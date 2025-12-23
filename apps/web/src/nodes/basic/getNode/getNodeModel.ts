// src/components/LF/BaseNode/model.ts
import { type Model } from '@logicflow/core';
import BasicNodeModel from '../basicNodeModel';
import { parseType } from '../typeDifination';

export type SetNodeProperties = {
  title: string;
  type: string;
};

class SetNodeModel extends BasicNodeModel {
  /**
   * 设置节点的基础属性
   * LogicFlow 会在初始化和属性更新时调用此方法
   */
  setAttributes() {
    super.setAttributes();
    this.setNodeHeightByRowCount(1);
  }

  /**
   * 进阶：自定义锚点
   * 让每个字段的左右两侧都能连线
   */
  getDefaultAnchor() {
    const anchors: Model.AnchorConfig[] = [];

    const properties = this.properties as SetNodeProperties;
    anchors.push(this.generateAnchorConfig(0, 'out', parseType(properties.type), 'data-out'));

    return anchors;
  }
}

export default SetNodeModel;
