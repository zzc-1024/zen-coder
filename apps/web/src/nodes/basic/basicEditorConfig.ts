import { type VueNodeConfig } from '@logicflow/vue-node-registry';

// 入口节点
import EntryNodeView from '@/nodes/basic/entryNode/EntryNodeView.vue';
import EntryNodeModel, {
  entryNodeGenerateAnchorRecommendation,
} from '@/nodes/basic/entryNode/entryNodeModel';
// 设置变量节点
import SetNodeView from '@/nodes/basic/setNode/SetNodeView.vue';
import SetNodeModel, {
  setNodeGenerateAnchorRecommendation,
} from '@/nodes/basic/setNode/setNodeModel';
// 获取变量节点
import GetNodeView from '@/nodes/basic/getNode/GetNodeView.vue';
import GetNodeModel, {
  getNodeGenerateAnchorRecommendation,
} from '@/nodes/basic/getNode/getNodeModel';
// 二元算术运算节点
import BinaryArithmeticNodeView from '@/nodes/basic/binaryArithmeticNode/binaryArithmeticNodeView.vue';
import BinaryArithmeticNodeModel, {
  binaryArithmeticNodeGenerateAnchorRecommendation,
} from './binaryArithmeticNode/binaryArithmeticNodeModel';

import type LogicFlow from '@logicflow/core';
import { EventType } from '@logicflow/core';
import { BUILTIN_BASIC_FLOW_TYPE, type AnchorType, type DirectType } from './typeDifination';
import { ToolBarConfig } from '@/components/toolBar/toolBar';
import router from '@/router';
import type { Variable } from '@/components/variableList/variableList';

// 节点配置区域
export const BasicEditorNodeTypePrefix = 'builtin:basic';
export const EntryNodeType = `${BasicEditorNodeTypePrefix}:entry`;
export const SetVariableNodeType = `${BasicEditorNodeTypePrefix}:set`;
export const GetVariableNodeType = `${BasicEditorNodeTypePrefix}:get`;
export const BinaryArithmeticNodeType = `${BasicEditorNodeTypePrefix}:binaryArithmetic`;

export type RecommendationFunction = (type: AnchorType, direction: DirectType) => unknown[];

export type BasicEditorNodeConfig = VueNodeConfig & {
  generateSuggestedNodes: RecommendationFunction;
};

export const basicEditorNode: BasicEditorNodeConfig[] = [
  {
    type: EntryNodeType,
    component: EntryNodeView,
    model: EntryNodeModel,
    generateSuggestedNodes: entryNodeGenerateAnchorRecommendation,
  },
  {
    type: SetVariableNodeType,
    component: SetNodeView,
    model: SetNodeModel,
    generateSuggestedNodes: setNodeGenerateAnchorRecommendation,
  },
  {
    type: GetVariableNodeType,
    component: GetNodeView,
    model: GetNodeModel,
    generateSuggestedNodes: getNodeGenerateAnchorRecommendation,
  },
  {
    type: BinaryArithmeticNodeType,
    component: BinaryArithmeticNodeView,
    model: BinaryArithmeticNodeModel,
    generateSuggestedNodes: binaryArithmeticNodeGenerateAnchorRecommendation,
  },
];

export const dndPanelItem: unknown[] = [
  {
    type: EntryNodeType,
    label: '程序入口',
    icon: 'favicon.ico',
    properties: {
      title: '程序入口',
    },
  },
];

// 事件配置区域
export function setBasicEditorEvent(lf: LogicFlow) {
  lf.on(EventType.ANCHOR_DRAGSTART, ({ data, nodeModel }) => {
    if (!lf) return;
    const outgoingEdges = lf.graphModel.getAnchorOutgoingEdge(data.id);
    lf.graphModel.nodes.forEach((node) => {
      // 所有节点显示左侧锚点
      node.setProperty('showAnchorSide', 'left');
      // 如果是当前节点，则不显示
      if (node.id === nodeModel.id) {
        node.setProperty('showAnchorSide', 'right');
        // 如果锚点是 flow 类型，只能有一个连边，临时让锚点不显示以取消拖拽
        if (outgoingEdges.length > 0 && data.type?.toString() === BUILTIN_BASIC_FLOW_TYPE) {
          node.setProperty('showAnchorSide', 'left');
        }
      }
    });
  });
  lf.on(EventType.ANCHOR_DRAGEND, () => {
    if (!lf) return;
    lf.graphModel.nodes.forEach((node) => {
      // 所有节点显示右侧锚点
      node.deleteProperty('showAnchorSide');
    });
  });
  // 手动聚焦
  lf.on(EventType.NODE_FOCUS, () => {
    if (!lf) return;
    lf.container.focus();
  });
  lf.on(EventType.EDGE_FOCUS, () => {
    if (!lf) return;
    lf.container.focus();
  });
}

// 工具栏配置
export class BasicToolBarConfig extends ToolBarConfig {
  constructor(
    public lf: LogicFlow,
    public variables: Variable[],
  ) {
    super();
  }

  onSave: undefined;
  onImport: undefined;
  onUndo: undefined;
  onRedo: undefined;
  onExecute: undefined;
  onGenerate: undefined;
  onLanguageChange: undefined;
  onGotoHome = () => {
    router.push('/');
  };
}
