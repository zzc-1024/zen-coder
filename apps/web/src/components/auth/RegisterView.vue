<template>
  <BaseAuthView
    title="创建账户"
    subtitle="加入我们的开发者社区，开始您的编码之旅"
  >
    <div class="register-form">
      <!-- Username -->
      <div class="form-group">
        <label for="username">用户名</label>
        <input
          id="username"
          v-model="form.username"
          type="text"
          placeholder="请输入用户名"
          @input="validateField('username')"
        />
        <div v-if="errors.username" class="error-message">{{ errors.username }}</div>
      </div>

      <!-- Email -->
      <div class="form-group">
        <label for="email">邮箱</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          placeholder="请输入邮箱地址"
          @input="validateField('email')"
        />
        <div v-if="errors.email" class="error-message">{{ errors.email }}</div>
      </div>

      <!-- Password -->
      <div class="form-group">
        <label for="password">密码</label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          placeholder="请输入密码 (至少8位)"
          @input="validateField('password')"
        />
        <div v-if="errors.password" class="error-message">{{ errors.password }}</div>
      </div>

      <!-- Confirm Password -->
      <div class="form-group">
        <label for="confirmPassword">确认密码</label>
        <input
          id="confirmPassword"
          v-model="form.confirmPassword"
          type="password"
          placeholder="请再次输入密码"
          @input="validateField('confirmPassword')"
        />
        <div v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</div>
      </div>

      <!-- Terms and Conditions -->
      <div class="form-group terms-group">
        <input
          id="terms"
          v-model="form.terms"
          type="checkbox"
          @change="validateField('terms')"
        />
        <label for="terms">
          我同意 <a href="#" class="text-link">服务条款</a> 和 <a href="#" class="text-link">隐私政策</a>
        </label>
        <div v-if="errors.terms" class="error-message">{{ errors.terms }}</div>
      </div>

      <!-- Submit Button -->
      <div class="form-actions">
        <button
          class="btn btn-primary"
          @click="onRegister"
          :disabled="!isFormValid"
        >
          注册
        </button>
      </div>
    </div>

    <template #footer>
      <div class="auth-footer-content">
        已有账户？ <a href="#/auth/login" class="text-link">立即登录</a>
      </div>
    </template>
  </BaseAuthView>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import BaseAuthView from './BaseAuthView.vue';

const emit = defineEmits<{
  onRegister: [username: string, email: string, password: string];
}>();

// Form State
const form = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  terms: false,
});

// Validation Errors
const errors = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  terms: '',
});

// Validate Individual Field
function validateField(field: string) {
  switch (field) {
    case 'username':
      if (!form.value.username) {
        errors.value.username = '请输入用户名';
      } else if (form.value.username.length < 3) {
        errors.value.username = '用户名至少需要3个字符';
      } else {
        errors.value.username = '';
      }
      break;

    case 'email':
      if (!form.value.email) {
        errors.value.email = '请输入邮箱地址';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
        errors.value.email = '请输入有效的邮箱地址';
      } else {
        errors.value.email = '';
      }
      break;

    case 'password':
      if (!form.value.password) {
        errors.value.password = '请输入密码';
      } else if (form.value.password.length < 8) {
        errors.value.password = '密码至少需要8个字符';
      } else {
        errors.value.password = '';
      }
      break;

    case 'confirmPassword':
      if (!form.value.confirmPassword) {
        errors.value.confirmPassword = '请确认密码';
      } else if (form.value.confirmPassword !== form.value.password) {
        errors.value.confirmPassword = '两次输入的密码不一致';
      } else {
        errors.value.confirmPassword = '';
      }
      break;

    case 'terms':
      if (!form.value.terms) {
        errors.value.terms = '请同意服务条款和隐私政策';
      } else {
        errors.value.terms = '';
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
    !errors.value.username &&
    !errors.value.email &&
    !errors.value.password &&
    !errors.value.confirmPassword &&
    !errors.value.terms &&
    form.value.username &&
    form.value.email &&
    form.value.password &&
    form.value.confirmPassword &&
    form.value.terms
  );
});

// Handle Register
function onRegister() {
  validateForm();
  if (isFormValid.value) {
    emit('onRegister', form.value.username, form.value.email, form.value.password);
  }
}
</script>

<style scoped lang="scss">
.register-form {
  width: 100%;
}

.terms-group {
  display: flex;
  align-items: flex-start;
  gap: 8px;

  input[type="checkbox"] {
    margin-top: 2px;
    accent-color: #00aaff;
  }

  label {
    flex: 1;
    margin: 0;
    font-size: 13px;
    line-height: 1.4;
  }
}

.error-message {
  font-size: 12px;
  color: #ff4444;
  margin-top: 4px;
}
</style>