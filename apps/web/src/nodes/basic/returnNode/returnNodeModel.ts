import type LogicFlow from '@logicflow/core';
import BasicNodeModel, {
  type BasicNodePropertiesWithDefaultValues,
  type FieldType,
} from '../basicNodeModel';
import { BasicEditorNodeTypePrefix, FlowType } from '../typeDifination';
import type { Expression, Statement } from '@/parser/defination';
import { ReturnStatement } from '@/parser/statements';
import { parseType } from '@/parser/variable';

export const ReturnNodeType = `${BasicEditorNodeTypePrefix}:return`;
export type ReturnNodeProperties = BasicNodePropertiesWithDefaultValues & {
  type: string | undefined;
};

export const ReturnNodeAnchorIds = {
  FLOW_IN: 'flow-in',
  DATA_IN: 'data-in',
};

class ReturnNodeModel extends BasicNodeModel {
  /**
   * 定义节点的字段
   */
  getFields(): FieldType[] {
    const properties = this.properties as ReturnNodeProperties;
    const fields: FieldType[] = [
      {
        name: '流程',
        type: new FlowType(),
        inputId: ReturnNodeAnchorIds.FLOW_IN,
        outputId: null,
      },
    ];
    if (properties.type !== undefined) {
      fields.push({
        name: '返回值',
        type: parseType(properties.type),
        inputId: ReturnNodeAnchorIds.DATA_IN,
        outputId: null,
      });
    }
    return fields;
  }

  /**
   * 解析节点的输入流
   */
  parseFlowIn(anchorId: string): Statement[] {
    const flowInId = anchorId.split(':')[1];
    if (flowInId !== ReturnNodeAnchorIds.FLOW_IN)
      throw new Error(
        `ReturnNodeModel parseFlowIn anchorId must be ${ReturnNodeAnchorIds.FLOW_IN}, but got ${anchorId}`,
      );

    const properties = this.properties as ReturnNodeProperties;

    // 生成输入表达式
    if (properties.type === undefined) return [new ReturnStatement(undefined)];
    let expression = this.getDataInExpression(`${this.id}:${ReturnNodeAnchorIds.DATA_IN}`);
    if (!expression) {
      const defaultValue = properties.defaultValues[ReturnNodeAnchorIds.DATA_IN];
      expression = this.parseTypeStringToDefaultExpression(properties.type, defaultValue);
    }
    if (!expression)
      throw new Error(
        `ReturnNodeModel parseTypeStringToDefaultExpression type ${properties.type} not supported`,
      );

    // 生成语句
    const statements = [new ReturnStatement(expression)];
    return statements;
  }

  /**
   * 解析节点的输出流
   */
  parseDataOut(): Expression {
    throw new Error('SetVariableNodeModel parseDataOut not implemented');
  }
}

export function returnNodeGenerateAnchorRecommendation(): LogicFlow.OnDragNodeConfig[] {
  return [];
}

export default ReturnNodeModel;
