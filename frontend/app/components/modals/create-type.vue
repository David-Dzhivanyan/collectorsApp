<template>
  <modals-base title="Новый тип коллекции">
    <div class="content">
      <ui-text-field v-model="formValues.name" label="Название" />
      <ui-text-field v-model="formValues.description" label="Описание" />
      <div class="footer">
        <ui-btn @click="handleCreate">Создать</ui-btn>
      </div>
    </div>
  </modals-base>
</template>

<script setup lang="ts">
import type { CreateCollectionTypeRequest } from '@/store/collection'
import { useCollectionStore } from '@/store/collection'
import { useModalStore } from '@/store/modal'

const { close } = useModalStore()
const { getCollectionTypes, createCollectionType } = useCollectionStore()

const formValues = ref<CreateCollectionTypeRequest>({ name: '', description: '' })

const handleCreate = async () => {
  await createCollectionType(formValues.value)
  await getCollectionTypes()
  close()
}
</script>

<style scoped lang="scss">
.content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 4px;
}
</style>
