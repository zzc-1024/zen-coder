import BasicNodeModel, { type BasicNodeProperties, type FieldType } from '../basicNodeModel';

export type EntryNodeProperties = BasicNodeProperties;

class EntryNodeModel extends BasicNodeModel {
  getFields(): FieldType[] {
    return [{ name: '流程', type: 'builtin:basic:flow', inputId: null, outputId: 'flow-out' }];
  }

  static generateAnchorRecommendation(): unknown[] {
    return [];
  }
}

export default EntryNodeModel;
