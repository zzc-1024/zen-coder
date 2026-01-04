import type LogicFlow from '@logicflow/core';
import BasicNodeModel, { type BasicNodeProperties, type FieldType } from '../basicNodeModel';
import { BasicEditorNodeTypePrefix, FlowType } from '../typeDifination';
import type { Expression, Statement } from '@/parser/defination';

export const EntryNodeType = `${BasicEditorNodeTypePrefix}:entry`;
export type EntryNodeProperties = BasicNodeProperties;

export const EntryNodeAnchorIds = {
  FLOW_OUT: 'flow-out',
};

class EntryNodeModel extends BasicNodeModel {
  getFields(): FieldType[] {
    return [
      { name: '流程', type: new FlowType(), inputId: null, outputId: EntryNodeAnchorIds.FLOW_OUT },
    ];
  }
  parseFlowIn(anchorId: string): Statement[] {
    throw new Error(`EntryNodeModel parseFlowIn anchorId ${anchorId} not supported`);
  }
  parseDataOut(anchorId: string): Expression {
    throw new Error(`EntryNodeModel parseDataOut anchorId ${anchorId} not supported`);
  }
}

export function entryNodeGenerateAnchorRecommendation(): LogicFlow.OnDragNodeConfig[] {
  return [];
}

export default EntryNodeModel;
