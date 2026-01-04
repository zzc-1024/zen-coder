import { type BasicEditorNodeConfig } from '../basicEditorConfig';
import { BasicType } from '../typeDifination';
import SetVariableNodeView from './SetVariableNodeView.vue';
import SetVariableNodeModel, {
  setVariableNodeGenerateAnchorRecommendation,
  SetVariableNodeType,
  type SetVariableNodeProperties,
} from './setVariableNodeModel';

const iconPath = 'nodeIcon/SetVariable.png';
export const setVariableNodeConfig: BasicEditorNodeConfig = {
  type: SetVariableNodeType,
  component: SetVariableNodeView,
  model: SetVariableNodeModel,
  name: '设置变量',
  banter: '随机应变',
  description: '将指定值赋值给指定变量。',
  generateSuggestedNodes: setVariableNodeGenerateAnchorRecommendation,
  iconPath: iconPath,
  demoDndData: {
    type: SetVariableNodeType,
    label: '设置变量',
    icon: iconPath,
    properties: {
      title: '设置变量',
      type: new BasicType('builtin:basic:integer').toString(),
      variable: 'Hello',
      defaultValues: {},
    } satisfies SetVariableNodeProperties,
  },
};
