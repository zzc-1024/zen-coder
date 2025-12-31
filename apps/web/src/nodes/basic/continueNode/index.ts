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
  name: '继续节点',
  banter: '“山的后面还是山！”。继续节点坚定地说着。',
  description: '跳过当前循环体，继续下一次循环。',
  generateSuggestedNodes: continueNodeGenerateAnchorRecommendation,
  iconPath: 'nodeIcon/Continue.png',
};
