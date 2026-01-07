import type { Expression, Statement } from '@/parser/defination';
import BasicNodeModel, {
  type BasicNodePropertiesWithDefaultValues,
  type FieldType,
} from '../basicNodeModel';
import { BasicEditorNodeTypePrefix, type AnchorType, type DirectType } from '../typeDifination';
import type LogicFlow from '@logicflow/core';
import { BinaryExpression, type BinaryOperator } from '@/parser/expressions';
import {
  BasicType,
  BUILTIN_BASIC_BOOLEAN_TYPE,
  BUILTIN_BASIC_INTEGER_TYPE,
  BUILTIN_BASIC_STRING_TYPE,
  parseType,
} from '@/parser/variable';

export const BinaryOperatorNodeType = `${BasicEditorNodeTypePrefix}:binaryOperator`;
export type BinaryOperatorNodeProperties = BasicNodePropertiesWithDefaultValues & {
  type: string;
  operator: BinaryOperator;
};

export const BinaryOperatorNodeAnchorIds = {
  LEFT_OPERAND: 'left-operand',
  RIGHT_OPERAND: 'right-operand',
  DATA_OUT: 'data-out',
};

class BinaryOperatorNodeModel extends BasicNodeModel {
  getFields(): FieldType[] {
    const fieldType: FieldType[] = [
      {
        name: '左操作数',
        type: parseType(this.properties.type as string),
        inputId: BinaryOperatorNodeAnchorIds.LEFT_OPERAND,
        outputId: null,
      },
      {
        name: '右操作数',
        type: parseType(this.properties.type as string),
        inputId: BinaryOperatorNodeAnchorIds.RIGHT_OPERAND,
        outputId: null,
      },
    ];
    const comparisonOperators: BinaryOperator[] = [
      'greater_than',
      'greater_than_or_equal',
      'less_than',
      'less_than_or_equal',
      'equal',
      'not_equal',
    ];
    if (comparisonOperators.includes(this.properties.operator as BinaryOperator)) {
      fieldType.push({
        name: '计算结果',
        type: new BasicType('builtin:basic:boolean'),
        inputId: null,
        outputId: BinaryOperatorNodeAnchorIds.DATA_OUT,
      });
    } else {
      fieldType.push({
        name: '计算结果',
        type: parseType(this.properties.type as string),
        inputId: null,
        outputId: BinaryOperatorNodeAnchorIds.DATA_OUT,
      });
    }
    return fieldType;
  }

  parseFlowIn(anchorId: string): Statement[] {
    throw new Error(`BinaryOperatorNodeModel parseFlowIn anchorId ${anchorId} not supported`);
  }

  parseDataOut(anchorId: string): Expression {
    const dataOutId = anchorId.split(':')[1];
    if (dataOutId !== BinaryOperatorNodeAnchorIds.DATA_OUT) {
      throw new Error(`BinaryOperatorNodeModel parseDataOut anchorId ${anchorId} not supported`);
    }
    const properties = this.properties as BinaryOperatorNodeProperties;

    // 获取左右操作数表达式
    let leftOperandExpression = this.getDataInExpression(
      `${this.id}:${BinaryOperatorNodeAnchorIds.LEFT_OPERAND}`,
    );
    let rightOperandExpression = this.getDataInExpression(
      `${this.id}:${BinaryOperatorNodeAnchorIds.RIGHT_OPERAND}`,
    );
    if (!leftOperandExpression) {
      const defaultValue = properties.defaultValues[BinaryOperatorNodeAnchorIds.LEFT_OPERAND];
      leftOperandExpression = this.parseTypeStringToDefaultExpression(
        properties.type,
        defaultValue,
      );
    }
    if (!rightOperandExpression) {
      const defaultValue = properties.defaultValues[BinaryOperatorNodeAnchorIds.RIGHT_OPERAND];
      rightOperandExpression = this.parseTypeStringToDefaultExpression(
        properties.type,
        defaultValue,
      );
    }
    if (!leftOperandExpression || !rightOperandExpression) {
      throw new Error(
        'BinaryOperatorNodeModel parseDataOut left or right operand expression is null',
      );
    }

    return new BinaryExpression(properties.operator, leftOperandExpression, rightOperandExpression);
  }
}

