import type LogicFlow from '@logicflow/core';
import BasicNodeModel, { type BasicNodeProperties, type FieldType } from '../basicNodeModel';
import { FlowType, parseType } from '../typeDifination';

export type SetNodeProperties = BasicNodeProperties & {
  type: string;
};

class SetNodeModel extends BasicNodeModel {
  /**
   * 定义节点的字段
   */
  getFields(): FieldType[] {
    return [
      { name: '流程', type: new FlowType(), inputId: 'flow-in', outputId: 'flow-out' },
      {
        name: '赋值',
        type: parseType(this.properties.type as string),
        inputId: 'data-in',
        outputId: null,
      },
    ];
  }
}

export function setNodeGenerateAnchorRecommendation(): LogicFlow.OnDragNodeConfig[] {
  return [];
}

export default SetNodeModel;
