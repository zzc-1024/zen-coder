import { type BasicEditorNodeConfig } from '../basicEditorConfig';
import BreakNodeView from './BreakNodeView.vue';
import BreakNodeModel, {
  breakNodeGenerateAnchorRecommendation,
  BreakNodeType,
  type BreakNodeProperties,
} from './breakNodeModel';

const iconPath = 'nodeIcon/Break.png';
export const breakNodeConfig: BasicEditorNodeConfig = {
  type: BreakNodeType,
  component: BreakNodeView,
  model: BreakNodeModel,
  name: 'Break节点',
  banter: '“山的后面就是大海了啊，哪里还有山”？Break节点很不理解继续节点。',
  description: '提前退出循环体。',
  generateSuggestedNodes: breakNodeGenerateAnchorRecommendation,
  iconPath: iconPath,
  demoDndData: {
    type: BreakNodeType,
    label: 'break节点',
    icon: iconPath,
    properties: {} satisfies BreakNodeProperties,
  },
};