export function binaryOperatorNodeGenerateAnchorRecommendation(
  anchorType: AnchorType,
  direction: DirectType,
): LogicFlow.OnDragNodeConfig[] {
  if (!(anchorType instanceof BasicType)) {
    return [];
  }
  // 预先定义要复用的比较运算符
  const comparisonDragNodeConfig: LogicFlow.OnDragNodeConfig[] = [
    {
      type: BinaryOperatorNodeType,
      label: '大于',
      icon: 'favicon.ico',
      properties: {
        type: anchorType.toString(), // 在 LogicFlow 中，锚点类型必须是字符串
        operator: 'greater_than',
        defaultValues: {},
      } satisfies BinaryOperatorNodeProperties,
    },
    {
      type: BinaryOperatorNodeType,
      label: '大于等于',
      icon: 'favicon.ico',
      properties: {
        type: anchorType.toString(), // 在 LogicFlow 中，锚点类型必须是字符串
        operator: 'greater_than_or_equal',
        defaultValues: {},
      } satisfies BinaryOperatorNodeProperties,
    },
    {
      type: BinaryOperatorNodeType,
      label: '小于',
      icon: 'favicon.ico',
      properties: {
        type: anchorType.toString(), // 在 LogicFlow 中，锚点类型必须是字符串
        operator: 'less_than',
        defaultValues: {},
      } satisfies BinaryOperatorNodeProperties,
    },
    {
      type: BinaryOperatorNodeType,
      label: '小于等于',
      icon: 'favicon.ico',
      properties: {
        type: anchorType.toString(), // 在 LogicFlow 中，锚点类型必须是字符串
        operator: 'less_than_or_equal',
        defaultValues: {},
      } satisfies BinaryOperatorNodeProperties,
    },
    {
      type: BinaryOperatorNodeType,
      label: '等于',
      icon: 'favicon.ico',
      properties: {
        type: anchorType.toString(), // 在 LogicFlow 中，锚点类型必须是字符串
        operator: 'equal',
        defaultValues: {},
      } satisfies BinaryOperatorNodeProperties,
    },
    {
      type: BinaryOperatorNodeType,
      label: '不等于',
      icon: 'favicon.ico',
      properties: {
        type: anchorType.toString(), // 在 LogicFlow 中，锚点类型必须是字符串
        operator: 'not_equal',
        defaultValues: {},
      } satisfies BinaryOperatorNodeProperties,
    },
  ];

  // 先处理布尔型
  if (anchorType.basicTypeName === BUILTIN_BASIC_BOOLEAN_TYPE) {
    const booleanTypeResult: LogicFlow.OnDragNodeConfig[] = [
      {
        type: BinaryOperatorNodeType,
        label: '与',
        icon: 'favicon.ico',
        properties: {
          type: anchorType.toString(), // 在 LogicFlow 中，锚点类型必须是字符串
          operator: 'and',
          defaultValues: {},
        } satisfies BinaryOperatorNodeProperties,
      },
      {
        type: BinaryOperatorNodeType,
        label: '或',
        icon: 'favicon.ico',
        properties: {
          type: anchorType.toString(), // 在 LogicFlow 中，锚点类型必须是字符串
          operator: 'or',
          defaultValues: {},
        } satisfies BinaryOperatorNodeProperties,
      },
      {
        type: BinaryOperatorNodeType,
        label: '不相等xor',
        icon: 'favicon.ico',
        properties: {
          type: anchorType.toString(), // 在 LogicFlow 中，锚点类型必须是字符串
          operator: 'xor',
          defaultValues: {},
        } satisfies BinaryOperatorNodeProperties,
      },
      {
        type: BinaryOperatorNodeType,
        label: '相等xnor',
        icon: 'favicon.ico',
        properties: {
          type: anchorType.toString(), // 在 LogicFlow 中，锚点类型必须是字符串
          operator: 'xnor',
          defaultValues: {},
        } satisfies BinaryOperatorNodeProperties,
      },
    ];
    return booleanTypeResult;
  } //布尔型处理结束

  // 字符串型
  if (anchorType.basicTypeName === BUILTIN_BASIC_STRING_TYPE) {
    const stringTypeResult: LogicFlow.OnDragNodeConfig[] = [
      {
        type: BinaryOperatorNodeType,
        label: '加法',
        icon: 'favicon.ico',
        properties: {
          type: anchorType.toString(), // 在 LogicFlow 中，锚点类型必须是字符串
          operator: 'addition',
          defaultValues: {},
        } satisfies BinaryOperatorNodeProperties,
      },
    ];
    if (direction === 'out') {
      stringTypeResult.push(...comparisonDragNodeConfig);
    }
    return stringTypeResult;
  } //字符串型处理结束

  const recommendations: LogicFlow.OnDragNodeConfig[] = [
    {
      type: BinaryOperatorNodeType,
      label: '加法',
      icon: 'favicon.ico',
      properties: {
        type: anchorType.toString(), // 在 LogicFlow 中，锚点类型必须是字符串
        operator: 'addition',
        defaultValues: {},
      } satisfies BinaryOperatorNodeProperties,
    },
    {
      type: BinaryOperatorNodeType,
      label: '减法',
      icon: 'favicon.ico',
      properties: {
        type: anchorType.toString(), // 在 LogicFlow 中，锚点类型必须是字符串
        operator: 'subtraction',
        defaultValues: {},
      } satisfies BinaryOperatorNodeProperties,
    },
    {
      type: BinaryOperatorNodeType,
      label: '乘法',
      icon: 'favicon.ico',
      properties: {
        type: anchorType.toString(), // 在 LogicFlow 中，锚点类型必须是字符串
        operator: 'multiplication',
        defaultValues: {},
      } satisfies BinaryOperatorNodeProperties,
    },
    {
      type: BinaryOperatorNodeType,
      label: anchorType.basicTypeName === BUILTIN_BASIC_INTEGER_TYPE ? '整除' : '除法',
      icon: 'favicon.ico',
      properties: {
        defaultValues: {},
        type: anchorType.toString(), // 在 LogicFlow 中，锚点类型必须是字符串
        operator:
          anchorType.basicTypeName === BUILTIN_BASIC_INTEGER_TYPE ? 'floor_division' : 'division',
      } satisfies BinaryOperatorNodeProperties,
    },
    {
      type: BinaryOperatorNodeType,
      label: '乘方',
      icon: 'favicon.ico',
      properties: {
        type: anchorType.toString(), // 在 LogicFlow 中，锚点类型必须是字符串
        operator: 'exponentiation',
        defaultValues: {},
      } satisfies BinaryOperatorNodeProperties,
    },
  ];

  if (anchorType.basicTypeName === BUILTIN_BASIC_INTEGER_TYPE) {
    recommendations.push({
      type: BinaryOperatorNodeType,
      label: '取余运算',
      icon: 'favicon.ico',
      properties: {
        defaultValues: {},
        type: anchorType.toString(), // 在 LogicFlow 中，锚点类型必须是字符串
        operator: 'modulus',
      } satisfies BinaryOperatorNodeProperties,
    });
  }

  if (direction === 'out') {
    recommendations.push(...comparisonDragNodeConfig);
  }

  return recommendations;
}

export default BinaryOperatorNodeModel;
