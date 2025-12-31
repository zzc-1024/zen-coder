import { ConditionBranchNodeType, type BasicEditorNodeConfig } from '../basicEditorConfig';
import ConditionBranchNodeView from './ConditionBranchNodeView.vue';
import ConditionBranchNodeModel, {
  conditionBranchNodeGenerateAnchorRecommendation,
} from './conditionBranchNodeModel';

export default {
  type: ConditionBranchNodeType,
  component: ConditionBranchNodeView,
  model: ConditionBranchNodeModel,
  generateSuggestedNodes: conditionBranchNodeGenerateAnchorRecommendation,
} as BasicEditorNodeConfig;
