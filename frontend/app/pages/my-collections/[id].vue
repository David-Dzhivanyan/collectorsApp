<template>
  <container class="my-collections-container">
    <div class="page-header">
      <nuxt-link to="/my-collections" class="back-link">← Назад</nuxt-link>
      <div class="page-header__row">
        <div>
          <h1 class="title">{{ collectionName }}</h1>
          <span class="subtitle">{{ collectionTypeName }}</span>
        </div>
        <ui-btn v-if="!loading" @click="isFormOpen = !isFormOpen">
          {{ isFormOpen ? 'Скрыть' : 'Добавить элемент' }}
        </ui-btn>
      </div>
    </div>

    <!-- Create form -->
    <div v-if="isFormOpen && tableData" class="form">
      <div class="form__fields">
        <ui-text-field v-model="form.name" label="Название *" />
        <ui-field-input
          v-for="field in tableData.fields"
          :key="field.id"
          :field="field"
          :model-value="fieldValues[field.id]"
          :is-error="!!fieldErrors[field.id]"
          :error-message="fieldErrors[field.id]"
          @update:model-value="fieldValues[field.id] = $event"
        />
      </div>
      <div class="form__footer">
        <ui-btn :disabled="!form.name" @click="handleCreate">Создать</ui-btn>
      </div>
    </div>

    <div v-if="loading" class="state">Загрузка...</div>

    <template v-else-if="tableData">
      <div v-if="tableData.fields.length === 0" class="state">
        Нет полей в данном типе коллекции
      </div>

      <div v-else-if="tableData.items.length === 0" class="state">
        Нет элементов — добавьте первый
      </div>

      <div v-else class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th>Название</th>
              <th v-for="field in tableData.fields" :key="field.id">
                {{ field.name }}
              </th>
              <th class="col-action" />
            </tr>
          </thead>
          <tbody>
            <template v-for="item in tableData.items" :key="item.id">
              <!-- Normal row -->
              <tr class="data-row" :class="{ 'data-row--editing': editingItemId === item.id }">
                <td>{{ item.name }}</td>
                <td v-for="field in tableData.fields" :key="field.id">
                  <template v-if="field.field_type === 'boolean'">
                    {{ item.values[String(field.id)] === true ? '✓' : item.values[String(field.id)] === false ? '✗' : '—' }}
                  </template>
                  <template v-else-if="field.field_type === 'date' && item.values[String(field.id)]">
                    {{ new Date(item.values[String(field.id)] as string).toLocaleDateString('ru-RU') }}
                  </template>
                  <template v-else>
                    {{ item.values[String(field.id)] ?? '—' }}
                  </template>
                </td>
                <td class="col-action">
                  <div class="row-actions">
                    <button
                      class="icon-btn"
                      :class="{ 'icon-btn--active': editingItemId === item.id }"
                      title="Редактировать"
                      @click="editingItemId === item.id ? cancelEditItem() : startEditItem(item)"
                    >
                      <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.5 2.5a1.414 1.414 0 0 1 2 2L5 13H3v-2L11.5 2.5z" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </button>
                    <button class="icon-btn icon-btn--danger" title="Удалить" @click="handleDeleteItem(item.id)">
                      <icons-trash class="icon-btn__icon" />
                    </button>
                  </div>
                </td>
              </tr>

              <!-- Edit row (inline expanded) -->
              <tr v-if="editingItemId === item.id" class="edit-row">
                <td :colspan="tableData.fields.length + 2">
                  <div class="edit-panel">
                    <div class="edit-panel__fields">
                      <ui-text-field v-model="editForm.name" label="Название *" />
                      <ui-field-input
                        v-for="field in tableData.fields"
                        :key="field.id"
                        :field="field"
                        :model-value="editFieldValues[field.id]"
                        :is-error="!!editFieldErrors[field.id]"
                        :error-message="editFieldErrors[field.id]"
                        @update:model-value="editFieldValues[field.id] = $event"
                      />
                    </div>
                    <div class="edit-panel__footer">
                      <ui-btn :disabled="!editForm.name" @click="saveEditItem(item.id)">Сохранить</ui-btn>
                      <button class="cancel-btn" @click="cancelEditItem">Отмена</button>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </template>
  </container>
</template>

<script setup lang="ts">
import { useCollectionStore } from '@/store/collection'
import type { CollectionTableResponse, CollectionTableItem } from '@/store/collection'

const route = useRoute()
const collectionStore = useCollectionStore()

const id = Number(route.params.id)
const loading = ref(true)
const isFormOpen = ref(false)
const tableData = ref<CollectionTableResponse | null>(null)
const collectionName = ref('')
const collectionTypeName = ref('')

// Create form
const form = ref({ name: '' })
const fieldValues = ref<Record<number, unknown>>({})
const fieldErrors = ref<Record<number, string>>({})

// Edit form
const editingItemId = ref<number | null>(null)
const editForm = ref({ name: '' })
const editFieldValues = ref<Record<number, unknown>>({})
const editFieldErrors = ref<Record<number, string>>({})

const { userCollections, currentUserCollection } = storeToRefs(collectionStore)

