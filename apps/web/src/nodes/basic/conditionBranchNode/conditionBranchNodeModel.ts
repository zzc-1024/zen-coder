import type LogicFlow from '@logicflow/core';
import BasicNodeModel, {
  type BasicNodePropertiesWithDefaultValues,
  type FieldType,
} from '../basicNodeModel';
import { BasicEditorNodeTypePrefix, FlowType } from '../typeDifination';
import type { Expression, Statement } from '@/parser/defination';
import { IfStatement } from '@/parser/statements';
import { BasicType } from '@/parser/variable';

export const ConditionBranchNodeType = `${BasicEditorNodeTypePrefix}:conditionBranch`;
export type ConditionBranchNodeProperties = BasicNodePropertiesWithDefaultValues;

export const ConditionBranchNodeAnchorIds = {
  FLOW_IN: 'flow-in',
  FLOW_OUT: 'flow-out',
  DATA_IN: 'data-in',
  FLOW_TRUE: 'flow-true',
  FLOW_FALSE: 'flow-false',
};

class ConditionBranchNodeModel extends BasicNodeModel {
  /**
   * 定义节点的字段
   */
  getFields(): FieldType[] {
    return [
      {
        name: '流程',
        type: new FlowType(),
        inputId: ConditionBranchNodeAnchorIds.FLOW_IN,
        outputId: ConditionBranchNodeAnchorIds.FLOW_OUT,
      },
      {
        name: '条件',
        type: new BasicType('builtin:basic:boolean'),
        inputId: ConditionBranchNodeAnchorIds.DATA_IN,
        outputId: null,
      },
      {
        name: '条件成立',
        type: new FlowType(),
        inputId: null,
        outputId: ConditionBranchNodeAnchorIds.FLOW_TRUE,
      },
      {
        name: '条件不成立',
        type: new FlowType(),
        inputId: null,
        outputId: ConditionBranchNodeAnchorIds.FLOW_FALSE,
      },
    ];
  }

  parseFlowIn(anchorId: string): Statement[] {
    const flowInId = anchorId.split(':')[1];
    if (flowInId !== ConditionBranchNodeAnchorIds.FLOW_IN)
      throw new Error(`ConditionBranchNodeModel parseFlowIn anchorId ${anchorId} not supported`);

    const properties = this.properties as ConditionBranchNodeProperties;

    // 获取条件判断锚点的输入
    let conditionExpression = this.getDataInExpression(
      `${this.id}:${ConditionBranchNodeAnchorIds.DATA_IN}`,
    );
    if (!conditionExpression) {
      const defaultValue = properties.defaultValues[ConditionBranchNodeAnchorIds.DATA_IN];
      conditionExpression = this.parseTypeStringToDefaultExpression(
        new BasicType('builtin:basic:boolean').toString(),
        defaultValue,
      );
    }
    if (!conditionExpression)
      throw new Error(
        `ConditionBranchNodeModel parseFlowIn anchorId ${ConditionBranchNodeAnchorIds.DATA_IN} not supported`,
      );

    return [
      new IfStatement(
        conditionExpression,
        this.getFlowOutStatement(`${this.id}:${ConditionBranchNodeAnchorIds.FLOW_TRUE}`),
        this.getFlowOutStatement(`${this.id}:${ConditionBranchNodeAnchorIds.FLOW_FALSE}`),
      ),
      ...this.getFlowOutStatement(`${this.id}:${ConditionBranchNodeAnchorIds.FLOW_OUT}`),
    ];
  }

  parseDataOut(anchorId: string): Expression {
    throw new Error(`ConditionBranchNodeModel parseDataOut anchorId ${anchorId} not supported`);
  }
}

export function conditionBranchNodeGenerateAnchorRecommendation(): LogicFlow.OnDragNodeConfig[] {
  return [];
}

export default ConditionBranchNodeModel;
