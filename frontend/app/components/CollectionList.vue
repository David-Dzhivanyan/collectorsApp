<template>
  <ui-page-section>
    <template #title>Типы коллекций</template>
    <template #action>
      <ui-btn @click="handleCreateType">Создать</ui-btn>
    </template>

    <div v-if="!collectionTypeList || collectionTypeList.length === 0" class="empty">
      Нет типов коллекций
    </div>

    <div v-else class="list">
      <div
        v-for="type in collectionTypeList"
        :key="type.id"
        class="card"
        @click="onClickCollectionType(type)"
      >
        <div class="card__main">
          <span class="card__name">{{ type.name }}</span>
          <span v-if="type.description" class="card__description">{{ type.description }}</span>
        </div>
        <span class="card__author">{{ type.created_by.firstName }} {{ type.created_by.lastName }}</span>
      </div>
    </div>
  </ui-page-section>
</template>

<script setup lang="ts">
import type { CollectionType } from '@/store/collection'
import { useCollectionStore } from '@/store/collection'
import { useModalStore } from '@/store/modal'

const { getCollectionTypes } = useCollectionStore()
const { collectionTypeList, currentCollection } = storeToRefs(useCollectionStore())
const { open } = useModalStore()

const handleCreateType = () => {
  open('createType')
}

const onClickCollectionType = (item: CollectionType) => {
  currentCollection.value = item
  open('collectionType')
}

onMounted(() => {
  getCollectionTypes()
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

  &__author {
    font-size: 13px;
    color: $gray600;
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
