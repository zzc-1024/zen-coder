import { type BasicEditorNodeConfig } from '../basicEditorConfig';
import RangeLoopNodeView from './RangeLoopNodeView.vue';
import RangeLoopNodeModel, {
  rangeLoopNodeGenerateAnchorRecommendation,
  RangeLoopNodeType,
} from './rangeLoopNodeModel';

export const rangeLoopNodeConfig: BasicEditorNodeConfig = {
  type: RangeLoopNodeType,
  component: RangeLoopNodeView,
  model: RangeLoopNodeModel,
  generateSuggestedNodes: rangeLoopNodeGenerateAnchorRecommendation,
  iconPath: 'nodeIcon/RangeLoop.png',
};
