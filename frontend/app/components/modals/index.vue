<template>
  <Transition name="modal">
    <div v-if="modal.name" class="modal-backdrop" @click.self="close">
      <component :is="currentModal" v-bind="modal.props" />
    </div>
  </Transition>
</template>

<script setup lang="ts">
import type { ModalName } from '@/store/modal'
import CollectionItems from '@/components/modals/collection-items.vue'
import CollectionType from '@/components/modals/collection-type.vue'
import ConfirmModal from '@/components/modals/confirm.vue'
import CreateField from '@/components/modals/create-field.vue'
import CreateType from '@/components/modals/create-type.vue'
import CreateUserCollection from '@/components/modals/create-user-collection.vue'
import LoginModal from '@/components/modals/login.vue'
import RegisterModal from '@/components/modals/register.vue'
import { useModalStore } from '@/store/modal'

const modal = useModalStore()

const modalsMap: Record<ModalName, any> = {
  login: LoginModal,
  confirm: ConfirmModal,
  register: RegisterModal,
  createType: CreateType,
  collectionType: CollectionType,
  createField: CreateField,
  createUserCollection: CreateUserCollection,
  collectionItems: CollectionItems,
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
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  padding: 16px;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-active .modal,
.modal-leave-active .modal {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from :deep(.modal),
.modal-leave-to :deep(.modal) {
  transform: scale(0.96) translateY(8px);
  opacity: 0;
}
</style>
