import { BasicType, ListType } from '@/parser/variable';
import CallNodeView from './MemberNodeView.vue';
import MemberNodeModel, {
  memberNodeGenerateAnchorRecommendation,
  MemberNodeType,
  type MemberNodeProperties,
} from './memberNodeModel';
import type { BasicEditorNodeConfig } from '../typeDifination';

export const MEMBER_NODE_ICON_PATH = 'nodeIcon/Member.png';
export const memberNodeConfig: BasicEditorNodeConfig = {
  type: MemberNodeType,
  component: CallNodeView,
  model: MemberNodeModel,
  name: '调用成员',
  banter: '你也是梦开始的地方？',
  description: '调用指定成员，包括成员函数和成员变量',
  generateSuggestedNodes: memberNodeGenerateAnchorRecommendation,
  iconPath: MEMBER_NODE_ICON_PATH,
  demoDndData: {
    type: MemberNodeType,
    label: '调用成员',
    icon: MEMBER_NODE_ICON_PATH,
    properties: {
      memberName: 'push',
      type: new ListType(new BasicType('builtin:basic:integer')).toString(),
      parameters: [{ type: 'builtin:basic:integer', name: 'element' }],
      returnType: new BasicType('builtin:basic:integer').toString(),
      isPureMethod: false,
      defaultValues: {},
    } satisfies MemberNodeProperties,
  },
};
