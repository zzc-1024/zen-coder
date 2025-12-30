<template>
  <div class="attribute-panel">
    <!-- Title Bar -->
    <div class="list-title-bar">
      <span class="title-text">属性面板</span>
    </div>

    <!-- Panel Body -->
    <div class="panel-body" v-if="selectedElement">
      <!-- Basic Info -->
      <div class="attribute-group">
        <div class="group-header">
          <span class="group-title">基本信息</span>
        </div>

        <div class="attribute-item">
          <label class="attribute-label">ID</label>
          <input type="text" class="attribute-input" :value="selectedElement.id" disabled />
        </div>

        <div class="attribute-item">
          <label class="attribute-label">标题</label>
          <input
            type="text"
            class="attribute-input"
            :value="selectedElement.properties.title || ''"
            disabled
          />
        </div>

        <div class="attribute-item">
          <button class="delete-node-btn" @click="deleteNode">删除</button>
        </div>
      </div>

      <!-- Anchor Points -->
      <div class="attribute-group">
        <div class="group-header">
          <span class="group-title">锚点配置</span>
        </div>

        <div v-for="(field, index) in fields" :key="index" class="attribute-item">
          <!-- 左侧锚点 -->
          <!-- Anchor Header -->
          <div class="anchor-header" v-if="field.inputId">
            <div class="anchor-info">
              <label class="attribute-label">{{ field.name || `左侧锚点 ${index + 1}` }}</label>
              <span class="anchor-type input"> 输入 </span>
            </div>
            <span class="anchor-data-type">{{ field.type.toDisplayString() }}</span>
          </div>

          <!-- Default Value Input (Only for BasicType Input Anchors) -->
          <div class="default-value-input" v-if="field.inputId && field.type instanceof BasicType">
            <label class="attribute-label">默认值</label>
            <input
              v-if="
                field.type.basicTypeName === 'builtin:basic:integer' ||
                field.type.basicTypeName === 'builtin:basic:float'
              "
              type="number"
              class="attribute-input"
              :value="defaultValues[field.inputId] || '0'"
              @input="updateDefaultValue(field.inputId!, $event)"
            />
            <input
              v-else-if="field.type.basicTypeName === 'builtin:basic:string'"
              type="text"
              class="attribute-input"
              :value="defaultValues[field.inputId] || ''"
              @input="updateDefaultValue(field.inputId!, $event)"
            />
            <select
              v-else-if="field.type.basicTypeName === 'builtin:basic:boolean'"
              class="attribute-input"
              :value="defaultValues[field.inputId] || 'false'"
              @change="updateDefaultValue(field.inputId!, $event)"
            >
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </div>

          <!-- Suggested Nodes -->
          <div class="suggested-nodes" v-if="field.inputId">
            <div
              v-for="(node, index) in recommendationFunctions(field.type, 'in')"
              :key="index"
              class="drag-node"
              draggable="true"
              @pointerdown="handleDragStart($event, node)"
            >
              <span class="node-label">{{ node.label }}</span>
            </div>
          </div>

          <!-- 右侧锚点 -->
          <!-- Anchor Header -->
          <div class="anchor-header" v-if="field.outputId">
            <div class="anchor-info">
              <label class="attribute-label">{{ field.name || `右侧锚点 ${index + 1}` }}</label>
              <span class="anchor-type output"> 输出 </span>
            </div>
            <span class="anchor-data-type">{{ field.type.toDisplayString() }}</span>
          </div>

          <!-- Suggested Nodes -->
          <div class="suggested-nodes" v-if="field.outputId">
            <div
              v-for="(node, index) in recommendationFunctions(field.type, 'out')"
              :key="index"
              class="drag-node"
              draggable="true"
              @pointerdown="handleDragStart($event, node)"
            >
              <span class="node-label">{{ node.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RecommendationFunction } from '@/nodes/basic/basicEditorConfig';
import type BasicNodeModel from '@/nodes/basic/basicNodeModel';
import LogicFlow from '@logicflow/core';
import { computed } from 'vue';
import { BasicType } from '@/nodes/basic/typeDifination';
import type { BasicNodePropertiesWithDefaultValues, DefaultValueMap } from '@/nodes/basic/basicNodeModel';

const props = defineProps<{
  lf: LogicFlow | null;
  selectedElements: LogicFlow.GraphData;
  recommendationFunctions: RecommendationFunction;
}>();

const selectedElement = computed(() => {
  if (props.selectedElements.nodes.length !== 1) {
    return null;
  }
  const node = props.selectedElements.nodes[0];
  return props.lf?.getNodeModelById(node!.id) as BasicNodeModel;
});

const defaultValues = computed(() => {
  if (!selectedElement.value) return {};
  const properties = selectedElement.value.properties;
  // 提高容错性，防止没有这个字段
  if (!properties.defaultValues) {
    properties.defaultValues = {} as DefaultValueMap;
    selectedElement.value.setProperties({
      ...selectedElement.value.getProperties(),
      defaultValues: properties.defaultValues,
    });
  }
  return properties.defaultValues as DefaultValueMap;
});

const fields = computed(() => {
  if (!selectedElement.value) return [];
  return selectedElement.value.getFields();
});

function deleteNode() {
  if (!selectedElement.value) return;
  props.lf?.deleteNode(selectedElement.value.id);
}

function handleDragStart(e: PointerEvent, node: LogicFlow.OnDragNodeConfig) {
  e.preventDefault();
  props.lf?.dnd.startDrag(node);
}

function updateDefaultValue(inputId: string, event: Event) {
  if (!selectedElement.value) return;

  const target = event.target as HTMLInputElement | HTMLSelectElement;
  const properties = selectedElement.value.properties as BasicNodePropertiesWithDefaultValues;

  // 确保默认值映射表存在
  if (!properties.defaultValues) {
    throw new Error('默认值映射表未定义');
  }

  // 获取对应的字段类型
  const field = fields.value.find((f) => f.inputId === inputId);
  if (!field || !(field.type instanceof BasicType)) {
    return;
  }

  let value: number | string | boolean;

  // 根据字段类型解析输入值
  if (field.type.basicTypeName === 'builtin:basic:integer') {
    value = parseInt(target.value, 10);
  } else if (field.type.basicTypeName === 'builtin:basic:float') {
    value = parseFloat(target.value);
  } else if (field.type.basicTypeName === 'builtin:basic:string') {
    value = target.value;
  } else if (field.type.basicTypeName === 'builtin:basic:boolean') {
    value = target.value === 'true';
  } else {
    return; // 其他类型不处理
  }

  // 更新默认值映射表
  properties.defaultValues[inputId] = value;

  // 更新字段类型的默认值
  selectedElement.value.setProperties({
    ...selectedElement.value.getProperties(),
    defaultValues: properties.defaultValues,
  });
}
</script>

<style scoped lang="scss">
.attribute-panel {
  width: 280px;
  min-width: 250px;
  height: 100%;
  background-color: #f5f5f5;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  /* 响应式布局：当屏幕宽度小于 768px 时，AttributePanel 改为横向展示 */
  @media (max-width: 768px) {
    width: 100%;
    height: auto;
    min-height: 150px;
    max-height: 250px;
    border-right: none;
    border-top: 1px solid #e0e0e0;

    .panel-body {
      display: flex;
      flex-direction: row;
      overflow-x: auto;
      overflow-y: auto;
      padding: 10px;
      min-height: 150px;
      max-height: 300px;

      .attribute-group {
        flex: 0 0 auto;
        width: 300px;
        margin-right: 10px;

        .attribute-item {
          flex-shrink: 0;

          .suggested-nodes {
            flex-wrap: nowrap;
            overflow-x: auto;

            .drag-node {
              flex: 0 0 auto;
              min-width: 80px;
            }
          }
        }
      }
    }
  }

  .list-title-bar {
    height: 40px;
    background-color: #fff;
    border-bottom: 1px solid #e0e0e0;
    display: flex;
    align-items: center;
    padding: 0 15px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

    .title-text {
      font-size: 14px;
      font-weight: 600;
      color: #333;
    }
  }

  .panel-body {
    flex: 1;
    overflow-y: auto;
    padding: 15px;

    .attribute-group {
      background-color: #fff;
      border-radius: 4px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      margin-bottom: 15px;
      overflow: hidden;
      overflow-y: auto;

      .group-header {
        padding: 12px 15px;
        background-color: #fafafa;
        border-bottom: 1px solid #e0e0e0;

        .group-title {
          font-size: 13px;
          font-weight: 600;
          color: #666;
        }
      }

      .attribute-item {
        padding: 12px 15px;
        border-bottom: 1px solid #f0f0f0;

        &:last-child {
          border-bottom: none;
        }

        .attribute-label {
          display: block;
          font-size: 12px;
          font-weight: 500;
          color: #666;
          margin-bottom: 6px;
        }

        .attribute-input {
          width: 100%;
          padding: 8px 10px;
          border: 1px solid #e0e0e0;
          border-radius: 3px;
          font-size: 13px;
          color: #333;
          background-color: #fff;
          transition: border-color 0.2s ease;

          &:focus {
            outline: none;
            border-color: #00b4d8;
            box-shadow: 0 0 0 2px rgba(0, 180, 216, 0.1);
          }

          &:disabled {
            background-color: #f9f9f9;
            color: #999;
            cursor: not-allowed;
          }
        }

        .delete-node-btn {
          padding: 4px 8px;
          background-color: #ff4d4f;
          color: #fff;
          border: none;
          border-radius: 3px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease;

          &:hover {
            background-color: #e63946;
          }
        }

        /* Anchor Header */
        .anchor-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;

          .anchor-info {
            display: flex;
            flex-direction: column;
            gap: 2px;
          }

          .anchor-type {
            font-size: 11px;
            padding: 2px 6px;
            border-radius: 3px;
            font-weight: 500;

            &.input {
              background-color: #e3f2fd;
              color: #1976d2;
            }

            &.output {
              background-color: #e8f5e9;
              color: #388e3c;
            }
          }

          .anchor-data-type {
            font-size: 11px;
            color: #888;
            background: #f0f0f0;
            padding: 2px 6px;
            border-radius: 3px;
            align-self: flex-start;
          }
        }

        /* Suggested Nodes */
        .suggested-nodes {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 6px;

          .drag-node {
            flex: 1;
            min-width: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 6px 8px;
            background-color: #555;
            border: 1px solid #777;
            border-radius: 3px;
            cursor: grab;
            color: #eee;
            font-size: 12px;
            font-weight: 500;
            user-select: none;
            transition: box-shadow 0.2s;
            touch-action: none;

            &:hover {
              box-shadow: 0 0 0 1px rgba(0, 180, 216, 0.5);
            }

            &:active {
              cursor: grabbing;
            }
          }
        }
      }
    }
  }
}
</style>
