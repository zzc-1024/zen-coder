import type { BasicTypeName, Variable } from '@/nodes/basic/typeDifination';
import { CompilerBackend, Expression, Statement } from '../defination';
import {
  AssignmentStatement,
  BreakStatement,
  ContinueStatement,
  CountLoopStatement,
  IfStatement,
  WhileStatement,
} from '../statements';
import {
  BinaryExpression,
  BooleanExpression,
  FloatExpression,
  IntegerExpression,
  StringExpression,
  VariableExpression,
  type BinaryOperator,
} from '../expressions';

export class PythonBackend extends CompilerBackend {
  pythonContext = {
    indentSpaceCount: 0,
  };
  pythonBinaryOperatorMap: Record<BinaryOperator, string> = {
    // 算术运算
    addition: '+',
    subtraction: '-',
    multiplication: '*',
    division: '/',
    floor_division: '//',
    modulus: '%',
    exponentiation: '**',
    // 比较运算
    less_than: '<',
    less_than_or_equal: '<=',
    greater_than: '>',
    greater_than_or_equal: '>=',
    equal: '==',
    not_equal: '!=',
    // 逻辑运算
    and: 'and',
    or: 'or',
    xor: '^',
    xnor: '==',
  };
  private parseExpression(expression: Expression): string {
    if (expression instanceof VariableExpression) return expression.name;
    if (expression instanceof BinaryExpression)
      return `(${this.parseExpression(expression.left)} ${this.pythonBinaryOperatorMap[expression.operator]} ${this.parseExpression(expression.right)})`;
    if (expression instanceof BooleanExpression) return expression.value ? 'True' : 'False';
    if (expression instanceof FloatExpression) return expression.value.toString();
    if (expression instanceof IntegerExpression) return expression.value.toString();
    if (expression instanceof StringExpression) return `'${expression.value}'`;
    throw new Error(`Unknown expression type: ${expression.constructor.name}`);
  }
  private convertVariableToPythonStyle(variable: Variable): string {
    if (variable.type.dataStructureType === 'dict') return `${variable.name}: dict = {}`;
    if (variable.type.dataStructureType === 'list') return `${variable.name}: list = []`;
    // 剩下的是 basic 情况
    switch (variable.type.toString() as BasicTypeName) {
      case 'builtin:basic:boolean':
        return `${variable.name}: bool = False`;
      case 'builtin:basic:float':
        return `${variable.name}: float = 0.0`;
      case 'builtin:basic:string':
        return `${variable.name}: str = ''`;
      case 'builtin:basic:integer':
        return `${variable.name}: int = 0`;
      default:
        throw new Error(`Unknown basic type: ${variable.type.toString()}`);
    }
  }
  private parseStatement(statement: Statement): string {
    let code = '';
    if (statement instanceof AssignmentStatement) {
      code += `${' '.repeat(this.pythonContext.indentSpaceCount)}`;
      code += `${statement.variable.name} = ${this.parseExpression(statement.expression)}\n`;
    } else if (statement instanceof IfStatement) {
      code += `${' '.repeat(this.pythonContext.indentSpaceCount)}`;
      code += `if ${this.parseExpression(statement.condition)}:\n`;
      this.pythonContext.indentSpaceCount += 4;
      code += this.parseStatements(statement.thenStatements);
      this.pythonContext.indentSpaceCount -= 4;
      code += `${' '.repeat(this.pythonContext.indentSpaceCount)}`;
      code += `else:\n`;
      this.pythonContext.indentSpaceCount += 4;
      code += this.parseStatements(statement.elseStatements);
      this.pythonContext.indentSpaceCount -= 4;
    } else if (statement instanceof BreakStatement) {
      code += `${' '.repeat(this.pythonContext.indentSpaceCount)}`;
      code += `break\n`;
    } else if (statement instanceof ContinueStatement) {
      code += `${' '.repeat(this.pythonContext.indentSpaceCount)}`;
      code += `continue\n`;
    } else if (statement instanceof WhileStatement) {
      code += `${' '.repeat(this.pythonContext.indentSpaceCount)}`;
      code += `while ${this.parseExpression(statement.condition)}:\n`;
      this.pythonContext.indentSpaceCount += 4;
      code += this.parseStatements(statement.statements);
      this.pythonContext.indentSpaceCount -= 4;
    } else if (statement instanceof CountLoopStatement) {
      code += `${' '.repeat(this.pythonContext.indentSpaceCount)}`;
      code += `for _ in range(${this.parseExpression(statement.timesExpression)}):\n`;
      this.pythonContext.indentSpaceCount += 4;
      code += this.parseStatements(statement.statements);
      this.pythonContext.indentSpaceCount -= 4;
    } else {
      throw new Error(`Unknown statement type: ${statement.constructor.name}`);
    }

    return code;
  }
  private parseStatements(statements: Statement[]): string {
    let code = '';
    if (statements.length === 0) return `${' '.repeat(this.pythonContext.indentSpaceCount)}pass\n`;
    statements.forEach((statement) => {
      code += this.parseStatement(statement);
    });
    return code;
  }
  generateCode(variables: Variable[], statements: Statement[]): string {
    // 先配置基础的上下文
    this.pythonContext.indentSpaceCount = 0;
    let code = '';
    code += 'def main():\n';
    this.pythonContext.indentSpaceCount += 4;

    // 先声明变量
    variables.forEach((variable) => {
      code += `${' '.repeat(this.pythonContext.indentSpaceCount)}${this.convertVariableToPythonStyle(variable)}\n`;
    });

    // 再执行语句
    code += this.parseStatements(statements);

    // 最后添加主函数调用
    code += 'if __name__ == "__main__":\n';
    code += '    main()\n';
    return code;
  }
}
