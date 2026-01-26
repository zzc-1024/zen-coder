
import { MEMBER_NODE_ICON_PATH } from '@/nodes/basic/memberNode';
import {
  MemberNodeType,
  type MemberNodeProperties,
} from '@/nodes/basic/memberNode/memberNodeModel';
import type { AnchorType, DirectType, RecommendationFunction } from '@/nodes/basic/typeDifination';
import { BasicType, ListType } from '@/parser/variable';
import type LogicFlow from '@logicflow/core';

function listTypeGenerateAnchorRecommendation(
  anchorType: AnchorType,
  direction: DirectType,
): LogicFlow.OnDragNodeConfig[] {
  if (!(anchorType instanceof ListType)) {
    return [];
  }
  if (direction !== 'out') {
    return [];
  }

  return [
    {
      type: MemberNodeType,
      label: 'push',
      icon: MEMBER_NODE_ICON_PATH,
      properties: {
        memberName: 'push',
        type: anchorType.toString(),
        parameters: [{ type: anchorType.itemType.toString(), name: 'element' }],
        returnType: undefined,
        isPureMethod: false,
        defaultValues: {},
      } satisfies MemberNodeProperties,
    },
    {
      type: MemberNodeType,
      label: 'length',
      icon: MEMBER_NODE_ICON_PATH,
      properties: {
        memberName: 'length',
        type: anchorType.toString(),
        parameters: [],
        returnType: new BasicType('builtin:basic:integer').toString(),
        isPureMethod: undefined,
        defaultValues: {},
      } satisfies MemberNodeProperties,
    },
  ];
}

export function getRecommendationsByType(): RecommendationFunction {
  const recommendationFunctions: RecommendationFunction[] = [];

  // 列表相关
  recommendationFunctions.push(listTypeGenerateAnchorRecommendation);

  return (type, direction) => {
    return recommendationFunctions.flatMap((fn) => fn(type, direction));
  };
}
