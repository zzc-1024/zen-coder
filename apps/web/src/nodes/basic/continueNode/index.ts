import { ContinueNodeType, type BasicEditorNodeConfig } from '../basicEditorConfig';
import ContinueNodeView from './ContinueNodeView.vue';
import ContinueNodeModel, { continueNodeGenerateAnchorRecommendation } from './continueNodeModel';

export const continueNodeConfig: BasicEditorNodeConfig = {
  type: ContinueNodeType,
  component: ContinueNodeView,
  model: ContinueNodeModel,
  generateSuggestedNodes: continueNodeGenerateAnchorRecommendation,
};
