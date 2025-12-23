import { type VueNodeConfig } from '@logicflow/vue-node-registry';
import EntryNodeView from '@/nodes/basic/entryNode/EntryNodeView.vue';
import EntryNodeModel from '@/nodes/basic/entryNode/entryNodeModel';
import SetNodeModel from '@/nodes/basic/setNode/setNodeModel';
import SetNodeView from '@/nodes/basic/setNode/SetNodeView.vue';
import GetNodeView from '@/nodes/basic/getNode/GetNodeView.vue';
import GetNodeModel from '@/nodes/basic/getNode/getNodeModel';
import type LogicFlow from '@logicflow/core';
import { EventType } from '@logicflow/core';
import { BUILTIN_BASIC_FLOW_TYPE } from './typeDifination';

// 节点配置区域
export const BasicEditorNodeTypePrefix = 'builtin:basic';
export const EntryNodeType = `${BasicEditorNodeTypePrefix}:entry`;
export const SetVariableNodeType = `${BasicEditorNodeTypePrefix}:set`;
export const GetVariableNodeType = `${BasicEditorNodeTypePrefix}:get`;

export const basicEditorNode: VueNodeConfig[] = [
  {
    type: EntryNodeType,
    component: EntryNodeView,
    model: EntryNodeModel,
  },
  {
    type: SetVariableNodeType,
    component: SetNodeView,
    model: SetNodeModel,
  },
  {
    type: GetVariableNodeType,
    component: GetNodeView,
    model: GetNodeModel,
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
}
