import BasicNodeModel, { type BasicNodeProperties, type FieldType } from '../basicNodeModel';
import { FlowType } from '../typeDifination';

export type EntryNodeProperties = BasicNodeProperties;

class EntryNodeModel extends BasicNodeModel {
  getFields(): FieldType[] {
    return [{ name: '流程', type: new FlowType(), inputId: null, outputId: 'flow-out' }];
  }

  static generateAnchorRecommendation(): unknown[] {
    return [];
  }
}

export default EntryNodeModel;
