import { GetVariableNodeType, type BasicEditorNodeConfig } from '../basicEditorConfig';
import GetNodeView from './GetNodeView.vue';
import GetNodeModel, { getNodeGenerateAnchorRecommendation } from './getNodeModel';

export default {
  type: GetVariableNodeType,
  component: GetNodeView,
  model: GetNodeModel,
  generateSuggestedNodes: getNodeGenerateAnchorRecommendation,
} as BasicEditorNodeConfig;
