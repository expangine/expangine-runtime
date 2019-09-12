
import { Runtime } from '../../Runtime';
import { NumberOps } from '../../ops/NumberOps';
import { _number, _bool, _text, _numberMaybe, _textMaybe } from './helper';
import { isNumber, isUndefined, isString, isWhole } from '../../fns';



const DEFAULT_BASE = 10;


export default (run: Runtime, epsilon: number = 0.000001) =>
{

  // Statics

  run.setOperation(NumberOps.create, (params) => (context) =>
    0
  );

  run.setOperation(NumberOps.pi, (params) => (context) =>
    Math.PI
  );

  run.setOperation(NumberOps.pi2, (params) => (context) =>
    Math.PI + Math.PI
  );

  run.setOperation(NumberOps.piHalf, (params) => (context) =>
    // tslint:disable-next-line: no-magic-numbers
    Math.PI * 0.5
  );

  run.setOperation(NumberOps.e, (params) => (context) =>
    Math.E
  );

  run.setOperation(NumberOps.sqrt2, (params) => (context) =>
    Math.SQRT2
  );

  run.setOperation(NumberOps.sqrt12, (params) => (context) =>
    Math.SQRT1_2
  );

  run.setOperation(NumberOps.ln2, (params) => (context) =>
    Math.LN2
  );

  run.setOperation(NumberOps.ln10, (params) => (context) =>
    Math.LN10
  );

  run.setOperation(NumberOps.log2e, (params) => (context) =>
    Math.LOG2E
  );

  run.setOperation(NumberOps.log10e, (params) => (context) =>
    Math.LOG10E
  );

  // Binary Operations

  run.setOperation(NumberOps.add, (params) => (context) => 
    _number(params.value, context) + _number(params.addend, context)
  );

  run.setOperation(NumberOps.sub, (params) => (context) => 
    _number(params.value, context) - _number(params.subtrahend, context)
  );

  run.setOperation(NumberOps.mul, (params) => (context) => 
    _number(params.value, context) * _number(params.multiplier, context)
  );

  run.setOperation(NumberOps.div, (params) => (context) => 
    _number(params.value, context) % _number(params.divisor, context)
  );

  run.setOperation(NumberOps.mod, (params) => (context) => 
    _number(params.value, context) % _number(params.divisor, context)
  );

  run.setOperation(NumberOps.min, (params) => (context) => 
    Math.min(_number(params.a, context), _number(params.b, context))
  );

  run.setOperation(NumberOps.max, (params) => (context) => 
    Math.max(_number(params.a, context), _number(params.b, context))
  );

  run.setOperation(NumberOps.pow, (params) => (context) => 
    Math.pow(_number(params.value, context), _number(params.exponent, context))
  );

  run.setOperation(NumberOps.atan2, (params) => (context) => 
    Math.atan2(_number(params.y, context), _number(params.x, context))
  );

  run.setOperation(NumberOps.hypot, (params) => (context) => {
    const a = _number(params.a, context);
    const b = _number(params.b, context);

    return Math.sqrt(a * a + b * b);
  });

  run.setOperation(NumberOps.choose, (params) => (context) => {
    const n = _number(params.n, context);
    const k = _number(params.k, context);
    if (!isFinite(n) || !isFinite(k)) {
      return Number.NaN;
    }

    return choose(n, k);
  });

  run.setOperation(NumberOps.gcd, (params) => (context) => {
    const a = _number(params.a, context);
    const b = _number(params.b, context);
    if (!isFinite(a) || !isFinite(b)) {
      return Number.NaN;
    }

    return gcd(a, b);
  });

  run.setOperation(NumberOps.bitAnd, (params) => (context) => 
    // tslint:disable-next-line: no-bitwise
    _number(params.a, context) & _number(params.b, context)
  );

  run.setOperation(NumberOps.bitOr, (params) => (context) => 
    // tslint:disable-next-line: no-bitwise
    _number(params.a, context) | _number(params.b, context)
  );

  run.setOperation(NumberOps.bitXor, (params) => (context) => 
    // tslint:disable-next-line: no-bitwise
    _number(params.a, context) ^ _number(params.b, context)
  );

  run.setOperation(NumberOps.cmp, (params) => (context) => 
    _number(params.value, context) - _number(params.test, context)
  );

  // Unary Operations

  run.setOperation(NumberOps.sqrt, (params) => (context) => 
    Math.sqrt(_number(params.value, context))
  );

  run.setOperation(NumberOps.sq, (params) => (context) => {
    const value = _number(params.value, context);

    return value * value;
  });

  run.setOperation(NumberOps.cbrt, (params) => (context) => 
    Math.cbrt(_number(params.value, context))
  );

  run.setOperation(NumberOps.floor, (params) => (context) => 
    Math.floor(_number(params.value, context))
  );

  run.setOperation(NumberOps.ceil, (params) => (context) => 
    Math.ceil(_number(params.value, context))
  );

  run.setOperation(NumberOps.up, (params) => (context) => {
    const value = _number(params.value, context);

    return value < 0 ? Math.ceil(value) : Math.floor(value);
  });

  run.setOperation(NumberOps.down, (params) => (context) => {
    const value = _number(params.value, context);

    return value > 0 ? Math.ceil(value) : Math.floor(value);
  });

  run.setOperation(NumberOps.round, (params) => (context) => 
    Math.round(_number(params.value, context))
  );

  run.setOperation(NumberOps.abs, (params) => (context) => 
    Math.abs(_number(params.value, context))
  );

  run.setOperation(NumberOps.neg, (params) => (context) => 
    -_number(params.value, context)
  );

  run.setOperation(NumberOps.sign, (params) => (context) => {
    const value = _number(params.value, context);

    return value === 0 ? 0 : value < 0 ? -1 : 1;
  });

  run.setOperation(NumberOps.log, (params) => (context) => 
    Math.log(_number(params.value, context))
  );

  run.setOperation(NumberOps.sin, (params) => (context) => 
    Math.sin(_number(params.value, context))
  );

  run.setOperation(NumberOps.cos, (params) => (context) => 
    Math.cos(_number(params.value, context))
  );

  run.setOperation(NumberOps.tan, (params) => (context) => 
    Math.tan(_number(params.value, context))
  );

  run.setOperation(NumberOps.sinh, (params) => (context) => 
    Math.sinh(_number(params.value, context))
  );

  run.setOperation(NumberOps.cosh, (params) => (context) => 
    Math.cosh(_number(params.value, context))
  );

  run.setOperation(NumberOps.asin, (params) => (context) => 
    Math.asin(_number(params.value, context))
  );

  run.setOperation(NumberOps.acos, (params) => (context) => 
    Math.acos(_number(params.value, context))
  );

  run.setOperation(NumberOps.atan, (params) => (context) => 
    Math.atan(_number(params.value, context))
  );

  run.setOperation(NumberOps.factorial, (params) => (context) => {
    const value = _number(params.value, context);

    return isFinite(value) ? factorial(value) : value;
  });

  run.setOperation(NumberOps.bitFlip, (params) => (context) => 
    // tslint:disable-next-line: no-bitwise
    ~_number(params.value, context)
  );

  // Other

  run.setOperation(NumberOps.clamp, (params) => (context) => 
    Math.max(_number(params.min, context), Math.min(_number(params.value, context), _number(params.max, context)))
  );

  run.setOperation(NumberOps.triangleHeight, (params) => (context) => {
    const base = _number(params.base, context);
    const side1 = _number(params.side1, context);
    const side2 = _number(params.side2, context);
    if (!isFinite(base) || !isFinite(side1) || !isFinite(side2)) {
      return Number.NaN;
    }

    return triangleHeight(base, side1, side2);
  });

  run.setOperation(NumberOps.lerp, (params) => (context) => {
    const start = _number(params.start, context);
    const end = _number(params.end, context);
    const delta = _number(params.delta, context);

    return (end - start) * delta + start;
  });

  // Generators

  run.setOperation(NumberOps.rnd, (params) => (context) => {
    const min = _number(params.min, context, 0);
    const max = _number(params.max, context, 1);
    const gap = max - min;
    const whole = _bool(params.whole, context, false);
    const include = _bool(params.includeMax, context, true);

    return whole
      ? include
        ? Math.floor((gap + 1) * Math.random()) + min
        : Math.floor(gap * Math.random()) + min
      : Math.random() * gap + min;
  });

  // Formatters

  run.setOperation(NumberOps.toBaseText, (params) => (context) => {
    const value = _number(params.value, context);
    if (!isFinite(value)) {
      return value;
    }
    const base = _number(params.base, context, DEFAULT_BASE);
    const min = _number(params.minDigits, context, 0);
    
    let x = value.toString(base);

    while (x.length < min) x = '0' + x;
    
    return x;
  });

  run.setOperation(NumberOps.toText, (params) => (context) => {
    const value = _number(params.value, context);
    if (!isFinite(value)) {
      return value;
    }
    const prefix = _text(params.prefix, context);
    const suffix = _text(params.suffix, context);
    const minPlaces = _numberMaybe(params.minPlaces, context);
    const maxPlaces = _numberMaybe(params.maxPlaces, context);
    const useExponent = _bool(params.useExponent, context, false);
    const separator = _textMaybe(params.thousandSeparator, context);
    
    let to = '';

    if (useExponent) {
      to = value.toExponential(isUndefined(maxPlaces) ? minPlaces : maxPlaces);
    } else if (isNumber(minPlaces)) {
      to = value.toFixed(minPlaces);
    } else {
      to = value.toPrecision(maxPlaces);
    }

    const SEPARATOR_NUMBER = 1.1;
    const SEPARATOR_OFFSET = 3;

    if (isString(separator)) {
      const systemSeparator = SEPARATOR_NUMBER.toLocaleString().substring(1, SEPARATOR_OFFSET - 1);
      let index = to.indexOf(systemSeparator);
      if (index === -1) {
        index = to.length;
      }
      index -= SEPARATOR_OFFSET;
      while (index > 0) {
        to = to.substring(0, index) + separator + to.substring(index);
        index -= SEPARATOR_OFFSET;
      }
    }
    
    return prefix + to + suffix;
  });

  // Comparisons

  run.setOperation(NumberOps.isValid, (params) => (context) => 
    isNumber(params.value(context))
  );

  run.setOperation(NumberOps.isZero, (params) => (context) => 
    Math.abs(_number(params.value, context)) <= _number(params.epsilon, context, epsilon)
  );

  run.setOperation(NumberOps.isEqual, (params) => (context) => 
    Math.abs(_number(params.value, context) - _number(params.test, context)) <= _number(params.epsilon, context, epsilon)
  );

  run.setOperation(NumberOps.isNotEqual, (params) => (context) => 
    Math.abs(_number(params.value, context) - _number(params.test, context)) > _number(params.epsilon, context, epsilon)
  );

  run.setOperation(NumberOps.isLess, (params) => (context) => 
    _number(params.value, context) < _number(params.test, context)
  );

  run.setOperation(NumberOps.isLessOrEqual, (params) => (context) => 
    _number(params.value, context) <= _number(params.test, context)
  );

  run.setOperation(NumberOps.isGreater, (params) => (context) => 
    _number(params.value, context) > _number(params.test, context)
  );

  run.setOperation(NumberOps.isGreaterOrEqual, (params) => (context) => 
    _number(params.value, context) >= _number(params.test, context)
  );

  run.setOperation(NumberOps.isBetween, (params) => (context) => {
    const value = _number(params.value, context);
    const min = _number(params.min, context);
    const max = _number(params.max, context);
    const minInclusive = _bool(params.minInclusive, context, true);
    const maxInclusive = _bool(params.maxInclusive, context, true);

    const minCompare = value - min;
    const maxCompare = value - max;

    const minOffset = minInclusive ? 0 : 1;
    const maxOffset = maxInclusive ? 0 : -1;

    return minCompare >= minOffset && maxCompare <= maxOffset;
  });

  run.setOperation(NumberOps.isWhole, (params) => (context) => {
    const value = _number(params.value, context);
    const eps = _number(params.epsilon, context, epsilon);

    return isWhole(value, eps);
  });

  run.setOperation(NumberOps.isDecimal, (params) => (context) => {
    const value = _number(params.value, context);
    const eps = _number(params.epsilon, context, epsilon);

    return !isWhole(value, eps);
  });

  run.setOperation(NumberOps.isPositive, (params) => (context) =>
    _number(params.value, context) >= 0
  );

  run.setOperation(NumberOps.isNegative, (params) => (context) =>
    _number(params.value, context) < 0
  );

  run.setOperation(NumberOps.isDivisible, (params) => (context) =>
    Math.abs(_number(params.value, context) % _number(params.by, context)) <= _number(params.epsilon, context, epsilon)
  );

};



function factorial (x: number): number {
  let f = x;
  while (--x > 1) {
    f *= x;
  }

  return f;
}

function gcd (a: number, b: number): number {
  const as = Math.abs(a);
  const bs = Math.abs(b);
  let x = Math.max(as, bs);
  let y = Math.min(as, bs);

  for (;;) {
    if (y === 0) return x;
    x %= y;
    if (x === 0) return y;
    y %= x;
  }
}

function choose(n: number, k: number): number 
{
  let num = 1; 
  let den = 1;
  let denom = 0;

  // tslint:disable-next-line: no-bitwise
  if (k > (n >> 1))
  {
    k = n - k;
  }

  while (k >= 1)
  {
    num *= n--;
    den *= k--;
    denom = gcd( num, den );
    num /= denom;
    den /= denom;
  }

  return num;
}

const HALF = 0.5;
const TWO = 2;

function triangleHeight(base: number, side1: number, side2: number): number 
{
  const p = (base + side1 + side2) * HALF;
  const area = Math.sqrt( p * (p - base) * (p - side1) * (p - side2) );
  const height = area * TWO / base;

  return height;
}