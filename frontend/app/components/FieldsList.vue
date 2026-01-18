<template>
  <div class="field">
    <div class="field-header">
      Поля

      <ui-btn @click="handleCreateField">
        Создать
      </ui-btn>
    </div>

    <div class="field-list">
      <div v-for="field in fieldsList" :key="field.id" class="field-item" @click="handleClick(field)">
        <span><b>Название:</b> {{ field.name }}</span>
        <span><b>Описание:</b> {{ field.description }}</span>
        <span><b>Тип поля:</b> {{ field.field_type }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Field } from '@/store/collection'
import { useCollectionStore } from '@/store/collection'
import { useModalStore } from '@/store/modal'

const { getFields, createCurrentCollectionField, getCurrentCollectionTypeField } = useCollectionStore()
const { fieldsList, currentCollection } = storeToRefs(useCollectionStore())
const { open } = useModalStore()

const handleCreateField = () => {
  open('createField')
}

const handleClick = async (field: Field) => {
  await createCurrentCollectionField({ collection_type_id: currentCollection.value?.id || 0, field_id: field.id })
  if (currentCollection.value) {
    await getCurrentCollectionTypeField(currentCollection.value.id)
  }
}

onMounted(() => {
  getFields()
})
</script>

<style scoped lang="scss">
.field {
  box-shadow: $box-shadow-default;
  padding: 16px 20px;
  border-radius: 8px;
  margin-top: 16px;
}

.field-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.field-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.field-item {
  position: relative;
  display: flex;
  cursor: pointer;
  flex-direction: column;
  border-radius: 8px;
  padding: 8px 16px;

  &:hover {
    box-shadow: $box-shadow-default;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 3%;
    width: 94%;
    height: 1px;
    background: $black;
  }
}
</style>
