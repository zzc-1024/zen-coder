<template>
  <div class="horizontal-group" v-if="props.needVariableScopeType">
    作用范围
    <select v-model="variableScopeType" class="type-selector">
      <option value="local">当前蓝图（局部）</option>
      <option value="global">当前文件（全局）</option>
    </select>
  </div>
  <div class="horizontal-group">
    数据结构
    <select v-model="variableDataStructureType" class="type-selector">
      <option value="basic">普通</option>
      <!-- <option value="list">列表 list</option> -->
      <!-- <option value="dict">映射 dict</option> -->
      <!-- <option value="set">集合 set</option> -->
    </select>
  </div>
  <div class="horizontal-group">
    变量类型
    <select v-model="newVariableType" class="type-selector">
      <option value="builtin:basic:boolean">布尔值 bool</option>
      <option value="builtin:basic:integer">整数 int</option>
      <option value="builtin:basic:float">浮点数 float</option>
      <option value="builtin:basic:string">字符串 string</option>
    </select>
  </div>
  <div class="horizontal-group" v-if="props.needVariableName">
    变量名称
    <input
      v-model="newVariableName"
      type="text"
      placeholder="新增变量的名称"
      class="variable-input"
      @keyup.enter="onAddVariable"
    />
    <button
      class="add-button"
      @click="onAddVariable"
      :disabled="newVariableName.trim().length === 0"
    >
      ➕
    </button>
  </div>
</template>

<script setup lang="ts">
import {
  BasicType,
  type BaseType,
  type BasicTypeName,
  type DataStructureType,
  type VariableScopeType,
} from '@/parser/variable';
import { ref } from 'vue';

const props = defineProps<{
  needVariableScopeType: boolean;
  needVariableName: boolean;
}>();
const emits = defineEmits<{
  onAddVariable: [scopeType: VariableScopeType, variableName: string, variableType: BaseType];
}>();
const variableScopeType = ref<VariableScopeType>('local');
const variableDataStructureType = ref<DataStructureType>('basic');
const newVariableType = ref<BasicTypeName>('builtin:basic:integer');
const newVariableName = ref<string>('hello');
const onAddVariable = () => {
  // 验证变量名是否合法，并且长度在1到32之间
  if (!/^[a-zA-Z_][a-zA-Z0-9_]{0,31}$/.test(newVariableName.value)) {
    alert(
      'Variable name must start with a letter and contain only letters, numbers, and underscores, and must be between 1 and 32 characters long!',
    );
    return;
  }

  let type: BaseType;
  if (variableDataStructureType.value === 'basic') {
    type = new BasicType(newVariableType.value);
  } else throw new Error(`Unknown data structure type: ${variableDataStructureType.value}`);
  emits('onAddVariable', variableScopeType.value, newVariableName.value, type);
  newVariableName.value = '';
};
</script>

<style scoped lang="scss">
.horizontal-group {
  display: flex;
  gap: 12px;
  align-items: center;
  .variable-input,
  .type-selector {
    padding: 10px 12px;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 4px;
    color: #333;
    font-family: inherit;
    font-size: 14px;

    &::placeholder {
      color: #999;
    }

    &:focus {
      outline: none;
      border-color: #4299e1;
      box-shadow: 0 0 0 2px rgba(66, 153, 225, 0.2);
    }
  }
}
</style>
