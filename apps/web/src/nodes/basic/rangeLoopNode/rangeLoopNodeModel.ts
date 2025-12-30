import type LogicFlow from '@logicflow/core';
import BasicNodeModel, { type BasicNodePropertiesWithDefaultValues, type FieldType } from '../basicNodeModel';
import { BasicType, FlowType } from '../typeDifination';

export type RangeLoopNodeProperties = BasicNodePropertiesWithDefaultValues;

class RangeLoopNodeModel extends BasicNodeModel {
  /**
   * 定义节点的字段
   */
  getFields(): FieldType[] {
    return [
      { name: '流程', type: new FlowType(), inputId: 'flow-in', outputId: 'flow-out' },
      { name: '循环体', type: new FlowType(), inputId: null, outputId: 'loop-out' },
      {
        name: '循环次数',
        type: new BasicType('builtin:basic:integer'),
        inputId: 'range-in',
        outputId: null,
      },
    ];
  }
}

export function rangeLoopNodeGenerateAnchorRecommendation(): LogicFlow.OnDragNodeConfig[] {
  return [];
}

export default RangeLoopNodeModel;
