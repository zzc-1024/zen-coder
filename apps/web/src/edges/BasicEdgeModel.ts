import LogicFlow, { BezierEdgeModel } from '@logicflow/core';

class BasicEdgeModel extends BezierEdgeModel {
  initEdgeData(data: LogicFlow.EdgeConfig): void {
    super.initEdgeData(data);
    this.text.draggable = false;
    this.text.editable = false;
  }
  // 重写此方法，使保存数据是能带上锚点数据。
  getData() {
    const data = super.getData();
    data.sourceAnchorId = this.sourceAnchorId;
    data.targetAnchorId = this.targetAnchorId;
    return data;
  }
}

export default BasicEdgeModel;
