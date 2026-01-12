import type LogicFlow from '@logicflow/core';
import BasicNodeModel, { type BasicNodeProperties, type FieldType } from '../basicNodeModel';
import { BasicEditorNodeTypePrefix } from '../typeDifination';
import type { Expression, Statement } from '@/parser/defination';
import { VariableExpression } from '@/parser/expressions';
import { parseType, type VariableScopeType } from '@/parser/variable';

export const GetVariableNodeType = `${BasicEditorNodeTypePrefix}:get`;
export type GetVariableNodeProperties = BasicNodeProperties & {
  variableScopeType: VariableScopeType;
  type: string;
  variable: string;
};

const GetVariableNodeAnchorIds = {
  DATA_OUT: 'data-out',
};

class GetVariableNodeModel extends BasicNodeModel {
  getFields(): FieldType[] {
    return [
      {
        name: '获取',
        type: parseType(this.properties.type as string),
        inputId: null,
        outputId: GetVariableNodeAnchorIds.DATA_OUT,
      },
    ];
  }

  parseFlowIn(anchorId: string): Statement[] {
    throw new Error(`GetVariableNodeModel parseFlowIn anchorId ${anchorId} not supported`);
  }
  parseDataOut(anchorId: string): Expression {
    const dataOutId = anchorId.split(':')[1];
    if (dataOutId !== GetVariableNodeAnchorIds.DATA_OUT)
      throw new Error(`GetVariableNodeModel parseDataOut anchorId ${anchorId} not supported`);
    return new VariableExpression(this.properties.variable as string);
  }
}

export function getVariableNodeGenerateAnchorRecommendation(): LogicFlow.OnDragNodeConfig[] {
  return [];
}

export default GetVariableNodeModel;
