<template>
  <ui-page-section>
    <template #title>Поля коллекций</template>
    <template #action>
      <ui-btn @click="handleCreateField">Создать</ui-btn>
    </template>

    <div v-if="!fieldsList || fieldsList.length === 0" class="empty">
      Нет полей
    </div>

    <div v-else class="list">
      <div
        v-for="field in fieldsList"
        :key="field.id"
        class="card"
        @click="handleClick(field)"
      >
        <div class="card__main">
          <span class="card__name">{{ field.name }}</span>
          <span v-if="field.description" class="card__description">{{ field.description }}</span>
        </div>
        <span class="card__badge">{{ field.field_type }}</span>
      </div>
    </div>
  </ui-page-section>
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
.list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  border: 1px solid $gray300;
  border-radius: 10px;
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s;

  &:hover {
    border-color: $primary;
    box-shadow: 0 2px 12px rgba(132, 88, 255, 0.12);
  }

  &__main {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__name {
    font-weight: 600;
    color: $gray900;
  }

  &__description {
    font-size: 13px;
    color: $gray600;
  }

  &__badge {
    font-size: 12px;
    font-weight: 600;
    color: $primary;
    background: rgba(132, 88, 255, 0.08);
    padding: 3px 10px;
    border-radius: 20px;
    white-space: nowrap;
    margin-left: 16px;
  }
}

.empty {
  color: $gray600;
  font-size: 14px;
  padding: 24px 0;
  text-align: center;
}
</style>
