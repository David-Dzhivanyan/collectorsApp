<template>
  <modals-base title="Категория коллекции">
    <div class="content">
      <ui-text-field v-model="formValues.name" label="Название" />
      <ui-text-field v-model="formValues.description" label="Описание" />
      <div class="btns">
        <ui-btn class="btn" @click="handleCreate">
          Создать
        </ui-btn>
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

  .btns {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 8px;
  }

  .btn {
    width: fit-content;
  }

  .link {
    cursor: pointer;

    &:hover {
      color: $primary;
    }
  }
}
</style>
