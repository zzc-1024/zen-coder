import type { Expression, Statement } from '@/parser/defination';
import BasicNodeModel, {
  type BasicNodePropertiesWithDefaultValues,
  type FieldType,
} from '../basicNodeModel';
import {
  BasicEditorNodeTypePrefix,
  type AnchorType,
} from '../typeDifination';
import type LogicFlow from '@logicflow/core';
import { BinaryExpression, type BinaryOperator } from '@/parser/expressions';
import { BasicType, BUILTIN_BASIC_FLOAT_TYPE, BUILTIN_BASIC_INTEGER_TYPE, parseType } from '@/parser/variable';

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
    return [
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
      {
        name: '计算结果',
        type: parseType(this.properties.type as string),
        inputId: null,
        outputId: BinaryOperatorNodeAnchorIds.DATA_OUT,
      },
    ];
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
): LogicFlow.OnDragNodeConfig[] {
  if (!(anchorType instanceof BasicType)) {
    return [];
  }
  if (
    anchorType.basicTypeName !== BUILTIN_BASIC_INTEGER_TYPE &&
    anchorType.basicTypeName !== BUILTIN_BASIC_FLOAT_TYPE
  ) {
    return [];
  }
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
  ];

  if (anchorType.basicTypeName === BUILTIN_BASIC_INTEGER_TYPE) {
    recommendations.push({
      type: BinaryOperatorNodeType,
      label: '整除',
      icon: 'favicon.ico',
      properties: {
        defaultValues: {},
        type: anchorType.toString(), // 在 LogicFlow 中，锚点类型必须是字符串
        operator: 'floor_division',
      } satisfies BinaryOperatorNodeProperties,
    });
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

  return recommendations;
}

export default BinaryOperatorNodeModel;
