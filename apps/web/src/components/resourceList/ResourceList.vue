<template>
  <div class="resource-manager">
    <!-- Title Bar -->
    <div class="list-title-bar">
      <span class="title-text">资源列表</span>
      <button class="add-button" @click="addVariablePopup.open()">➕变量</button>
      <button class="add-button" @click="functionsDialog.open()">➕函数</button>
    </div>

    <!-- Add New Variable Form (Fixed) -->
    <PopupDialog title="新增变量" ref="addVariablePopup" class="add-variable-form">
      <div class="horizontal-group">
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
          <option value="list">列表 list</option>
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
      <div class="horizontal-group">
        变量名称
        <input
          v-model="newVariableName"
          type="text"
          placeholder="新增变量的名称"
          class="variable-input"
          @keyup.enter="onAddVariable"
        />
        <button class="add-button" @click="onAddVariable" :disabled="!newVariableName.trim()">
          ➕
        </button>
      </div>
    </PopupDialog>

    <!-- List Body -->
    <div class="list-body">
      <!-- 参数 -->
      <div
        v-for="(variable, index) in props.parameters"
        :key="index"
        class="variable-item parameter-item"
        @click="onVariableClick(variable, 'parameter')"
      >
        <div class="variable-header">
          <span class="variable-name">参数{{ variable.name }}</span>
          <span class="variable-type">{{ variable.type.toDisplayString() }}</span>
        </div>
      </div>

      <!-- 局部变量 -->
      <div
        v-for="(variable, index) in props.localVariables"
        :key="index"
        class="variable-item local-variable-item"
        @click="onVariableClick(variable, 'local')"
      >
        <div class="variable-header">
          <span class="variable-name">局部{{ variable.name }}</span>
          <span class="variable-type">{{ variable.type.toDisplayString() }}</span>
          <button
            class="delete-button"
            @click.stop="onDeleteVariable(variable.name)"
            title="Delete Variable"
          >
            ✕
          </button>
        </div>
      </div>

      <!-- 全局变量 -->
      <div
        v-for="(variable, index) in props.globalVariables"
        :key="index"
        class="variable-item global-variable-item"
        @click="onVariableClick(variable, 'global')"
      >
        <div class="variable-header">
          <span class="variable-name">全局{{ variable.name }}</span>
          <span class="variable-type">{{ variable.type.toDisplayString() }}</span>
          <button
            class="delete-button"
            @click.stop="onDeleteVariable(variable.name)"
            title="Delete Variable"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  </div>

  <PopupDialog title="按住节点拖拽使用" ref="functionsDialog">
    <div class="functions-container">
      <!-- Source Level -->
      <div
        v-for="(modules, source) in props.availableFunctions"
        :key="source"
        class="function-source"
      >
        <div class="source-header">{{ source }}</div>
        <!-- Module Level -->
        <div class="modules-container">
          <div v-for="(functions, module) in modules" :key="module" class="function-module">
            <div class="module-header">{{ module }}</div>
            <!-- Function Level -->
            <div class="functions-list">
              <div
                v-for="(functionInfo, functionName) in functions"
                :key="functionName"
                class="function-node"
                @pointerdown="onFunctionPointerDown($event, source, module, functionName)"
              >
                <span class="function-name">{{ functionName }}</span>
                <span class="function-return-type">{{
                  functionInfo.returnType?.toDisplayString() || 'void'
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </PopupDialog>

  <!-- 变量节点选择对话框 -->
  <PopupDialog title="选择节点" ref="variableNodesDialog">
    <div v-if="selectedVariable" class="variable-nodes-container">
      <div class="variable-info">
        <div class="variable-name">{{ selectedVariable.name }}</div>
        <div class="variable-type">{{ selectedVariable.type.toDisplayString() }}</div>
      </div>
      <div class="variable-nodes-list">
        <!-- 展示可用的节点 -->
        <div
          v-for="[indexs, type] in getTypeIndexsWithType(selectedVariable.type)"
          :key="type.toString()"
          class="node set-node"
          @pointerdown="
            onNodePointerDown(
              $event,
              'set',
              selectedVariableScopeType,
              selectedVariable.name,
              type,
              indexs,
            )
          "
        >
          <span class="node-label">设置 {{ type.toDisplayString() }}</span>
        </div>
        <div
          class="node get-node"
          @pointerdown="
            onNodePointerDown(
              $event,
              'get',
              selectedVariableScopeType,
              selectedVariable.name,
              selectedVariable.type,
              [],
            )
          "
        >
          <span class="node-label">获取 {{ selectedVariable.type.toDisplayString() }}</span>
        </div>
      </div>
    </div>
  </PopupDialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  BaseType,
  BasicType,
  DictType,
  ListType,
  type BasicTypeName,
  type DataStructureType,
  type Variable,
  type VariableScopeType,
} from '@/parser/variable';
import PopupDialog from '../ui/PopupDialog.vue';
import type { AvailableFunctions } from '@/functions/typeDefination';
const props = defineProps<{
  parameters: Variable[];
  localVariables: Variable[];
  globalVariables: Variable[];
  availableFunctions: AvailableFunctions;
}>();
const emits = defineEmits<{
  onDeleteVariable: [scopeType: VariableScopeType, variableName: string];
  onPointerDown: [
    dragType: string,
    scopeType: VariableScopeType,
    variableName: string,
    variableType: BaseType,
    indexs: BasicTypeName[],
  ];
  onAddVariable: [scopeType: VariableScopeType, variableName: string, variableType: BaseType];
  onFunctionPointerDown: [source: string, module: string, functionName: string];
}>();

const addVariablePopup = ref();
const functionsDialog = ref();
const variableNodesDialog = ref();

// 当前选中的变量和范围类型
const selectedVariable = ref<Variable | null>(null);
const selectedVariableScopeType = ref<VariableScopeType | 'parameter'>('local');
const variableScopeType = ref<VariableScopeType>('local');
const variableDataStructureType = ref<DataStructureType>('basic');
const newVariableType = ref<BasicTypeName>('builtin:basic:integer');
const newVariableName = ref<string>('hello');

function onDeleteVariable(variableName: string) {
  emits('onDeleteVariable', variableScopeType.value, variableName);
}

// 处理变量点击事件
function onVariableClick(variable: Variable, scopeType: VariableScopeType | 'parameter') {
  selectedVariable.value = variable;
  selectedVariableScopeType.value = scopeType;
  variableNodesDialog.value.open();
}

// onPointerDown函数已被onNodePointerDown函数替代

function onAddVariable() {
  // 验证变量名是否存在
  if (variableScopeType.value === 'global') {
    if (props.globalVariables.some((v) => v.name === newVariableName.value)) {
      alert('Variable name already exists!');
      return;
    }
  } else if (variableScopeType.value === 'local') {
    if (props.localVariables.some((v) => v.name === newVariableName.value)) {
      alert('Variable name already exists!');
      return;
    }
    if (props.parameters.some((v) => v.name === newVariableName.value)) {
      alert('该变量已存在于参数列表中');
      return;
    }
  }
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
  } else if (variableDataStructureType.value === 'list') {
    type = new ListType(new BasicType(newVariableType.value));
  } else throw new Error(`Unknown data structure type: ${variableDataStructureType.value}`);

  emits('onAddVariable', variableScopeType.value, newVariableName.value, type);
  newVariableName.value = '';
}

