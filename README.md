# expangine-runtime-ts

A TypeScript/JS library that supports a system where a user can define the structure of their application, create code to interact with data in that structure, and save that code in a JSON format so it can be parsed at a later time and executed against data which first the designed structure.

In a nutshell, this allows a UI to build and save a program visually without programming code. This can be used to build a highly dynamic CMS, interactives, or tools to teach people how to program.

### Work Remaining
- def/AnyOps, runtimes/js/any
- def/BooleanOps.cmp
- def/ListOps, runtimes/js/list
- def/ManyOps, runtimes/js/many
- def/NumberOps.cmp
- def/ObjectOps, runtimes/js/object
- def/OptionalOps, runtimes/js/optional
- types/Date, def/DateOps, runtimes/js/date
- types/Enum, def/EnumOps, runtimes/js/enum
- types/Color, def/ColorOps, runtime/js/color
- exprs/Template, runtime/js/expressions.template

### Type Backlog for v2
- LatLng
- Point2
- Point3
- Rect2
- Rect3
- Bounds2
- Bounds3
- Poly2
- Poly3
- Plane2
- Plane3
- Segment2
- Segment3

This library provides functionality for the following flow:
1. You (as the user) describe the types in your system.
2. This library allows an interface to build complex expressions for getting or setting data in your system.
3. This library takes the expressions and outputs JSON.
4. Another application can take the output JSON and an implementation (JS, SQL, etc) manipulate and query the data.

The goals of this library is to provide the following functionality:
- Assist UI into building an expression to test a given source.
- Assist UI into finding a value of a given Type with a starting source.
- Assist UI into setting values throughout a given source.

This runtime has the following concepts
- Type: The data type for a value. Can be operated on.
- Expression: A part of a program. A constant, a for loop, an operation, etc.
- Definitions: Contains all types and expressions available to the system.
- Runtime: Understands how to process expressions in the given environment.

The runtime needs the following interface implementation to allow an interface to construct values
- buildType( source: S ): Promise<Type>
- getProperty( source: S, prop: string ): E
- getElement( source: S, index: number ): E