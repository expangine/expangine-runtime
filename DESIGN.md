1-to-1

subject { id, object_id } object { id }
  - has one (object_id NOT NULL UNIQUE, if subject DELETE then DELETE object )
  - has one maybe (object_id NULL UNIQUE, if subject DELETE then DELETE object )
  - belongs to (object_id NOT NULL, if object DELETE then DELETE subject )
  - belongs to maybe (object_id NULL, if object DELETE then DELETE subject )
  - relates (object_id NOT NULL, if object DELETE then RESTRICT )
  - relates (object_id NULL, if object DELETE then SET NULL )

subject { id, object_id, object_type } object1 { id } object2 { id }
  - polymorphic where expression on subject generates a type name

subject { id } object 



parent { id, child_type } child { id }

enum Cardinality {
  ONE,
  OPTIONAL,
  MANY
}

Relation {
  subject: ObjectType;
  subject_key: string[];
  
  name: string;
  inverted_name: string;

  object: Expression;
  object_keys: Record<string, string[]>;
  
  cardinality: Cardinality
  inverted: boolean;
}

1. has one <-> has one
2. has many <-> belongs to

has one 1{a,b} -> 2{b}            RESTRICT
has one optional 1{a,b} -> 2{b}   SET NULL
has many 1{a} -> 2{b,a}           CASCADE

