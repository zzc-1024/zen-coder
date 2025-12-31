import { type BasicEditorNodeConfig } from '../basicEditorConfig';
import GetVariableNodeView from './GetVariableNodeView.vue';
import GetVariableNodeModel, {
  getVariableNodeGenerateAnchorRecommendation,
  GetVariableNodeType,
} from './getVariableNodeModel';

export const getVariableNodeConfig: BasicEditorNodeConfig = {
  type: GetVariableNodeType,
  component: GetVariableNodeView,
  model: GetVariableNodeModel,
  generateSuggestedNodes: getVariableNodeGenerateAnchorRecommendation,
  iconPath: 'nodeIcon/GetVariable.png',
};
