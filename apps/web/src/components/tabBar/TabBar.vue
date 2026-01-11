<template>
  <div class="tab-bar-container">
    <div class="tab-bar-scroll-wrapper" ref="tabBarScrollWrapperRef">
      <div class="tab-bar" ref="tabBarRef">
        <div
          v-for="(tab, index) in tabs"
          :key="tab.id"
          class="tab-item"
          :class="{ active: selectedTabId === tab.id, dragging: draggingIndex === index }"
          @dragenter="onDragEnter($event, index)"
          @dragover.prevent="onDragOver($event)"
          @dragleave="onDragLeave($event, index)"
          @drop="onDrop($event, index)"
          @dragend="onDragEnd"
          @click="onTabClick(tab.id)"
        >
          <span class="drag-handle" :draggable="true" @dragstart="onDragStart($event, index)">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="drag-handle-icon"
            >
              <circle cx="5" cy="7" r="1.5" />
              <circle cx="5" cy="12" r="1.5" />
              <circle cx="5" cy="17" r="1.5" />
              <circle cx="12" cy="7" r="1.5" />
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="12" cy="17" r="1.5" />
            </svg>
          </span>
          <span class="tab-text" @pointerdown="emit('tabTouch', tab.id)">{{ tab.name }}</span>
          <button
            class="tab-delete-btn"
            @click.stop="onTabDelete(tab.id)"
            @touchstart.stop="onTabDelete(tab.id)"
          >
            ×
          </button>
        </div>
      </div>
    </div>
    <button class="tab-add-btn" @click="onTabAdd" @touchstart="onTabAdd">+</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

// 定义Tab类型
interface Tab {
  id: string;
  name: string;
}

// 定义props
interface Props {
  tabs: Tab[];
  selectedTabId?: string;
}

// 定义emit事件
type Emits = {
  (e: 'tabSelect', tabId: string): void;
  (e: 'tabAdd'): void;
  (e: 'tabDelete', tabId: string): void;
  (e: 'tabReorder', tabs: string[]): void;
  (e: 'tabTouch', tabId: string): void;
};

// 声明props和emit
const props = withDefaults(defineProps<Props>(), {
  selectedTabId: undefined,
});

const emit = defineEmits<Emits>();

// 拖拽状态
const draggingIndex = ref<number | null>(null);
const dragOverIndex = ref<number | null>(null);
const tabBarRef = ref<HTMLElement | null>(null);
const tabBarScrollWrapperRef = ref<HTMLElement | null>(null);

// 触摸拖拽状态
const originalOrder = ref<Tab[]>([]);

// 滚动状态
const canScrollLeft = ref(false);
const canScrollRight = ref(false);

// 处理tab点击
const onTabClick = (tabId: string) => {
  console.log(`点击了tab ${tabId}`);
  emit('tabSelect', tabId);
};

// 处理tab添加
const onTabAdd = () => {
  emit('tabAdd');
};

// 处理tab删除
const onTabDelete = (tabId: string) => {
  emit('tabDelete', tabId);
};

// 拖拽事件处理
const onDragStart = (event: DragEvent, index: number) => {
  draggingIndex.value = index;
  originalOrder.value = [...props.tabs];
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', index.toString());
  }
};

const onDragEnter = (event: DragEvent, index: number) => {
  event.preventDefault();
  if (draggingIndex.value !== null && draggingIndex.value !== index) {
    dragOverIndex.value = index;
  }
};

const onDragOver = (event: DragEvent) => {
  event.preventDefault();
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move';
  }
};

const onDragLeave = (event: DragEvent, index: number) => {
  event.preventDefault();
  if (dragOverIndex.value === index) {
    dragOverIndex.value = null;
  }
};

const onDrop = (event: DragEvent, dropIndex: number) => {
  event.preventDefault();
  if (draggingIndex.value === null || draggingIndex.value === dropIndex) return;

  const newTabs = [...props.tabs];
  const [movedTab] = newTabs.splice(draggingIndex.value, 1);
  if (movedTab) {
    newTabs.splice(dropIndex, 0, movedTab);
    emit(
      'tabReorder',
      newTabs.map((tab) => tab.id),
    );
  }
  dragOverIndex.value = null;
};

