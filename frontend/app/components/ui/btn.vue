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
  background: linear-gradient(225deg, #40c6ff 0%, #4086f1 50.52%, #8458ff 100%);
  color: white;

  &:hover {
    opacity: 0.8;
  }
}
</style>
