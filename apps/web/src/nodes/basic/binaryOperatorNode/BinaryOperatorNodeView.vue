<template>
  <div class="node">
    <!-- 1. 表头区域：显示表名 -->
    <NodeHeader>{{
      properties?.operator ? operatorMap[properties?.operator] : '未知运算符'
    }}</NodeHeader>

    <!-- 2. 字段列表区域 -->
    <div class="node-body" v-if="getNode">
      <NodeField
        v-for="field in getNode().getFields()"
        :key="field.name"
        :hasInput="field.inputId !== null"
        :hasOutput="field.outputId !== null"
        :name="field.name"
        :type="field.type.toString()"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, onMounted } from 'vue';
import { EventType, GraphModel } from '@logicflow/core';
import NodeHeader from '@/components/node/NodeHeader.vue';
import type BinaryOperatorNodeModel from './binaryOperatorNodeModel';
import type { BinaryOperatorNodeProperties } from './binaryOperatorNodeModel';
import NodeField from '@/components/node/NodeField.vue';
import type { BinaryOperator } from '@/parser/expressions';

// 1. 注入 LogicFlow 核心方法
const getNode = inject<() => BinaryOperatorNodeModel>('getNode');
const getGraph = inject<() => GraphModel>('getGraph');

// 2. 定义响应式数据
// 给定一个默认结构，防止渲染报错
const properties = ref<BinaryOperatorNodeProperties>();

// 3. 初始化与事件监听
onMounted(() => {
  if (!getNode || !getGraph) return;

  const node = getNode();
  const graph = getGraph();

  // --- 函数：从节点属性同步数据到 Vue 组件 ---
  const updateData = (props: BinaryOperatorNodeProperties) => {
    // 这里做一层合并，确保即使 props 为空也有默认值
    properties.value = { ...props };
  };

  // A. 初始化：首次加载时读取数据
  updateData(node.properties as BinaryOperatorNodeProperties);

  // B. 监听：当图表上的节点属性发生变化时（例如通过 properties 面板修改了表名）
  graph.eventCenter.on(
    EventType.NODE_PROPERTIES_CHANGE,
    (eventData: { id: string; properties: unknown }) => {
      // 关键判断：确保事件是针对当前这个节点的
      if (eventData.id !== node.id) return;
      updateData(eventData.properties as BinaryOperatorNodeProperties);
    },
  );
});

const operatorMap: Record<BinaryOperator, string> = {
  // 算术运算符
  addition: '加法',
  subtraction: '减法',
  multiplication: '乘法',
  division: '除法',
  floor_division: '整除',
  modulus: '取余',
  exponentiation: '指数运算',
  // 比较运算符
  less_than: '小于',
  less_than_or_equal: '小于等于',
  greater_than: '大于',
  greater_than_or_equal: '大于等于',
  equal: '等于',
  not_equal: '不等于',
  // 逻辑运算符
  and: '逻辑与',
  or: '逻辑或',
  xor: '异或',
  xnor: '同或',
};
</script>

<style scoped style="scss">
.node {
  /* 宽度需要和 Model 中定义的 width 一致 */
  width: var(--zencoder-node-width);
  background: #2b2b2b;
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
