import { type Ref } from 'vue';

import { type VueNodeConfig } from '@logicflow/vue-node-registry';

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

// 导入节点
import { entryNodeConfig } from './entryNode'; // 入口节点
import { setVariableNodeConfig } from './setVariableNode'; // 设置变量节点
import { getVariableNodeConfig } from './getVariableNode'; // 获取变量节点
import { binaryArithmeticNodeConfig } from './binaryArithmeticNode'; // 二元算术运算节点
import { conditionLoopNodeConfig } from './conditionLoopNode'; // 条件循环节点
import { rangeLoopNodeConfig } from './rangeLoopNode'; // 范围循环节点
import { breakNodeConfig } from './breakNode'; // 中断节点
import { continueNodeConfig } from './continueNode'; // 继续节点
import { conditionBranchNodeConfig } from './conditionBranchNode'; // 条件分支节点

// 节点配置区域

export type RecommendationFunction = (
  type: AnchorType,
  direction: DirectType,
) => LogicFlow.OnDragNodeConfig[];

export type BasicEditorNodeConfig = VueNodeConfig & {
  name: string;
  banter: string;
  description: string;
  generateSuggestedNodes: RecommendationFunction;
  iconPath: string;
  demoDndData: LogicFlow.OnDragNodeConfig;
};

export const basicEditorNode: BasicEditorNodeConfig[] = [
  entryNodeConfig,
  setVariableNodeConfig,
  getVariableNodeConfig,
  binaryArithmeticNodeConfig,
  conditionLoopNodeConfig,
  rangeLoopNodeConfig,
  breakNodeConfig,
  continueNodeConfig,
  conditionBranchNodeConfig,
];

export const dndPanelItem: LogicFlow.OnDragNodeConfig[] = [
  {
    type: entryNodeConfig.type,
    label: '程序入口',
    icon: entryNodeConfig.iconPath,
    properties: {
      title: '程序入口',
    },
  },
  {
    type: conditionLoopNodeConfig.type,
    label: '条件循环',
    icon: conditionLoopNodeConfig.iconPath,
    properties: {
      title: '条件循环',
    },
  },
  {
    type: rangeLoopNodeConfig.type,
    label: '范围循环',
    icon: rangeLoopNodeConfig.iconPath,
    properties: {
      title: '范围循环',
    },
  },
  {
    type: breakNodeConfig.type,
    label: 'break节点',
    icon: breakNodeConfig.iconPath,
    properties: {
      title: 'break节点',
    },
  },
  {
    type: continueNodeConfig.type,
    label: '继续节点',
    icon: continueNodeConfig.iconPath,
    properties: {
      title: '继续节点',
    },
  },
  {
    type: conditionBranchNodeConfig.type,
    label: '条件分支',
    icon: conditionBranchNodeConfig.iconPath,
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
    this.lf.undo();
  };
  onRedo = () => {
    this.lf.redo();
  };
  onExecute: undefined;
  onGenerate: undefined;
  onLanguageChange: undefined;
  onGotoHome = () => {
    router.push('/');
  };
}
