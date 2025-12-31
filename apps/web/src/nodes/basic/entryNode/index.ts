import { type BasicEditorNodeConfig } from '../basicEditorConfig';
// 入口节点
import EntryNodeView from './EntryNodeView.vue';
import EntryNodeModel, {
  entryNodeGenerateAnchorRecommendation,
  EntryNodeType,
} from './entryNodeModel';

const iconPath = 'nodeIcon/Entry.png';
export const entryNodeConfig: BasicEditorNodeConfig = {
  type: EntryNodeType,
  component: EntryNodeView,
  model: EntryNodeModel,
  name: '程序入口',
  banter: '欢迎光临^_^',
  description: '程序的开始节点，所有流程必须从这里开始。',
  generateSuggestedNodes: entryNodeGenerateAnchorRecommendation,
  iconPath: iconPath,
  demoDndData: {
    type: EntryNodeType,
    label: '程序入口',
    icon: iconPath,
    properties: {
      title: '祝大家2026年快乐！',
    },
  },
};
