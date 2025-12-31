import { type BasicEditorNodeConfig } from '../basicEditorConfig';
import ConditionLoopNodeView from './ConditionLoopNodeView.vue';
import ConditionLoopNodeModel, {
  conditionLoopNodeGenerateAnchorRecommendation,
  ConditionLoopNodeType,
} from './conditionLoopNodeModel';

export const conditionLoopNodeConfig: BasicEditorNodeConfig = {
  type: ConditionLoopNodeType,
  component: ConditionLoopNodeView,
  model: ConditionLoopNodeModel,
  name: '条件循环',
  banter: '谁把我的循环条件改成“当前循环不是无限循环”了？条件循环节点暴躁地说。',
  description: '根据条件重复执行循环体，直到条件为false或使用break节点提前退出循环。',
  generateSuggestedNodes: conditionLoopNodeGenerateAnchorRecommendation,
  iconPath: 'nodeIcon/ConditionLoop.png',
};
