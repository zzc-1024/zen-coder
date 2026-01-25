import { BasicType } from '@/parser/variable';
import type { BasicEditorNodeConfig } from '../typeDifination';
import BinaryOperatorNodeView from './BinaryOperatorNodeView.vue';
import BinaryOperatorNodeModel, {
  binaryOperatorNodeGenerateAnchorRecommendation,
  BinaryOperatorNodeType,
  type BinaryOperatorNodeProperties,
} from './binaryOperatorNodeModel';

const iconPath = 'nodeIcon/BinaryOperator.png';
export const binaryOperatorNodeConfig: BasicEditorNodeConfig = {
  type: BinaryOperatorNodeType,
  component: BinaryOperatorNodeView,
  model: BinaryOperatorNodeModel,
  name: '双目运算符',
  banter: '双目运算符节点经常被左右操作数输入节点夹在中间撒狗粮',
  description: '执行双目运算符运算，如加法、减法、乘法、除法、整除和取余等操作（尚未完工）。',
  generateSuggestedNodes: binaryOperatorNodeGenerateAnchorRecommendation,
  iconPath: iconPath,
  demoDndData: {
    type: BinaryOperatorNodeType,
    label: '加法',
    icon: iconPath,
    properties: {
      type: new BasicType('builtin:basic:integer').toString(),
      operator: 'addition',
      defaultValues: {},
    } satisfies BinaryOperatorNodeProperties,
  },
};