const onDragEnd = () => {
  draggingIndex.value = null;
  dragOverIndex.value = null;
};

// 滚动控制
const updateScrollButtons = () => {
  if (!tabBarScrollWrapperRef.value) return;

  const wrapper = tabBarScrollWrapperRef.value;
  canScrollLeft.value = wrapper.scrollLeft > 0;
  canScrollRight.value = wrapper.scrollLeft < wrapper.scrollWidth - wrapper.clientWidth;
};

// 生命周期钩子
onMounted(() => {
  // 初始化滚动按钮状态
  updateScrollButtons();

  // 监听滚动事件
  if (tabBarScrollWrapperRef.value) {
    tabBarScrollWrapperRef.value.addEventListener('scroll', updateScrollButtons);
  }
});

onUnmounted(() => {
  // 移除滚动事件监听
  if (tabBarScrollWrapperRef.value) {
    tabBarScrollWrapperRef.value.removeEventListener('scroll', updateScrollButtons);
  }
});
</script>

<style scoped lang="scss">
// 虚幻引擎风格的暗黑色主题变量
$bg-primary: #1a1a1a;
$bg-secondary: #2a2a2a;
$bg-tertiary: #3a3a3a;
$border-color: #4a4a4a;
$text-primary: #ffffff;
$text-secondary: #b0b0b0;
$accent-color: #00aaff;
$accent-hover: #00ccff;
$delete-color: #ff4444;

.tab-bar-container {
  width: 100%;
  height: 100%;
  min-height: 32px;
  max-height: 40px;
  background-color: $bg-primary;
  border-bottom: 1px solid $border-color;
  overflow: hidden;
  display: flex;
  align-items: center;
  position: relative;
}

.tab-bar-scroll-wrapper {
  flex: 1;
  height: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  scroll-snap-type: x mandatory;
  -webkit-scroll-snap-type: x mandatory;
  margin: 0 4px;

  &::-webkit-scrollbar {
    display: none;
  }
}

.tab-bar {
  display: flex;
  align-items: center;
  height: 100%;
  gap: 4px;
  min-width: max-content;
}

.tab-item {
  display: flex;
  align-items: center;
  height: 28px;
  padding: 0 12px;
  background-color: $bg-secondary;
  border: 1px solid $border-color;
  border-radius: 16px;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;
  font-size: 14px;
  white-space: nowrap;
  position: relative;
  touch-action: pan-x;
  color: $text-primary;

  &:hover {
    background-color: $bg-tertiary;
    border-color: $accent-color;
  }

  &.active {
    background-color: $accent-color;
    color: $text-primary;
    border-color: $accent-color;
    box-shadow: 0 0 8px rgba(0, 170, 255, 0.3);
  }

  &.dragging {
    opacity: 0.7;
    transform: rotate(2deg);
    background-color: $bg-tertiary;
    box-shadow: 0 4px 12px rgba(0, 170, 255, 0.4);
  }

  .drag-handle {
    cursor: move;
  }

  .tab-text {
    margin-right: 8px;
  }

  .tab-delete-btn {
    width: 16px;
    height: 16px;
    padding: 0;
    background: transparent;
    border: none;
    color: $text-secondary;
    font-size: 16px;
    line-height: 1;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.7;
    transition: all 0.2s ease;

    &:hover {
      opacity: 1;
      color: $delete-color;
    }
  }
}

.tab-add-btn {
  width: 28px;
  height: 28px;
  padding: 0;
  background-color: $bg-secondary;
  border: 1px dashed $border-color;
  border-radius: 16px;
  color: $accent-color;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  touch-action: manipulation;
  margin-right: 8px;

  &:hover {
    background-color: $bg-tertiary;
    border-color: $accent-color;
    box-shadow: 0 0 8px rgba(0, 170, 255, 0.3);
  }

  &:active {
    background-color: $accent-color;
    color: $bg-primary;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .tab-bar {
    gap: 2px;
  }

  .tab-item {
    height: 24px;
    padding: 0 8px;
    font-size: 12px;

    .tab-delete-btn {
      width: 14px;
      height: 14px;
      font-size: 14px;
    }
  }

  .tab-add-btn {
    width: 24px;
    height: 24px;
    font-size: 16px;
  }
}
</style>
