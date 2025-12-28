import BasicNodeModel, { type BasicNodeProperties, type FieldType } from '../basicNodeModel';
import {
  BasicType,
  BUILTIN_BASIC_FLOAT_TYPE,
  BUILTIN_BASIC_INTEGER_TYPE,
  parseType,
  type AnchorType,
} from '../typeDifination';
import { BinaryArithmeticNodeType } from '../basicEditorConfig';
import type LogicFlow from '@logicflow/core';

export type BinaryArithmeticNodeProperties = BasicNodeProperties & {
  type: string;
  operator: string;
};

class BinaryArithmeticNodeModel extends BasicNodeModel {
  getFields(): FieldType[] {
    return [
      {
        name: '左操作数',
        type: parseType(this.properties.type as string),
        inputId: 'left-operand',
        outputId: null,
      },
      {
        name: '右操作数',
        type: parseType(this.properties.type as string),
        inputId: 'right-operand',
        outputId: null,
      },
      {
        name: '计算结果',
        type: parseType(this.properties.type as string),
        inputId: null,
        outputId: 'data-out',
      },
    ];
  }
}

export function binaryArithmeticNodeGenerateAnchorRecommendation(
  anchorType: AnchorType,
): LogicFlow.OnDragNodeConfig[] {
  if (!(anchorType instanceof BasicType)) {
    return [];
  }
  if (
    anchorType.type !== BUILTIN_BASIC_INTEGER_TYPE &&
    anchorType.type !== BUILTIN_BASIC_FLOAT_TYPE
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

  if (anchorType.type === BUILTIN_BASIC_INTEGER_TYPE) {
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
