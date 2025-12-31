import { type BasicEditorNodeConfig } from '../basicEditorConfig';
import SetVariableNodeView from './SetVariableNodeView.vue';
import SetVariableNodeModel, {
  setVariableNodeGenerateAnchorRecommendation,
  SetVariableNodeType,
} from './setVariableNodeModel';

export const setVariableNodeConfig: BasicEditorNodeConfig = {
  type: SetVariableNodeType,
  component: SetVariableNodeView,
  model: SetVariableNodeModel,
  generateSuggestedNodes: setVariableNodeGenerateAnchorRecommendation,
  iconPath: 'nodeIcon/SetVariable.png',
};
