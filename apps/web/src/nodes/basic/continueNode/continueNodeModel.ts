import type LogicFlow from '@logicflow/core';
import BasicNodeModel, { type BasicNodeProperties, type FieldType } from '../basicNodeModel';
import { BasicEditorNodeTypePrefix, FlowType } from '../typeDifination';
import type { Expression, Statement } from '@/parser/defination';
import { ContinueStatement } from '@/parser/statements';

export const ContinueNodeType = `${BasicEditorNodeTypePrefix}:continue`;
export type ContinueNodeProperties = BasicNodeProperties;

export const ContinueNodeAnchorIds = {
  FLOW_IN: 'flow-in',
};

class ContinueNodeModel extends BasicNodeModel {
  /**
   * 定义节点的字段
   */
  getFields(): FieldType[] {
    return [
      {
        name: '流程',
        type: new FlowType(),
        inputId: ContinueNodeAnchorIds.FLOW_IN,
        outputId: null,
      },
    ];
  }
  /**
   * 解析流程入锚点
   */
  parseFlowIn(anchorId: string): Statement[] {
    const flowInAnchorId = anchorId.split(':')[1];
    if (flowInAnchorId !== ContinueNodeAnchorIds.FLOW_IN) {
      throw new Error(`ContinueNodeModel parseFlowIn anchorId ${anchorId} not supported`);
    }
    return [new ContinueStatement()];
  }
  /**
   * 解析数据出锚点
   */
  parseDataOut(anchorId: string): Expression {
    throw new Error(`ContinueNodeModel parseDataOut anchorId ${anchorId} not supported`);
  }
}

export function continueNodeGenerateAnchorRecommendation(): LogicFlow.OnDragNodeConfig[] {
  return [];
}

export default ContinueNodeModel;
