import { type VueNodeConfig } from '@logicflow/vue-node-registry';
import EntryNodeView from '@/nodes/basic/entryNode/EntryNodeView.vue';
import EntryNodeModel from '@/nodes/basic/entryNode/entryNodeModel';
import SetNodeModel from '@/nodes/basic/setNode/setNodeModel';
import SetNodeView from '@/nodes/basic/setNode/SetNodeView.vue';

export const basicEditorNode: VueNodeConfig[] = [
  {
    type: 'builtin:basic:entry',
    component: EntryNodeView,
    model: EntryNodeModel,
  },
  {
    type: 'builtin:basic:set',
    component: SetNodeView,
    model: SetNodeModel,
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
