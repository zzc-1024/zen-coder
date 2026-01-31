import { MEMBER_NODE_ICON_PATH } from '@/nodes/basic/memberNode';
import {
  MemberNodeType,
  type MemberNodeProperties,
} from '@/nodes/basic/memberNode/memberNodeModel';
import type { AnchorType, DirectType, RecommendationFunction } from '@/nodes/basic/typeDifination';
import { BasicType, DictType, ListType, SetType } from '@/parser/variable';
import type LogicFlow from '@logicflow/core';

function stringTypeGenerateAnchorRecommendation(
  anchorType: AnchorType,
  direction: DirectType,
): LogicFlow.OnDragNodeConfig[] {
  if (!(anchorType instanceof BasicType) || anchorType.basicTypeName !== 'builtin:basic:string') {
    return [];
  }
  if (direction !== 'out') {
    return [];
  }

  return [
    {
      type: MemberNodeType,
      label: 'replaceAll',
      icon: MEMBER_NODE_ICON_PATH,
      properties: {
        memberName: 'replaceAll',
        type: anchorType.toString(),
        parameters: [
          { type: new BasicType('builtin:basic:string').toString(), name: 'old' },
          { type: new BasicType('builtin:basic:string').toString(), name: 'new' },
        ],
        returnType: new BasicType('builtin:basic:string').toString(),
        isPureMethod: true,
        defaultValues: {},
      } satisfies MemberNodeProperties,
    },
    {
      type: MemberNodeType,
      label: 'substring',
      icon: MEMBER_NODE_ICON_PATH,
      properties: {
        memberName: 'substring',
        type: anchorType.toString(),
        parameters: [
          { type: new BasicType('builtin:basic:integer').toString(), name: 'start' },
          { type: new BasicType('builtin:basic:integer').toString(), name: 'end' },
        ],
        returnType: new BasicType('builtin:basic:string').toString(),
        isPureMethod: true,
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
        isPureMethod: true,
        defaultValues: {},
      } satisfies MemberNodeProperties,
    },
  ];
}

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
      label: 'pop',
      icon: MEMBER_NODE_ICON_PATH,
      properties: {
        memberName: 'pop',
        type: anchorType.toString(),
        parameters: [],
        returnType: anchorType.itemType.toString(),
        isPureMethod: false,
        defaultValues: {},
      } satisfies MemberNodeProperties,
    },
    {
      type: MemberNodeType,
      label: 'delete',
      icon: MEMBER_NODE_ICON_PATH,
      properties: {
        memberName: 'delete',
        type: anchorType.toString(),
        parameters: [{ type: new BasicType('builtin:basic:integer').toString(), name: 'index' }],
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
        isPureMethod: true,
        defaultValues: {},
      } satisfies MemberNodeProperties,
    },
  ];
}

