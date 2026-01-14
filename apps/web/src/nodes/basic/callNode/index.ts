import { BasicType } from '@/parser/variable';
import { type BasicEditorNodeConfig } from '../basicEditorConfig';
import CallNodeView from './CallNodeView.vue';
import CallNodeModel, {
  callNodeGenerateAnchorRecommendation,
  CallNodeType,
  type CallNodeProperties,
} from './callNodeModel';

const iconPath = 'nodeIcon/Call.png';
export const callNodeConfig: BasicEditorNodeConfig = {
  type: CallNodeType,
  component: CallNodeView,
  model: CallNodeModel,
  name: '调用函数',
  banter: '梦开始的地方',
  description: '调用指定函数。',
  generateSuggestedNodes: callNodeGenerateAnchorRecommendation,
  iconPath: iconPath,
  demoDndData: {
    type: CallNodeType,
    label: '调用函数',
    icon: iconPath,
    properties: {
      source: 'builtin:basic',
      module: '.',
      functionName: 'input',
      parameters: [{ type: 'builtin:basic:string', name: 'tip' }],
      returnType: new BasicType('builtin:basic:string').toString(),
      isPureFunction: false,
      defaultValues: {},
    } satisfies CallNodeProperties,
  },
};
