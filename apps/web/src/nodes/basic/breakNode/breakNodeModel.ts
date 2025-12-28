import type LogicFlow from '@logicflow/core';
import BasicNodeModel, { type BasicNodeProperties, type FieldType } from '../basicNodeModel';
import { FlowType } from '../typeDifination';

export type BreakNodeProperties = BasicNodeProperties;

class BreakNodeModel extends BasicNodeModel {
  /**
   * 定义节点的字段
   */
  getFields(): FieldType[] {
    return [{ name: '流程', type: new FlowType(), inputId: 'flow-in', outputId: null }];
  }
}

export function breakNodeGenerateAnchorRecommendation(): LogicFlow.OnDragNodeConfig[] {
  return [];
}

export default BreakNodeModel;
