// src/components/LF/BaseNode/model.ts
import { type Model } from '@logicflow/core';
import BasicNodeModel, { type BasicNodeProperties } from '../basicNodeModel';

export type EntryNodeProperties = BasicNodeProperties;

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
    // 先定义需要的数据
    const anchors: Model.AnchorConfig[] = [];

    // 一切流程开始的地方
    const flowOutAnchor = this.generateAnchorConfig(0, 'out', 'builtin:basic:flow', 'flow-out');
    if (flowOutAnchor) anchors.push(flowOutAnchor);

    return anchors;
  }

  static generateAnchorRecommendation(): unknown[] {
    return [];
  }
}

export default EntryNodeModel;
