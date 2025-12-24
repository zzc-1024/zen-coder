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
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getTeleport } from '@logicflow/vue-node-registry';
import LogicFlow, { BezierEdge, EventType } from '@logicflow/core';
import { DndPanel, MiniMap } from '@logicflow/extension';
import { BaseType, BasicType } from '@/nodes/basic/typeDifination';
import { batchRegisterVueNode } from '@/utils/editor';
import {
  basicEditorNode,
  BasicToolBarConfig,
  dndPanelItem,
  setBasicEditorEvent,
  SetVariableNodeType,
} from '@/nodes/basic/basicEditorConfig';
import ToolBar from './toolBar/ToolBar.vue';
import VariableList from './variableList/VariableList.vue';
import { dragVariable, type Variable } from './variableList/variableList';
import BasicEdgeModel from '@/edges/BasicEdgeModel';

// LogicFlow 相关的必要变量
const containerRef = ref(null);
const TeleportContainer = getTeleport();
const flowId = ref('');
let lf: LogicFlow | null = null;
const renderData = ref<LogicFlow.GraphConfigData>({
  nodes: [
    {
      id: '1',
      type: SetVariableNodeType,
      x: 100,
      y: 100,
      properties: {
        title: 'test',
        type: new BasicType('builtin:basic:string').toString(),
      },
    },
  ],
});

// LogicFlow外部数据
// 变量列表配置
const variables = ref<Variable[]>([]);
// 工具栏配置
const toolBarConfig = ref<BasicToolBarConfig>(new BasicToolBarConfig(lf!, variables.value));

onMounted(() => {
  // 初始化
  if (containerRef.value === null) {
    return;
  }
  lf = new LogicFlow({
    container: containerRef.value,
    plugins: [MiniMap],
  });

  // 注册自定义边和节点
  lf.register({
    type: 'builtin:basic:edge',
    view: BezierEdge,
    model: BasicEdgeModel,
  });
  lf.setDefaultEdgeType('builtin:basic:edge');
  batchRegisterVueNode(lf, basicEditorNode);

  // 设置拖拽面板
  if (lf.extension.dndPanel instanceof DndPanel) {
    lf.extension.dndPanel.setPatternItems(dndPanelItem);
  }

  // 设置事件
  lf.on(EventType.GRAPH_RENDERED, ({ graphModel }) => {
    // flowId 内聚在当前文件，因此单独设置事件
    flowId.value = graphModel.flowId!;
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
}
</style>
