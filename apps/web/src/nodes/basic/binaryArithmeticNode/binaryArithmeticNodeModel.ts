// src/components/LF/BaseNode/model.ts
import { type Model } from '@logicflow/core';
import BasicNodeModel, { type BasicNodeProperties } from '../basicNodeModel';
import {
  BasicType,
  BUILTIN_BASIC_FLOAT_TYPE,
  BUILTIN_BASIC_INTEGER_TYPE,
  parseType,
  type AnchorType,
} from '../typeDifination';
import { BinaryArithmeticNodeType } from '../basicEditorConfig';

export type BinaryArithmeticNodeProperties = BasicNodeProperties & {
  type: string;
  operator: string;
};

class BinaryArithmeticNodeModel extends BasicNodeModel {
  /**
   * 设置节点的基础属性
   * LogicFlow 会在初始化和属性更新时调用此方法
   */
  setAttributes() {
    super.setAttributes();
    this.setNodeHeightByRowCount(3);
  }

  /**
   * 进阶：自定义锚点
   * 让每个字段的左右两侧都能连线
   */
  getDefaultAnchor() {
    // 先定义需要的数据
    const anchors: Model.AnchorConfig[] = [];
    const properties = this.properties as BinaryArithmeticNodeProperties;

    // 左操作数锚点
    const leftOperandAnchor = this.generateAnchorConfig(
      0,
      'in',
      parseType(properties.type),
      'left-operand',
    );
    if (leftOperandAnchor) anchors.push(leftOperandAnchor);
    // 右操作数锚点
    const rightOperandAnchor = this.generateAnchorConfig(
      1,
      'in',
      parseType(properties.type),
      'right-operand',
    );
    if (rightOperandAnchor) anchors.push(rightOperandAnchor);
    // 计算结果锚点
    const dataOutAnchor = this.generateAnchorConfig(
      2,
      'out',
      parseType(properties.type),
      'data-out',
    );
    if (dataOutAnchor) anchors.push(dataOutAnchor);

    return anchors;
  }

  static generateAnchorRecommendation(anchorType: AnchorType): unknown[] {
    if (!(anchorType instanceof BasicType)) {
      return [];
    }
    if (
      anchorType.type !== BUILTIN_BASIC_INTEGER_TYPE &&
      anchorType.type !== BUILTIN_BASIC_FLOAT_TYPE
    ) {
      return [];
    }
    const recommendations: unknown[] = [
      [
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
      ],
    ];

    if (anchorType.type === BUILTIN_BASIC_INTEGER_TYPE) {
      recommendations.push([
        {
          type: BinaryArithmeticNodeType,
          label: '整除',
          icon: 'favicon.ico',
          properties: {
            title: '整除运算',
            type: anchorType.toString(), // 在 LogicFlow 中，锚点类型必须是字符串
            operator: 'floorDivision',
          },
        },
        {
          type: BinaryArithmeticNodeType,
          label: '取余运算',
          icon: 'favicon.ico',
          properties: {
            title: '取余运算',
            type: anchorType.toString(), // 在 LogicFlow 中，锚点类型必须是字符串
            operator: 'modulus',
          },
        },
      ]);
    }

    return recommendations;
  }
}

export default BinaryArithmeticNodeModel;
