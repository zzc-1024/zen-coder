<template>
  <div class="wrapper">
    <ToolBar :config="toolBarConfig" />
    <div class="lf-container">
      <VariableList
        class="variable-list"
        :variables="variables"
        @onPointerDown="onPointerDown"
        @onAddVariable="onAddVariable"
        @onDeleteVariable="onDeleteVariable"
      />
      <div ref="containerRef" class="lf-object"></div>
      <TeleportContainer :flow-id="flowId" />
      <AttributePanel
        :lf="lf"
        :selectedElements="selectedElements"
        :recommendationFunctions="recommendationFunctions"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getTeleport } from '@logicflow/vue-node-registry';
import LogicFlow, { BezierEdge, EventType } from '@logicflow/core';
import { DndPanel, MiniMap } from '@logicflow/extension';
import { BaseType } from '@/nodes/basic/typeDifination';
import { batchRegisterVueNode } from '@/utils/editor';
import {
  basicEditorNode,
  BasicToolBarConfig,
  dndPanelItem,
  setBasicEditorEvent,
  EntryNodeType,
  type RecommendationFunction,
} from '@/nodes/basic/basicEditorConfig';
import ToolBar from './toolBar/ToolBar.vue';
import VariableList from './variableList/VariableList.vue';
import { dragVariable, type Variable } from './variableList/variableList';
import BasicEdgeModel from '@/edges/BasicEdgeModel';
import AttributePanel from './AttributePanel/AttributePanel.vue';

// LogicFlow 相关的必要变量
const containerRef = ref(null);
const TeleportContainer = getTeleport();
const flowId = ref('');
let lf: LogicFlow | null = null;
const renderData = ref<LogicFlow.GraphConfigData>({
  nodes: [
    {
      id: '1',
      type: EntryNodeType,
      x: 100,
      y: 100,
      properties: {
        title: '欢迎光临^_^',
      },
    },
  ],
});

// LogicFlow外部数据
// 变量列表配置
const variables = ref<Variable[]>([]);
// 工具栏配置
const toolBarConfig = ref<BasicToolBarConfig | null>(null);
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
    plugins: [MiniMap],
  });

  // 工具栏配置
  toolBarConfig.value = new BasicToolBarConfig(lf!, variables);

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
    lf.extension.dndPanel.setPatternItems(dndPanelItem);
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
  lf.render(renderData.value);
  lf.translateCenter();
  if (lf.extension.miniMap instanceof MiniMap) {
    lf.extension.miniMap.show();
  }
});

function onPointerDown(dragType: string, variableName: string, variableType: BaseType) {
  if (lf === null) {
    return;
  }
  dragVariable(lf, dragType, variableName, variableType);
}
function onAddVariable(variableName: string, variableType: BaseType) {
  variables.value.push({
    name: variableName,
    type: variableType,
  });
}
function onDeleteVariable(variableName: string) {
  variables.value = variables.value.filter((v) => v.name !== variableName);
}
</script>

<style scoped lang="scss">
.wrapper {
  height: 100%;
  .lf-container {
    height: calc(99% - 49px);
    min-height: 686px;
    width: 100vw;
    display: flex;
    flex-direction: row;

    .variable-list {
      min-width: 230px;
    }

    .lf-object {
      height: 100%;
      width: 100%;
    }
  }

  /* 响应式布局：当屏幕宽度小于 768px 时采用纵向布局 */
  @media (max-width: 768px) {
    .lf-container {
      flex-direction: column;
      min-height: 970px;

      .variable-list,
      .attribute-panel {
        width: 100%;
        height: auto;
      }

      .lf-object {
        flex: 1;
        width: 100%;
        min-height: 300px;
      }
    }
  }
}
</style>
