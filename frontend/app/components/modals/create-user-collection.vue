<template>
  <modals-base title="Новая коллекция">
    <div class="content">
      <ui-select-field
        v-model="formValues.collection_type_id"
        :options="options"
        label="Тип коллекции"
        placeholder="Выберите тип"
        @update:model-value="(value) => onChangeType(value)"
      />
      <ui-text-field v-model="formValues.name" label="Название коллекции" />
      <div class="footer">
        <ui-btn @click="handleCreate">Создать</ui-btn>
      </div>
    </div>
  </modals-base>
</template>

<script setup lang="ts">
import type { SelectFieldProps } from '@/components/ui/select-field.vue'
import { useCollectionStore } from '@/store/collection'
import { useModalStore } from '@/store/modal'
import { useUserStore } from '@/store/user'

const { close } = useModalStore()
const { collectionTypeList } = storeToRefs(useCollectionStore())
const { getCollectionTypes, createUserCollection, getUserCollections } = useCollectionStore()
const { currentUser } = storeToRefs(useUserStore())

const formValues = ref<{ name: string, collection_type_id: number | null }>({ name: '', collection_type_id: null })

const options = computed<SelectFieldProps['options']>(() =>
  collectionTypeList.value?.map(item => ({ value: item.id, label: item.name })) ?? []
)

const handleCreate = async () => {
  if (!formValues.value.collection_type_id) return
  await createUserCollection(formValues.value as { name: string, collection_type_id: number })
  if (currentUser.value) {
    await getUserCollections(currentUser.value.id)
  }
  close()
}

const onChangeType = (option: number | string | null) => {
  const match = options.value.find(item => item.value === option)
  formValues.value.name = match?.label || ''
}

onMounted(async () => {
  if (!collectionTypeList.value) {
    await getCollectionTypes()
  }
})
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
