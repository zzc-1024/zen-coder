import { type BasicEditorNodeConfig } from '../basicEditorConfig';
import RangeLoopNodeView from './RangeLoopNodeView.vue';
import RangeLoopNodeModel, {
  rangeLoopNodeGenerateAnchorRecommendation,
  RangeLoopNodeType,
  type RangeLoopNodeProperties,
} from './rangeLoopNodeModel';

const iconPath = 'nodeIcon/RangeLoop.png';
export const rangeLoopNodeConfig: BasicEditorNodeConfig = {
  type: RangeLoopNodeType,
  component: RangeLoopNodeView,
  model: RangeLoopNodeModel,
  name: '次数循环',
  banter: '“到底有几座山是我说了算”。范围循环节点一直那么霸道，直到他遇到了Break节点。',
  description:
    '根据指定范围（range）重复执行循环体（目前仅支持次数循环），直到循环次数达到指定次数或使用break节点提前退出循环。',
  generateSuggestedNodes: rangeLoopNodeGenerateAnchorRecommendation,
  iconPath: iconPath,
  demoDndData: {
    type: RangeLoopNodeType,
    label: '次数循环',
    icon: iconPath,
    properties: {
      title: '次数循环',
      defaultValues: {},
    } satisfies RangeLoopNodeProperties,
  },
};
