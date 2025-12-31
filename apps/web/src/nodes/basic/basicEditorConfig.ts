import { type Ref } from 'vue';

import { type VueNodeConfig } from '@logicflow/vue-node-registry';

// 入口节点
import EntryNodeView from '@/nodes/basic/entryNode/EntryNodeView.vue';
import EntryNodeModel, {
  entryNodeGenerateAnchorRecommendation,
} from '@/nodes/basic/entryNode/entryNodeModel';
// 设置变量节点
import SetVariableNodeView from '@/nodes/basic/setNode/SetVariableNodeView.vue';
import SetVariableNodeModel, {
  setVariableNodeGenerateAnchorRecommendation,
} from '@/nodes/basic/setNode/setVariableNodeModel';
// 获取变量节点
import GetVariableNodeView from '@/nodes/basic/getNode/GetVariableNodeView.vue';
import GetVariableNodeModel, {
  getVariableNodeGenerateAnchorRecommendation,
} from '@/nodes/basic/getNode/getVariableNodeModel';
// 二元算术运算节点
import BinaryArithmeticNodeView from '@/nodes/basic/binaryArithmeticNode/binaryArithmeticNodeView.vue';
import BinaryArithmeticNodeModel, {
  binaryArithmeticNodeGenerateAnchorRecommendation,
} from './binaryArithmeticNode/binaryArithmeticNodeModel';
// 条件循环节点
import ConditionLoopNodeView from '@/nodes/basic/conditionLoopNode/ConditionLoopNodeView.vue';
import ConditionLoopNodeModel, {
  conditionLoopNodeGenerateAnchorRecommendation,
} from '@/nodes/basic/conditionLoopNode/conditionLoopNodeModel';
// 范围循环节点
import RangeLoopNodeView from '@/nodes/basic/rangeLoopNode/RangeLoopNodeView.vue';
import RangeLoopNodeModel, {
  rangeLoopNodeGenerateAnchorRecommendation,
} from '@/nodes/basic/rangeLoopNode/rangeLoopNodeModel';
// 中断节点
import BreakNodeView from '@/nodes/basic/breakNode/BreakNodeView.vue';
import BreakNodeModel, {
  breakNodeGenerateAnchorRecommendation,
} from '@/nodes/basic/breakNode/breakNodeModel';
// 继续节点
import ContinueNodeView from '@/nodes/basic/continueNode/ContinueNodeView.vue';
import ContinueNodeModel, {
  continueNodeGenerateAnchorRecommendation,
} from '@/nodes/basic/continueNode/continueNodeModel';
// 条件分支节点
import ConditionBranchNodeView from '@/nodes/basic/conditionBranchNode/ConditionBranchNodeView.vue';
import ConditionBranchNodeModel, {
  conditionBranchNodeGenerateAnchorRecommendation,
} from '@/nodes/basic/conditionBranchNode/conditionBranchNodeModel';

import type LogicFlow from '@logicflow/core';
import { EventType } from '@logicflow/core';
import {
  BaseType,
  BUILTIN_BASIC_FLOW_TYPE,
  type AnchorType,
  type DirectType,
} from './typeDifination';
import { ToolBarConfig } from '@/components/toolBar/toolBar';
import router from '@/router';
import type { Variable } from '@/components/variableList/variableList';

// 节点配置区域
export const BasicEditorNodeTypePrefix = 'builtin:basic';
export const EntryNodeType = `${BasicEditorNodeTypePrefix}:entry`;
export const SetVariableNodeType = `${BasicEditorNodeTypePrefix}:set`;
export const GetVariableNodeType = `${BasicEditorNodeTypePrefix}:get`;
export const BinaryArithmeticNodeType = `${BasicEditorNodeTypePrefix}:binaryArithmetic`;
export const ConditionLoopNodeType = `${BasicEditorNodeTypePrefix}:conditionLoop`;
export const RangeLoopNodeType = `${BasicEditorNodeTypePrefix}:rangeLoop`;
export const BreakNodeType = `${BasicEditorNodeTypePrefix}:break`;
export const ContinueNodeType = `${BasicEditorNodeTypePrefix}:continue`;
export const ConditionBranchNodeType = `${BasicEditorNodeTypePrefix}:conditionBranch`;

export type RecommendationFunction = (
  type: AnchorType,
  direction: DirectType,
) => LogicFlow.OnDragNodeConfig[];

export type BasicEditorNodeConfig = VueNodeConfig & {
  generateSuggestedNodes: RecommendationFunction;
};

