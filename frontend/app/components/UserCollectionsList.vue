<template>
  <ui-page-section>
    <template #title>Мои коллекции</template>
    <template #action>
      <ui-btn @click="handleCreateUserCollection">Создать</ui-btn>
    </template>

    <div v-if="!userCollections || userCollections.length === 0" class="empty">
      У вас пока нет коллекций
    </div>

    <div v-else class="list">
      <div
        v-for="collection in userCollections"
        :key="collection.id"
        class="card"
        @click="handleClick(collection)"
      >
        <span class="card__name">{{ collection.name }}</span>
        <span class="card__meta">{{ collection.collection_type_id.name }}</span>
      </div>
    </div>
  </ui-page-section>
</template>

<script setup lang="ts">
import type { UserCollection } from '@/store/collection'
import { useCollectionStore } from '@/store/collection'
import { useModalStore } from '@/store/modal'
import { useUserStore } from '@/store/user'

const router = useRouter()
const { getUserCollections } = useCollectionStore()
const { userCollections } = storeToRefs(useCollectionStore())
const { currentUser } = storeToRefs(useUserStore())
const { open } = useModalStore()

const handleCreateUserCollection = () => {
  open('createUserCollection')
}

const handleClick = (collection: UserCollection) => {
  router.push(`/my-collections/${collection.id}`)
}

onMounted(async () => {
  if (currentUser.value) {
    await getUserCollections(currentUser.value.id)
  }
})

watch(currentUser, async () => {
  if (currentUser.value) {
    await getUserCollections(currentUser.value.id)
  }
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

  &__name {
    font-weight: 600;
    color: $gray900;
  }

  &__meta {
    font-size: 13px;
    color: $gray600;
  }
}

.empty {
  color: $gray600;
  font-size: 14px;
  padding: 24px 0;
  text-align: center;
}
</style>
