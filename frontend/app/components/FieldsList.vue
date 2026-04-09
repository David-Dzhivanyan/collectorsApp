<template>
  <ui-page-section>
    <template #title>Поля коллекций</template>
    <template #action>
      <ui-btn v-if="isAuth" @click="handleCreateField">Создать</ui-btn>
    </template>

    <input
      v-model="search"
      class="search"
      type="text"
      placeholder="Поиск по названию..."
    />

    <div v-if="!fieldsList || fieldsList.length === 0" class="empty">
      Нет полей
    </div>

    <div v-else-if="filtered.length === 0" class="empty">
      Ничего не найдено
    </div>

    <div v-else class="list">
      <div
        v-for="field in filtered"
        :key="field.id"
        class="card"
        :class="{ 'card--editing': editingId === field.id }"
      >
        <!-- Edit form -->
        <template v-if="editingId === field.id">
          <div class="card__edit">
            <ui-text-field v-model="editForm.name" label="Название" />
            <ui-text-field v-model="editForm.description" label="Описание" />
          </div>
          <div class="card__edit-actions">
            <ui-btn @click="saveEdit(field.id)">Сохранить</ui-btn>
            <button class="cancel-btn" @click="cancelEdit">Отмена</button>
          </div>
        </template>

        <!-- Normal view -->
        <template v-else>
          <div class="card__main">
            <span class="card__name">{{ field.name }}</span>
            <span v-if="field.description" class="card__description">{{ field.description }}</span>
          </div>
          <div class="card__right">
            <span class="card__badge">{{ field.field_type }}</span>
            <div v-if="isAuth && isOwner(field)" class="card__actions">
              <button class="icon-btn" title="Редактировать" @click.stop="startEdit(field)">
                <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.5 2.5a1.414 1.414 0 0 1 2 2L5 13H3v-2L11.5 2.5z" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <button class="icon-btn icon-btn--danger" title="Удалить" @click.stop="handleDelete(field.id)">
                <icons-trash class="icon-btn__icon" />
              </button>
            </div>
          </div>
        </template>
      </div>
    </div>
  </ui-page-section>
</template>

<script setup lang="ts">
import { notify } from '@kyvg/vue3-notification'
import type { Field } from '@/store/collection'
import { useCollectionStore } from '@/store/collection'
import { useModalStore } from '@/store/modal'
import { useAuthStore } from '@/store/auth'
import { useUserStore } from '@/store/user'

const collectionStore = useCollectionStore()
const { getFields, updateField, deleteField } = collectionStore
const { fieldsList } = storeToRefs(collectionStore)
const { open } = useModalStore()
const { isAuth } = storeToRefs(useAuthStore())
const { currentUser } = storeToRefs(useUserStore())

const isOwner = (field: Field) => field.created_by?.id === currentUser.value?.id

const editingId = ref<number | null>(null)
const editForm = ref({ name: '', description: '' })
const search = ref('')

const filtered = computed(() =>
  (fieldsList.value ?? []).filter((f) =>
    f.name.toLowerCase().includes(search.value.toLowerCase()),
  ),
)

const handleCreateField = () => open('createField')

const startEdit = (field: Field) => {
  editingId.value = field.id
  editForm.value = { name: field.name, description: field.description ?? '' }
}

const cancelEdit = () => {
  editingId.value = null
  editForm.value = { name: '', description: '' }
}

const saveEdit = async (id: number) => {
  try {
    await updateField(id, { name: editForm.value.name, description: editForm.value.description })
    await getFields()
    cancelEdit()
  } catch (e: any) {
    notify({
      title: e?.response?.data?.message ?? 'Не удалось сохранить поле',
      type: 'error',
    })
  }
}

const handleDelete = async (id: number) => {
  try {
    await deleteField(id)
    await getFields()
  } catch (e: any) {
    notify({
      title: e?.response?.data?.message ?? 'Не удалось удалить поле',
      type: 'error',
    })
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
  transition: border-color 0.15s, box-shadow 0.15s;
  gap: 12px;

  &:hover:not(&--editing) {
    border-color: $primary;
    box-shadow: 0 2px 12px rgba(132, 88, 255, 0.12);
  }

  &--editing {
    flex-direction: column;
    align-items: stretch;
    border-color: $primary;
  }

  &__edit {
    display: flex;
    gap: 10px;

    > * {
      flex: 1;
    }
  }

  &__edit-actions {
    display: flex;
    align-items: center;
    gap: 10px;
    justify-content: flex-end;
  }

  &__main {
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex: 1;
    min-width: 0;
  }

  &__name {
    font-weight: 600;
    color: $gray900;
  }

  &__description {
    font-size: 13px;
    color: $gray600;
  }

  &__right {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  &__badge {
    font-size: 12px;
    font-weight: 600;
    color: $primary;
    background: rgba(132, 88, 255, 0.08);
    padding: 3px 10px;
    border-radius: 20px;
    white-space: nowrap;
  }

  &__actions {
    display: flex;
    gap: 2px;
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

  svg, &__icon {
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

.cancel-btn {
  background: none;
  border: none;
  font-size: 13px;
  color: $gray600;
  cursor: pointer;

  &:hover {
    color: $gray900;
  }
}

.search {
  width: 100%;
  padding: 9px 14px;
  border: 1px solid $gray300;
  border-radius: 8px;
  font-size: 14px;
  color: $gray900;
  background: $white;
  outline: none;
  margin-bottom: 12px;
  transition: border-color 0.15s, box-shadow 0.15s;

  &::placeholder {
    color: $gray600;
  }

  &:focus {
    border-color: $primary;
    box-shadow: 0 0 0 3px rgba(132, 88, 255, 0.12);
  }
}

.empty {
  color: $gray600;
  font-size: 14px;
  padding: 24px 0;
  text-align: center;
}
</style>