function onFunctionPointerDown(
  event: PointerEvent,
  source: string,
  module: string,
  functionName: string,
) {
  event.preventDefault();
  functionsDialog.value.close();
  emits('onFunctionPointerDown', source, module, functionName);
}

// 处理节点拖拽事件
function getTypeIndexsWithType(variableType: BaseType): [BasicTypeName[], BaseType][] {
  const res: [BasicTypeName[], BaseType][] = [];
  const calculateIndexs: BasicTypeName[] = [];
  res.push([[...calculateIndexs], variableType]);
  while (!(variableType instanceof BasicType)) {
    if (variableType instanceof ListType) {
      calculateIndexs.push('builtin:basic:integer');
      res.push([[...calculateIndexs], variableType.itemType]);
      variableType = variableType.itemType;
    } else if (variableType instanceof DictType) {
      calculateIndexs.push(variableType.keyType.toString() as BasicTypeName);
      res.push([[...calculateIndexs], variableType.valueType]);
      variableType = variableType.valueType;
    }
  }
  return res;
}

function onNodePointerDown(
  event: PointerEvent,
  dragType: string,
  scopeType: VariableScopeType | 'parameter',
  variableName: string,
  variableType: BaseType,
  indexs: BasicTypeName[],
) {
  event.preventDefault();
  variableNodesDialog.value.close();
  if (scopeType === 'parameter') scopeType = 'local';
  emits(
    'onPointerDown',
    dragType,
    scopeType as VariableScopeType,
    variableName,
    variableType,
    indexs,
  );
}
</script>

