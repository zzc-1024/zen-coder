import { BasicType, BUILTIN_BASIC_INTEGER_TYPE } from '@/parser/variable';
import type { BasicEditorNodeConfig } from '../typeDifination';
// 入口节点
import IndexNodeView from './IndexNodeView.vue';
import IndexNodeModel, {
  indexNodeGenerateAnchorRecommendation,
  IndexNodeType,
  type IndexNodeProperties,
} from './indexNodeModel';

const iconPath = 'nodeIcon/Index.png';
export const indexNodeConfig: BasicEditorNodeConfig = {
  type: IndexNodeType,
  component: IndexNodeView,
  model: IndexNodeModel,
  name: '索引',
  banter: '让我查一下',
  description: '根据索引获取变量的子元素，对应中括号运算符。',
  generateSuggestedNodes: indexNodeGenerateAnchorRecommendation,
  iconPath: iconPath,
  demoDndData: {
    type: IndexNodeType,
    label: '索引',
    icon: iconPath,
    properties: {
      inputType: new BasicType('builtin:basic:integer').toString(),
      outputType: new BasicType('builtin:basic:string').toString(),
      defaultValues: {},
      indexs: [BUILTIN_BASIC_INTEGER_TYPE],
    } satisfies IndexNodeProperties,
  },
};
