import type LogicFlow from '@logicflow/core';
import BasicNodeModel, {
  type BasicNodePropertiesWithDefaultValues,
  type FieldType,
} from '../basicNodeModel';
import { BasicEditorNodeTypePrefix, FlowType } from '../typeDifination';
import type { Expression, Statement } from '@/parser/defination';
import { CountLoopStatement } from '@/parser/statements';
import { BasicType } from '@/parser/variable';

export const RangeLoopNodeType = `${BasicEditorNodeTypePrefix}:rangeLoop`;
export type RangeLoopNodeProperties = BasicNodePropertiesWithDefaultValues;

export const RangeLoopNodeAnchorIds = {
  FLOW_IN: 'flow-in',
  FLOW_OUT: 'flow-out',
  LOOP_OUT: 'loop-out',
  RANGE_IN: 'range-in',
};

class RangeLoopNodeModel extends BasicNodeModel {
  /**
   * 定义节点的字段
   */
  getFields(): FieldType[] {
    return [
      {
        name: '流程',
        type: new FlowType(),
        inputId: RangeLoopNodeAnchorIds.FLOW_IN,
        outputId: RangeLoopNodeAnchorIds.FLOW_OUT,
      },
      {
        name: '循环体',
        type: new FlowType(),
        inputId: null,
        outputId: RangeLoopNodeAnchorIds.LOOP_OUT,
      },
      {
        name: '循环次数',
        type: new BasicType('builtin:basic:integer'),
        inputId: RangeLoopNodeAnchorIds.RANGE_IN,
        outputId: null,
      },
    ];
  }

  parseFlowIn(anchorId: string): Statement[] {
    const flowInAnchorId = anchorId.split(':')[1];
    if (flowInAnchorId !== RangeLoopNodeAnchorIds.FLOW_IN) {
      throw new Error(`RangeLoopNodeModel parseFlowIn anchorId ${anchorId} not supported`);
    }
    const properties = this.properties as RangeLoopNodeProperties;

    // 生成输入表达式
    let timesExpression = this.getDataInExpression(`${this.id}:${RangeLoopNodeAnchorIds.RANGE_IN}`);
    if (!timesExpression) {
      const defaultValue = properties.defaultValues[RangeLoopNodeAnchorIds.RANGE_IN];
      timesExpression = this.parseTypeStringToDefaultExpression(
        new BasicType('builtin:basic:integer').toString(),
        defaultValue,
      );
    }
    if (!timesExpression) {
      throw new Error(`RangeLoopNodeModel parseFlowIn timesExpression is null`);
    }

    // 生成语句
    const statements = [
      new CountLoopStatement(
        timesExpression,
        this.getFlowOutStatement(`${this.id}:${RangeLoopNodeAnchorIds.LOOP_OUT}`),
      ),
      ...this.getFlowOutStatement(`${this.id}:${RangeLoopNodeAnchorIds.FLOW_OUT}`),
    ];
    return statements;
  }
  parseDataOut(anchorId: string): Expression {
    throw new Error(`RangeLoopNodeModel parseDataOut anchorId ${anchorId} not supported`);
  }
}

export function rangeLoopNodeGenerateAnchorRecommendation(): LogicFlow.OnDragNodeConfig[] {
  return [];
}

export default RangeLoopNodeModel;
