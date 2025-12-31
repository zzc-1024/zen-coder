import { type BasicEditorNodeConfig } from '../basicEditorConfig';
// 入口节点
import EntryNodeView from './EntryNodeView.vue';
import EntryNodeModel, {
  entryNodeGenerateAnchorRecommendation,
  EntryNodeType,
} from './entryNodeModel';

export const entryNodeConfig: BasicEditorNodeConfig = {
  type: EntryNodeType,
  component: EntryNodeView,
  model: EntryNodeModel,
  generateSuggestedNodes: entryNodeGenerateAnchorRecommendation,
  iconPath: 'nodeIcon/Entry.png',
};
