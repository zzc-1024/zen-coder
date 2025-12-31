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
  name: '获取变量',
  banter: '以不变应万变',
  description: '获取指定变量的值，当变量变化后，该节点获取的变量也会变化。',
  generateSuggestedNodes: getVariableNodeGenerateAnchorRecommendation,
  iconPath: 'nodeIcon/GetVariable.png',
};
