import type { Expression, Statement } from '@/parser/defination';
import BasicNodeModel, {
  type BasicNodePropertiesWithDefaultValues,
  type FieldType,
} from '../basicNodeModel';
import {
  BasicEditorNodeTypePrefix,
  BasicType,
  BUILTIN_BASIC_FLOAT_TYPE,
  BUILTIN_BASIC_INTEGER_TYPE,
  parseType,
  type AnchorType,
} from '../typeDifination';
import type LogicFlow from '@logicflow/core';
import { BinaryExpression } from '@/parser/expressions';

export const BinaryArithmeticNodeType = `${BasicEditorNodeTypePrefix}:binaryArithmetic`;
export type BinaryArithmeticNodeProperties = BasicNodePropertiesWithDefaultValues & {
  type: string;
  operator: string;
};

export const BinaryArithmeticNodeAnchorIds = {
  LEFT_OPERAND: 'left-operand',
  RIGHT_OPERAND: 'right-operand',
  DATA_OUT: 'data-out',
};

class BinaryArithmeticNodeModel extends BasicNodeModel {
  getFields(): FieldType[] {
    return [
      {
        name: '左操作数',
        type: parseType(this.properties.type as string),
        inputId: BinaryArithmeticNodeAnchorIds.LEFT_OPERAND,
        outputId: null,
      },
      {
        name: '右操作数',
        type: parseType(this.properties.type as string),
        inputId: BinaryArithmeticNodeAnchorIds.RIGHT_OPERAND,
        outputId: null,
      },
      {
        name: '计算结果',
        type: parseType(this.properties.type as string),
        inputId: null,
        outputId: BinaryArithmeticNodeAnchorIds.DATA_OUT,
      },
    ];
  }

  parseFlowIn(anchorId: string): Statement[] {
    throw new Error(`BinaryArithmeticNodeModel parseFlowIn anchorId ${anchorId} not supported`);
  }

  parseDataOut(anchorId: string): Expression {
    const dataOutId = anchorId.split(':')[1];
    if (dataOutId !== BinaryArithmeticNodeAnchorIds.DATA_OUT) {
      throw new Error(`BinaryArithmeticNodeModel parseDataOut anchorId ${anchorId} not supported`);
    }
    const properties = this.properties as BinaryArithmeticNodeProperties;

    // 获取左右操作数表达式
    let leftOperandExpression = this.getDataInExpression(
      `${this.id}:${BinaryArithmeticNodeAnchorIds.LEFT_OPERAND}`,
    );
    let rightOperandExpression = this.getDataInExpression(
      `${this.id}:${BinaryArithmeticNodeAnchorIds.RIGHT_OPERAND}`,
    );
    if (!leftOperandExpression) {
      const defaultValue = properties.defaultValues[BinaryArithmeticNodeAnchorIds.LEFT_OPERAND];
      leftOperandExpression = this.parseTypeStringToDefaultExpression(
        properties.type,
        defaultValue,
      );
    }
    if (!rightOperandExpression) {
      const defaultValue = properties.defaultValues[BinaryArithmeticNodeAnchorIds.RIGHT_OPERAND];
      rightOperandExpression = this.parseTypeStringToDefaultExpression(
        properties.type,
        defaultValue,
      );
    }
    if (!leftOperandExpression || !rightOperandExpression) {
      throw new Error(
        'BinaryArithmeticNodeModel parseDataOut left or right operand expression is null',
      );
    }

    return new BinaryExpression(properties.operator, leftOperandExpression, rightOperandExpression);
  }
}

export function binaryArithmeticNodeGenerateAnchorRecommendation(
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
      type: BinaryArithmeticNodeType,
      label: '加法',
      icon: 'favicon.ico',
      properties: {
        title: '加法运算',
        type: anchorType.toString(), // 在 LogicFlow 中，锚点类型必须是字符串
        operator: 'addition',
      },
    },
    {
      type: BinaryArithmeticNodeType,
      label: '减法',
      icon: 'favicon.ico',
      properties: {
        title: '减法运算',
        type: anchorType.toString(), // 在 LogicFlow 中，锚点类型必须是字符串
        operator: 'subtraction',
      },
    },
    {
      type: BinaryArithmeticNodeType,
      label: '乘法',
      icon: 'favicon.ico',
      properties: {
        title: '乘法运算',
        type: anchorType.toString(), // 在 LogicFlow 中，锚点类型必须是字符串
        operator: 'multiplication',
      },
    },
  ];

  if (anchorType.basicTypeName === BUILTIN_BASIC_INTEGER_TYPE) {
    recommendations.push({
      type: BinaryArithmeticNodeType,
      label: '整除',
      icon: 'favicon.ico',
      properties: {
        title: '整除运算',
        type: anchorType.toString(), // 在 LogicFlow 中，锚点类型必须是字符串
        operator: 'floorDivision',
      },
    });
    recommendations.push({
      type: BinaryArithmeticNodeType,
      label: '取余运算',
      icon: 'favicon.ico',
      properties: {
        title: '取余运算',
        type: anchorType.toString(), // 在 LogicFlow 中，锚点类型必须是字符串
        operator: 'modulus',
      },
    });
  }

  return recommendations;
}

export default BinaryArithmeticNodeModel;
