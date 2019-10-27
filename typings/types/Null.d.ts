import { Type, TypeDescribeProvider, TypeSub, TypeCompatibleOptions } from '../Type';
import { Operations } from '../Operation';
import { ExpressionBuilder } from '../ExpressionBuilder';
import { Expression } from '../Expression';
import { Definitions } from '../Definitions';
import { Traverser } from '../Traverser';
export interface NullOptions {
    includeUndefined?: boolean;
}
export declare class NullType extends Type<NullOptions> {
    static id: string;
    static operations: Operations;
    static baseType: NullType;
    static decode(data: any[]): NullType;
    static encode(type: NullType): any;
    static describePriority: number;
    static describe(data: any): Type | null;
    static registered: boolean;
    static register(): void;
    getId(): string;
    getOperations(): Record<string, import("../Operation").Operation<any, any, any, any, any>>;
    merge(type: NullType, describer: TypeDescribeProvider): void;
    getSubType(expr: Expression, def: Definitions, context: Type): Type | null;
    getSubTypes(def: Definitions): TypeSub[];
    getExactType(value: any): Type;
    getSimplifiedType(): Type;
    protected isDeepCompatible(other: Type, options: TypeCompatibleOptions): boolean;
    traverse<R>(traverse: Traverser<Type, R>): R;
    setParent(parent?: Type): void;
    removeDescribedRestrictions(): void;
    getCreateExpression(ex: ExpressionBuilder): Expression;
    getValidateExpression(ex: ExpressionBuilder): Expression;
    getCompareExpression(ex: ExpressionBuilder): Expression;
    isValid(value: any): boolean;
    normalize(value: any): any;
    newInstance(): NullType;
    clone(): NullType;
    encode(): any;
    create(): null;
    random(rnd: (a: number, b: number, whole: boolean) => number): any;
    fromJson(json: null): null;
    toJson(value: null): null;
}
