import { type BasicEditorNodeConfig } from '../basicEditorConfig';
import ConditionLoopNodeView from './ConditionLoopNodeView.vue';
import ConditionLoopNodeModel, {
  conditionLoopNodeGenerateAnchorRecommendation,
  ConditionLoopNodeType,
} from './conditionLoopNodeModel';

export const conditionLoopNodeConfig: BasicEditorNodeConfig = {
  type: ConditionLoopNodeType,
  component: ConditionLoopNodeView,
  model: ConditionLoopNodeModel,
  generateSuggestedNodes: conditionLoopNodeGenerateAnchorRecommendation,
  iconPath: 'nodeIcon/ConditionLoop.png',
};
