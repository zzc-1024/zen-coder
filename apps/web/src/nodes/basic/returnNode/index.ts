import { BasicType } from '@/parser/variable';
import ReturnNodeView from './ReturnNodeView.vue';
import ReturnNodeModel, {
  returnNodeGenerateAnchorRecommendation,
  ReturnNodeType,
  type ReturnNodeProperties,
} from './returnNodeModel';
import type { BasicEditorNodeConfig } from '../typeDifination';

const iconPath = 'nodeIcon/Return.png';
export const returnNodeConfig: BasicEditorNodeConfig = {
  type: ReturnNodeType,
  component: ReturnNodeView,
  model: ReturnNodeModel,
  name: '返回节点',
  banter: '回到梦开始的地方',
  description: '将指定值返回给调用者。',
  generateSuggestedNodes: returnNodeGenerateAnchorRecommendation,
  iconPath: iconPath,
  demoDndData: {
    type: ReturnNodeType,
    label: '返回节点',
    icon: iconPath,
    properties: {
      type: new BasicType('builtin:basic:integer').toString(),
      defaultValues: {},
    } satisfies ReturnNodeProperties,
  },
};
