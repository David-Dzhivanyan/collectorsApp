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
        :class="{ 'card--editing': editingId === collection.id }"
      >
        <template v-if="editingId === collection.id">
          <ui-text-field
            v-model="editName"
            label="Название"
            class="card__edit-input"
            @keydown.enter="saveEdit(collection.id)"
            @keydown.esc="cancelEdit"
          />
          <div class="card__edit-actions">
            <ui-btn :disabled="!editName.trim()" @click="saveEdit(collection.id)">Сохранить</ui-btn>
            <button class="card__cancel-btn" @click="cancelEdit">Отмена</button>
          </div>
        </template>

        <template v-else>
          <div class="card__body" @click="handleClick(collection)">
            <span class="card__name">{{ collection.name }}</span>
            <span class="card__meta">{{ collection.collection_type_id.name }}</span>
          </div>
          <div class="card__actions">
            <button class="icon-btn" title="Редактировать" @click.stop="startEdit(collection)">
              <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.5 2.5a1.414 1.414 0 0 1 2 2L5 13H3v-2L11.5 2.5z" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <button class="icon-btn icon-btn--danger" title="Удалить коллекцию" @click.stop="handleDelete(collection.id)">
              <icons-trash class="icon-btn__icon" />
            </button>
          </div>
        </template>
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
const collectionStore = useCollectionStore()
const { getUserCollections, updateUserCollection, deleteUserCollection } = collectionStore
const { userCollections } = storeToRefs(collectionStore)
const { currentUser } = storeToRefs(useUserStore())
const { open } = useModalStore()

const editingId = ref<number | null>(null)
const editName = ref('')

const handleCreateUserCollection = () => {
  open('createUserCollection')
}

const handleClick = (collection: UserCollection) => {
  router.push(`/my-collections/${collection.id}`)
}

const startEdit = (collection: UserCollection) => {
  editingId.value = collection.id
  editName.value = collection.name
}

const cancelEdit = () => {
  editingId.value = null
  editName.value = ''
}

const handleDelete = async (id: number) => {
  await deleteUserCollection(id)
  if (currentUser.value) await getUserCollections(currentUser.value.id)
}

const saveEdit = async (id: number) => {
  if (!editName.value.trim()) return
  await updateUserCollection(id, editName.value.trim())
  if (currentUser.value) await getUserCollections(currentUser.value.id)
  cancelEdit()
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
  transition: border-color 0.15s, box-shadow 0.15s;
  gap: 12px;

  &:hover:not(&--editing) {
    border-color: $primary;
    box-shadow: 0 2px 12px rgba(132, 88, 255, 0.12);
  }

  &--editing {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }

  &__body {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex: 1;
    cursor: pointer;
    min-width: 0;
  }

  &__name {
    font-weight: 600;
    color: $gray900;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__meta {
    font-size: 13px;
    color: $gray600;
    white-space: nowrap;
    margin-left: 12px;
  }

  &__actions {
    display: flex;
    gap: 4px;
    flex-shrink: 0;
  }

  &__edit-input {
    width: 100%;
  }

  &__edit-actions {
    display: flex;
    align-items: center;
    gap: 10px;
    justify-content: flex-end;
  }

  &__cancel-btn {
    background: none;
    border: none;
    font-size: 13px;
    color: $gray600;
    cursor: pointer;

    &:hover {
      color: $gray900;
    }
  }
}

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  color: $gray600;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s, background 0.15s;

  svg {
    width: 15px;
    height: 15px;
  }

  &:hover {
    color: $primary;
    background: rgba(132, 88, 255, 0.08);
  }

  &--danger:hover {
    color: $red400;
    background: rgba(220, 53, 69, 0.08);
  }
}

.empty {
  color: $gray600;
  font-size: 14px;
  padding: 24px 0;
  text-align: center;
}
</style>
