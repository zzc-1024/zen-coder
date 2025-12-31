import { type BasicEditorNodeConfig } from '../basicEditorConfig';
import BinaryArithmeticNodeView from './binaryArithmeticNodeView.vue';
import BinaryArithmeticNodeModel, {
  binaryArithmeticNodeGenerateAnchorRecommendation,
  BinaryArithmeticNodeType,
} from './binaryArithmeticNodeModel';

export const binaryArithmeticNodeConfig: BasicEditorNodeConfig = {
  type: BinaryArithmeticNodeType,
  component: BinaryArithmeticNodeView,
  model: BinaryArithmeticNodeModel,
  generateSuggestedNodes: binaryArithmeticNodeGenerateAnchorRecommendation,
  iconPath: 'nodeIcon/BinaryArithmetic.png',
};
