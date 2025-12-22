<template>
  <div class="node-header">
    <span class="icon">🗃️</span>
    <span><slot> Unknown Table </slot></span>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.node-header {
  height: 17px;
  background: linear-gradient(to right, #2c3e50, #4ca1af); /* 数据库风格的蓝绿色 */
  padding: 8px 10px;
  font-weight: bold;
  font-size: 13px;
  color: white;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #1a1a1a;
  .icon {
    margin-right: 6px;
  }
}
</style>
