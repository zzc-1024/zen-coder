import type BasicNodeModel from '@/nodes/basic/basicNodeModel';
import { BUILTIN_BASIC_FLOW_TYPE } from '@/nodes/basic/typeDifination';
import {
  BUILTIN_BASIC_BOOLEAN_TYPE,
  BUILTIN_BASIC_FLOAT_TYPE,
  BUILTIN_BASIC_INTEGER_TYPE,
  BUILTIN_BASIC_STRING_TYPE,
  ListType,
  parseType,
} from '@/parser/variable';
import { getThemeVar } from '@/utils/theme';
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
    const type = parseType(this.properties.type);
    if (type.toString() === BUILTIN_BASIC_FLOW_TYPE) {
      style.stroke = getThemeVar('--zencoder-edge-flow-color');
    } else if (type.toString() === BUILTIN_BASIC_BOOLEAN_TYPE) {
      style.stroke = getThemeVar('--zencoder-edge-boolean-color');
    } else if (type.toString() === BUILTIN_BASIC_INTEGER_TYPE) {
      style.stroke = getThemeVar('--zencoder-edge-integer-color');
    } else if (type.toString() === BUILTIN_BASIC_FLOAT_TYPE) {
      style.stroke = getThemeVar('--zencoder-edge-float-color');
    } else if (type.toString() === BUILTIN_BASIC_STRING_TYPE) {
      style.stroke = getThemeVar('--zencoder-edge-string-color');
    } else if (type instanceof ListType) {
      style.stroke = getThemeVar('--zencoder-edge-array-color');
    }
    return style;
  }
}

export default BasicEdgeModel;
