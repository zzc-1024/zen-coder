import type LogicFlow from '@logicflow/core';
import BasicNodeModel, {
  type BasicNodePropertiesWithDefaultValues,
  type FieldType,
} from '../basicNodeModel';
import { BasicEditorNodeTypePrefix, FlowType } from '../typeDifination';
import type { Expression, Statement } from '@/parser/defination';
import { MemberStatement } from '@/parser/statements';
import { MemberExpression } from '@/parser/expressions';
import { parseType, type ParameterProperty } from '@/parser/variable';

export const MemberNodeType = `${BasicEditorNodeTypePrefix}:member`;
export type MemberNodeProperties = BasicNodePropertiesWithDefaultValues & {
  type: string;
  memberName: string;
  parameters: ParameterProperty[];
  returnType: string | undefined;
  isPureMethod: boolean | undefined;
};

export const MemberNodeAnchorIds = {
  FLOW_IN: 'flow-in',
  FLOW_OUT: 'flow-out',
  DATA_OUT: 'data-out',
  DATA_IN: 'data-in',
};

class MemberNodeModel extends BasicNodeModel {
  /**
   * 定义节点的字段
   */
  getFields(): FieldType[] {
    const properties = this.properties as MemberNodeProperties;
    const fields: FieldType[] = [];
    if (properties.isPureMethod === false) {
      fields.push({
        name: '流程',
        type: new FlowType(),
        inputId: MemberNodeAnchorIds.FLOW_IN,
        outputId: MemberNodeAnchorIds.FLOW_OUT,
      });
    }
    fields.push({
      name: '调用者',
      type: parseType(properties.type),
      inputId: MemberNodeAnchorIds.DATA_IN,
      outputId: null,
    });
    if (properties.returnType !== undefined) {
      fields.push({
        name: '返回值',
        type: parseType(properties.returnType),
        inputId: null,
        outputId: MemberNodeAnchorIds.DATA_OUT,
      });
    }
    for (const parameter of properties.parameters) {
      fields.push({
        name: parameter.name,
        type: parseType(parameter.type),
        inputId: `${MemberNodeAnchorIds.DATA_IN}/${parameter.name}`,
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
    if (flowInId !== MemberNodeAnchorIds.FLOW_IN)
      throw new Error(
        `MemberNodeModel parseFlowIn anchorId must be ${MemberNodeAnchorIds.FLOW_IN}, but got ${anchorId}`,
      );

    const properties = this.properties as MemberNodeProperties;

    // 生成上一个节点的输出表达式
    const callerExpression = this.getDataInExpression(`${this.id}:${MemberNodeAnchorIds.DATA_IN}`);
    if (!callerExpression) throw new Error(`MemberNodeModel parseFlowIn caller must be connected`);

    // 生成输入表达式
    const parameters: Expression[] = [];
    for (const parameter of properties.parameters) {
      let expression = this.getDataInExpression(
        `${this.id}:${MemberNodeAnchorIds.DATA_IN}/${parameter.name}`,
      );
      if (!expression) {
        const defaultValue =
          properties.defaultValues[`${MemberNodeAnchorIds.DATA_IN}/${parameter.name}`];
        expression = this.parseTypeStringToDefaultExpression(parameter.type, defaultValue);
      }
      if (!expression)
        throw new Error(
          `MemberNodeModel parseFlowIn parameter ${parameter.name} must be connected`,
        );
      parameters.push(expression);
    }

    // 生成语句
    const statements = [
      new MemberStatement(
        new MemberExpression(
          callerExpression,
          parseType(properties.type),
          properties.memberName,
          properties.isPureMethod !== undefined ? parameters : undefined,
        ),
      ),
      ...this.getFlowOutStatement(`${this.id}:${MemberNodeAnchorIds.FLOW_OUT}`),
    ];
    return statements;
  }

  /**
   * 解析节点的输出流
   */
  parseDataOut(anchorId: string): Expression {
    const dataOutId = anchorId.split(':')[1];
    if (dataOutId !== MemberNodeAnchorIds.DATA_OUT) {
      throw new Error(`CallNodeModel parseDataOut anchorId ${anchorId} not supported`);
    }
    const properties = this.properties as MemberNodeProperties;

    // 生成上一个节点的输出表达式
    let callerExpression = this.getDataInExpression(`${this.id}:${MemberNodeAnchorIds.DATA_IN}`);
    if (!callerExpression) {
      const defaultValue = properties.defaultValues[MemberNodeAnchorIds.DATA_IN];
      callerExpression = this.parseTypeStringToDefaultExpression(properties.type, defaultValue);
    }
    if (!callerExpression) throw new Error(`MemberNodeModel parseDataOut caller must be connected`);

    // 生成输入表达式
    const parameters: Expression[] = [];
    for (const parameter of properties.parameters) {
      let expression = this.getDataInExpression(
        `${this.id}:${MemberNodeAnchorIds.DATA_IN}/${parameter.name}`,
      );
      if (!expression) {
        const defaultValue =
          properties.defaultValues[`${MemberNodeAnchorIds.DATA_IN}/${parameter.name}`];
        expression = this.parseTypeStringToDefaultExpression(parameter.type, defaultValue);
      }
      if (!expression)
        throw new Error(`CallNodeModel parseFlowIn parameter ${parameter.name} must be connected`);
      parameters.push(expression);
    }

    // 生成返回值表达式
    return new MemberExpression(
      callerExpression,
      parseType(properties.type),
      properties.memberName,
      properties.isPureMethod !== undefined ? parameters : undefined,
    );
  }
}

export function memberNodeGenerateAnchorRecommendation(): LogicFlow.OnDragNodeConfig[] {
  return [];
}

export default MemberNodeModel;
