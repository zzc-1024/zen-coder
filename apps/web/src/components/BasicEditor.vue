<template>
  <div class="wrapper">
    <ToolBar />
    <div class="lf-container">
      <div ref="containerRef" style="height: 100%"></div>
      <TeleportContainer :flow-id="flowId" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getTeleport } from '@logicflow/vue-node-registry';
import LogicFlow from '@logicflow/core';
import { DndPanel, MiniMap } from '@logicflow/extension';
import { BasicType } from '@/nodes/basic/typeDifination';
import { batchRegisterVueNode } from '@/utils/editor';
import { basicEditorNode, dndPanelItem } from '@/nodes/basic/basicEditorConfig';
import ToolBar from '@/components/ToolBar.vue';

// LogicFlow 相关的必要变量
const containerRef = ref(null);
const TeleportContainer = getTeleport();
const flowId = ref('');
let lf: LogicFlow | null = null;
const renderData = ref<LogicFlow.GraphConfigData>({
  nodes: [
    {
      id: '1',
      type: 'builtin:basic:set',
      x: 100,
      y: 100,
      properties: {
        title: 'test',
        type: new BasicType('builtin:basic:string').toString(),
      },
    },
  ],
});
onMounted(() => {
  if (containerRef.value === null) {
    return;
  }
  lf = new LogicFlow({
    container: containerRef.value,
    plugins: [MiniMap],
  });
  batchRegisterVueNode(lf, basicEditorNode);
  if (lf.extension.dndPanel instanceof DndPanel) {
    lf.extension.dndPanel.setPatternItems(dndPanelItem);
  }
  lf.render(renderData.value);
  lf.translateCenter();
  if (lf.extension.miniMap instanceof MiniMap) {
    lf.extension.miniMap.show();
  }
});
</script>

<style scoped lang="scss">
.wrapper {
  height: 100%;
  .lf-container {
    height: calc(99% - 49px);
  }
}
</style>
