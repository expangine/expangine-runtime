# expangine-runtime

A TypeScript/JS library that supports a system where a user can define the structure of their application, create code to interact with data in that structure, and save that code in a JSON format so it can be parsed at a later time and executed against data which first the designed structure.

In a nutshell, this allows a UI to build and save a program visually without programming code. This can be used to build a highly dynamic CMS, interactives, or tools to teach people how to program.

Runtime implementations can be made to run javascript now or generate code in any supported language (JavaScript, SQL, C, etc).

## About

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
- Type: The data type for a value. Has a set of operations that can be performed on instances of the data type (math, traversal, comparisons, etc).
- Expression: A part of a program. A constant, a for loop, an operation, etc.
- Definitions: Contains all types and expressions available to the system.
- Runtime: Understands how to process expressions in the given environment.
