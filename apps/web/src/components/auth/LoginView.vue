<template>
  <BaseAuthView
    title="登录账户"
    subtitle="欢迎回来，请输入您的账户信息"
  >
    <div class="login-form">
      <!-- Username or Email -->
      <div class="form-group">
        <label for="identifier">用户名或邮箱</label>
        <input
          id="identifier"
          v-model="form.identifier"
          type="text"
          placeholder="请输入用户名或邮箱"
          @input="validateField('identifier')"
        />
        <div v-if="errors.identifier" class="error-message">{{ errors.identifier }}</div>
      </div>

      <!-- Password -->
      <div class="form-group">
        <div class="password-label-container">
          <label for="password">密码</label>
          <a href="#/auth/forgot" class="text-link password-reset">忘记密码？</a>
        </div>
        <input
          id="password"
          v-model="form.password"
          type="password"
          placeholder="请输入密码"
          @input="validateField('password')"
        />
        <div v-if="errors.password" class="error-message">{{ errors.password }}</div>
      </div>

      <!-- Remember Me -->
      <div class="form-group remember-group">
        <input
          id="remember"
          v-model="form.remember"
          type="checkbox"
        />
        <label for="remember">记住我</label>
      </div>

      <!-- Submit Button -->
      <div class="form-actions">
        <button
          class="btn btn-primary"
          @click="onLogin"
          :disabled="!isFormValid"
        >
          登录
        </button>
      </div>

      <!-- Social Login (Optional) -->
      <div class="social-login">
        <div class="social-divider">
          <span>或使用以下方式登录</span>
        </div>
        <div class="social-buttons">
          <button class="social-btn" title="GitHub登录">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </button>
          <button class="social-btn" title="Google登录">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="auth-footer-content">
        还没有账户？ <a href="#/auth/register" class="text-link">立即注册</a>
      </div>
    </template>
  </BaseAuthView>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import BaseAuthView from './BaseAuthView.vue';

const emit = defineEmits<{
  onLogin: [identifier: string, password: string, remember: boolean];
}>();

// Form State
const form = ref({
  identifier: '',
  password: '',
  remember: false,
});

// Validation Errors
const errors = ref({
  identifier: '',
  password: '',
});

// Validate Individual Field
function validateField(field: string) {
  switch (field) {
    case 'identifier':
      if (!form.value.identifier) {
        errors.value.identifier = '请输入用户名或邮箱';
      } else {
        errors.value.identifier = '';
      }
      break;

    case 'password':
      if (!form.value.password) {
        errors.value.password = '请输入密码';
      } else {
        errors.value.password = '';
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
    !errors.value.identifier &&
    !errors.value.password &&
    form.value.identifier &&
    form.value.password
  );
});

// Handle Login
function onLogin() {
  validateForm();
  if (isFormValid.value) {
    emit('onLogin', form.value.identifier, form.value.password, form.value.remember);
  }
}
</script>

<style scoped lang="scss">
.login-form {
  width: 100%;
}

.password-label-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.password-reset {
  font-size: 13px;
}

.remember-group {
  display: flex;
  align-items: center;
  gap: 8px;

  input[type="checkbox"] {
    accent-color: #00aaff;
  }

  label {
    margin: 0;
    font-size: 14px;
  }
}

.social-login {
  margin-top: 32px;
}

.social-divider {
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background-color: #444;
  }

  span {
    margin: 0 12px;
    font-size: 13px;
    color: #b0b0b0;
  }
}

.social-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background-color: #3a3a3a;
  border: 1px solid #444;
  border-radius: 4px;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #444;
    border-color: #00aaff;
    box-shadow: 0 0 8px rgba(0, 170, 255, 0.3);
  }
}

.error-message {
  font-size: 12px;
  color: #ff4444;
  margin-top: 4px;
}
</style>