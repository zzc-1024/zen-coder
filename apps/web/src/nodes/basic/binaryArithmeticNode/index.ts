import { BinaryArithmeticNodeType, type BasicEditorNodeConfig } from '../basicEditorConfig';
import BinaryArithmeticNodeView from './binaryArithmeticNodeView.vue';
import BinaryArithmeticNodeModel, {
  binaryArithmeticNodeGenerateAnchorRecommendation,
} from './binaryArithmeticNodeModel';

export const binaryArithmeticNodeConfig: BasicEditorNodeConfig = {
  type: BinaryArithmeticNodeType,
  component: BinaryArithmeticNodeView,
  model: BinaryArithmeticNodeModel,
  generateSuggestedNodes: binaryArithmeticNodeGenerateAnchorRecommendation,
};
