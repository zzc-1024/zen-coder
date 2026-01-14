<template>
  <div class="wrapper">
    <ToolBar :config="toolBarConfig" @generate="handleGenerate" />
    <div class="editor-container">
      <resourceList
        class="variable-list"
        :parameters="selectedSheetParameters"
        :localVariables="localVariables"
        :globalVariables="globalVariables"
        @onPointerDown="onPointerDown"
        @onAddVariable="onAddVariable"
        @onDeleteVariable="onDeleteVariable"
      />
      <div class="lf-object">
        <div ref="containerRef" class="lf-container"></div>
        <TabBar
          class="tab-bar"
          :tabs="sheets.map((sheet) => ({ id: sheet.id, name: sheet.signature.name }))"
          :selectedTabId="selectedSheetId"
          @tabAdd="onTabAdd"
          @tabSelect="onTabChange"
          @tabDelete="onTabDelete"
          @tabReorder="onTabReorder"
          @tabTouch="onTabTouch"
        />
      </div>
      <TeleportContainer :flow-id="flowId" />
      <AttributePanel
        :lf="lf"
        :selectedElements="selectedElements"
        :recommendationFunctions="recommendationFunctions"
      />
    </div>
  </div>

  <!-- 弹窗 -->
  <!-- 工具栏的弹窗 -->
  <PopupDialog ref="codePopupDialogRef" title="代码生成结果">
    <code class="code-block">{{ generatedCode }}</code>
    <button class="copy-btn" @click="copyCode">复制代码</button>
  </PopupDialog>

  <!-- 添加Tab的弹窗 -->
  <PopupDialog ref="addTabPopupDialogRef" title="添加新工作表">
    <div>
      <label>函数名称</label>
      <input v-model="newTabName" type="text" placeholder="请输入函数名称" />
    </div>
    <br />
    <label>参数列表</label>
    <div v-for="(parameter, index) in parameters" :key="index">
      {{ parameter.name }}: {{ parameter.type.toDisplayString() }}
      <button @click="onDeleteParameter(index)">删除</button>
    </div>
    <VariablePicker
      :needVariableScopeType="false"
      :needVariableName="true"
      @onAddVariable="onAddParameter"
    />
    <br />
    <label>返回值类型：{{ returnType !== undefined ? returnType.toDisplayString() : '空' }}</label>
    <button v-if="returnType !== undefined" @click="onDeleteReturnType">删除返回值类型</button>
    <VariablePicker
      :needVariableScopeType="false"
      :needVariableName="false"
      @onAddVariable="onSetReturnType"
    />
    <div>
      <button @click="handleAddTab" :disabled="newTabName.length === 0">添加函数</button>
    </div>
  </PopupDialog>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { getTeleport } from '@logicflow/vue-node-registry';
import LogicFlow, { BezierEdge, EventType } from '@logicflow/core';
import { DndPanel, MiniMap } from '@logicflow/extension';
import { BaseType, type Variable, type VariableScopeType } from '@/parser/variable';
import { batchRegisterVueNode } from '@/utils/editor';
import {
  basicEditorNode,
  BasicToolBarConfig,
  dndPanelItem,
  setBasicEditorEvent,
  type RecommendationFunction,
} from '@/nodes/basic/basicEditorConfig';
import ToolBar from './toolBar/ToolBar.vue';
import resourceList from './resourceList/ResourceList.vue';
import { dragVariable } from './resourceList/resourceList';
import BasicEdgeModel from '@/edges/BasicEdgeModel';
import AttributePanel from './AttributePanel/AttributePanel.vue';
import PopupDialog from './ui/PopupDialog.vue';
import TabBar from './tabBar/TabBar.vue';
import type { SheetData } from '@/nodes/basic/typeDifination';
import {
  ReturnNodeType,
  type ReturnNodeProperties,
} from '@/nodes/basic/returnNode/returnNodeModel';
import { returnNodeConfig } from '@/nodes/basic/returnNode';
import VariablePicker from './variablePicker/VariablePicker.vue';
import { CallNodeType, type CallNodeProperties } from '@/nodes/basic/callNode/callNodeModel';

// LogicFlow 相关的必要变量
const containerRef = ref(null);
const TeleportContainer = getTeleport();
const flowId = ref('');
let lf: LogicFlow | null = null;
const selectedSheetId = ref<string>('1');
const sheets = ref<SheetData[]>([
  {
    id: '1',
    signature: {
      name: 'main',
      parameters: [],
      returnValue: undefined,
    },
    variables: [],
    graph: {},
  },
]);

