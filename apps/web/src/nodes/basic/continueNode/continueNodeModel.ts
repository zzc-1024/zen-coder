import type LogicFlow from '@logicflow/core';
import BasicNodeModel, { type BasicNodeProperties, type FieldType } from '../basicNodeModel';
import { BasicEditorNodeTypePrefix, FlowType } from '../typeDifination';

export const ContinueNodeType = `${BasicEditorNodeTypePrefix}:continue`;
export type ContinueNodeProperties = BasicNodeProperties;

class ContinueNodeModel extends BasicNodeModel {
  /**
   * 定义节点的字段
   */
  getFields(): FieldType[] {
    return [{ name: '流程', type: new FlowType(), inputId: 'flow-in', outputId: null }];
  }
}

export function continueNodeGenerateAnchorRecommendation(): LogicFlow.OnDragNodeConfig[] {
  return [];
}

export default ContinueNodeModel;