function setTypeGenerateAnchorRecommendation(
  anchorType: AnchorType,
  direction: DirectType,
): LogicFlow.OnDragNodeConfig[] {
  if (!(anchorType instanceof SetType)) {
    return [];
  }
  if (direction !== 'out') {
    return [];
  }

  return [
    {
      type: MemberNodeType,
      label: 'add',
      icon: MEMBER_NODE_ICON_PATH,
      properties: {
        memberName: 'add',
        type: anchorType.toString(),
        parameters: [{ type: anchorType.itemType.toString(), name: 'element' }],
        returnType: undefined,
        isPureMethod: false,
        defaultValues: {},
      } satisfies MemberNodeProperties,
    },
    {
      type: MemberNodeType,
      label: 'discard',
      icon: MEMBER_NODE_ICON_PATH,
      properties: {
        memberName: 'discard',
        type: anchorType.toString(),
        parameters: [{ type: anchorType.itemType.toString(), name: 'element' }],
        returnType: undefined,
        isPureMethod: false,
        defaultValues: {},
      } satisfies MemberNodeProperties,
    },
    {
      type: MemberNodeType,
      label: 'clear',
      icon: MEMBER_NODE_ICON_PATH,
      properties: {
        memberName: 'clear',
        type: anchorType.toString(),
        parameters: [],
        returnType: undefined,
        isPureMethod: false,
        defaultValues: {},
      } satisfies MemberNodeProperties,
    },
    {
      type: MemberNodeType,
      label: 'union',
      icon: MEMBER_NODE_ICON_PATH,
      properties: {
        memberName: 'union',
        type: anchorType.toString(),
        parameters: [{ type: anchorType.toString(), name: 'other' }],
        returnType: anchorType.toString(),
        isPureMethod: true,
        defaultValues: {},
      } satisfies MemberNodeProperties,
    },
    {
      type: MemberNodeType,
      label: 'union',
      icon: MEMBER_NODE_ICON_PATH,
      properties: {
        memberName: 'union',
        type: anchorType.toString(),
        parameters: [{ type: anchorType.itemType.toString(), name: 'other' }],
        returnType: anchorType.itemType.toString(),
        isPureMethod: true,
        defaultValues: {},
      } satisfies MemberNodeProperties,
    },
    {
      type: MemberNodeType,
      label: 'contains',
      icon: MEMBER_NODE_ICON_PATH,
      properties: {
        memberName: 'contains',
        type: anchorType.toString(),
        parameters: [{ type: anchorType.itemType.toString(), name: 'element' }],
        returnType: new BasicType('builtin:basic:boolean').toString(),
        isPureMethod: true,
        defaultValues: {},
      } satisfies MemberNodeProperties,
    },
    {
      type: MemberNodeType,
      label: 'size',
      icon: MEMBER_NODE_ICON_PATH,
      properties: {
        memberName: 'size',
        type: anchorType.toString(),
        parameters: [],
        returnType: new BasicType('builtin:basic:integer').toString(),
        isPureMethod: true,
        defaultValues: {},
      } satisfies MemberNodeProperties,
    },
  ];
}

function dictTypeGenerateAnchorRecommendation(
  anchorType: AnchorType,
  direction: DirectType,
): LogicFlow.OnDragNodeConfig[] {
  if (!(anchorType instanceof DictType)) {
    return [];
  }
  if (direction !== 'out') {
    return [];
  }

  return [
    {
      type: MemberNodeType,
      label: 'delete',
      icon: MEMBER_NODE_ICON_PATH,
      properties: {
        memberName: 'delete',
        type: anchorType.toString(),
        parameters: [{ type: anchorType.keyType.toString(), name: 'key' }],
        returnType: undefined,
        isPureMethod: false,
        defaultValues: {},
      } satisfies MemberNodeProperties,
    },
    {
      type: MemberNodeType,
      label: 'contains',
      icon: MEMBER_NODE_ICON_PATH,
      properties: {
        memberName: 'contains',
        type: anchorType.toString(),
        parameters: [{ type: anchorType.keyType.toString(), name: 'key' }],
        returnType: new BasicType('builtin:basic:boolean').toString(),
        isPureMethod: true,
        defaultValues: {},
      } satisfies MemberNodeProperties,
    },
    {
      type: MemberNodeType,
      label: 'size',
      icon: MEMBER_NODE_ICON_PATH,
      properties: {
        memberName: 'size',
        type: anchorType.toString(),
        parameters: [],
        returnType: new BasicType('builtin:basic:integer').toString(),
        isPureMethod: true,
        defaultValues: {},
      } satisfies MemberNodeProperties,
    },
  ];
}

export function getRecommendationsByType(): RecommendationFunction {
  const recommendationFunctions: RecommendationFunction[] = [];

  // 字符串相关
  recommendationFunctions.push(stringTypeGenerateAnchorRecommendation);
  // 列表相关
  recommendationFunctions.push(listTypeGenerateAnchorRecommendation);
  // 集合相关
  recommendationFunctions.push(setTypeGenerateAnchorRecommendation);
  // 字典相关
  recommendationFunctions.push(dictTypeGenerateAnchorRecommendation);

  return (type, direction) => {
    return recommendationFunctions.flatMap((fn) => fn(type, direction));
  };
}