// LogicFlow外部数据
// 工具栏配置
const toolBarConfig = ref<BasicToolBarConfig | null>(null);
const codePopupDialogRef = ref();
const generatedCode = ref('');
// 变量列表配置
const globalVariables = ref<Variable[]>([]);
const selectedSheet = computed(() => {
  return sheets.value.find((sheet) => sheet.id === selectedSheetId.value)!;
});
const localVariables = computed(() => {
  return selectedSheet.value.variables;
});
const selectedSheetParameters = computed(() => {
  return selectedSheet.value.signature.parameters;
});
// 添加Tab弹窗配置
const addTabPopupDialogRef = ref();
const newTabName = ref('');
const parameters = ref<Variable[]>([]);
const returnType = ref<BaseType | undefined>(undefined);
// 属性面板配置
const selectedElements = ref<LogicFlow.GraphData>({
  nodes: [],
  edges: [],
}); // 选中的元素
const recommendationFunctions = ref<RecommendationFunction>(() => []);

onMounted(() => {
  // 初始化
  if (containerRef.value === null) {
    return;
  }
  lf = new LogicFlow({
    container: containerRef.value,
    keyboard: {
      enabled: true,
    },
    themeMode: 'dark',
    background: {
      color: '#111',
    },
    plugins: [MiniMap],
  });

  // 工具栏配置
  toolBarConfig.value = new BasicToolBarConfig(lf!, sheets, selectedSheetId, globalVariables);

  // 注册自定义边和节点
  lf.register({
    type: 'builtin:basic:edge',
    view: BezierEdge,
    model: BasicEdgeModel,
  });
  lf.setDefaultEdgeType('builtin:basic:edge');
  recommendationFunctions.value = batchRegisterVueNode(lf, basicEditorNode);

  // 设置拖拽面板
  if (lf.extension.dndPanel instanceof DndPanel) {
    lf.extension.dndPanel.setPatternItems([
      ...dndPanelItem,
      {
        label: '返回节点',
        icon: returnNodeConfig.iconPath,
        callback: () => {
          lf!.dnd.startDrag({
            type: ReturnNodeType,
            properties: {
              type: sheets.value
                .find((sheet) => sheet.id === selectedSheetId.value)!
                .signature.returnValue?.toString(),
              defaultValues: {},
            } satisfies ReturnNodeProperties,
          });
        },
      },
    ]);
  }

  // 设置事件
  lf.on(EventType.GRAPH_RENDERED, ({ graphModel }) => {
    // flowId 内聚在当前文件，因此单独设置事件
    flowId.value = graphModel.flowId!;
  });
  // 为属性面板定制的事件
  lf.on(EventType.NODE_FOCUS, ({}) => {
    selectedElements.value =
      lf?.getSelectElements() ||
      ({
        nodes: [],
        edges: [],
      } as LogicFlow.GraphData);
  });
  lf.on(EventType.NODE_DELETE, () => {
    selectedElements.value = {
      nodes: [],
      edges: [],
    } as LogicFlow.GraphData;
  });
  lf.on(EventType.BLANK_CLICK, () => {
    selectedElements.value = {
      nodes: [],
      edges: [],
    } as LogicFlow.GraphData;
  });
  lf.on(EventType.EDGE_FOCUS, () => {
    selectedElements.value = {
      nodes: [],
      edges: [],
    } as LogicFlow.GraphData;
  });
  setBasicEditorEvent(lf);

  // 绘制画布并配置显示设置
  lf.render(sheets.value[0]!.graph);
  lf.translateCenter();
  if (lf.extension.miniMap instanceof MiniMap) {
    lf.extension.miniMap.show();
  }
}); // onMounted结束

// 工具栏事件
function handleGenerate(code: string) {
  if (codePopupDialogRef.value === null) {
    return;
  }
  generatedCode.value = code;
  codePopupDialogRef.value.open();
}
// 复制代码
function copyCode() {
  if (generatedCode.value === '') {
    return;
  }
  navigator.clipboard.writeText(generatedCode.value);
}

// 变量列表事件
function onPointerDown(
  dragType: string,
  variableScopeType: VariableScopeType,
  variableName: string,
  variableType: BaseType,
) {
  if (lf === null) {
    return;
  }
  dragVariable(lf, dragType, variableScopeType, variableName, variableType);
}
function onAddVariable(
  variableScopeType: VariableScopeType,
  variableName: string,
  variableType: BaseType,
) {
  if (variableScopeType === 'global') {
    globalVariables.value.push({
      scope: variableScopeType,
      name: variableName,
      type: variableType,
    });
  } else if (variableScopeType === 'local') {
    sheets.value[sheets.value.findIndex((s) => s.id === selectedSheetId.value)]!.variables.push({
      scope: variableScopeType,
      name: variableName,
      type: variableType,
    });
  }
}
function onDeleteVariable(variableScopeType: VariableScopeType, variableName: string) {
  if (variableScopeType === 'global') {
    globalVariables.value = globalVariables.value.filter((v) => v.name !== variableName);
  } else if (variableScopeType === 'local') {
    sheets.value[sheets.value.findIndex((s) => s.id === selectedSheetId.value)]!.variables =
      sheets.value[sheets.value.findIndex((s) => s.id === selectedSheetId.value)]!.variables.filter(
        (v) => v.name !== variableName,
      );
  }
}

