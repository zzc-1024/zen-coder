export const EXAMPLE_OUTPUT = [
  {
    type: 'AssignmentStatement',
    variableScopeType: 'local',
    variable: {
      type: 'VariableExpression',
      variableScopeType: 'local',
      name: 'count',
    },
    expression: {
      type: 'IntegerExpression',
      value: 0,
    },
  },
  {
    type: 'WhileStatement',
    condition: {
      type: 'BinaryExpression',
      operator: 'less_than',
      left: {
        type: 'VariableExpression',
        variableScopeType: 'local',
        name: 'count',
      },
      right: {
        type: 'IntegerExpression',
        value: 5,
      },
    },
    statements: [
      {
        type: 'IfStatement',
        condition: {
          type: 'BinaryExpression',
          operator: 'greater_than',
          left: {
            type: 'VariableExpression',
            variableScopeType: 'local',
            name: 'count',
          },
          right: {
            type: 'IntegerExpression',
            value: 10,
          },
        },
        thenStatements: [
          {
            type: 'CallStatement',
            CallExpression: {
              source: '.',
              module: '.',
              name: 'println',
              parameters: [
                {
                  type: 'TypeCastExpression',
                  castFrom: 'int',
                  castTo: 'String',
                  expression: {
                    type: 'VariableExpression',
                    variableScopeType: 'local',
                    name: 'count',
                  },
                },
              ],
            },
          },
          {
            type: 'BreakStatement',
          },
        ],
        elseStatements: [
          {
            type: 'AssignmentStatement',
            variableScopeType: 'local',
            variable: {
              type: 'VariableExpression',
              variableScopeType: 'local',
              name: 'count',
            },
            expression: {
              type: 'BinaryExpression',
              operator: 'addition',
              left: {
                type: 'VariableExpression',
                variableScopeType: 'local',
                name: 'count',
              },
              right: {
                type: 'IntegerExpression',
                value: 1,
              },
            },
          },
          {
            type: 'ContinueStatement',
          },
        ],
      },
    ],
  },
];

export const GENERATE_BLUEPRINT_PROMPT = `你是一个专业的编译器/解释器语法树生成专家。我会给你一段自然语言描述的逻辑流程，你必须输出**唯一、标准、可被程序直接解析的 JSON**，不能有任何解释、注释、多余文字。

输出规则必须严格遵守以下要求，不可违反：
1. 输出格式：纯 JSON，根节点是一个数组 Statement[]，完全匹配我提供的 TypeScript 语法结构。
2. 语法结构严格使用我定义的类名，包括：
   AssignmentStatement, IfStatement, WhileStatement, CallStatement, BreakStatement, ContinueStatement, ExpressionStatement 等。
3. 每个节点必须包含：
   - "type": 严格的类名
   - 对应构造函数的所有字段，具体字段请参考示例输出
4. Expression 节点统一结构：
   { "type": "xxxExpression", ...字段 }
   例如：VariableExpression, CallExpression, BinaryExpression 等。
5. 禁止使用任何自定义字段、自定义类型、自定义语法。
6. 禁止 markdown，禁止代码块，只输出纯 JSON 字符串。
7. 新增变量必须使用新增变量工具，禁止在本工具中使用不存在的变量。
8. CallStatement 节点只有 println 输出函数，没有输入函数，其他函数不允许使用。需要使用类型转换节点，先转换为字符串。只能是基本类型，可选int、float、string、bool。

用法说明：
BinaryExpression 的 operator 字段只能使用以下固定值，严禁使用其他值！
// 算术运算
addition          // +
subtraction       // -
multiplication    // *
division          // /
floor_division    // //
modulus           // %
exponentiation    // **
// 比较运算
less_than                  // <
less_than_or_equal         // <=
greater_than               // >
greater_than_or_equal      // >=
equal                      // ==
not_equal                  // !=
// 逻辑运算
and    // &&
or     // ||
xor    // 异或
xnor   // 同或

示例输出【必须严格模仿】：
${JSON.stringify(EXAMPLE_OUTPUT, null, 2)}
`;