<style scoped lang="scss">
.resource-manager {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 250px;
  min-width: 200px; /* 最小宽度限制 */
  background-color: #2a2a2a; /* Dark background */
  color: #e0e0e0; /* Light text */
  font-family: 'Roboto Mono', monospace;
  border-radius: 4px;
  overflow: hidden;
  user-select: none; /* Prevent text selection */

  .list-title-bar {
    background-color: #1a1a1a; /* Slightly darker title bar */
    padding: 8px 12px;
    border-bottom: 1px solid #444;

    .title-text {
      font-size: 14px;
      font-weight: bold;
      color: #b0b0b0;
    }

    .add-button {
      font-size: 14px;
      color: #b0b0b0;
      cursor: pointer;
      background: none;
      border: 1px solid #b0b0b0;
      padding: 4px;
      border-radius: 4px;

      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }
    }
  }

  .add-variable-form {
    display: flex;
    flex-direction: column;
    gap: 12px;
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

    .add-button {
      align-self: flex-end;
      padding: 8px 16px;
      background-color: #4299e1;
      color: #fff;
      border: 1px solid #4299e1;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;

      &:hover:not(:disabled) {
        background-color: #3182ce;
        border-color: #3182ce;
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
  }

  .list-body {
    flex: 1;
    overflow-x: auto;
    overflow-y: auto;
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-height: 0; /* 确保flex子元素能正确处理溢出 */
    scrollbar-width: thin;
    scrollbar-color: #444 #222;

    /* --- Variable Item --- */
    .variable-item {
      background-color: #333;
      border: 1px solid #555;
      border-radius: 4px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      width: 180px;
      min-width: 180px;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        border-color: #00aaff;
        box-shadow: 0 0 8px rgba(0, 170, 255, 0.3);
      }

      &.parameter-item {
        .variable-header {
          background: linear-gradient(to right, #502c35, #740312);
        }
      }
      &.global-variable-item {
        .variable-header {
          background: linear-gradient(to right, #48502c, #325702);
        }
      }
      &.local-variable-item {
        .variable-header {
          background: linear-gradient(to right, #2c3e50, #03056e);
        }
      }

      .variable-header {
        display: flex;
        align-items: center;
        padding: 6px 8px;
        background-color: #444;
        position: relative;

        .variable-name {
          flex-grow: 1;
          font-weight: bold;
          font-size: 13px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .variable-type {
          font-size: 11px;
          color: #aaa;
          background-color: #555;
          padding: 2px 6px;
          border-radius: 3px;
          margin-right: 24px; /* Space for delete button */
        }

        .delete-button {
          position: absolute;
          right: 6px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: 1px solid transparent;
          color: #999;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          padding: 0;

          &:hover {
            background-color: #e57373;
            color: #fff;
            border-color: #e57373;
          }
        }
      }
    }
  }

  /* 响应式布局：当屏幕宽度小于 768px ResourceList 改为横向展示 */
  @media (max-width: 768px) {
    width: 100%;
    height: 202px;
    min-height: 150px;
    max-height: 200px;

    .add-variable-form {
      min-width: 300px;
      flex-shrink: 0;
      flex-direction: column;
      flex-wrap: nowrap;

      .horizontal-group {
        flex-wrap: wrap;
        .variable-input {
          flex: 1;
          min-width: 140px;
          padding: 10px 12px;
          background-color: #fff;
          border: 1px solid #ddd;
          border-radius: 4px;
          color: #333;
          font-family: inherit;
          font-size: 14px;
        }

        .type-selector {
          min-width: 100px;
          padding: 10px 12px;
          background-color: #fff;
          border: 1px solid #ddd;
          border-radius: 4px;
          color: #333;
          font-family: inherit;
          font-size: 14px;
        }
      }

      .add-button {
        padding: 8px 16px;
        background-color: #4299e1;
        color: #fff;
        border: 1px solid #4299e1;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
      }
    }

    .list-body {
      height: 100%;
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      overflow-x: auto;
      overflow-y: auto;
      padding: 8px;
      gap: 8px;

      .variable-item {
        min-width: 180px;
        flex-shrink: 0;
      }
    }
  }
}

/* 变量节点选择对话框样式 */
.variable-nodes-container {
  padding: 8px;
}

.variable-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 12px;
  background-color: #1a1a1a;
  border-radius: 4px;
  border: 1px solid #444;
}

.variable-nodes-list {
  display: flex;
  gap: 12px;
  padding: 8px;
  background-color: #3a3a3a;
  border-radius: 4px;
}

.variable-nodes-list .node {
  flex: 1;
  min-width: 100px;
  display: flex;
  align-items: center;
  padding: 12px 8px;
  background-color: #555;
  border: 1px solid #777;
  border-radius: 4px;
  cursor: grab;
  position: relative;
  justify-content: center;
  box-sizing: border-box;
  touch-action: none;

  &:active {
    cursor: grabbing;
  }

  .node-label {
    font-size: 14px;
    font-weight: bold;
    color: #ffffff;
  }

  &.get-node {
    background-color: #2c5a7b;
    border-color: #3d7ca8;

    .node-label {
      color: #a0d0f0;
    }
  }

  &.set-node {
    background-color: #7b5a2c;
    border-color: #a87c3d;

    .node-label {
      color: #f0d0a0;
    }
  }
}

/* 函数列表预览样式 */
.functions-container {
  max-height: 400px;
  overflow-y: auto;
  padding: 8px;
}

.function-source {
  margin-bottom: 16px;
  border: 1px solid #444;
  border-radius: 4px;
  overflow: hidden;
}

.source-header {
  background-color: #1a1a1a;
  padding: 8px 12px;
  font-weight: bold;
  color: #b0b0b0;
  border-bottom: 1px solid #444;
}

.modules-container {
  padding: 8px;
}

.function-module {
  margin-bottom: 12px;
  border-left: 2px solid #444;
  padding-left: 8px;
}

.module-header {
  font-size: 14px;
  font-weight: bold;
  color: #808080;
  margin-bottom: 8px;
  padding: 4px 8px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 2px;
}

.functions-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 4px;
}

.function-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 120px;
  padding: 12px 8px;
  background-color: #333;
  border: 1px solid #555;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
  touch-action: none;
}

.function-node:hover {
  background-color: #444;
  border-color: #00aaff;
  box-shadow: 0 0 8px rgba(0, 170, 255, 0.3);
}

.function-node:active {
  cursor: grabbing;
}

.function-name {
  font-size: 14px;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 4px;
}

.function-return-type {
  font-size: 12px;
  color: #808080;
}

/* 滚动条样式 */
.functions-container {
  scrollbar-width: thin;
  scrollbar-color: #444 #222;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #222;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #444;
    border-radius: 3px;
    border: none;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #555;
  }
}
</style>
