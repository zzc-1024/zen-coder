<template>
  <BaseAuthView
    title="重置密码"
    subtitle="请输入您的邮箱地址，我们将发送密码重置链接"
  >
    <div class="forgot-password-form">
      <!-- Email -->
      <div class="form-group">
        <label for="email">邮箱</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          placeholder="请输入您的邮箱地址"
          @input="validateField('email')"
        />
        <div v-if="errors.email" class="error-message">{{ errors.email }}</div>
      </div>

      <!-- Submit Button -->
      <div class="form-actions">
        <button
          class="btn btn-primary"
          @click="onSubmit"
          :disabled="!isFormValid"
        >
          {{ isSubmitting ? '发送中...' : '发送重置链接' }}
        </button>
      </div>

      <!-- Success Message -->
      <div v-if="successMessage" class="success-message">
        {{ successMessage }}
      </div>
    </div>

    <template #footer>
      <div class="auth-footer-content">
        <a href="#/auth/login" class="text-link">返回登录</a>
      </div>
    </template>
  </BaseAuthView>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import BaseAuthView from './BaseAuthView.vue';

const emit = defineEmits<{
  onSubmit: [email: string];
}>();

// Form State
const form = ref({
  email: '',
});

// Validation Errors
const errors = ref({
  email: '',
});

// UI State
const isSubmitting = ref(false);
const successMessage = ref('');

// Validate Individual Field
function validateField(field: string) {
  switch (field) {
    case 'email':
      if (!form.value.email) {
        errors.value.email = '请输入邮箱地址';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
        errors.value.email = '请输入有效的邮箱地址';
      } else {
        errors.value.email = '';
      }
      break;
  }
}

// Validate Entire Form
function validateForm() {
  Object.keys(form.value).forEach(validateField);
}

// Check if Form is Valid
const isFormValid = computed(() => {
  return (
    !errors.value.email &&
    form.value.email
  );
});

// Handle Submit
async function onSubmit() {
  validateForm();
  if (isFormValid.value) {
    isSubmitting.value = true;
    successMessage.value = '';

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      emit('onSubmit', form.value.email);
      successMessage.value = '密码重置链接已发送到您的邮箱，请检查收件箱';
      form.value.email = '';
    } catch (error) {
      console.error('Failed to send reset link:', error);
    } finally {
      isSubmitting.value = false;
    }
  }
}
</script>

<style scoped lang="scss">
.forgot-password-form {
  width: 100%;
}

.success-message {
  margin-top: 16px;
  padding: 12px;
  background-color: rgba(0, 255, 136, 0.1);
  border: 1px solid rgba(0, 255, 136, 0.3);
  border-radius: 4px;
  color: #00ff88;
  font-size: 14px;
  line-height: 1.4;
}

.error-message {
  font-size: 12px;
  color: #ff4444;
  margin-top: 4px;
}
</style>