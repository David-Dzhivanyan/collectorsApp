<template>
  <div class="modal-base">
    <div class="header">
      <div class="title">
        {{ title }}
      </div>
      <icons-close class="close" @click="close" />
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { useModalStore } from '@/store/modal'

export type ModalBaseProps = {
  title: string
}

defineProps<ModalBaseProps>()

const { close } = useModalStore()
</script>

<style scoped lang="scss">
.modal-base {
  min-width: 300px;
  background-color: $white;
  padding: 26px 32px;
  border-radius: 24px;
  box-shadow: $box-shadow-secondary;
  border: 1px solid $gray300;

  .header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
  }

  .title {
    @include header-3;
  }

  .close {
    cursor: pointer;
    height: 100%;
    width: 32px;
  }
}
</style>
