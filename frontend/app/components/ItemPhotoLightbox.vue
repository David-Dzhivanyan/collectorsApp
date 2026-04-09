<template>
  <Teleport to="body">
    <div class="lightbox" @click.self="$emit('close')">
      <button class="lightbox__close" @click="$emit('close')">
        <icons-close class="lightbox__close-icon" />
      </button>

      <button
        v-if="photos.length > 1"
        class="lightbox__nav lightbox__nav--prev"
        :disabled="current === 0"
        @click="current--"
      >‹</button>

      <div class="lightbox__img-wrap">
        <img :src="photos[current]" class="lightbox__img" alt="" />
      </div>

      <button
        v-if="photos.length > 1"
        class="lightbox__nav lightbox__nav--next"
        :disabled="current === photos.length - 1"
        @click="current++"
      >›</button>

      <div v-if="photos.length > 1" class="lightbox__counter">
        {{ current + 1 }} / {{ photos.length }}
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{ photos: string[]; initialIndex: number }>()
const emit = defineEmits<{ close: [] }>()

const current = ref(props.initialIndex)

const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') emit('close')
  if (e.key === 'ArrowRight' && current.value < props.photos.length - 1) current.value++
  if (e.key === 'ArrowLeft' && current.value > 0) current.value--
}

onMounted(() => document.addEventListener('keydown', onKey))
onUnmounted(() => document.removeEventListener('keydown', onKey))
</script>

<style scoped lang="scss">
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(0, 0, 0, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox__close {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(255, 255, 255, 0.12);
  border: none;
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;

  &:hover {
    background: rgba(255, 255, 255, 0.22);
  }

  &-icon {
    width: 20px;
    height: 20px;
  }
}

.lightbox__img-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 90vw;
  max-height: 90vh;
}

.lightbox__img {
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 8px;
  display: block;
}

.lightbox__nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.12);
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  font-size: 28px;
  line-height: 1;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.25);
  }

  &:disabled {
    opacity: 0.3;
    cursor: default;
  }

  &--prev {
    left: 16px;
  }

  &--next {
    right: 16px;
  }
}

.lightbox__counter {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  font-weight: 500;
  background: rgba(0, 0, 0, 0.4);
  padding: 4px 12px;
  border-radius: 20px;
}
</style>
