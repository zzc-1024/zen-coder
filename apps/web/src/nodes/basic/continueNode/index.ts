import { type BasicEditorNodeConfig } from '../basicEditorConfig';
import ContinueNodeView from './ContinueNodeView.vue';
import ContinueNodeModel, {
  continueNodeGenerateAnchorRecommendation,
  ContinueNodeType,
} from './continueNodeModel';

export const continueNodeConfig: BasicEditorNodeConfig = {
  type: ContinueNodeType,
  component: ContinueNodeView,
  model: ContinueNodeModel,
  generateSuggestedNodes: continueNodeGenerateAnchorRecommendation,
  iconPath: 'nodeIcon/Continue.png',
};
