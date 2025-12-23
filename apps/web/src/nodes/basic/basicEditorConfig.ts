import { type VueNodeConfig } from '@logicflow/vue-node-registry';
import EntryNodeView from '@/nodes/basic/entryNode/EntryNodeView.vue';
import EntryNodeModel from '@/nodes/basic/entryNode/entryNodeModel';
import SetNodeModel from '@/nodes/basic/setNode/setNodeModel';
import SetNodeView from '@/nodes/basic/setNode/SetNodeView.vue';
import GetNodeView from '@/nodes/basic/getNode/GetNodeView.vue';
import GetNodeModel from '@/nodes/basic/getNode/getNodeModel';

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
    type: 'builtin:basic:entry',
    label: '程序入口',
    icon: 'favicon.ico',
    properties: {
      title: '程序入口',
    },
  },
];
