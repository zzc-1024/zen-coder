<template>
  <div class="book-container">
    <div class="book-header">
      <h1>节点图鉴</h1>
    </div>

    <div class="book-content">
      <!-- 左侧卡片列表 -->
      <div class="card-list">
        <BookCard
          v-for="node in nodes"
          :key="node.type"
          :type="node.type"
          :name="node.name"
          :icon="node.iconPath"
          :selected="selectedNodeType === node.type"
          @select="handleNodeSelect"
        />
      </div>

      <!-- 右侧详细信息 -->
      <div class="detail-panel">
        <div class="detail-header">
          <h2>{{ selectedNode?.name || '请选择一个节点' }}</h2>
        </div>

        <div class="detail-preview">
          <div v-if="selectedNode" class="preview-placeholder">
            <div class="preview-icon">{{ selectedNode.iconPath }}</div>
          </div>
          <div v-else class="preview-empty">
            <p>选择一个节点查看详细信息</p>
          </div>
        </div>

        <div class="detail-description">
          <p class="banter" v-if="selectedNode?.banter">{{ selectedNode.banter }}</p>
          <p v-if="selectedNode">{{ selectedNode.description }}</p>
          <p v-else class="empty-description">
            点击左侧的节点卡片，右侧将显示该节点的详细信息，包括节点功能、使用方法等内容。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import BookCard from './ui/BookCard.vue';
import type { BasicEditorNodeConfig } from '@/nodes/basic/basicEditorConfig';

const props = defineProps<{
  nodes: BasicEditorNodeConfig[];
}>();

const selectedNodeType = ref<string>('');

const selectedNode = computed(() => {
  return props.nodes.find((node) => node.type === selectedNodeType.value);
});

const handleNodeSelect = (selectedTypeName: string) => {
  selectedNodeType.value = selectedTypeName;
};
</script>

<style scoped lang="scss">
.book-container {
  height: calc(100% - 40px);
  width: calc(100% - 40px);
  margin: 0 auto;
  padding: 20px;
}

.book-header {
  margin-bottom: 20px;
  h1 {
    font-size: 28px;
    color: #333;
    margin: 0;
  }
}

.book-content {
  display: flex;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
}

/* 左侧卡片列表 */
.card-list {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  min-height: 300px;
  padding: 8px;
  background-color: #f5f5f5;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

/* 右侧详细信息面板 */
.detail-panel {
  flex: 1;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.detail-header {
  h2 {
    font-size: 22px;
    color: #333;
    margin: 0;
  }
}

/* 预览区域 */
.detail-preview {
  height: 150px;
  border-radius: 8px;
  border: 2px dashed #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fafafa;

  .preview-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #e8f5e9;
    border-radius: 6px;

    .preview-icon {
      font-size: 48px;
    }
  }

  .preview-empty {
    color: #999;
    p {
      margin: 0;
    }
  }
}

/* 小屏幕优化 */
@media (max-width: 768px) {
  .book-content {
    gap: 12px;
  }

  .detail-panel {
    padding: 12px;
    gap: 12px;
  }

  .detail-preview {
    height: 100px;
  }

  .detail-header h2 {
    font-size: 18px;
  }

  .preview-icon {
    font-size: 36px !important;
  }
}

/* 描述区域 */
.detail-description {
  flex: 1;

  p {
    color: #555;
    line-height: 1.6;
    margin: 0;
  }

  .banter {
    color: #ff6600;
    font-weight: bold;
    margin-bottom: 8px;
  }

  .empty-description {
    color: #999;
    font-style: italic;
  }
}
</style>
