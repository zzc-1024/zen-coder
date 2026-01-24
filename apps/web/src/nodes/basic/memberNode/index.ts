import { BasicType, ListType } from '@/parser/variable';
import { type BasicEditorNodeConfig } from '../basicEditorConfig';
import CallNodeView from './MemberNodeView.vue';
import MemberNodeModel, {
  memberNodeGenerateAnchorRecommendation,
  MemberNodeType,
  type MemberNodeProperties,
} from './memberNodeModel';

const iconPath = 'nodeIcon/Member.png';
export const memberNodeConfig: BasicEditorNodeConfig = {
  type: MemberNodeType,
  component: CallNodeView,
  model: MemberNodeModel,
  name: '调用函数',
  banter: '梦开始的地方',
  description: '调用指定函数。',
  generateSuggestedNodes: memberNodeGenerateAnchorRecommendation,
  iconPath: iconPath,
  demoDndData: {
    type: MemberNodeType,
    label: '调用函数',
    icon: iconPath,
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
