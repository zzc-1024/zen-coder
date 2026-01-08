<template>
  <div class="resource-manager">
    <!-- Title Bar -->
    <div class="list-title-bar">
      <span class="title-text">资源列表</span>
      <button class="add-button" @click="addVariablePopup.open()">➕添加</button>
    </div>

    <!-- Add New Variable Form (Fixed) -->
    <PopupDialog title="新增变量" ref="addVariablePopup" class="add-variable-form">
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
          <option value="bool">布尔值 bool</option>
          <option value="int">整数 int</option>
          <option value="float">浮点数 float</option>
          <option value="string">字符串 string</option>
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
      <!-- Variable Item -->
      <div v-for="(variable, index) in props.variables" :key="index" class="variable-item">
        <!-- Variable Info -->
        <div class="variable-header">
          <span class="variable-name">{{ variable.name }}</span>
          <span class="variable-type">{{ variable.type.toDisplayString() }}</span>
          <button
            class="delete-button"
            @click="onDeleteVariable(variable.name)"
            title="Delete Variable"
          >
            ✕
          </button>
        </div>

        <!-- Variable Nodes -->
        <div class="variable-nodes">
          <div
            class="node get-node"
            data-node-type="get-variable"
            @pointerdown="onPointerDown($event, 'get', variable.name, variable.type)"
          >
            <span class="node-label">获取</span>
          </div>
          <div
            class="node set-node"
            data-node-type="set-variable"
            @pointerdown="onPointerDown($event, 'set', variable.name, variable.type)"
          >
            <span class="node-label">设置</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { BaseType, BasicType, type DataStructureType, type Variable } from '@/parser/variable';
import PopupDialog from '../ui/PopupDialog.vue';
const props = defineProps<{
  variables: Variable[];
}>();
const emits = defineEmits<{
  onDeleteVariable: [variableName: string];
  onPointerDown: [dragType: string, variableName: string, variableType: BaseType];
  onAddVariable: [variableName: string, variableType: BaseType];
}>();

const addVariablePopup = ref();
const variableDataStructureType = ref<DataStructureType>('basic');
const newVariableType = ref('int');
const newVariableName = ref('hello');

function onDeleteVariable(variableName: string) {
  emits('onDeleteVariable', variableName);
}

function onPointerDown(
  event: PointerEvent,
  dragType: string,
  variableName: string,
  variableType: BaseType,
) {
  event.preventDefault();
  emits('onPointerDown', dragType, variableName, variableType);
}

function onAddVariable() {
  // 验证变量名是否存在
  if (props.variables.some((v) => v.name === newVariableName.value)) {
    alert('Variable name already exists!');
    return;
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
    if (newVariableType.value === 'bool') {
      type = new BasicType('builtin:basic:boolean');
    } else if (newVariableType.value === 'int') {
      type = new BasicType('builtin:basic:integer');
    } else if (newVariableType.value === 'float') {
      type = new BasicType('builtin:basic:float');
    } else if (newVariableType.value === 'string') {
      type = new BasicType('builtin:basic:string');
    } else throw new Error(`Unknown variable type: ${newVariableType.value}`);
  } else throw new Error(`Unknown data structure type: ${variableDataStructureType.value}`);

  emits('onAddVariable', newVariableName.value, type);
  newVariableName.value = '';
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
      border: none;
      padding: 4px 8px;
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
    overflow-x: hidden;
    overflow-y: auto;
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-height: 0; /* 确保flex子元素能正确处理溢出 */

    /* --- Variable Item --- */
    .variable-item {
      background-color: #333;
      border: 1px solid #555;
      border-radius: 4px;
      overflow: hidden;
      flex-shrink: 0;

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

      /* --- Variable Nodes --- */
      .variable-nodes {
        display: flex;
        padding: 8px;
        gap: 8px;
        background-color: #3a3a3a;

        .node {
          flex: 1;
          display: flex;
          align-items: center;
          padding: 6px 8px;
          background-color: #555;
          border: 1px solid #777;
          border-radius: 3px;
          cursor: grab;
          position: relative;
          min-height: 30px;
          box-sizing: border-box;
          touch-action: none;

          &:active {
            cursor: grabbing;
          }

          .node-label {
            flex-grow: 1;
            text-align: center;
            font-size: 12px;
            font-weight: 500;
          }

          &.get-node {
            background-color: #2c5a7b; /* Blue-ish for Get */
            border-color: #3d7ca8;

            .node-label {
              color: #a0d0f0;
            }
          }

          &.set-node {
            background-color: #7b5a2c; /* Orange-ish for Set */
            border-color: #a87c3d;

            .node-label {
              color: #f0d0a0;
            }
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
      flex-direction: row;
      flex-wrap: nowrap;
      overflow-x: auto;
      overflow-y: hidden;
      padding: 8px;
      gap: 8px;

      .variable-item {
        min-width: 180px;
        flex-shrink: 0;
      }
    }
  }
}
</style>
