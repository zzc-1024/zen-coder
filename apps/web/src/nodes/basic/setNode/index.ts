import { SetVariableNodeType, type BasicEditorNodeConfig } from '../basicEditorConfig';
import SetNodeView from './SetNodeView.vue';
import SetNodeModel, { setNodeGenerateAnchorRecommendation } from './setNodeModel';

export default {
  type: SetVariableNodeType,
  component: SetNodeView,
  model: SetNodeModel,
  generateSuggestedNodes: setNodeGenerateAnchorRecommendation,
} as BasicEditorNodeConfig;
