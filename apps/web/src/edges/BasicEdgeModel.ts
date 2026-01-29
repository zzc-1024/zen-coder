import type BasicNodeModel from '@/nodes/basic/basicNodeModel';
import { parseAnchorType } from '@/nodes/basic/typeDifination';
import { getColorByType } from '@/utils/theme';
import LogicFlow, { BezierEdgeModel } from '@logicflow/core';

class BasicEdgeModel extends BezierEdgeModel {
  initEdgeData(data: LogicFlow.EdgeConfig): void {
    super.initEdgeData(data);
    this.text.draggable = false;
    this.text.editable = false;
    const sourceNode = this.sourceNode as BasicNodeModel;
    const fields = sourceNode.getFields();
    const sourceAnchorInnerId = this.sourceAnchorId?.split(':')[1];
    for (const field of fields) {
      if (field.outputId !== sourceAnchorInnerId) {
        continue;
      }
      this.properties.type = field.type.toString();
    }
  }
  // 重写此方法，使保存数据是能带上锚点数据。
  getData() {
    const data = super.getData();
    data.sourceAnchorId = this.sourceAnchorId;
    data.targetAnchorId = this.targetAnchorId;
    return data;
  }

  getEdgeStyle() {
    const style = super.getEdgeStyle();
    const type = parseAnchorType(this.properties.type);
    const color = getColorByType(type);
    style.stroke = color;
    return style;
  }
}

export default BasicEdgeModel;
