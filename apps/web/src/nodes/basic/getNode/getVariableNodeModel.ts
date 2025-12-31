import type LogicFlow from '@logicflow/core';
import BasicNodeModel, { type BasicNodeProperties, type FieldType } from '../basicNodeModel';
import { parseType } from '../typeDifination';

export type GetVariableNodeProperties = BasicNodeProperties & {
  type: string;
};

class GetVariableNodeModel extends BasicNodeModel {
  getFields(): FieldType[] {
    return [
      {
        name: '获取',
        type: parseType(this.properties.type as string),
        inputId: null,
        outputId: 'data-out',
      },
    ];
  }
}

export function getVariableNodeGenerateAnchorRecommendation(): LogicFlow.OnDragNodeConfig[] {
  return [];
}

export default GetVariableNodeModel;
