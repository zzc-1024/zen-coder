// src/components/LF/BaseNode/model.ts
import { type Model } from '@logicflow/core';
import BasicNodeModel from '../basicNodeModel';
import { parseType } from '../typeDifination';

export type GetNodeProperties = {
  title: string;
  type: string;
};

class GetNodeModel extends BasicNodeModel {
  /**
   * 设置节点的基础属性
   * LogicFlow 会在初始化和属性更新时调用此方法
   */
  setAttributes() {
    super.setAttributes();
    this.setNodeHeightByRowCount(2);
  }

  /**
   * 进阶：自定义锚点
   * 让每个字段的左右两侧都能连线
   */
  getDefaultAnchor() {
    const anchors: Model.AnchorConfig[] = [];

    const properties = this.properties as GetNodeProperties;
    anchors.push(this.generateAnchorConfig(0, 'in', 'builtin:basic:flow', 'flow-in'));
    anchors.push(this.generateAnchorConfig(0, 'out', 'builtin:basic:flow', 'flow-out'));
    anchors.push(this.generateAnchorConfig(1, 'in', parseType(properties.type), 'data-in'));

    return anchors;
  }
}

export default GetNodeModel;
