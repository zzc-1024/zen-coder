import type LogicFlow from '@logicflow/core';
import BasicNodeModel, {
  type BasicNodePropertiesWithDefaultValues,
  type FieldType,
} from '../basicNodeModel';
import { BasicEditorNodeTypePrefix, FlowType } from '../typeDifination';
import type { Expression, Statement } from '@/parser/defination';
import { WhileStatement } from '@/parser/statements';
import { BasicType } from '@/parser/variable';

export const ConditionLoopNodeType = `${BasicEditorNodeTypePrefix}:conditionLoop`;
export type ConditionLoopNodeProperties = BasicNodePropertiesWithDefaultValues;

export const ConditionLoopNodeAnchorIds = {
  FLOW_IN: 'flow-in',
  FLOW_OUT: 'flow-out',
  LOOP_OUT: 'loop-out',
  CONDITION_IN: 'condition-in',
};

class ConditionLoopNodeModel extends BasicNodeModel {
  /**
   * 定义节点的字段
   */
  getFields(): FieldType[] {
    return [
      {
        name: '流程',
        type: new FlowType(),
        inputId: ConditionLoopNodeAnchorIds.FLOW_IN,
        outputId: ConditionLoopNodeAnchorIds.FLOW_OUT,
      },
      {
        name: '循环体',
        type: new FlowType(),
        inputId: null,
        outputId: ConditionLoopNodeAnchorIds.LOOP_OUT,
      },
      {
        name: '条件',
        type: new BasicType('builtin:basic:boolean'),
        inputId: ConditionLoopNodeAnchorIds.CONDITION_IN,
        outputId: null,
      },
    ];
  }

  parseFlowIn(anchorId: string): Statement[] {
    const flowInId = anchorId.split(':')[1];
    if (flowInId !== ConditionLoopNodeAnchorIds.FLOW_IN)
      throw new Error(`ConditionLoopNodeModel parseFlowIn anchorId ${anchorId} not supported`);

    const properties = this.properties as ConditionLoopNodeProperties;

    // 获取条件表达式
    let conditionExpression = this.getDataInExpression(
      `${this.id}:${ConditionLoopNodeAnchorIds.CONDITION_IN}`,
    );
    if (!conditionExpression) {
      const defaultValue = properties.defaultValues[ConditionLoopNodeAnchorIds.CONDITION_IN];
      conditionExpression = this.parseTypeStringToDefaultExpression(
        new BasicType('builtin:basic:boolean').toString(),
        defaultValue,
      );
    }
    if (!conditionExpression)
      throw new Error(
        `ConditionLoopNodeModel parseFlowIn anchorId ${anchorId} conditionExpression is undefined`,
      );

    return [
      new WhileStatement(
        conditionExpression,
        this.getFlowOutStatement(`${this.id}:${ConditionLoopNodeAnchorIds.LOOP_OUT}`),
      ), ...this.getFlowOutStatement(`${this.id}:${ConditionLoopNodeAnchorIds.FLOW_OUT}`),
    ];
  }
  parseDataOut(anchorId: string): Expression {
    throw new Error(`ConditionLoopNodeModel parseDataOut anchorId ${anchorId} not supported`);
  }
}

export function conditionLoopNodeGenerateAnchorRecommendation(): LogicFlow.OnDragNodeConfig[] {
  return [];
}

export default ConditionLoopNodeModel;
