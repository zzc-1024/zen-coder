import { BasicType } from '@/parser/variable';
import { type BasicEditorNodeConfig } from '../basicEditorConfig';
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
      type: new BasicType('builtin:basic:integer').toString(),
      variableScopeType: 'local',
      variable: 'Hello',
      indexs: [],
      defaultValues: {},
    } satisfies SetVariableNodeProperties,
  },
};
