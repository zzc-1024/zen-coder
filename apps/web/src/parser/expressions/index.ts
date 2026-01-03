import { Expression } from '../defination';

export class VariableExpression extends Expression {
  constructor(public name: string) {
    super();
  }
}

export class FunctionCallExpression extends Expression {
  constructor(
    public name: string,
    public args: Expression[],
  ) {
    super();
  }
}

export class IndexExpression extends Expression {
  constructor(public base: Expression, public index: Expression) {
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
  constructor(public start: Expression, public end: Expression) {
    super();
  }
}

export class UnaryExpression extends Expression {
  constructor(public operator: string, public operand: Expression) {
    super();
  }
}

export class BinaryExpression extends Expression {
  constructor(public operator: string, public left: Expression, public right: Expression) {
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
