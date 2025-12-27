import type {
  BasicEditorNodeConfig,
  RecommendationFunction,
} from '@/nodes/basic/basicEditorConfig';
import type LogicFlow from '@logicflow/core';
import { register } from '@logicflow/vue-node-registry';

export function batchRegisterVueNode(
  lf: LogicFlow,
  nodes: BasicEditorNodeConfig[],
): RecommendationFunction {
  const recommendationFunctions: RecommendationFunction[] = [];
  nodes.forEach((node) => {
    register(node, lf);
    recommendationFunctions.push(node.generateSuggestedNodes);
  });
  return (type, direction) => {
    return recommendationFunctions.flatMap((fn) => fn(type, direction));
  };
}
