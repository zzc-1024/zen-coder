import {
  BUILTIN_BASIC_BOOLEAN_TYPE,
  BUILTIN_BASIC_FLOAT_TYPE,
  BUILTIN_BASIC_INTEGER_TYPE,
  BUILTIN_BASIC_STRING_TYPE,
  ListType,
  type BasicTypeName,
  type Variable,
} from '../variable';
import { CompilerBackend, Expression, Statement } from '../defination';
import {
  AssignmentStatement,
  BreakStatement,
  CallStatement,
  ContinueStatement,
  IfStatement,
  MemberStatement,
  ReturnStatement,
  WhileStatement,
} from '../statements';
import {
  BinaryExpression,
  TypeCastExpression,
  BooleanExpression,
  FloatExpression,
  IntegerExpression,
  StringExpression,
  VariableExpression,
  type BinaryOperator,
  CallExpression,
  IndexExpression,
  ListExpression,
  MemberExpression,
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
    if (expression === undefined) {
      throw new Error('未定义表达式错误');
    }
    if (expression instanceof VariableExpression) {
      if (expression.variableScopeType === 'local') return expression.name;
      return `globals()["${expression.name}"]`;
    } else if (expression instanceof TypeCastExpression) {
      if (expression.type === BUILTIN_BASIC_FLOAT_TYPE)
        return `float(${this.parseExpression(expression.expression)})`;
      if (expression.type === BUILTIN_BASIC_INTEGER_TYPE)
        return `int(${this.parseExpression(expression.expression)})`;
      if (expression.type === BUILTIN_BASIC_STRING_TYPE)
        return `str(${this.parseExpression(expression.expression)})`;
      throw new Error(`Unknown type cast type: ${expression.type.toString()}`);
    } else if (expression instanceof BinaryExpression)
      return `(${this.parseExpression(expression.left)} ${this.pythonBinaryOperatorMap[expression.operator]} ${this.parseExpression(expression.right)})`;
    else if (expression instanceof BooleanExpression) return expression.value ? 'True' : 'False';
    else if (expression instanceof FloatExpression) return expression.value.toString();
    else if (expression instanceof IntegerExpression) return expression.value.toString();
    else if (expression instanceof StringExpression) return `'${expression.value}'`;
    else if (expression instanceof ListExpression)
      return `[${expression.items.map(this.parseExpression.bind(this)).join(', ')}]`;
    else if (expression instanceof IndexExpression)
      return `${this.parseExpression(expression.base)}[${this.parseExpression(expression.index)}]`;
    else if (expression instanceof CallExpression) {
      if (expression.source === '.')
        return `${expression.functionName}(${expression.parameters.map(this.parseExpression.bind(this)).join(', ')})`;
      if (expression.source === 'builtin:basic') {
        if (expression.module === '.') {
          switch (expression.functionName) {
            case 'print':
              return `print(${this.parseExpression(expression.parameters[0]!)}, end=${this.parseExpression(expression.parameters[1]!)})`;
            case 'input':
              return `input(${this.parseExpression(expression.parameters[0]!)})`;
          }
        }
      }
    } else if (expression instanceof MemberExpression) {
      if (expression.type instanceof ListType) {
        switch (expression.memberName) {
          case 'push':
            return `${this.parseExpression(expression.caller)}.append(${this.parseExpression(expression.parameters![0]!)})`;
          case 'pop':
            if (`${this.parseExpression(expression.caller)}` === '[]') throw new Error('pop 方法不能作用于空列表');
            return `${this.parseExpression(expression.caller)}.pop()`;
          case 'delete':
            return `${this.parseExpression(expression.caller)}.pop(${this.parseExpression(expression.parameters![0]!)})`;
          case 'length':
            return `${this.parseExpression(expression.caller)}.__len__()`;
        }
      }
      return (
        `${this.parseExpression(expression.caller)}.${expression.memberName}` +
        (expression.parameters
          ? `(${expression.parameters.map(this.parseExpression.bind(this)).join(', ')})`
          : '')
      );
    }
    throw new Error(`Unknown expression type: ${typeof expression}`);
  }
  convertVariableToPythonStyle(variable: Variable): string {
    if (variable.type.dataStructureType === 'dict') return `${variable.name}: dict = {}`;
    if (variable.type.dataStructureType === 'list') return `${variable.name}: list = []`;
    // 剩下的是 basic 情况
    switch (variable.type.toString() as BasicTypeName) {
      case BUILTIN_BASIC_BOOLEAN_TYPE:
        return `${variable.name}: bool = False`;
      case BUILTIN_BASIC_FLOAT_TYPE:
        return `${variable.name}: float = 0.0`;
      case BUILTIN_BASIC_STRING_TYPE:
        return `${variable.name}: str = ''`;
      case BUILTIN_BASIC_INTEGER_TYPE:
        return `${variable.name}: int = 0`;
      default:
        throw new Error(`Unknown basic type: ${variable.type.toString()}`);
    }
  }
  private parseStatement(statement: Statement): string {
    let code = '';
    if (statement instanceof AssignmentStatement) {
      code += `${' '.repeat(this.pythonContext.indentSpaceCount)}`;
      code += `${this.parseExpression(statement.variable)} = ${this.parseExpression(statement.expression)}\n`;
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
    } else if (statement instanceof ReturnStatement) {
      code += `${' '.repeat(this.pythonContext.indentSpaceCount)}return`;
      if (statement.expression) code += ` ${this.parseExpression(statement.expression)}`;
      code += '\n';
    } else if (statement instanceof CallStatement) {
      code += `${' '.repeat(this.pythonContext.indentSpaceCount)}`;
      code += `${this.parseExpression(statement.callExpression)}\n`;
    } else if (statement instanceof MemberStatement) {
      code += `${' '.repeat(this.pythonContext.indentSpaceCount)}`;
      code += `${this.parseExpression(statement.memberExpression)}\n`;
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
  generateCode(
    localVariables: Variable[],
    functionName: string,
    parameters: Variable[],
    statements: Statement[],
  ): string {
    // 先配置基础的上下文
    this.pythonContext.indentSpaceCount = 0;
    let code = '';
    code += `def ${functionName}(${parameters.map((parameter) => parameter.name).join(', ')}):\n`;
    this.pythonContext.indentSpaceCount += 4;

    // 先声明变量
    localVariables.forEach((variable) => {
      code += `${' '.repeat(this.pythonContext.indentSpaceCount)}${this.convertVariableToPythonStyle(variable)}\n`;
    });

    // 再执行语句
    code += this.parseStatements(statements);
    return code;
  }
}
