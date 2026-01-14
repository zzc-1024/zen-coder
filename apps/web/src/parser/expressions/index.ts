import { Expression } from '../defination';
import type { VariableScopeType } from '../variable';

export class VariableExpression extends Expression {
  constructor(
    public variableScopeType: VariableScopeType,
    public name: string,
  ) {
    super();
  }
}

export class TypeCastExpression extends Expression {
  constructor(
    public expression: Expression,
    public type: string,
  ) {
    super();
  }
}

export class CallExpression extends Expression {
  constructor(
    public source: string,
    public module: string,
    public functionName: string,
    public parameters: Expression[],
  ) {
    super();
  }
}

export class IndexExpression extends Expression {
  constructor(
    public base: Expression,
    public index: Expression,
  ) {
    super();
  }
}

export class DictExpression extends Expression {
  constructor(public pairs: [Expression, Expression][]) {
    super();
  }
}

export class ListExpression extends Expression {
  constructor(public items: Expression[]) {
    super();
  }
}

export class TupleExpression extends Expression {
  constructor(public items: Expression[]) {
    super();
  }
}

export class SetExpression extends Expression {
  constructor(public items: Expression[]) {
    super();
  }
}

export class RangeExpression extends Expression {
  constructor(
    public start: Expression,
    public end: Expression,
  ) {
    super();
  }
}

export class UnaryExpression extends Expression {
  constructor(
    public operator: string,
    public operand: Expression,
  ) {
    super();
  }
}

export type BinaryOperator =
  // 算术运算
  | 'addition'
  | 'subtraction'
  | 'multiplication'
  | 'division'
  | 'floor_division'
  | 'modulus'
  | 'exponentiation'
  // 比较运算
  | 'less_than'
  | 'less_than_or_equal'
  | 'greater_than'
  | 'greater_than_or_equal'
  | 'equal'
  | 'not_equal'
  // 逻辑运算
  | 'and'
  | 'or'
  | 'xor'
  | 'xnor';
export class BinaryExpression extends Expression {
  constructor(
    public operator: BinaryOperator,
    public left: Expression,
    public right: Expression,
  ) {
    super();
  }
}

export class BooleanExpression extends Expression {
  constructor(public value: boolean) {
    super();
  }
}

export class FloatExpression extends Expression {
  constructor(public value: number) {
    super();
  }
}

export class IntegerExpression extends Expression {
  constructor(public value: number) {
    super();
  }
}

export class StringExpression extends Expression {
  constructor(public value: string) {
    super();
  }
}

export class NoneExpression extends Expression {
  constructor() {
    super();
  }
}
