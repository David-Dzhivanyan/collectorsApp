<template>
  <button class="button" @click="onClick">
    <slot />
  </button>
</template>

<script setup lang="ts">
export type BtnProps = {
  onClick?: () => void
}

const props = withDefaults(defineProps<BtnProps>(), {})
</script>

<style scoped lang="scss">
.button {
  cursor: pointer;
  padding: 4px 8px;
  box-shadow: $box-shadow-default;

  &:hover {
    opacity: 0.8;
  }
}
</style>
