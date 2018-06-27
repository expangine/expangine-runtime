# expangine-runtime-ts
A TypeScript/JS library for processing data based on variables and conditions

This library provides functionality for the following flow:
1. You (as the user) describe the types in your system.
2. This library allows an interface to build complex expressions for getting or setting data in your system.
3. This library allows an interface to build complex conditions to be build based on the data.
4. This library takes the expressions and conditions and outputs to JSON.
5. Another application can take the output JSON and an implementation (JS, SQL, etc) manipulate and query the data.

The goals of this library is to provide the following functionality:
- Assist UI into building a condition to test an entity source.
- Assist UI into finding a value of a given Type with a starting entity source.
- Assist UI into setting values throughout a given entity source.

This runtime has the following concepts
- Entity: The definition of an object
- Property: The definition of a value on an Entity
- Type: The type of a property. A type can validate values, have comparisons with other values & types, etc. See [[Types]]
- Reference: The reference to a value on an Entity, a constant value, a computable expression, etc. See [[References]]
- Condition: Evaluates 

The runtime needs the following interface implementation to allow an interface to construct values
- buildType( source: S ): Promise<Type>
- getProperty( source: S, prop: string ): E
- getElement( source: S, index: number ): E

### Design
- Type { operators, comparisons, formatters, fromString, toString, isMatch( type: Type ) }
- Function\<I, O> { compute( input: I, args: {} ): O, parameters: {} }
- Reference\<S, T> { get( source: S ): T, set( source: S, value: T ), type( source: S ) }
- Condition { evaluate( source ): boolean }

### References
- Constant: A constant value. Ex: `3.1415`
- Variable: A reference to an entity's property, and may have a next reference. Ex: `name` or `related.name`
- Templated: A string which contains references to resolve and build a string. Ex: `{last}, {first}`
- Formatted: A reference value formatted given a formatter for the value's type. Ex: `date formatted as 'MM/dd/yyyy'`
- Equation: An equation with variables, and the references to get the variables from. Ex: `x * 100 / y`
- Conditional: A set of conditions and related values determine the value. Ex: `if x; then y; else w`
- Computed: A function executed on a value optionally passing parameters. Could be an operation specified on the type.

### Types 
A type has a name, has a collection of formatters, comparisons, and operations.

- Object: An object with properties of certain types
- Array: Each item has a type
- Text:
- Number:
- List:
- Any:
- Boolean:
- Null:
- Color:
- Date:
- Enumerated: A fixed set of possible values - which a value has a display name, desired value, and set of possible values
- Point2d:
- Point3d:
- Font:
- LatLng:
- Rect2d:
- Rect3d:
- Bounds2d:
- Bounds3d:

### Conditions
- Comparison: One reference, a comparison from it's type, and any additional references needed for the comparison
- Group: Multiple conditions and one of: AND, OR, XOR
- Negate: Negates a single condition

### Functions
A function has a name, has an input Type, an output Type, and optionally arguments with a name, type, and default value.

*Examples:*
- floor( input: number ): number
- clamp( input: number, min: number, max: number ): number
- substring( input: string, offset: number, length: number ): string
- length( input: string ): number


```typescript
// A rounding function
Functions.define('round', {
  input: Types.Number,
  output: Types.Number,
  params: {
    places: {
      type: Types.Number,
      default: (input) => 2
    }
  }
});

// This implementation returns the rounded value immediately.
Functions.implement('round', function(value, args) {
  return Math.round( value, args.places );
});

// Substring Function
Functions.define('substring', {
  input: Types.Text,
  output: Types.Text,
  params: {
    start: {
      type: Types.Number,
      default: (input) => 0
    },
    end: {
      type: Types.Number,
      default: (input) => input.length
    }
  }
});

// This implementation produces a part of a SQL query
Functions.implement('substring', function(value, args) {
  return 'SUBSTRING(' + value + ',' + args.start + ',' + args.end + ')';
});
```
