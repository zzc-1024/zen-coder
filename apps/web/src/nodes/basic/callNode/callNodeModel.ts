import type LogicFlow from '@logicflow/core';
import BasicNodeModel, {
  type BasicNodePropertiesWithDefaultValues,
  type FieldType,
} from '../basicNodeModel';
import { BasicEditorNodeTypePrefix, FlowType } from '../typeDifination';
import type { Expression, Statement } from '@/parser/defination';
import { CallStatement } from '@/parser/statements';
import { CallExpression } from '@/parser/expressions';
import { parseType } from '@/parser/variable';

export const CallNodeType = `${BasicEditorNodeTypePrefix}:call`;
export type CallNodeProperties = BasicNodePropertiesWithDefaultValues & {
  source: string;
  module: string;
  functionName: string;
  parameters: { type: string; name: string }[];
  returnType: string | undefined;
  isPureFunction: boolean;
};

export const CallNodeAnchorIds = {
  FLOW_IN: 'flow-in',
  FLOW_OUT: 'flow-out',
  DATA_OUT: 'data-out',
  DATA_IN: 'data-in',
};

class CallNodeModel extends BasicNodeModel {
  /**
   * 定义节点的字段
   */
  getFields(): FieldType[] {
    const properties = this.properties as CallNodeProperties;
    const fields: FieldType[] = [];
    if (!properties.isPureFunction) {
      fields.push({
        name: '流程',
        type: new FlowType(),
        inputId: CallNodeAnchorIds.FLOW_IN,
        outputId: CallNodeAnchorIds.FLOW_OUT,
      });
    }
    if (properties.returnType !== undefined) {
      fields.push({
        name: '返回值',
        type: parseType(properties.returnType),
        inputId: null,
        outputId: CallNodeAnchorIds.DATA_OUT,
      });
    }
    for (const parameter of properties.parameters) {
      fields.push({
        name: parameter.name,
        type: parseType(parameter.type),
        inputId: `${CallNodeAnchorIds.DATA_IN}/${parameter.name}`,
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
    if (flowInId !== CallNodeAnchorIds.FLOW_IN)
      throw new Error(
        `CallNodeModel parseFlowIn anchorId must be ${CallNodeAnchorIds.FLOW_IN}, but got ${anchorId}`,
      );

    const properties = this.properties as CallNodeProperties;

    // 生成输入表达式
    const parameters: Expression[] = [];
    for (const parameter of properties.parameters) {
      let expression = this.getDataInExpression(
        `${this.id}:${CallNodeAnchorIds.DATA_IN}/${parameter.name}`,
      );
      if (!expression) {
        const defaultValue = properties.defaultValues[CallNodeAnchorIds.DATA_IN];
        expression = this.parseTypeStringToDefaultExpression(parameter.type, defaultValue);
      }
      if (!expression)
        throw new Error(`CallNodeModel parseFlowIn parameter ${parameter.name} must be connected`);
      parameters.push(expression);
    }

    // 生成语句
    const statements = [
      new CallStatement(
        new CallExpression(
          properties.source,
          properties.module,
          properties.functionName,
          parameters,
        ),
      ),
    ];
    return statements;
  }

  /**
   * 解析节点的输出流
   */
  parseDataOut(anchorId: string): Expression {
    const dataOutId = anchorId.split(':')[1];
    if (dataOutId !== CallNodeAnchorIds.DATA_OUT) {
      throw new Error(`CallNodeModel parseDataOut anchorId ${anchorId} not supported`);
    }
    const properties = this.properties as CallNodeProperties;
    // 生成输入表达式
    const parameters: Expression[] = [];
    for (const parameter of properties.parameters) {
      let expression = this.getDataInExpression(
        `${this.id}:${CallNodeAnchorIds.DATA_IN}/${parameter.name}`,
      );
      if (!expression) {
        const defaultValue = properties.defaultValues[CallNodeAnchorIds.DATA_IN];
        expression = this.parseTypeStringToDefaultExpression(parameter.type, defaultValue);
      }
      if (!expression)
        throw new Error(`CallNodeModel parseFlowIn parameter ${parameter.name} must be connected`);
      parameters.push(expression);
    }

    // 生成返回值表达式
    return new CallExpression(
      properties.source,
      properties.module,
      properties.functionName,
      parameters,
    );
  }
}

export function callNodeGenerateAnchorRecommendation(): LogicFlow.OnDragNodeConfig[] {
  return [];
}

export default CallNodeModel;
