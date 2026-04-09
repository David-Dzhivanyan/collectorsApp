<template>
  <div class="container">
    <slot />
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.container {
  max-width: 1420px;
  margin: 0 auto;
  flex-grow: 1;
  padding: 16px 32px;
  width: 100%;

  @include mobile { padding: 12px 16px; }
  @include sm     { padding: 10px 12px; }
}
</style>