export const basicEditorNode: BasicEditorNodeConfig[] = [
  {
    type: EntryNodeType,
    component: EntryNodeView,
    model: EntryNodeModel,
    generateSuggestedNodes: entryNodeGenerateAnchorRecommendation,
  },
  {
    type: SetVariableNodeType,
    component: SetVariableNodeView,
    model: SetVariableNodeModel,
    generateSuggestedNodes: setVariableNodeGenerateAnchorRecommendation,
  },
  {
    type: GetVariableNodeType,
    component: GetVariableNodeView,
    model: GetVariableNodeModel,
    generateSuggestedNodes: getVariableNodeGenerateAnchorRecommendation,
  },
  {
    type: BinaryArithmeticNodeType,
    component: BinaryArithmeticNodeView,
    model: BinaryArithmeticNodeModel,
    generateSuggestedNodes: binaryArithmeticNodeGenerateAnchorRecommendation,
  },
  {
    type: ConditionLoopNodeType,
    component: ConditionLoopNodeView,
    model: ConditionLoopNodeModel,
    generateSuggestedNodes: conditionLoopNodeGenerateAnchorRecommendation,
  },
  {
    type: RangeLoopNodeType,
    component: RangeLoopNodeView,
    model: RangeLoopNodeModel,
    generateSuggestedNodes: rangeLoopNodeGenerateAnchorRecommendation,
  },
  {
    type: BreakNodeType,
    component: BreakNodeView,
    model: BreakNodeModel,
    generateSuggestedNodes: breakNodeGenerateAnchorRecommendation,
  },
  {
    type: ContinueNodeType,
    component: ContinueNodeView,
    model: ContinueNodeModel,
    generateSuggestedNodes: continueNodeGenerateAnchorRecommendation,
  },
  {
    type: ConditionBranchNodeType,
    component: ConditionBranchNodeView,
    model: ConditionBranchNodeModel,
    generateSuggestedNodes: conditionBranchNodeGenerateAnchorRecommendation,
  },
];

export const dndPanelItem: LogicFlow.OnDragNodeConfig[] = [
  {
    type: EntryNodeType,
    label: '程序入口',
    icon: 'nodeIcon/Entry.png',
    properties: {
      title: '程序入口',
    },
  },
  {
    type: ConditionLoopNodeType,
    label: '条件循环',
    icon: 'nodeIcon/ConditionLoop.png',
    properties: {
      title: '条件循环',
    },
  },
  {
    type: RangeLoopNodeType,
    label: '范围循环',
    icon: 'nodeIcon/RangeLoop.png',
    properties: {
      title: '范围循环',
    },
  },
  {
    type: BreakNodeType,
    label: 'break节点',
    icon: 'nodeIcon/Break.png',
    properties: {
      title: 'break节点',
    },
  },
  {
    type: ContinueNodeType,
    label: '继续节点',
    icon: 'nodeIcon/Continue.png',
    properties: {
      title: '继续节点',
    },
  },
  {
    type: ConditionBranchNodeType,
    label: '条件分支',
    icon: 'nodeIcon/ConditionBranch.png',
    properties: {
      title: '条件分支',
    },
  },
];

// 事件配置区域
export function setBasicEditorEvent(lf: LogicFlow) {
  lf.on(EventType.ANCHOR_DRAGSTART, ({ data, nodeModel }) => {
    if (!lf) return;
    const outgoingEdges = lf.graphModel.getAnchorOutgoingEdge(data.id);
    lf.graphModel.nodes.forEach((node) => {
      // 所有节点显示左侧锚点
      node.setProperty('showAnchorSide', 'left');
      // 如果是当前节点，则不显示
      if (node.id === nodeModel.id) {
        node.setProperty('showAnchorSide', 'right');
        // 如果锚点是 flow 类型，只能有一个连边，临时让锚点不显示以取消拖拽
        if (outgoingEdges.length > 0 && data.type?.toString() === BUILTIN_BASIC_FLOW_TYPE) {
          node.setProperty('showAnchorSide', 'left');
        }
      }
    });
  });
  lf.on(EventType.ANCHOR_DRAGEND, () => {
    if (!lf) return;
    lf.graphModel.nodes.forEach((node) => {
      // 所有节点显示右侧锚点
      node.deleteProperty('showAnchorSide');
    });
  });
  // 手动聚焦
  lf.on(EventType.NODE_FOCUS, () => {
    if (!lf) return;
    lf.container.focus();
  });
  lf.on(EventType.EDGE_FOCUS, () => {
    if (!lf) return;
    lf.container.focus();
  });
}

// 工具栏配置
export class BasicToolBarConfig extends ToolBarConfig {
  constructor(
    public lf: LogicFlow,
    public variables: Ref<Variable[]>,
  ) {
    super();
  }

  onSave = () => {
    const graphData = this.lf.getGraphRawData();
    // 保存为 JSON 文件
    const json = JSON.stringify(
      {
        version: '0.0.0',
        ...graphData,
        variables: this.variables.value,
      },
      null,
      2,
    );
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flow-${Date.now()}.json`; // 文件名为时间戳
    a.click();
    URL.revokeObjectURL(url);
  };
  onImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.click();
    input.addEventListener('change', (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.readAsText(file, 'utf-8');
      reader.onload = () => {
        const json = reader.result as string;
        this.lf.render(JSON.parse(json));
        const variables = JSON.parse(json).variables.map((variable: Variable) => ({
          ...variable,
          type: BaseType.fromString(variable.type.toString()),
        }));
        this.variables.value = variables;
      };
    });
    input.remove();
  };
  onUndo = () => {
    console.log('撤销');
    this.lf.undo();
  };
  onRedo = () => {
    console.log('重做');
    this.lf.redo();
  };
  onExecute: undefined;
  onGenerate: undefined;
  onLanguageChange: undefined;
  onGotoHome = () => {
    router.push('/');
  };
}