const loadTable = async () => {
  tableData.value = await collectionStore.getCollectionTable(id)
}

const validateFields = (values: Record<number, unknown>, errors: Record<number, string>): boolean => {
  let valid = true
  for (const field of tableData.value?.fields ?? []) {
    const val = values[field.id]
    const isEmpty = val === undefined || val === null || val === ''
    if (field.is_required && isEmpty) {
      errors[field.id] = 'Обязательное поле'
      valid = false
      continue
    }
    if (isEmpty) continue
    if (field.field_type === 'number' && isNaN(Number(val))) {
      errors[field.id] = 'Введите корректное число'
      valid = false
    }
    if (field.field_type === 'date' && isNaN(new Date(val as string).getTime())) {
      errors[field.id] = 'Введите корректную дату'
      valid = false
    }
  }
  return valid
}

const handleDeleteItem = async (itemId: number) => {
  if (editingItemId.value === itemId) cancelEditItem()
  await collectionStore.deleteCollectionItem(itemId)
  await loadTable()
}

const handleCreate = async () => {
  fieldErrors.value = {}
  if (!validateFields(fieldValues.value, fieldErrors.value)) return

  const item = await collectionStore.createCollectionItem({ name: form.value.name, user_collection_id: id })
  if (item) {
    for (const field of tableData.value?.fields ?? []) {
      const value = fieldValues.value[field.id]
      if (value !== undefined && value !== null && value !== '') {
        await collectionStore.createItemValue({ collection_item_id: item.id, field_id: field.id, value })
      }
    }
  }
  form.value.name = ''
  fieldValues.value = {}
  fieldErrors.value = {}
  isFormOpen.value = false
  await loadTable()
}

const startEditItem = (item: CollectionTableItem) => {
  editingItemId.value = item.id
  editForm.value.name = item.name
  editFieldValues.value = {}
  editFieldErrors.value = {}
  for (const field of tableData.value?.fields ?? []) {
    const raw = item.values[String(field.id)]
    editFieldValues.value[field.id] = raw !== undefined ? raw : (field.field_type === 'boolean' ? false : '')
  }
}

const cancelEditItem = () => {
  editingItemId.value = null
  editForm.value.name = ''
  editFieldValues.value = {}
  editFieldErrors.value = {}
}

const saveEditItem = async (itemId: number) => {
  editFieldErrors.value = {}
  if (!validateFields(editFieldValues.value, editFieldErrors.value)) return

  const values = (tableData.value?.fields ?? [])
    .map(field => ({ field_id: field.id, value: editFieldValues.value[field.id] }))
    .filter(v => v.value !== undefined && v.value !== null && v.value !== '')

  await collectionStore.updateCollectionItem(itemId, {
    name: editForm.value.name,
    values,
  })

  cancelEditItem()
  await loadTable()
}

onMounted(async () => {
  const match = userCollections.value?.find(c => c.id === id)
  if (match) {
    currentUserCollection.value = match
    collectionName.value = match.name
    collectionTypeName.value = match.collection_type_id.name
  }

  try {
    await loadTable()
  } finally {
    loading.value = false
  }
})
</script>

<style scoped lang="scss">
.my-collections-container {
  flex-grow: 1;
}

.page-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 24px;
  margin-bottom: 20px;

  &__row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
  }
}

.back-link {
  font-size: 14px;
  color: $black;
  text-decoration: none;
  opacity: 0.5;
  width: fit-content;

  &:hover {
    opacity: 1;
  }
}

.title {
  @include header-3;
  font-weight: 700;
  color: $gray900;
}

.subtitle {
  font-size: 14px;
  color: $gray600;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  border: 1px solid $gray300;
  border-radius: 10px;
  margin-bottom: 20px;

  &__fields {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__footer {
    display: flex;
    justify-content: flex-end;
  }
}

.state {
  margin-top: 40px;
  text-align: center;
  color: $gray600;
  font-size: 14px;
}

.table-wrap {
  overflow-x: auto;
  border-radius: 10px;
  border: 1px solid $gray300;
}

.table {
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 10px 16px;
    text-align: left;
    border-bottom: 1px solid $gray300;
    white-space: nowrap;
  }

  th {
    font-weight: 600;
    font-size: 13px;
    background: $gray200;
    color: $gray600;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }
}

.data-row {
  &:hover td {
    background: $gray200;
  }

  &--editing td {
    background: rgba(132, 88, 255, 0.04);
  }
}

.edit-row td {
  padding: 0;
  border-bottom: 1px solid $gray300;
  background: $gray200;
}

.edit-panel {
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  &__fields {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__footer {
    display: flex;
    align-items: center;
    gap: 12px;
    justify-content: flex-end;
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

.col-action {
  width: 80px;
  text-align: center;
}

.row-actions {
  display: flex;
  gap: 2px;
  justify-content: center;
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

  &:hover, &--active {
    color: $primary;
    background: rgba(132, 88, 255, 0.08);
  }

  &--danger:hover {
    color: $red400;
    background: rgba(220, 53, 69, 0.08);
  }
}
</style>
