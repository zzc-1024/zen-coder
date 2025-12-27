import BasicNodeModel, { type BasicNodeProperties, type FieldType } from '../basicNodeModel';
import { parseType } from '../typeDifination';

export type GetNodeProperties = BasicNodeProperties & {
  type: string;
};

class GetNodeModel extends BasicNodeModel {
  getFields(): FieldType[] {
    return [
      {
        name: '获取',
        type: parseType(this.properties.type as string),
        inputId: 'data-in',
        outputId: 'data-out',
      },
    ];
  }

  static generateAnchorRecommendation(): unknown[] {
    return [];
  }
}

export default GetNodeModel;
