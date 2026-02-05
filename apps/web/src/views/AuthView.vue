<template>
  <div class="auth-view">
    <!-- Login View -->
    <LoginView
      v-if="currentView === 'login'"
      @onLogin="handleLogin"
    />

    <!-- Register View -->
    <RegisterView
      v-else-if="currentView === 'register'"
      @onRegister="handleRegister"
    />

    <!-- Forgot Password View -->
    <ForgotPasswordView
      v-else-if="currentView === 'forgot'"
      @onSubmit="handleForgotPassword"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import LoginView from '../components/auth/LoginView.vue';
import RegisterView from '../components/auth/RegisterView.vue';
import ForgotPasswordView from '../components/auth/ForgotPasswordView.vue';

const route = useRoute();
const router = useRouter();

// Current View State
const currentView = ref('login');

// Get current view from route
const getCurrentView = () => {
  const view = route.params.view as string || 'login';
  const validViews = ['login', 'register', 'forgot'];
  return validViews.includes(view) ? view : 'login';
};

// Update current view when route changes
watch(
  () => route.params.view,
  () => {
    currentView.value = getCurrentView();
  }
);

// Initialize current view
onMounted(() => {
  currentView.value = getCurrentView();
});

// Handle Login
function handleLogin(identifier: string, _password: string, remember: boolean) {
  console.log('Login attempt:', {
    identifier,
    password: '***',
    remember,
  });

  // Simulate API call
  setTimeout(() => {
    // Success
    router.push('/');
  }, 1000);
}

// Handle Register
function handleRegister(username: string, email: string, password: string) {
  console.log('Register attempt:', {
    username,
    email,
    password,
  });

  // Simulate API call
  setTimeout(() => {
    // Success - redirect to login
    router.push('/auth/login');
  }, 1000);
}

// Handle Forgot Password
function handleForgotPassword(email: string) {
  console.log('Forgot password attempt:', {
    email,
  });

  // Simulate API call
  setTimeout(() => {
    // Success - show message in component
  }, 1000);
}
</script>

<style scoped lang="scss">
.auth-view {
  min-height: 100vh;
  background-color: #1a1a1a;
}
</style>
