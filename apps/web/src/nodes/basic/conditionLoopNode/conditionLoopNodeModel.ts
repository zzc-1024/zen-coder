import type LogicFlow from '@logicflow/core';
import BasicNodeModel, { type BasicNodePropertiesWithDefaultValues, type FieldType } from '../basicNodeModel';
import { BasicType, FlowType } from '../typeDifination';

export type ConditionLoopNodeProperties = BasicNodePropertiesWithDefaultValues;

class ConditionLoopNodeModel extends BasicNodeModel {
  /**
   * 定义节点的字段
   */
  getFields(): FieldType[] {
    return [
      { name: '流程', type: new FlowType(), inputId: 'flow-in', outputId: 'flow-out' },
      { name: '循环体', type: new FlowType(), inputId: null, outputId: 'loop-out' },
      {
        name: '条件',
        type: new BasicType('builtin:basic:boolean'),
        inputId: 'condition-in',
        outputId: null,
      },
    ];
  }
}

export function conditionLoopNodeGenerateAnchorRecommendation(): LogicFlow.OnDragNodeConfig[] {
  return [];
}

export default ConditionLoopNodeModel;
