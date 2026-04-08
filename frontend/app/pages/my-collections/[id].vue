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

    <div v-if="isFormOpen && tableData" class="form">
      <div class="form__fields">
        <ui-text-field v-model="form.name" label="Название" />
        <ui-text-field
          v-for="field in tableData.fields"
          :key="field.id"
          v-model="fieldValues[field.id]"
          :label="field.name"
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
            <tr v-for="item in tableData.items" :key="item.id">
              <td>{{ item.name }}</td>
              <td v-for="field in tableData.fields" :key="field.id">
                {{ item.values[String(field.id)] ?? '—' }}
              </td>
              <td class="col-action">
                <button class="delete-btn" title="Удалить" @click="handleDeleteItem(item.id)">
                  <icons-trash class="delete-btn__icon" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </container>
</template>

<script setup lang="ts">
import { useCollectionStore } from '@/store/collection'
import type { CollectionTableResponse } from '@/store/collection'

const route = useRoute()
const collectionStore = useCollectionStore()

const id = Number(route.params.id)
const loading = ref(true)
const isFormOpen = ref(false)
const tableData = ref<CollectionTableResponse | null>(null)
const collectionName = ref('')
const collectionTypeName = ref('')

const form = ref({ name: '' })
const fieldValues = ref<Record<number, string>>({})

const { userCollections, currentUserCollection } = storeToRefs(collectionStore)

const loadTable = async () => {
  tableData.value = await collectionStore.getCollectionTable(id)
}

const handleDeleteItem = async (itemId: number) => {
  await collectionStore.deleteCollectionItem(itemId)
  await loadTable()
}

const handleCreate = async () => {
  const item = await collectionStore.createCollectionItem({ name: form.value.name, user_collection_id: id })
  console.log(collectionStore.currentUserCollection)
  if (item) {
    for (const field of tableData.value?.fields ?? []) {
      const value = fieldValues.value[field.id]
      if (value) {
        await collectionStore.createItemValue({ collection_item_id: item.id, field_id: field.id, value })
      }
    }
  }
  form.value.name = ''
  fieldValues.value = {}
  isFormOpen.value = false
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
    gap: 8px;
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

  tbody tr:hover td {
    background: $gray200;
  }
}

.col-action {
  width: 48px;
  text-align: center;
}

.delete-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: $gray600;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s, background 0.15s;

  &:hover {
    color: $red400;
    background: rgba(220, 53, 69, 0.08);
  }

  &__icon {
    width: 16px;
    height: 16px;
  }
}
</style>
