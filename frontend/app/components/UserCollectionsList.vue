<template>
  <div class="user-collections">
    <div class="header">
      Мои коллекции

      <ui-btn @click="handleCreateUserCollection">
        Создать
      </ui-btn>
    </div>
    <div class="list">
      <div v-for="collection in userCollections" :key="collection.id" class="collection-item" @click="handleClick(collection)">
        <span><b>Имя:</b> {{ collection.name }}</span>
        <span><b>Тип коллекции:</b> {{ collection.collection_type_id.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UserCollection } from '@/store/collection'
import { useCollectionStore } from '@/store/collection'
import { useModalStore } from '@/store/modal'
import { useUserStore } from '@/store/user'

const { getUserCollections } = useCollectionStore()
const { userCollections, currentUserCollection } = storeToRefs(useCollectionStore())
const { currentUser } = storeToRefs(useUserStore())
const { open } = useModalStore()

const handleCreateUserCollection = () => {
  open('createUserCollection')
}

const handleClick = (collection: UserCollection) => {
  currentUserCollection.value = collection
  open('collectionItems')
}

onMounted(async () => {
  if (currentUser.value) {
    await getUserCollections(currentUser.value.id)
  }
})

watch(currentUser, async () => {
  if (currentUser.value) {
    await getUserCollections(currentUser.value?.id)
  }
})
</script>

<style scoped lang="scss">
.user-collections {
  box-shadow: $box-shadow-default;
  padding: 16px 20px;
  border-radius: 8px;
  margin-top: 16px;
}

.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.collection-item {
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
