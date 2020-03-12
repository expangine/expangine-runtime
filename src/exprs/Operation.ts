
import { objectMap, isEmpty, objectEach, isArray } from '../fns';
import { Expression, ExpressionProvider, ExpressionValue, ExpressionMap } from '../Expression';
import { DefinitionProvider } from '../DefinitionProvider';
import { Operation } from '../Operation';
import { Type } from '../Type';
import { Traverser, TraverseStep } from '../Traverser';
import { ValidationHandler, ValidationType, ValidationSeverity } from '../Validate';
import { Types } from '../Types';
import { Exprs } from '../Exprs';
import { AndExpression } from './And';
import { OrExpression } from './Or';
import { NotExpression } from './Not';


const INDEX_NAME = 1;
const INDEX_PARAMS = 2;
const INDEX_SCOPE = 3;

export class OperationExpression<P extends string = never, O extends string = never, S extends string = never> extends Expression 
{

  public static id = 'op';

  public static decode(data: any[], exprs: ExpressionProvider): OperationExpression 
  {
    const name = data[INDEX_NAME];
    const params: ExpressionMap = objectMap(data[INDEX_PARAMS], value => exprs.getExpression(value));
    const scopeAlias: Record<string, string> = data[INDEX_SCOPE] || {};
    
    return new OperationExpression(name, params, scopeAlias);
  }

  public static encode(expr: OperationExpression): any 
  {
    const params = objectMap(expr.params, e => e.encode());

    return isEmpty(expr.scopeAlias)
      ? [this.id, expr.name, params]
      : [this.id, expr.name, params, expr.scopeAlias]
  }

  public static create<P extends string, O extends string, S extends string>(
    op: Operation<P, O, S, any, any>, 
    params: Record<P, Expression> & Partial<Record<O, Expression>>,
    scopeAlias: Partial<Record<S, string>> = Object.create(null)
  ): OperationExpression<P, O, S> {
    return new OperationExpression<P, O, S>(op.id, params, scopeAlias);
  }

  public name: string;
  public params: ExpressionMap;
  public scopeAlias: Record<string, string>;

  public constructor(name: string, params: ExpressionMap, scopeAlias: Record<string, string> = {}) 
  {
    super();
    this.name = name;
    this.params = params;
    this.scopeAlias = scopeAlias;
  }

  public getId(): string
  {
    return OperationExpression.id;
  }

  public getComplexity(def: DefinitionProvider, context: Type): number
  {
    const op = def.getOperation(this.name);
    let complexity = op ? op.complexity : 0;

    for (const prop in this.params)
    {
      complexity = Math.max(complexity, this.params[prop].getComplexity(def, context));
    }

    return complexity;
  }

  public getScope(): null
  {
    return null;
  }

  public encode(): any 
  {
    return OperationExpression.encode(this);
  }

  public clone(): Expression
  {
    return new OperationExpression(this.name, objectMap(this.params, (p) => p.clone()), { ...this.scopeAlias });
  }

  public getType(def: DefinitionProvider, context: Type): Type | null
  {
    return def.getOperationReturnType(this.name, this.params, this.scopeAlias, context);
  }

  public traverse<R>(traverse: Traverser<Expression, R>): R
  {
    return traverse.enter(this, () =>
      objectEach(this.params, (expr, param) =>
        traverse.step(param, expr, (replaceWith) => this.params[param] = replaceWith, () => delete this.params[param])
      )
    );
  }

  public getExpressionFromStep(steps: TraverseStep[]): [number, Expression] | null
  {
    return steps[0] in this.params
      ? [1, this.params[steps[0]]]
      : null;
  }

  public setParent(parent: Expression = null): void
  {
    this.parent = parent;

    objectEach(this.params, e => e.setParent(this));
  }

  public validate(def: DefinitionProvider, context: Type, handler: ValidationHandler): void
  {
    const { name, params, scopeAlias } = this;
    const operation = def.getOperation(name);
    const operationTypes = def.getOperationTypes(name);

    if (!operation)
    {
      handler({
        type: ValidationType.MISSING_OPERATION,
        severity: ValidationSeverity.HIGH,
        context,
        subject: this,
      });

      return;
    }

    const expectedTypes = def.getOperationExpectedTypes(name, params, scopeAlias, context);
    const scopeContext = operation.hasScope.length > 0
      ? def.getOperationScopeContext(name, expectedTypes, scopeAlias, context)
      : context;

    for (const paramName in expectedTypes)
    {
      const optional = operation.optional.indexOf(paramName) !== -1;
      const expectedRequired = expectedTypes[paramName];
      const expected = optional ? Types.optional(expectedRequired) : expectedRequired;
      const subject = params[paramName];
      const hasScope = operation.hasScope.indexOf(paramName) !== -1;
      const paramContext = hasScope ? scopeContext : context;
      
      this.validateType(def, paramContext, expected, subject, handler);
    }

    for (const paramName in params)
    {
      const subject = params[paramName];
      const operationType = operationTypes.params[paramName];

      if (!(paramName in expectedTypes) && operationType)
      {
        const hasScope = operation.hasScope.indexOf(paramName) !== -1;
        const paramContext = hasScope ? scopeContext : context;

        handler({
          type: ValidationType.MISSING_EXPRESSION,
          severity: ValidationSeverity.HIGH,
          context: paramContext,
          subject,
          parent: this,
        });

        params[paramName].validate(def, paramContext, handler);
      }
    }
  }

  public param(name: P | O, value: ExpressionValue): OperationExpression<P, O, S>
  {
    const param = Exprs.parse(value);

    this.params[name] = param;
    param.setParent(this);

    return this;
  }

  public alias(scoped: S, alias: string): OperationExpression<P, O, S>
  {
    this.scopeAlias[scoped] = alias;

    return this;
  }

  public and(exprs: Expression | Expression[]): AndExpression
  {
    const append = isArray(exprs) ? exprs : [exprs];

    return new AndExpression([this as Expression].concat(append));
  }

  public or(exprs: Expression | Expression[]): OrExpression
  {
    const append = isArray(exprs) ? exprs : [exprs];

    return new OrExpression([this as Expression].concat(append));
  }

  public not(): NotExpression
  {
    return new NotExpression(this);
  }

}