<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <div class="app-container">
    <nav v-if="false">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/editor">Editor</RouterLink>
    </nav>

    <main class="main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped lang="scss">
.app-container {
  // 根据屏幕高度自动获取
  height: 100lvh;
  display: flex;
  flex-direction: column;
  main {
    height: 100%;
  }
}
</style>
