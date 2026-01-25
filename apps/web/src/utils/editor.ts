import { getRecommendationsByType } from '@/members';
import type { BasicEditorNodeConfig, RecommendationFunction } from '@/nodes/basic/typeDifination';
import type LogicFlow from '@logicflow/core';
import { register } from '@logicflow/vue-node-registry';

export function batchRegisterVueNode(
  lf: LogicFlow,
  nodes: BasicEditorNodeConfig[],
): RecommendationFunction {
  // 推荐函数
  const recommendationFunctions: RecommendationFunction[] = [];

  // 逐个注册节点并添加推荐函数
  nodes.forEach((node) => {
    register(node, lf);
    recommendationFunctions.push(node.generateSuggestedNodes);
  });

  // 添加根据类型推荐的函数
  recommendationFunctions.push(getRecommendationsByType());

  // 返回合并后的推荐函数
  return (type, direction) => {
    return recommendationFunctions.flatMap((fn) => fn(type, direction));
  };
}
