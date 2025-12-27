import LogicFlow, { HtmlNodeModel, type BaseNodeModel, type Model } from '@logicflow/core';
import { BUILTIN_BASIC_FLOW_TYPE, type AnchorType, type DirectType } from './typeDifination';

export type AnchorSide = 'left' | 'right' | 'both' | 'none';

export type BasicNodeProperties = {
  title: string;
  showAnchorSide?: AnchorSide;
};

export type FieldType = {
  name: string;
  type: AnchorType;
  inputId: string | null;
  outputId: string | null;
};

abstract class BasicNodeModel extends HtmlNodeModel {
  initNodeData(data: LogicFlow.NodeConfig<LogicFlow.PropertiesType>) {
    super.initNodeData(data);
    this.text.draggable = false; // 不允许文本被拖动
    this.text.editable = false; // 不允许文本被编辑
  }

  setNodeHeightByRowCount(rowCount: number) {
    // 1. 定义与 CSS 一致的尺寸常量
    const headerHeight = 34; // 标题栏高度
    const rowHeight = 32; // 单个字段行高

    // 2. 根据字段数量动态计算高度
    this.height = headerHeight + rowCount * rowHeight;
  }

  /**
   * 设置节点的基础属性
   * LogicFlow 会在初始化和属性更新时调用此方法
   */
  setAttributes() {
    this.setNodeHeightByRowCount(this.getFields().length);
    const width = 220;
    this.width = width;

    // 类型校验规则
    this.sourceRules.push({
      message: '只能同类型连接',
      validate: (
        sourceNode?: BaseNodeModel,
        targetNode?: BaseNodeModel,
        sourceAnchor?: Model.AnchorConfig,
        targetAnchor?: Model.AnchorConfig,
      ) => {
        // 不能自己指向自己
        if (sourceNode?.id === targetNode?.id) {
          return false;
        }
        // 先验证 type 字段
        if (sourceAnchor?.type?.toString() !== targetAnchor?.type?.toString()) {
          return false;
        }
        // 只能从左侧连接到右侧
        if (sourceAnchor?.direction !== 'out' && targetAnchor?.direction !== 'in') {
          return false;
        }
        // 其他类型直接比较是否相同
        return sourceAnchor?.type?.toString() === targetAnchor?.type?.toString();
      },
    });
    // 配置锚点数量规则
    this.sourceRules.push({
      message: 'flow类型anchor只能连出一条边',
      validate: (
        _sourceNode?: BaseNodeModel,
        _targetNode?: BaseNodeModel,
        sourceAnchor?: Model.AnchorConfig,
      ) => {
        const outgoingEdges = this.graphModel.getAnchorOutgoingEdge(sourceAnchor?.id as string);
        if (sourceAnchor?.type?.toString() === BUILTIN_BASIC_FLOW_TYPE && outgoingEdges.length > 0)
          return false;
        return true;
      },
    });
    this.targetRules.push({
      message: '任何anchor只能连入一条边',
      validate: (
        _sourceNode?: BaseNodeModel,
        _targetNode?: BaseNodeModel,
        _sourceAnchor?: Model.AnchorConfig,
        targetAnchor?: Model.AnchorConfig,
      ) => {
        const incomingEdges = this.graphModel.getAnchorIncomingEdge(targetAnchor?.id as string);
        if (incomingEdges.length > 0) return false;
        return true;
      },
    });
  }

  abstract getFields(): FieldType[];

  generateAnchorConfig(
    index: number,
    direction: DirectType,
    type: AnchorType,
    anchorId: string,
  ): Model.AnchorConfig | undefined {
    // 先判断该锚点是否有必要展示
    const properties = this.properties as BasicNodeProperties;
    const showAnchorSide: AnchorSide = properties.showAnchorSide || 'right'; // 默认展示右侧锚点
    if (showAnchorSide === 'none') return undefined;
    if (showAnchorSide === 'left' && direction === 'out') return undefined;
    if (showAnchorSide === 'right' && direction === 'in') return undefined;

    // 判断该锚点是否合法
    if (index < 0) throw new Error('index must be non-negative');
    if (index >= this.rowCount) throw new Error('index out of range');

    // 验证通过后再开始正常的逻辑
    const { height, y } = this;
    const headerHeight = 34;
    const rowHeight = 32;
    const rowY = y - height / 2 + headerHeight + index * rowHeight + rowHeight / 2;

    let rowX;
    if (direction === 'in') {
      rowX = this.x - this.width / 2;
    } else if (direction === 'out') {
      rowX = this.x + this.width / 2;
    } else {
      throw new Error('direction must be in or out');
    }

    return {
      x: rowX,
      y: rowY,
      id: `${this.id}/${anchorId}`,
      direction,
      type,
    };
  }

  getDefaultAnchor() {
    const fields = this.getFields();
    const anchors: Model.AnchorConfig[] = [];
    fields.forEach((field, index) => {
      if (field.inputId) {
        const inAnchor = this.generateAnchorConfig(index, 'in', field.type, field.inputId);
        if (inAnchor) anchors.push(inAnchor);
      }
      if (field.outputId) {
        const outAnchor = this.generateAnchorConfig(index, 'out', field.type, field.outputId);
        if (outAnchor) anchors.push(outAnchor);
      }
    });
    return anchors;
  }
}

export default BasicNodeModel;
