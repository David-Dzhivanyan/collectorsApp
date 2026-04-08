<template>
  <div class="modal">
    <div class="modal__header">
      <h3 class="modal__title">{{ title }}</h3>
      <button class="modal__close" @click="close">
        <icons-close class="modal__close-icon" />
      </button>
    </div>
    <div class="modal__body">
      <slot />
    </div>
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
.modal {
  background: $white;
  border-radius: 16px;
  box-shadow: $box-shadow-secondary;
  border: 1px solid $gray300;
  width: 100%;
  max-width: 520px;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px 16px;
    border-bottom: 1px solid $gray300;
  }

  &__title {
    @include header-3;
    font-weight: 700;
    color: $gray900;
  }

  &__close {
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    color: $gray600;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.15s, background 0.15s;

    &:hover {
      color: $gray900;
      background: $gray300;
    }
  }

  &__close-icon {
    width: 18px;
    height: 18px;
  }

  &__body {
    padding: 20px 24px 24px;
  }
}
</style>
