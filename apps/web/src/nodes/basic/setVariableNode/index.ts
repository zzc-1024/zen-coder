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
  name: '设置变量',
  banter: '随机应变',
  description: '将指定值赋值给指定变量。',
  generateSuggestedNodes: setVariableNodeGenerateAnchorRecommendation,
  iconPath: 'nodeIcon/SetVariable.png',
};
