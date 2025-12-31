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
  name: '双目算术运算',
  banter: '双面算术节点经常被左右操作数输入节点撒狗粮',
  description: '执行双目算术运算，如加法、减法、乘法、除法、整除和取余等操作（尚未完工）。',
  generateSuggestedNodes: binaryArithmeticNodeGenerateAnchorRecommendation,
  iconPath: 'nodeIcon/BinaryArithmetic.png',
};
