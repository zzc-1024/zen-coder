import { BasicType } from '@/parser/variable';
import type { BasicEditorNodeConfig } from '../typeDifination';
// 入口节点
import TypeCastNodeView from './TypeCastNodeView.vue';
import TypeCastNodeModel, {
  typeCastNodeGenerateAnchorRecommendation,
  TypeCastNodeType,
  type TypeCastNodeProperties,
} from './typeCastNodeModel';

const iconPath = 'nodeIcon/TypeCast.png';
export const typeCastNodeConfig: BasicEditorNodeConfig = {
  type: TypeCastNodeType,
  component: TypeCastNodeView,
  model: TypeCastNodeModel,
  name: '类型转换',
  banter: '指鹿为马',
  description: '将一个变量转换为另一个类型。',
  generateSuggestedNodes: typeCastNodeGenerateAnchorRecommendation,
  iconPath: iconPath,
  demoDndData: {
    type: TypeCastNodeType,
    label: '类型转换',
    icon: iconPath,
    properties: {
      inputType: new BasicType('builtin:basic:integer').toString(),
      outputType: new BasicType('builtin:basic:string').toString(),
      defaultValues: {},
    } satisfies TypeCastNodeProperties,
  },
};
