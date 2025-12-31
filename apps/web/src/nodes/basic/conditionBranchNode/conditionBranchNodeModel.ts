import type LogicFlow from '@logicflow/core';
import BasicNodeModel, { type BasicNodePropertiesWithDefaultValues, type FieldType } from '../basicNodeModel';
import { BasicEditorNodeTypePrefix, BasicType, FlowType } from '../typeDifination';

export const ConditionBranchNodeType = `${BasicEditorNodeTypePrefix}:conditionBranch`;
export type ConditionBranchNodeProperties = BasicNodePropertiesWithDefaultValues;

class ConditionBranchNodeModel extends BasicNodeModel {
  /**
   * 定义节点的字段
   */
  getFields(): FieldType[] {
    return [
      { name: '流程', type: new FlowType(), inputId: 'flow-in', outputId: 'flow-out' },
      {
        name: '条件',
        type: new BasicType('builtin:basic:boolean'),
        inputId: 'data-in',
        outputId: null,
      },
      {
        name: '条件成立',
        type: new FlowType(),
        inputId: null,
        outputId: 'flow-true',
      },
      {
        name: '条件不成立',
        type: new FlowType(),
        inputId: null,
        outputId: 'flow-false',
      },
    ];
  }
}

export function conditionBranchNodeGenerateAnchorRecommendation(): LogicFlow.OnDragNodeConfig[] {
  return [];
}

export default ConditionBranchNodeModel;
