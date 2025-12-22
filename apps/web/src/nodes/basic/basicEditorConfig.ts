import { type VueNodeConfig } from '@logicflow/vue-node-registry';
import SetNodeModel from '@/nodes/basic/setNode/setNodeModel';
import SetNodeView from '@/nodes/basic/setNode/SetNodeView.vue';

export const basicEditorNode: VueNodeConfig[] = [
  {
    type: 'builtin:basic:set',
    component: SetNodeView,
    model: SetNodeModel,
  },
];
