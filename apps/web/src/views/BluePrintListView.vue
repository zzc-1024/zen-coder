<template>
  <div class="blueprint-container">
    <!-- 蓝图列表区域 -->
    <div class="blueprint-list-section">
      <h2 class="section-title">蓝图列表</h2>

      <!-- 搜索过滤器 -->
      <div class="search-filter">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索蓝图名称..."
          class="search-input"
        />
      </div>

      <!-- 蓝图卡片网格 -->
      <div class="blueprint-grid">
        <div
          v-for="blueprint in filteredBlueprints"
          :key="blueprint.id"
          class="blueprint-card"
          @click="selectBlueprint(blueprint)"
        >
          <div class="card-header">
            <h3 class="card-title">{{ blueprint.name }}</h3>
            <span class="card-type">{{ blueprint.type }}</span>
          </div>
          <div class="card-content">
            <p class="card-description">{{ blueprint.description }}</p>
            <div class="card-meta">
              <span class="meta-item">作者: {{ blueprint.authorName }}</span>
              <span class="meta-item">更新时间: {{ formatDate(blueprint.updatedAt) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页组件 -->
      <div class="pagination-container">
        <div class="page-info">
          显示 {{ startIndex }} - {{ endIndex }} / {{ totalItems }} 条记录
        </div>
        <div class="pagination-controls">
          <button
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="page-btn prev-btn"
          >
            上一页
          </button>

          <div class="page-numbers">
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="goToPage(page)"
              :class="{ active: page === currentPage }"
              class="page-number"
            >
              {{ page }}
            </button>
          </div>

          <button
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="page-btn next-btn"
          >
            下一页
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- ✅ 核心修改：组合式API <script setup> 写法 -->
<script setup lang="ts">
import { builtinBluePrintsWithPath, type BlueprintWithPath } from '@/utils/builtinBluePrints';
import { ref, computed } from 'vue';

// 1. TS 类型定义
// 定义部分代码以移动到外部

// 2. 模拟数据（不变）
const mockBlueprints: BlueprintWithPath[] = builtinBluePrintsWithPath;

// 3. 响应式变量（直接声明，无需 return）
const blueprints = ref<BlueprintWithPath[]>(mockBlueprints);
const searchQuery = ref<string>('');
const currentPage = ref<number>(1);
const itemsPerPage = ref<number>(6);

// 4. 计算属性 - 搜索过滤
const filteredList = computed(() => {
  if (!searchQuery.value) return blueprints.value;

  const query = searchQuery.value.toLowerCase();
  return blueprints.value.filter(
    (bp) =>
      bp.name.toLowerCase().includes(query) ||
      bp.description.toLowerCase().includes(query) ||
      bp.authorName.toLowerCase().includes(query),
  );
});

// 5. 分页相关计算属性
const totalItems = computed(() => filteredList.value.length);
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value));
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value + 1);
const endIndex = computed(() => Math.min(currentPage.value * itemsPerPage.value, totalItems.value));

// 6. 当前页展示的蓝图（模板直接使用）
const filteredBlueprints = computed(() => {
  const start = startIndex.value - 1;
  const end = start + itemsPerPage.value;
  return filteredList.value.slice(start, end);
});

// 7. 页码显示计算
const visiblePages = computed(() => {
  const pages = [];
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage.value - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages.value, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  return pages;
});

// 8. 方法（直接声明，模板自动可用）
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const selectBlueprint = (blueprint: BlueprintWithPath) => {
  try {
    // 直接创建下载链接，指向public目录下的文件
    const a = document.createElement('a');
    a.href = blueprint.filePath;
    a.download = `${blueprint.name}.json`;
    document.body.appendChild(a);

    // 触发下载
    a.click();

    // 清理
    setTimeout(() => {
      document.body.removeChild(a);
    }, 100);
  } catch (error) {
    console.error('Error downloading blueprint:', error);
    alert('下载蓝图失败，请重试');
  }
};

const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('zh-CN');
};
</script>

<style lang="scss" scoped>
/* 样式完全不变，直接复制即可 */
.blueprint-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 20px;
  background-color: #f5f7fa;

  .blueprint-list-section {
    flex: 1;
    margin-bottom: 20px;

    .section-title {
      font-size: 1.8rem;
      color: #2c3e50;
      margin-bottom: 20px;
      text-align: center;
    }

    .search-filter {
      display: flex;
      justify-content: center;
      margin-bottom: 30px;

      .search-input {
        width: 100%;
        max-width: 400px;
        padding: 12px 16px;
        border: 1px solid #ddd;
        border-radius: 8px;
        font-size: 1rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

        &:focus {
          outline: none;
          border-color: #3498db;
          box-shadow: 0 2px 8px rgba(52, 152, 219, 0.3);
        }
      }
    }

    .blueprint-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      margin-bottom: 30px;

      .blueprint-card {
        background: white;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        transition:
          transform 0.3s ease,
          box-shadow 0.3s ease;
        cursor: pointer;

        &:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        }

        .card-header {
          padding: 15px 20px;
          background: linear-gradient(to right, #3498db, #2c3e50);
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;

          .card-title {
            margin: 0;
            font-size: 1.2rem;
          }

          .card-type {
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 0.8rem;
            background-color: #2ecc71;
          }
        }

        .card-content {
          padding: 20px;

          .card-description {
            color: #555;
            line-height: 1.5;
            margin-bottom: 15px;
          }

          .card-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            font-size: 0.9rem;
            color: #777;

            .meta-item {
              background: #f0f0f0;
              padding: 4px 8px;
              border-radius: 4px;
            }
          }
        }
      }
    }

    .pagination-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 15px;

      .page-info {
        font-size: 0.9rem;
        color: #666;
      }

      .pagination-controls {
        display: flex;
        align-items: center;
        gap: 10px;

        .page-btn {
          padding: 8px 16px;
          border: 1px solid #ddd;
          background: white;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;

          &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          &:not(:disabled):hover {
            background: #3498db;
            color: white;
            border-color: #3498db;
          }
        }

        .page-numbers {
          display: flex;
          gap: 5px;

          .page-number {
            width: 36px;
            height: 36px;
            border: 1px solid #ddd;
            background: white;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.3s ease;

            &:hover {
              background: #3498db;
              color: white;
              border-color: #3498db;
            }

            &.active {
              background: #3498db;
              color: white;
              border-color: #3498db;
            }
          }
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .blueprint-container {
    padding: 10px;

    .blueprint-list-section {
      .section-title {
        font-size: 1.5rem;
      }

      .search-filter {
        .search-input {
          max-width: 100%;
        }
      }

      .blueprint-grid {
        grid-template-columns: 1fr;
        gap: 15px;

        .blueprint-card {
          .card-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;

            .card-title {
              font-size: 1.1rem;
            }
          }
        }
      }

      .pagination-container {
        .pagination-controls {
          flex-direction: column;

          .page-btn,
          .page-number {
            width: 100%;
          }

          .page-numbers {
            flex-wrap: wrap;
            justify-content: center;
          }
        }
      }
    }
  }
}
</style>
