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
          :key="node.id"
          :id="node.id"
          :name="node.name"
          :icon="node.icon"
          :selected="selectedNodeId === node.id"
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
            <div class="preview-icon">{{ selectedNode.icon }}</div>
          </div>
          <div v-else class="preview-empty">
            <p>选择一个节点查看详细信息</p>
            1lI
          </div>
        </div>

        <div class="detail-description">
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

interface Node {
  id: string;
  name: string;
  icon: string;
  description: string;
}

// 示例节点数据
const nodes = ref<Node[]>([
  {
    id: 'node-1',
    name: '整数节点',
    icon: '/nodeIcon/Entry.png',
    description:
      '整数节点用于处理整数类型的数据，可以进行加减乘除等数学运算，支持默认值设置和范围限制。',
  },
  {
    id: 'node-2',
    name: '字符串节点',
    icon: '/nodeIcon/StringNode.png',
    description:
      '字符串节点用于处理文本数据，支持字符串拼接、截取、替换等操作，可设置默认文本内容。',
  },
  {
    id: 'node-3',
    name: '布尔节点',
    icon: '/nodeIcon/BooleanNode.png',
    description: '布尔节点用于处理逻辑值，支持true/false两种状态，常用于条件判断和开关控制。',
  },
  {
    id: 'node-4',
    name: '列表节点',
    icon: '/nodeIcon/ListNode.png',
    description: '列表节点用于存储多个数据元素，支持添加、删除、排序等操作，可包含不同类型的数据。',
  },
  {
    id: 'node-5',
    name: '字典节点',
    icon: '/nodeIcon/DictNode.png',
    description: '字典节点用于存储键值对数据，支持通过键快速查找值，适合表示复杂的数据结构。',
  },
  {
    id: 'node-6',
    name: '浮点数节点',
    icon: '/nodeIcon/FloatNode.png',
    description: '浮点数节点用于处理小数类型的数据，支持高精度计算，适用于科学计算和数据分析场景。',
  },
  {
    id: 'node-7',
    name: '日期节点',
    icon: '/nodeIcon/DateNode.png',
    description: '日期节点用于处理时间和日期数据，支持日期格式化、比较和计算等功能。',
  },
  {
    id: 'node-8',
    name: '文件节点',
    icon: '/nodeIcon/FileNode.png',
    description: '文件节点用于处理文件操作，支持文件读取、写入和上传下载等功能。',
  },
]);

const selectedNodeId = ref<string>('');

const selectedNode = computed(() => {
  return nodes.value.find((node) => node.id === selectedNodeId.value);
});

const handleNodeSelect = (id: string) => {
  selectedNodeId.value = id;
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

  .empty-description {
    color: #999;
    font-style: italic;
  }
}
</style>
