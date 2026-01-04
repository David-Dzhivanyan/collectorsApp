<template>
  <div v-if="modal.name" class="modal-backdrop" @click.self="close">
    <component :is="currentModal" v-bind="modal.props" />
  </div>
</template>

<script setup lang="ts">
import type { ModalName } from '@/store/modal'

import ConfirmModal from '@/components/modals/confirm.vue'
// Здесь ты импортируешь все возможные модалки
import LoginModal from '@/components/modals/login.vue'
import RegisterModal from '@/components/modals/register.vue'
import { useModalStore } from '@/store/modal'

const modal = useModalStore()

const modalsMap: Record<ModalName, any> = {
  login: LoginModal,
  confirm: ConfirmModal,
  register: RegisterModal,
}

const currentModal = computed(() => {
  return modal.name ? modalsMap[modal.name] : null
})

function close() {
  modal.close()
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
