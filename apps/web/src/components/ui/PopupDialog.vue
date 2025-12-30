<template>
  <div v-if="isVisible" class="popup-overlay" @click.self="close">
    <div class="popup-dialog">
      <div class="popup-header">
        <h3 class="popup-title">{{ title }}</h3>
        <button class="popup-close" @click="close">×</button>
      </div>
      <div class="popup-content">
        <slot>{{ content }}</slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// Props
const props = defineProps<{
  title?: string;
  content?: string;
  visible?: boolean;
}>();

// State
const isVisible = ref(props.visible || false);

// Methods
function open() {
  isVisible.value = true;
}

function close() {
  isVisible.value = false;
}

// Expose methods for external access
defineExpose({
  open,
  close
});
</script>

<style scoped lang="scss">
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
}

.popup-dialog {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow: hidden;
  animation: slideUp 0.3s ease;

  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  .popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid #e9ecef;

    .popup-title {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }

    .popup-close {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #666;
      padding: 0;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      transition: background-color 0.2s;

      &:hover {
        background-color: #f5f5f5;
      }
    }
  }

  .popup-content {
    padding: 20px;
    color: #555;
    line-height: 1.6;
    max-height: calc(80vh - 80px);
    overflow-y: auto;
  }
}
</style>
