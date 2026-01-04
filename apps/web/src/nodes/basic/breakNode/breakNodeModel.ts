import type LogicFlow from '@logicflow/core';
import BasicNodeModel, { type BasicNodeProperties, type FieldType } from '../basicNodeModel';
import { BasicEditorNodeTypePrefix, FlowType } from '../typeDifination';
import type { Expression, Statement } from '@/parser/defination';
import { BreakStatement } from '@/parser/statements';

export const BreakNodeType = `${BasicEditorNodeTypePrefix}:break`;
export type BreakNodeProperties = BasicNodeProperties;

export const BreakNodeAnchorIds = {
  FLOW_IN: 'flow-in',
};

class BreakNodeModel extends BasicNodeModel {
  /**
   * 定义节点的字段
   */
  getFields(): FieldType[] {
    return [
      { name: '流程', type: new FlowType(), inputId: BreakNodeAnchorIds.FLOW_IN, outputId: null },
    ];
  }
  /**
   * 解析流程入锚点
   */
  parseFlowIn(anchorId: string): Statement[] {
    const flowInAnchorId = anchorId.split(':')[1];
    if (flowInAnchorId !== BreakNodeAnchorIds.FLOW_IN) {
      throw new Error(`BreakNodeModel parseFlowIn anchorId ${anchorId} not supported`);
    }
    return [new BreakStatement()];
  }
  /**
   * 解析数据出锚点
   */
  parseDataOut(anchorId: string): Expression {
    throw new Error(`BreakNodeModel parseDataOut anchorId ${anchorId} not supported`);
  }
}

export function breakNodeGenerateAnchorRecommendation(): LogicFlow.OnDragNodeConfig[] {
  return [];
}

export default BreakNodeModel;
