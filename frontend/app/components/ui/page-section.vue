<template>
  <div class="page-section">
    <div class="page-section__header">
      <h2 class="page-section__title">
        <slot name="title" />
      </h2>
      <slot name="action" />
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
.page-section {
  margin-top: 32px;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  &__title {
    @include header-3;
    font-weight: 700;
    color: $gray900;
  }
}
</style>
