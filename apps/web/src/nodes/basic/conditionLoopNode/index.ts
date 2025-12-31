import { ConditionLoopNodeType, type BasicEditorNodeConfig } from '../basicEditorConfig';
import ConditionLoopNodeView from './ConditionLoopNodeView.vue';
import ConditionLoopNodeModel, {
  conditionLoopNodeGenerateAnchorRecommendation,
} from './conditionLoopNodeModel';

export default {
  type: ConditionLoopNodeType,
  component: ConditionLoopNodeView,
  model: ConditionLoopNodeModel,
  generateSuggestedNodes: conditionLoopNodeGenerateAnchorRecommendation,
} as BasicEditorNodeConfig;
