// src/components/LF/BaseNode/model.ts
import { type Model } from '@logicflow/core';
import BasicNodeModel from '../basicNodeModel';

export type EntryNodeProperties = {
  title: string;
};

class EntryNodeModel extends BasicNodeModel {
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

    anchors.push(this.generateAnchorConfig(0, 'out', 'builtin:basic:flow', 'flow-out'));

    return anchors;
  }
}

export default EntryNodeModel;
