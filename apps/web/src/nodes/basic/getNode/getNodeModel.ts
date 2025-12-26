// src/components/LF/BaseNode/model.ts
import { type Model } from '@logicflow/core';
import BasicNodeModel, { type BasicNodeProperties } from '../basicNodeModel';
import { parseType } from '../typeDifination';

export type GetNodeProperties = BasicNodeProperties & {
  type: string;
};

class GetNodeModel extends BasicNodeModel {
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
    // 先定义需要的数据
    const anchors: Model.AnchorConfig[] = [];
    const properties = this.properties as GetNodeProperties;

    // 数据退出当前节点的锚点
    const dataOutAnchor = this.generateAnchorConfig(
      0,
      'out',
      parseType(properties.type),
      'data-out',
    );
    if (dataOutAnchor) anchors.push(dataOutAnchor);

    return anchors;
  }

  static generateAnchorRecommendation(): unknown[] {
    return [];
  }
}

export default GetNodeModel;
