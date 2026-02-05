<template>
  <div class="auth-container">
    <div class="auth-card">
      <!-- Header -->
      <div class="auth-header">
        <div class="auth-title">{{ title }}</div>
        <div class="auth-subtitle">{{ subtitle }}</div>
      </div>

      <!-- Content -->
      <div class="auth-content">
        <slot></slot>
      </div>

      <!-- Footer -->
      <div class="auth-footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  subtitle: string;
}>();
</script>

<style scoped lang="scss">
// 暗黑色科技主题变量
$bg-primary: #1a1a1a;
$bg-secondary: #2a2a2a;
$bg-tertiary: #3a3a3a;
$border-color: #444;
$accent-color: #00aaff;
$accent-hover: #00ccff;
$text-primary: #ffffff;
$text-secondary: #b0b0b0;
$success-color: #00ff88;
$error-color: #ff4444;

.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: $bg-primary;
  background-image:
    radial-gradient(circle at 25% 25%, rgba(0, 170, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(0, 170, 255, 0.05) 0%, transparent 50%);
  padding: 20px;
}

.auth-card {
  width: 100%;
  max-width: 480px;
  background-color: $bg-secondary;
  border: 1px solid $border-color;
  border-radius: 8px;
  box-shadow: 0 0 24px rgba(0, 170, 255, 0.15);
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.auth-header {
  background-color: $bg-primary;
  border-bottom: 1px solid $border-color;
  padding: 32px 24px 24px;
  text-align: center;
}

.auth-title {
  font-size: 24px;
  font-weight: bold;
  color: $accent-color;
  margin-bottom: 8px;
  text-shadow: 0 0 12px rgba(0, 170, 255, 0.3);
}

.auth-subtitle {
  font-size: 14px;
  color: $text-secondary;
  line-height: 1.4;
}

.auth-content {
  padding: 24px;
}

.auth-footer {
  background-color: $bg-primary;
  border-top: 1px solid $border-color;
  padding: 16px 24px;
  text-align: center;
}

// 通用表单元素样式
.auth-content {
  :deep(.form-group) {
    margin-bottom: 20px;

    label {
      display: block;
      font-size: 14px;
      font-weight: 500;
      color: $text-secondary;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    input {
      width: 100%;
      padding: 12px 16px;
      background-color: $bg-tertiary;
      border: 1px solid $border-color;
      border-radius: 4px;
      color: $text-primary;
      font-size: 14px;
      transition: all 0.2s ease;

      &:focus {
        outline: none;
        border-color: $accent-color;
        box-shadow: 0 0 0 2px rgba(0, 170, 255, 0.2);
      }

      &::placeholder {
        color: rgba(255, 255, 255, 0.3);
      }
    }

    .error-message {
      color: $error-color;
      font-size: 12px;
      margin-top: 4px;
    }
  }

  :deep(.btn) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 12px 24px;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    text-decoration: none;

    &.btn-primary {
      background-color: $accent-color;
      color: $text-primary;

      &:hover {
        background-color: $accent-hover;
        box-shadow: 0 0 12px rgba(0, 170, 255, 0.4);
      }

      &:active {
        transform: translateY(1px);
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        box-shadow: none;
      }
    }

    &.btn-secondary {
      background-color: transparent;
      color: $text-secondary;
      border: 1px solid $border-color;

      &:hover {
        color: $accent-color;
        border-color: $accent-color;
      }
    }
  }

  :deep(.form-actions) {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 24px;
  }

  :deep(.text-link) {
    color: $accent-color;
    text-decoration: none;
    font-size: 14px;
    transition: color 0.2s ease;

    &:hover {
      color: $accent-hover;
      text-decoration: underline;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .auth-card {
    width: 100%;
    max-width: none;
    margin: 0 16px;
  }

  .auth-header {
    padding: 24px 16px 16px;
  }

  .auth-content {
    padding: 16px;
  }

  .auth-footer {
    padding: 12px 16px;
  }
}
</style>
