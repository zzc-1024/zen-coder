import type LogicFlow from '@logicflow/core';
import BasicNodeModel, { type BasicNodeProperties, type FieldType } from '../basicNodeModel';
import { BasicEditorNodeTypePrefix, FlowType } from '../typeDifination';

export const EntryNodeType = `${BasicEditorNodeTypePrefix}:entry`;
export type EntryNodeProperties = BasicNodeProperties;

class EntryNodeModel extends BasicNodeModel {
  getFields(): FieldType[] {
    return [{ name: '流程', type: new FlowType(), inputId: null, outputId: 'flow-out' }];
  }
}

export function entryNodeGenerateAnchorRecommendation(): LogicFlow.OnDragNodeConfig[] {
  return [];
}

export default EntryNodeModel;
