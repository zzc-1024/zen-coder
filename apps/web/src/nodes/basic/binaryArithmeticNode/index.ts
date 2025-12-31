import { BinaryArithmeticNodeType, type BasicEditorNodeConfig } from '../basicEditorConfig';
import BinaryArithmeticNodeView from './binaryArithmeticNodeView.vue';
import BinaryArithmeticNodeModel, {
  binaryArithmeticNodeGenerateAnchorRecommendation,
} from './binaryArithmeticNodeModel';

export default {
  type: BinaryArithmeticNodeType,
  component: BinaryArithmeticNodeView,
  model: BinaryArithmeticNodeModel,
  generateSuggestedNodes: binaryArithmeticNodeGenerateAnchorRecommendation,
} as BasicEditorNodeConfig;
