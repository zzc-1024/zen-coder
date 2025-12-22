import type LogicFlow from '@logicflow/core';
import { register, type VueNodeConfig } from '@logicflow/vue-node-registry';

export function batchRegisterVueNode(lf: LogicFlow, nodes: VueNodeConfig[]) {
  nodes.forEach((node) => {
    register(node, lf);
  });
}
