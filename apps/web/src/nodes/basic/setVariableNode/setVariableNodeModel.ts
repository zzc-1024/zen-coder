import type LogicFlow from '@logicflow/core';
import BasicNodeModel, {
  type BasicNodePropertiesWithDefaultValues,
  type FieldType,
} from '../basicNodeModel';
import { BasicEditorNodeTypePrefix, FlowType } from '../typeDifination';
import type { Expression, Statement } from '@/parser/defination';
import { AssignmentStatement } from '@/parser/statements';
import { VariableExpression } from '@/parser/expressions';
import { parseType } from '@/parser/variable';

export const SetVariableNodeType = `${BasicEditorNodeTypePrefix}:set`;
export type SetVariableNodeProperties = BasicNodePropertiesWithDefaultValues & {
  type: string;
  variable: string;
};

export const SetVariableNodeAnchorIds = {
  FLOW_IN: 'flow-in',
  FLOW_OUT: 'flow-out',
  DATA_IN: 'data-in',
};

class SetVariableNodeModel extends BasicNodeModel {
  /**
   * 定义节点的字段
   */
  getFields(): FieldType[] {
    return [
      {
        name: '流程',
        type: new FlowType(),
        inputId: SetVariableNodeAnchorIds.FLOW_IN,
        outputId: SetVariableNodeAnchorIds.FLOW_OUT,
      },
      {
        name: '赋值',
        type: parseType(this.properties.type as string),
        inputId: SetVariableNodeAnchorIds.DATA_IN,
        outputId: null,
      },
    ];
  }

  /**
   * 解析节点的输入流
   */
  parseFlowIn(anchorId: string): Statement[] {
    const flowInId = anchorId.split(':')[1];
    if (flowInId !== SetVariableNodeAnchorIds.FLOW_IN)
      throw new Error(
        `SetVariableNodeModel parseFlowIn anchorId must be ${SetVariableNodeAnchorIds.FLOW_IN}, but got ${anchorId}`,
      );

    const properties = this.properties as SetVariableNodeProperties;

    // 生成输入表达式
    let expression = this.getDataInExpression(`${this.id}:${SetVariableNodeAnchorIds.DATA_IN}`);
    if (!expression) {
      const defaultValue = properties.defaultValues[SetVariableNodeAnchorIds.DATA_IN];
      expression = this.parseTypeStringToDefaultExpression(
        properties.type,
        defaultValue,
      );
    }
    if (!expression)
      throw new Error(
        `SetVariableNodeModel parseTypeStringToDefaultExpression type ${properties.type} not supported`,
      );

    // 生成语句
    const statements = [
      new AssignmentStatement(new VariableExpression(properties.variable), expression),
      ...this.getFlowOutStatement(`${this.id}:${SetVariableNodeAnchorIds.FLOW_OUT}`),
    ];
    return statements;
  }

  /**
   * 解析节点的输出流
   */
  parseDataOut(): Expression {
    throw new Error('SetVariableNodeModel parseDataOut not implemented');
  }
}

export function setVariableNodeGenerateAnchorRecommendation(): LogicFlow.OnDragNodeConfig[] {
  return [];
}

export default SetVariableNodeModel;
