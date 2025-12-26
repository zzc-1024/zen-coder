// src/components/LF/BaseNode/model.ts
import { type Model } from '@logicflow/core';
import BasicNodeModel, { type BasicNodeProperties } from '../basicNodeModel';
import { parseType } from '../typeDifination';

export type SetNodeProperties = BasicNodeProperties & {
  type: string;
};

class SetNodeModel extends BasicNodeModel {
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
    // 先定义需要的数据
    const anchors: Model.AnchorConfig[] = [];
    const properties = this.properties as SetNodeProperties;

    // 进入当前节点的流程锚点
    const flowInAnchor = this.generateAnchorConfig(0, 'in', 'builtin:basic:flow', 'flow-in');
    if (flowInAnchor) anchors.push(flowInAnchor);
    // 退出当前节点的流程锚点
    const flowOutAnchor = this.generateAnchorConfig(0, 'out', 'builtin:basic:flow', 'flow-out');
    if (flowOutAnchor) anchors.push(flowOutAnchor);
    // 数据进入当前节点的锚点
    const dataInAnchor = this.generateAnchorConfig(1, 'in', parseType(properties.type), 'data-in');
    if (dataInAnchor) anchors.push(dataInAnchor);

    return anchors;
  }

  static generateAnchorRecommendation(): unknown[] | null {
    return [];
  }
}

export default SetNodeModel;
