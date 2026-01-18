<template>
  <div class="collection">
    <div class="collection-header">
      Типы коллекций

      <ui-btn @click="handleCreateType">
        Создать
      </ui-btn>
    </div>

    <div class="collection-list">
      <div v-for="type in collectionTypeList" :key="type.id" class="collection-item" @click="onClickCollectionType(type)">
        <span><b>Имя:</b> {{ type.name }}</span>
        <span><b>Описание:</b> {{ type.description }}</span>
        <span><b>Автор:</b> {{ type.created_by.firstName }} {{ type.created_by.lastName }}</span>
      </div>
    </div>
  </div>
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
.collection {
  box-shadow: $box-shadow-default;
  padding: 16px 20px;
  border-radius: 8px;
  margin-top: 16px;
}

.collection-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.collection-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.collection-item {
  position: relative;
  display: flex;
  flex-direction: column;
  cursor: pointer;
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
