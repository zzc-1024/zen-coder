import { type BasicEditorNodeConfig } from '../basicEditorConfig';
import BreakNodeView from './BreakNodeView.vue';
import BreakNodeModel, { breakNodeGenerateAnchorRecommendation, BreakNodeType } from './breakNodeModel';

export const breakNodeConfig: BasicEditorNodeConfig = {
  type: BreakNodeType,
  component: BreakNodeView,
  model: BreakNodeModel,
  name: 'Break节点',
  banter: '“山的后面就是大海了啊，哪里还有山？”。Break节点觉得，是继续节点想让自己困在循环里。',
  description: '提前退出循环体。',
  generateSuggestedNodes: breakNodeGenerateAnchorRecommendation,
  iconPath: 'nodeIcon/Break.png',
};
