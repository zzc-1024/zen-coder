import type { BasicEditorNodeConfig } from '../typeDifination';
import ConditionBranchNodeView from './ConditionBranchNodeView.vue';
import ConditionBranchNodeModel, {
  conditionBranchNodeGenerateAnchorRecommendation,
  ConditionBranchNodeType,
  type ConditionBranchNodeProperties,
} from './conditionBranchNodeModel';

const iconPath = 'nodeIcon/ConditionBranch.png';
export const conditionBranchNodeConfig: BasicEditorNodeConfig = {
  type: ConditionBranchNodeType,
  component: ConditionBranchNodeView,
  model: ConditionBranchNodeModel,
  name: '条件分支',
  banter: '虽然脚踏三条船，但是两条腿最多只能踩住两条船，不过最少也能踩住一条船。',
  description: '根据条件选择不同的流程路径。',
  generateSuggestedNodes: conditionBranchNodeGenerateAnchorRecommendation,
  iconPath: iconPath,
  demoDndData: {
    type: ConditionBranchNodeType,
    label: '条件分支',
    icon: iconPath,
    properties: {
      defaultValues: {},
    } satisfies ConditionBranchNodeProperties,
  },
};
