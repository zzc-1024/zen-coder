import BasicNodeModel, { type BasicNodeProperties, type FieldType } from '../basicNodeModel';
import { parseType } from '../typeDifination';

export type SetNodeProperties = BasicNodeProperties & {
  type: string;
};

class SetNodeModel extends BasicNodeModel {
  /**
   * 定义节点的字段
   */
  getFields(): FieldType[] {
    return [
      { name: '流程', type: 'builtin:basic:flow', inputId: 'flow-in', outputId: 'flow-out' },
      {
        name: '赋值',
        type: parseType(this.properties.type as string),
        inputId: 'data-in',
        outputId: null,
      },
    ];
  }

  static generateAnchorRecommendation(): unknown[] {
    return [];
  }
}

export default SetNodeModel;
