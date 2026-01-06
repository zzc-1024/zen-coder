import { BasicType } from '@/parser/variable';
import { type BasicEditorNodeConfig } from '../basicEditorConfig';
import BinaryArithmeticNodeView from './BinaryArithmeticNodeView.vue';
import BinaryArithmeticNodeModel, {
  binaryArithmeticNodeGenerateAnchorRecommendation,
  BinaryArithmeticNodeType,
  type BinaryArithmeticNodeProperties,
} from './binaryArithmeticNodeModel';

const iconPath = 'nodeIcon/BinaryArithmetic.png';
export const binaryArithmeticNodeConfig: BasicEditorNodeConfig = {
  type: BinaryArithmeticNodeType,
  component: BinaryArithmeticNodeView,
  model: BinaryArithmeticNodeModel,
  name: '双目算术运算',
  banter: '双目算术节点经常被左右操作数输入节点夹在中间撒狗粮',
  description: '执行双目算术运算，如加法、减法、乘法、除法、整除和取余等操作（尚未完工）。',
  generateSuggestedNodes: binaryArithmeticNodeGenerateAnchorRecommendation,
  iconPath: iconPath,
  demoDndData: {
    type: BinaryArithmeticNodeType,
    label: '加法',
    icon: iconPath,
    properties: {
      type: new BasicType('builtin:basic:integer').toString(),
      operator: 'addition',
      defaultValues: {},
    } satisfies BinaryArithmeticNodeProperties,
  },
};
