import { EntryNodeType, type BasicEditorNodeConfig } from '../basicEditorConfig';
// 入口节点
import EntryNodeView from './EntryNodeView.vue';
import EntryNodeModel, { entryNodeGenerateAnchorRecommendation } from './entryNodeModel';

export const entryNodeConfig: BasicEditorNodeConfig = {
  type: EntryNodeType,
  component: EntryNodeView,
  model: EntryNodeModel,
  generateSuggestedNodes: entryNodeGenerateAnchorRecommendation,
};