// Sheets 栏事件
function onTabAdd() {
  if (addTabPopupDialogRef.value === null) {
    return;
  }
  addTabPopupDialogRef.value.open();
}
function onDeleteParameter(index: number) {
  parameters.value.splice(index, 1);
}
function onAddParameter(
  _scopeType: VariableScopeType,
  variableName: string,
  variableType: BaseType,
) {
  if (parameters.value.some((p) => p.name === variableName)) {
    alert('参数名称已存在');
    return;
  }
  parameters.value.push({
    scope: 'local',
    name: variableName,
    type: variableType,
  });
}
function onDeleteReturnType() {
  returnType.value = undefined;
}
function onSetReturnType(
  _scopeType: VariableScopeType,
  _variableName: string,
  variableType: BaseType,
) {
  returnType.value = variableType;
}
function handleAddTab() {
  if (addTabPopupDialogRef.value === null) {
    alert('请先打开添加工作表弹窗');
    return;
  }
  if (newTabName.value === '') {
    alert('请输入工作表名称');
    return;
  }
  if (!/^[a-zA-Z_][a-zA-Z0-9_]{0,31}$/.test(newTabName.value)) {
    alert('工作表名称必须以字母开头，只能包含字母、数字和下划线，且长度必须在 1 到 32 个字符之间!');
    return;
  }
  // 需要判断 name 是否重复
  if (sheets.value.some((s) => s.signature.name === newTabName.value)) {
    alert('工作表名称已存在');
    return;
  }
  if (globalVariables.value.some((v) => v.name === newTabName.value)) {
    alert('工作表名称不能与变量名称重复');
    return;
  }
  const newId = Date.now();
  const newLabel = newTabName.value;
  sheets.value.push({
    id: newId.toString(),
    signature: { name: newLabel, parameters: [...parameters.value], returnValue: returnType.value },
    variables: [],
    graph: {},
  });
  parameters.value = [];
  returnType.value = undefined;
  addTabPopupDialogRef.value.close();
}
// 切换工作表
function onTabChange(tabId: string) {
  // 先保存上下文
  if (lf === null) {
    return;
  }
  const graphRawData = lf.getGraphRawData();
  sheets.value[sheets.value.findIndex((s) => s.id === selectedSheetId.value)]!.graph = graphRawData;
  // 再切换上下文
  selectedSheetId.value = tabId;
  lf.render(sheets.value.find((s) => s.id === tabId)!.graph);
}
function onTabDelete(tabId: string) {
  if (selectedSheetId.value === tabId) {
    alert('不能删除当前工作表');
    return;
  }
  sheets.value = sheets.value.filter((s) => s.id !== tabId);
}
function onTabReorder(tabIds: string[]) {
  sheets.value = tabIds.map((id) => sheets.value.find((s) => s.id === id)!);
}
function onTabTouch(tabId: string) {
  if (lf === null) {
    return;
  }
  // 获取选中的 sheet 的参数和返回值类型
  const currentSheet = sheets.value.find((s) => s.id === tabId)!;
  lf.dnd.startDrag({
    type: CallNodeType,
    properties: {
      source: '.',
      module: '.',
      functionName: currentSheet.signature.name,
      parameters: currentSheet.signature.parameters.map((v) => ({
        name: v.name,
        type: v.type.toString(),
      })),
      returnType: currentSheet.signature.returnValue?.toString(),
      isPureFunction: false,
      defaultValues: {},
    } satisfies CallNodeProperties,
  });
}
</script>

<style scoped lang="scss">
.wrapper {
  height: 100%;
  .editor-container {
    // 49是工具栏高度，5px是实验值
    height: calc(100% - 49px - 5px);
    min-height: 686px;
    width: 100%;
    display: flex;
    flex-direction: row;

    .variable-list {
      min-width: 230px;
    }

    .lf-object {
      height: calc(100% - 41px);
      width: 100%;
      min-height: 300px;
      .lf-container {
        width: 100%;
        height: 100%;
      }
      .tab-bar {
        width: 100%;
      }
    }
  }

  /* 响应式布局：当屏幕宽度小于 768px 时采用纵向布局 */
  @media (max-width: 768px) {
    .editor-container {
      flex-direction: column;
      min-height: 970px;

      .variable-list,
      .attribute-panel {
        width: 100%;
        height: auto;
      }

      .lf-object {
        flex: 1;
      }
    }
  }
}
.code-block {
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
