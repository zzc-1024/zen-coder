<template>
  <div class="toolbar">
    <!-- 文件操作 -->
    <button class="toolbar-btn" title="保存" @click="handleSave">
      <i class="icon save-icon"></i>
    </button>
    <button class="toolbar-btn" title="导入" @click="handleImport">
      <i class="icon import-icon"></i>
    </button>

    <!-- 分割线 -->
    <div class="divider"></div>

    <!-- 编辑操作 -->
    <button class="toolbar-btn" :disabled="!canUndo" title="撤回" @click="handleUndo">
      <i class="icon undo-icon"></i>
    </button>
    <button class="toolbar-btn" :disabled="!canRedo" title="重做" @click="handleRedo">
      <i class="icon redo-icon"></i>
    </button>

    <!-- 分割线 -->
    <div class="divider"></div>

    <!-- 执行操作 -->
    <button class="toolbar-btn" title="执行流程(未实现)" @click="handleExecute">
      <i class="icon execute-icon"></i>
    </button>

    <!-- 分割线 -->
    <div class="divider"></div>

    <!-- 导出代码 -->
    <div class="export-language-selector">
      <select v-model="selectedLanguage" @change="handleLanguageChange" class="language-select">
        <option value="python">Python</option>
      </select>
      <button class="toolbar-btn" title="导出代码" @click="handleGenerate">
        <i class="icon generate-icon"></i>
      </button>
    </div>

    <!-- 分割线 -->
    <div class="divider"></div>

    <!-- 路由跳转 -->
    <button class="toolbar-btn" title="回到首页" @click="gotoHome">
      <i class="icon home-icon"></i>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { ToolBarConfig } from './toolBar';
const props = defineProps<{
  config: ToolBarConfig | null;
}>();

const canUndo = ref(true);
const canRedo = ref(true);
const selectedLanguage = ref('python'); // 默认导出语言为Python

const handleSave = () => props.config?.onSave?.();
const handleImport = () => props.config?.onImport?.();
const handleUndo = () => canUndo.value && props.config?.onUndo?.();
const handleRedo = () => canRedo.value && props.config?.onRedo?.();
const handleExecute = () => props.config?.onExecute?.();
const handleGenerate = () => props.config?.onGenerate?.(selectedLanguage.value);
const handleLanguageChange = () => props.config?.onLanguageChange?.(selectedLanguage.value);
const gotoHome = () => props.config?.onGotoHome?.();
</script>

<style lang="scss" scoped>
.toolbar {
  display: flex;
  align-items: center;
  padding: 6px;
  background-color: #1e1e1e; /* UE5 蓝图深灰 */
  border-bottom: 1px solid #333;
  height: 36px;

  .toolbar-btn {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin: 0 2px;
    padding: 0;
    transition:
      background-color 0.15s ease,
      box-shadow 0.15s ease;

    &:hover:not(:disabled) {
      background-color: rgba(90, 90, 90, 0.4);
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
    }

    &:active:not(:disabled) {
      background-color: rgba(120, 120, 120, 0.5);
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .icon {
      width: 18px;
      height: 18px;
      background-size: contain;
      background-repeat: no-repeat;
    }
  }

  .divider {
    width: 1px;
    height: 18px;
    background-color: #444;
    margin: 0 6px;
  }

  .export-language-selector {
    display: flex;
    align-items: center;
    margin: 0 2px;

    .language-select {
      height: 28px;
      background-color: #333;
      color: #ddd;
      border: 1px solid #555;
      border-radius: 4px 0 0 4px;
      padding: 0 8px;
      font-size: 12px;
      cursor: pointer;
      outline: none;
      transition: border-color 0.15s ease;

      &:hover {
        border-color: #777;
      }

      &:focus {
        border-color: #007acc;
        box-shadow: 0 0 0 2px rgba(0, 122, 204, 0.2);
      }

      option {
        background-color: #333;
        color: #ddd;
      }
    }

    .toolbar-btn {
      border-radius: 0 4px 4px 0;
      margin: 0;
    }
  }
}

/* 所有图标统一为浅灰色，悬停时可考虑变亮（此处保持一致） */
.icon.save-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ddd'%3E%3Cpath d='M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z'/%3E%3C/svg%3E");
}

.icon.import-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ddd'%3E%3Cpath d='M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z'/%3E%3C/svg%3E");
}

.icon.undo-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ddd'%3E%3Cpath d='M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z'/%3E%3C/svg%3E");
}

.icon.redo-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ddd'%3E%3Cpath d='M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z'/%3E%3C/svg%3E");
}

.icon.execute-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1024 1024' version='1.1'%3E%3Cpath d='M512 0C229.216 0 0 229.216 0 512s229.216 512 512 512 512-229.216 512-512S794.784 0 512 0z m0 955.744C266.944 955.744 68.256 757.088 68.256 512S266.912 68.256 512 68.256c245.056 0 443.744 198.656 443.744 443.744-0.32 244.928-198.784 443.424-443.712 443.744H512zM398.208 294.4a21.056 21.056 0 0 0-31.584 18.208v398.496a21.056 21.056 0 0 0 31.68 18.144l-0.096 0.064 345.6-199.104a21.12 21.12 0 0 0 0.096-36.352l-0.096-0.064z m36.704 335.072v-234.944L638.56 512z' fill='%23ddd'/%3E%3C/svg%3E");
}

.icon.generate-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1024 1024' version='1.1'%3E%3Cpath d='M438.4 849.1l222.7-646.7c0.2-0.5 0.3-1.1 0.4-1.6L438.4 849.1z' opacity='.224'/%3E%3Cpath d='M661.2 168.7h-67.5c-3.4 0-6.5 2.2-7.6 5.4L354.7 846c-0.3 0.8-0.4 1.7-0.4 2.6 0 4.4 3.6 8 8 8h67.8c3.4 0 6.5-2.2 7.6-5.4l0.7-2.1 223.1-648.3 7.4-21.4c0.3-0.8 0.4-1.7 0.4-2.6-0.1-4.5-3.6-8.1-8.1-8.1zM954.6 502.1c-0.8-1-1.7-1.9-2.7-2.7l-219-171.3c-3.5-2.7-8.5-2.1-11.2 1.4-1.1 1.4-1.7 3.1-1.7 4.9v81.3c0 2.5 1.1 4.8 3.1 6.3l115 90-115 90c-1.9 1.5-3.1 3.8-3.1 6.3v81.3c0 4.4 3.6 8 8 8 1.8 0 3.5-0.6 4.9-1.7l219-171.3c6.9-5.4 8.2-15.5 2.7-22.5zM291.1 328.1l-219 171.3c-1 0.8-1.9 1.7-2.7 2.7-5.4 7-4.2 17 2.7 22.5l219 171.3c1.4 1.1 3.1 1.7 4.9 1.7 4.4 0 8-3.6 8-8v-81.3c0-2.5-1.1-4.8-3.1-6.3l-115-90 115-90c1.9-1.5 3.1-3.8 3.1-6.3v-81.3c0-1.8-0.6-3.5-1.7-4.9-2.7-3.5-7.7-4.1-11.2-1.4z' fill='%23ddd'/%3E%3C/svg%3E");
}
.icon.home-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1024 1024' fill='%23ddd'%3E%3Cpath d='M512 89.6L42.666667 512h128v384h298.666666v-256h85.333334v256h298.666666v-384h128L512 89.6z m0 114.816l256 230.4V810.666667h-128v-256H384v256H256v-375.850667l256-230.4z'/%3E%3C/svg%3E");
}
</style>
