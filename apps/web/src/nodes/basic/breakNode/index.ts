import { type BasicEditorNodeConfig } from '../basicEditorConfig';
import BreakNodeView from './BreakNodeView.vue';
import BreakNodeModel, { breakNodeGenerateAnchorRecommendation, BreakNodeType } from './breakNodeModel';

export const breakNodeConfig: BasicEditorNodeConfig = {
  type: BreakNodeType,
  component: BreakNodeView,
  model: BreakNodeModel,
  generateSuggestedNodes: breakNodeGenerateAnchorRecommendation,
  iconPath: 'nodeIcon/Break.png',
};
