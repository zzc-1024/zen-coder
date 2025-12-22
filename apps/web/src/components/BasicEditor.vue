<template>
  <div ref="containerRef" class="lf-container"></div>
  <TeleportContainer :flow-id="flowId" />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getTeleport, register } from '@logicflow/vue-node-registry';
import LogicFlow from '@logicflow/core';
import SetNodeModel from '@/nodes/basic/setNode/setNodeModel';
import SetNodeView from '@/nodes/basic/setNode/SetNodeView.vue';
import { MiniMap } from '@logicflow/extension';
import { BasicType } from '@/nodes/basic/typeDifination';

// LogicFlow 相关的必要变量
const containerRef = ref(null);
const TeleportContainer = getTeleport();
const flowId = ref('');
let lf: LogicFlow | null = null;
const renderData = ref<LogicFlow.GraphConfigData>({
  nodes: [
    {
      id: '1',
      type: 'set-node',
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
  register(
    {
      type: 'set-node',
      component: SetNodeView,
      model: SetNodeModel,
    },
    lf,
  );
  lf.render(renderData.value);
  lf.translateCenter();
  if (lf.extension.miniMap instanceof MiniMap) {
    lf.extension.miniMap.show();
  }
});
</script>

<style scoped lang="scss">
.lf-container {
  height: 99%;
}
</style>
