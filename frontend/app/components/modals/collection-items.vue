<template>
  <modals-base :title="currentUserCollection?.name || ''" class="collection-items">
    <div class="content">
      <ui-btn @click="() => { isAddField = !isAddField }">
        {{ !isAddField ? 'Добавить поле' : 'Скрыть' }}
      </ui-btn>
      <div v-if="isAddField">
        <ui-text-field v-model="formValuesForItem.name" label="Название элемента коллекции" />
        <div v-for="field in formValuesFields" :key="field.id">
          <ui-text-field v-model="field.value" :label="field.label" />
        </div>
        <div class="btns">
          <ui-btn class="btn" @click="handleCreate">
            Создать
          </ui-btn>
        </div>
      </div>
      <div v-for="item in currentCollectionItems" :key="item.id" @click="handleClickItem(item)">
        {{ item.name }}
      </div>
    </div>
  </modals-base>
</template>

<script setup lang="ts">
import type { CollectionItem } from '@/store/collection'
import { useCollectionStore } from '@/store/collection'

const { currentUserCollection, currentCollectionItems, currentCollectionFields } = storeToRefs(useCollectionStore())
const { createCollectionItem, getCollectionItems, getCurrentCollectionTypeField, createItemValue, getItemValues } = useCollectionStore()

const isAddField = ref(false)
const formValuesForItem = ref<{ name: string, user_collection_id: number }>({ name: '', user_collection_id: 0 })
const formValuesFields = ref<{ id: number, label: string, value: string }[]>([])

const handleCreate = async () => {
  if (currentUserCollection.value) {
    formValuesForItem.value.user_collection_id = currentUserCollection.value.id
    const collectionItem = await createCollectionItem(formValuesForItem.value)
    await getCollectionItems(currentUserCollection.value.id)

    if (collectionItem) {
      for (const field of formValuesFields.value) {
        if (field.value) {
          await createItemValue({
            collection_item_id: collectionItem.id,
            field_id: field.id,
            value: field.value,
          })
        }
      }
    }
  }
}

const handleClickItem = async (item: CollectionItem) => {
  await getItemValues(item.id)
}

onMounted(async () => {
  if (currentUserCollection.value) {
    await getCollectionItems(currentUserCollection.value.id)
    await getCurrentCollectionTypeField(currentUserCollection.value.collection_type_id.id)
  }
})

watch([currentCollectionFields], () => {
  if (currentCollectionFields.value) {
    const result: { id: number, label: string, value: string }[] = []
    currentCollectionFields.value.forEach(field => {
      result.push({ id: field.field_id.id, label: field.field_id.name, value: '' })
    })
    formValuesFields.value = result
  }
})
</script>

<style scoped lang="scss">
.collection-items {
  width: 100%;
  height: 100%;

  .btns {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 8px;
  }

  .btn {
    width: fit-content;
  }
}

.content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
