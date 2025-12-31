import { RangeLoopNodeType, type BasicEditorNodeConfig } from '../basicEditorConfig';
import RangeLoopNodeView from './RangeLoopNodeView.vue';
import RangeLoopNodeModel, {
  rangeLoopNodeGenerateAnchorRecommendation,
} from './rangeLoopNodeModel';

export default {
  type: RangeLoopNodeType,
  component: RangeLoopNodeView,
  model: RangeLoopNodeModel,
  generateSuggestedNodes: rangeLoopNodeGenerateAnchorRecommendation,
} as BasicEditorNodeConfig;
