<template>
  <div
    class="book-card"
    :class="{ 'is-selected': selected }"
    @click="handleClick"
  >
    <div class="card-icon">
      <img :src="icon" alt="" class="icon-image" />
    </div>
    <div class="card-name">{{ name }}</div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  id: string
  name: string
  icon: string
  selected?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  selected: false
})

const emit = defineEmits<{
  (e: 'select', id: string): void
}>()

const handleClick = () => {
  emit('select', props.id)
}
</script>

<style scoped lang="scss">
.book-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90px;
  padding: 8px;
  margin: 4px;
  background-color: #fef9e7;
  border: 2px solid #8b4513;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2), inset 0 0 6px rgba(255, 255, 255, 0.6);
  position: relative;

  /* 纸质纹理效果 */
  background-image:
    linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 15px 15px;

  &:hover {
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3), inset 0 0 6px rgba(255, 255, 255, 0.6);
  }

  &.is-selected {
    border-color: #2ecc71;
    background-color: #e8f8f5;
    box-shadow:
      0 0 0 3px rgba(46, 204, 113, 0.4),
      0 3px 6px rgba(0, 0, 0, 0.3),
      inset 0 0 6px rgba(255, 255, 255, 0.6);
    transform: translateY(-1px);
  }

  .card-icon {
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #ffffff;
    border: 2px solid #d4af37;
    border-radius: 6px;
    margin-bottom: 6px;
    overflow: hidden;
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.2);

    .icon-image {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  .card-name {
    font-size: 12px;
    font-weight: 600;
    color: #8b4513;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
    text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);
    font-family: 'Arial Black', sans-serif;
  }
}
</style>
