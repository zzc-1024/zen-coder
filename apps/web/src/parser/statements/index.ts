import { Expression, Statement } from '../defination';
import type { CallExpression, VariableExpression } from '../expressions';
import type { VariableScopeType } from '../variable';

export class VariableStatement extends Statement {
  constructor(public variable: VariableExpression) {
    super();
  }
}

export class AssignmentStatement extends Statement {
  constructor(
    public variableScopeType: VariableScopeType,
    public variable: Expression,
    public expression: Expression,
  ) {
    super();
  }
}

export class IfStatement extends Statement {
  constructor(
    public condition: Expression,
    public thenStatements: Statement[],
    public elseStatements: Statement[],
  ) {
    super();
  }
}

export class WhileStatement extends Statement {
  constructor(
    public condition: Expression,
    public statements: Statement[],
  ) {
    super();
  }
}

export class CallStatement extends Statement {
  constructor(public callExpression: CallExpression) {
    super();
  }
}

export class ReturnStatement extends Statement {
  constructor(public expression: Expression | undefined) {
    super();
  }
}

export class BreakStatement extends Statement {
  constructor() {
    super();
  }
}

export class ContinueStatement extends Statement {
  constructor() {
    super();
  }
}

export class ExpressionStatement extends Statement {
  constructor(public expression: Expression) {
    super();
  }
}

export class EmptyStatement extends Statement {
  constructor() {
    super();
  }
}

export class CommentStatement extends Statement {
  constructor(public comment: string) {
    super();
  }
}

export class LabelStatement extends Statement {
  constructor(public label: string) {
    super();
  }
}

export class SwitchStatement extends Statement {
  constructor(
    public expression: Expression,
    public cases: CaseClause[],
  ) {
    super();
  }
}

export class CaseClause extends Statement {
  constructor(
    public expression: Expression,
    public statements: Statement[],
  ) {
    super();
  }
}

export class DefaultClause extends Statement {
  constructor(public statements: Statement[]) {
    super();
  }
}

export class ThrowStatement extends Statement {
  constructor(public expression: Expression) {
    super();
  }
}

export class TryStatement extends Statement {
  constructor(
    public tryStatements: Statement[],
    public catchStatements: CatchClause[],
  ) {
    super();
  }
}

export class CatchClause extends Statement {
  constructor(
    public variable: VariableExpression,
    public catchStatements: Statement[],
  ) {
    super();
  }
}

export class FinallyClause extends Statement {
  constructor(public finallyStatements: Statement[]) {
    super();
  }
}

export class DebuggerStatement extends Statement {
  constructor() {
    super();
  }
}

export class WithStatement extends Statement {
  constructor(
    public object: Expression,
    public statements: Statement[],
  ) {
    super();
  }
}

export class ForStatement extends Statement {
  constructor(
    public initializer: ExpressionStatement,
    public condition: Expression,
    public updater: ExpressionStatement,
    public statements: Statement[],
  ) {
    super();
  }
}

export class ForInStatement extends Statement {
  constructor(
    public left: VariableExpression,
    public right: Expression,
    public statements: Statement[],
  ) {
    super();
  }
}

export class ForOfStatement extends Statement {
  constructor(
    public left: VariableExpression,
    public right: Expression,
    public statements: Statement[],
  ) {
    super();
  }
}

export class DoWhileStatement extends Statement {
  constructor(
    public statements: Statement[],
    public condition: Expression,
  ) {
    super();
  }
}

export class CountLoopStatement extends Statement {
  constructor(
    public timesExpression: Expression,
    public statements: Statement[],
  ) {
    super();
  }
}
