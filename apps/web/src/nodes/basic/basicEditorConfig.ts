import { type Ref } from 'vue';

import { type VueNodeConfig } from '@logicflow/vue-node-registry';

import LogicFlow from '@logicflow/core';
import { EventType } from '@logicflow/core';
import {
  BUILTIN_BASIC_FLOW_TYPE,
  type AnchorType,
  type DirectType,
  type SheetData,
} from './typeDifination';
import { ToolBarConfig } from '@/components/toolBar/toolBar';
import router from '@/router';
import { parseType, type Variable } from '@/parser/variable';

// 节点属性
import type { BasicNodeProperties } from './basicNodeModel';
import type { ConditionLoopNodeProperties } from './conditionLoopNode/conditionLoopNodeModel';
import type { BreakNodeProperties } from './breakNode/breakNodeModel';
import type { ContinueNodeProperties } from './continueNode/continueNodeModel';
import type { ConditionBranchNodeProperties } from './conditionBranchNode/conditionBranchNodeModel';

// 导入节点
import { entryNodeConfig } from './entryNode'; // 入口节点
import { setVariableNodeConfig } from './setVariableNode'; // 设置变量节点
import { getVariableNodeConfig } from './getVariableNode'; // 获取变量节点
import { indexNodeConfig } from './indexNode'; // 索引节点
import { binaryOperatorNodeConfig } from './binaryOperatorNode'; // 二元算术运算节点
import { conditionLoopNodeConfig } from './conditionLoopNode'; // 条件循环节点
import { breakNodeConfig } from './breakNode'; // 中断节点
import { continueNodeConfig } from './continueNode'; // 继续节点
import { conditionBranchNodeConfig } from './conditionBranchNode'; // 条件分支节点
import { typeCastNodeConfig } from './typeCastNode'; // 类型转换节点
import { returnNodeConfig } from './returnNode'; // 返回节点
import { callNodeConfig } from './callNode';

import EntryNodeModel, { EntryNodeType } from './entryNode/entryNodeModel';
import { PythonBackend } from '@/parser/backends/pythonBackends';
import { memberNodeConfig } from './memberNode';

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
  indexNodeConfig,
  binaryOperatorNodeConfig,
  conditionLoopNodeConfig,
  breakNodeConfig,
  continueNodeConfig,
  conditionBranchNodeConfig,
  typeCastNodeConfig,
  returnNodeConfig,
  callNodeConfig,
  memberNodeConfig,
];

export const dndPanelItem: LogicFlow.OnDragNodeConfig[] = [
  {
    type: entryNodeConfig.type,
    label: '程序入口',
    icon: entryNodeConfig.iconPath,
    properties: {} satisfies BasicNodeProperties,
  },
  {
    type: conditionLoopNodeConfig.type,
    label: '条件循环',
    icon: conditionLoopNodeConfig.iconPath,
    properties: {
      defaultValues: {},
    } satisfies ConditionLoopNodeProperties,
  },
  {
    type: breakNodeConfig.type,
    label: 'break节点',
    icon: breakNodeConfig.iconPath,
    properties: {} satisfies BreakNodeProperties,
  },
  {
    type: continueNodeConfig.type,
    label: '继续节点',
    icon: continueNodeConfig.iconPath,
    properties: {} satisfies ContinueNodeProperties,
  },
  {
    type: conditionBranchNodeConfig.type,
    label: '条件分支',
    icon: conditionBranchNodeConfig.iconPath,
    properties: {
      defaultValues: {},
    } satisfies ConditionBranchNodeProperties,
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

type SaveDataType = {
  version: '0.0.1';
  sheets: SheetData[];
  selectedSheetId: string;
  globalVariables: Variable[];
};
// 工具栏配置
export class BasicToolBarConfig extends ToolBarConfig {
  constructor(
    public lf: LogicFlow,
    public sheets: Ref<SheetData[]>,
    public selectedSheetId: Ref<string>,
    public globalVariables: Ref<Variable[]>,
  ) {
    super();
  }

  private saveCurrentSheet() {
    const graphRawData = this.lf.getGraphRawData();
    this.sheets.value[
      this.sheets.value.findIndex((s) => s.id === this.selectedSheetId.value)
    ]!.graph = graphRawData;
  }
  private changeToSelectedSheet() {
    const graphModel = this.lf.graphModel;
    graphModel.graphDataToModel(
      this.sheets.value[this.sheets.value.findIndex((s) => s.id === this.selectedSheetId.value)]!
        .graph,
    );
  }

  onSave = () => {
    this.saveCurrentSheet();
    // 保存为 JSON 文件
    const json = JSON.stringify(
      {
        version: '0.0.1',
        sheets: this.sheets.value,
        selectedSheetId: this.selectedSheetId.value,
        globalVariables: this.globalVariables.value,
      } satisfies SaveDataType,
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
        const data = JSON.parse(json) as SaveDataType;
        // 逐个解析局部变量
        data.sheets.forEach((sheet: SheetData) => {
          sheet.variables.forEach((variable: Variable) => {
            variable.type = parseType(variable.type.toString());
          });
        });
        if (data.version !== '0.0.1') {
          alert('文件版本不匹配');
          return;
        }
        this.sheets.value = data.sheets;
        this.selectedSheetId.value = data.selectedSheetId;
        this.lf.render(data.sheets.find((sheet) => sheet.id === data.selectedSheetId)?.graph || {});
        const globalVariables = data.globalVariables.map((variable: Variable) => ({
          ...variable,
          type: parseType(variable.type.toString()),
        }));
        this.globalVariables.value = globalVariables;
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
  onGenerate = () => {
    this.saveCurrentSheet();
    const graphModel = this.lf.graphModel;
    const functions: string[] = [];
    const pythonBackend: PythonBackend = new PythonBackend();
    for (const sheet of this.sheets.value) {
      graphModel.graphDataToModel(sheet.graph);
      const entryNodes = graphModel.nodes?.filter(
        (node) => (node.type as string) === EntryNodeType,
      );
      if (entryNodes === undefined || entryNodes.length !== 1) {
        alert(`${sheet.signature.name} 主函数的入口节点必须有一个且至多只能有一个`);
        this.changeToSelectedSheet();
        return;
      }

      const entryNode = entryNodes[0]! as EntryNodeModel;
      const statements = entryNode.parseFlowIn();
      const code = pythonBackend.generateCode(
        sheet.variables,
        sheet.signature.name,
        sheet.signature.parameters,
        statements,
      );
      functions.push(code);
    }
    graphModel.graphDataToModel(
      this.sheets.value[this.sheets.value.findIndex((s) => s.id === this.selectedSheetId.value)]!
        .graph,
    );
    // 合并所有函数
    let result = '';
    for (const variable of this.globalVariables.value) {
      result += pythonBackend.convertVariableToPythonStyle(variable) + '\n';
    }
    result += '\n';
    for (const functionCode of functions) {
      result += functionCode + '\n';
    }
    result += 'if __name__ == "__main__":\n';
    result += `    ${this.sheets.value.find((sheet) => sheet.id === this.selectedSheetId.value)!.signature.name}()\n`;
    return result;
  };
  onLanguageChange: undefined;
  onGotoHome = () => {
    router.push('/');
  };
}
