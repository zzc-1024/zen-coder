import { BreakNodeType, type BasicEditorNodeConfig } from '../basicEditorConfig';
import BreakNodeView from './BreakNodeView.vue';
import BreakNodeModel, { breakNodeGenerateAnchorRecommendation } from './breakNodeModel';

export const breakNodeConfig: BasicEditorNodeConfig = {
  type: BreakNodeType,
  component: BreakNodeView,
  model: BreakNodeModel,
  generateSuggestedNodes: breakNodeGenerateAnchorRecommendation,
};
