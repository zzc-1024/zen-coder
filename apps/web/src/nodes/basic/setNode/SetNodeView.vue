<template>
  <div class="node">
    <!-- 1. 表头区域：显示表名 -->
    <NodeHeader>{{ properties?.title || 'Unknown Table' }}</NodeHeader>

    <!-- 2. 字段列表区域 -->
    <div class="node-body">
      <NodeField :hasInput="true" :hasOutput="true" name="流程" type="builtin:basic:flow" />
      <NodeField
        :hasInput="true"
        :hasOutput="false"
        name="赋值"
        :type="properties?.type || 'blank'"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, onMounted } from 'vue';
import { EventType, GraphModel } from '@logicflow/core';
import NodeHeader from '@/components/node/NodeHeader.vue';
import type GetNodeModel from './setNodeModel';
import type { GetNodeProperties } from './setNodeModel';
import NodeField from '@/components/node/NodeField.vue';

// 1. 注入 LogicFlow 核心方法
const getNode = inject<() => GetNodeModel>('getNode');
const getGraph = inject<() => GraphModel>('getGraph');

// 2. 定义响应式数据
// 给定一个默认结构，防止渲染报错
const properties = ref<GetNodeProperties>();

// 3. 初始化与事件监听
onMounted(() => {
  if (!getNode || !getGraph) return;

  const node = getNode();
  const graph = getGraph();

  // --- 函数：从节点属性同步数据到 Vue 组件 ---
  const updateData = (props: GetNodeProperties) => {
    // 这里做一层合并，确保即使 props 为空也有默认值
    properties.value = {
      title: props.title,
      type: props.type,
    };
  };

  // A. 初始化：首次加载时读取数据
  updateData(node.properties as GetNodeProperties);

  // B. 监听：当图表上的节点属性发生变化时（例如通过 properties 面板修改了表名）
  graph.eventCenter.on(
    EventType.NODE_PROPERTIES_CHANGE,
    (eventData: { id: string; properties: unknown }) => {
      // 关键判断：确保事件是针对当前这个节点的
      if (eventData.id !== node.id) return;
      updateData(eventData.properties as GetNodeProperties);
    },
  );
});
</script>

<style scoped style="scss">
.node {
  /* 宽度需要和 Model 中定义的 width 一致 */
  width: 220px;
  background: #2b2b2b;
  border: 1px solid #444;
  border-radius: 6px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  font-family: 'Consolas', 'Monaco', monospace; /* 代码风格字体 */
  color: #dcdcdc;
  overflow: hidden;
  font-size: 12px;
}

/* 列表区域 */
.node-body {
  background: #2b2b2b;
}
</style>
