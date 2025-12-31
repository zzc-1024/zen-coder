import { BreakNodeType, type BasicEditorNodeConfig } from '../basicEditorConfig';
import BreakNodeView from './BreakNodeView.vue';
import BreakNodeModel, { breakNodeGenerateAnchorRecommendation } from './breakNodeModel';

export default {
  type: BreakNodeType,
  component: BreakNodeView,
  model: BreakNodeModel,
  generateSuggestedNodes: breakNodeGenerateAnchorRecommendation,
} as BasicEditorNodeConfig;
