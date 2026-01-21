import type LogicFlow from '@logicflow/core';
import BasicNodeModel, {
  type BasicNodePropertiesWithDefaultValues,
  type FieldType,
} from '../basicNodeModel';
import { BasicEditorNodeTypePrefix, FlowType } from '../typeDifination';
import type { Expression, Statement } from '@/parser/defination';
import { AssignmentStatement } from '@/parser/statements';
import { IndexExpression, VariableExpression } from '@/parser/expressions';
import { parseType, type BasicTypeName, type VariableScopeType } from '@/parser/variable';

export const SetVariableNodeType = `${BasicEditorNodeTypePrefix}:set`;
export type SetVariableNodeProperties = BasicNodePropertiesWithDefaultValues & {
  variableScopeType: VariableScopeType;
  type: string;
  variable: string;
  indexs: BasicTypeName[];
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
    const properties = this.properties as SetVariableNodeProperties;

    const fields: FieldType[] = [
      {
        name: '流程',
        type: new FlowType(),
        inputId: SetVariableNodeAnchorIds.FLOW_IN,
        outputId: SetVariableNodeAnchorIds.FLOW_OUT,
      },
    ];

    for (const [i, index] of properties.indexs.entries()) {
      fields.push({
        name: `${i}号索引`,
        type: parseType(index),
        inputId: `${SetVariableNodeAnchorIds.DATA_IN}:${i}`,
        outputId: null,
      });
    }

    fields.push({
      name: '赋值',
      type: parseType(properties.type),
      inputId: SetVariableNodeAnchorIds.DATA_IN,
      outputId: null,
    });

    return fields;
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
      expression = this.parseTypeStringToDefaultExpression(properties.type, defaultValue);
    }
    if (!expression)
      throw new Error(
        `SetVariableNodeModel parseTypeStringToDefaultExpression type ${properties.type} not supported`,
      );

    // 生成索引表达式
    for (const [i, index] of properties.indexs.entries()) {
      let indexExpression = this.getDataInExpression(
        `${this.id}:${SetVariableNodeAnchorIds.DATA_IN}:${i}`,
      );
      if (!indexExpression) {
        const defaultValue = properties.defaultValues[`${SetVariableNodeAnchorIds.DATA_IN}:${i}`];
        indexExpression = this.parseTypeStringToDefaultExpression(index, defaultValue);
      }
      if (!indexExpression)
        throw new Error(
          `SetVariableNodeModel parseTypeStringToDefaultExpression index ${i} type ${index} not supported`,
        );
      expression = new IndexExpression(expression, indexExpression);
    }

    // 生成语句
    const statements = [
      new AssignmentStatement(
        properties.variableScopeType,
        new VariableExpression(properties.variableScopeType, properties.variable),
        expression,
      ),
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
