import { type BasicEditorNodeConfig } from '../basicEditorConfig';
import ConditionBranchNodeView from './ConditionBranchNodeView.vue';
import ConditionBranchNodeModel, {
  conditionBranchNodeGenerateAnchorRecommendation,
  ConditionBranchNodeType,
} from './conditionBranchNodeModel';

export const conditionBranchNodeConfig: BasicEditorNodeConfig = {
  type: ConditionBranchNodeType,
  component: ConditionBranchNodeView,
  model: ConditionBranchNodeModel,
  generateSuggestedNodes: conditionBranchNodeGenerateAnchorRecommendation,
  iconPath: 'nodeIcon/ConditionBranch.png',
};
