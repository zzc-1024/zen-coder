<template>
  <div class="field-row">
    <!-- 左侧：字段名 -->
    <span class="field-name">
      <!-- 这里是一个视觉上的小圆点，对应连线锚点的位置 -->
      <i class="anchor-indicator left" v-if="props.hasInput"></i>
      {{ props.name }}
    </span>

    <!-- 右侧：字段类型 -->
    <span class="field-type">
      {{ fieldType }}
      <i class="anchor-indicator right" v-if="props.hasOutput"></i>
    </span>
  </div>
</template>

<script setup lang="ts">
import { BUILTIN_BASIC_FLOW_TYPE, BUILTIN_BASIC_FLOW_TYPE_DISPLAY, parseType } from '@/nodes/basic/typeDifination';
import { computed } from 'vue';

const props = defineProps<{
  hasInput: boolean;
  hasOutput: boolean;
  name: string;
  type: string | 'blank';
}>();
const fieldType = computed(() => {
  if (props.type === 'blank') {
    return '未知类型';
  }
  if (props.type === BUILTIN_BASIC_FLOW_TYPE) {
    return BUILTIN_BASIC_FLOW_TYPE_DISPLAY;
  }
  // 解析类型字符串并返回显示字符串
  const parsedType = parseType(props.type);
  return parsedType.toDisplayString();
});
</script>

<style lang="scss" scoped>
.field-row {
  display: flex;
  justify-content: space-between;
  padding: 4px 10px;
  height: 24px; /* 固定高度，方便 Model 计算锚点位置 */
  align-items: center;
  position: relative;
}

/* 斑马纹效果，增加可读性 */
.field-row:nth-child(even) {
  background-color: rgba(255, 255, 255, 0.03);
}

.field-name {
  color: #a9b7c6;
  display: flex;
  align-items: center;
}

.field-type {
  color: #cc7832; /* 类似 IDE 的关键字颜色 */
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
}

/* 立即数输入框样式 */
.immediate-input-container {
  display: inline-flex;
  align-items: center;
}

.immediate-input {
  width: 80px;
  padding: 2px 4px;
  background: #1a1a1a;
  border: 1px solid #444;
  border-radius: 3px;
  color: #dcdcdc;
  font-size: 11px;
  font-family: 'Consolas', 'Monaco', monospace;
  outline: none;
  transition: border-color 0.2s;
}

.immediate-input:focus {
  border-color: #61afef;
  box-shadow: 0 0 0 1px rgba(97, 175, 239, 0.3);
}

.immediate-input::placeholder {
  color: #666;
  font-style: italic;
}

.empty-state {
  padding: 10px;
  text-align: center;
  color: #666;
  font-style: italic;
}

/* 模拟锚点的小圆点（仅视觉，实际逻辑由 LogicFlow Model 控制） */
.anchor-indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #666;
  display: inline-block;
}

.anchor-indicator.left {
  margin-right: 6px;
  /* 视觉上让它看起来在边框上 */
  margin-left: -13px;
}

.anchor-indicator.right {
  margin-left: 6px;
  /* 视觉上让它看起来在边框上 */
  margin-right: -13px;
}
</style>
