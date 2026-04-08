<template>
  <container>
    <ui-page-section>
      <template #title>Типы коллекций</template>
      <template #action>
        <ui-btn v-if="isAuth" @click="handleCreateType">Создать</ui-btn>
      </template>

      <div v-if="loading" class="state">Загрузка...</div>

      <div v-else-if="!rows || rows.length === 0" class="state">Нет типов коллекций</div>

      <div v-else class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th>Название</th>
              <th>Описание</th>
              <th>Поля</th>
              <th>Автор</th>
              <th v-if="isAuth" class="col-action" />
            </tr>
          </thead>
          <tbody>
            <template v-for="row in rows" :key="row.id">
              <tr class="main-row" @click="toggleExpanded(row.id)">
                <td class="cell-name">
                  <span class="expand-icon">{{ expandedId === row.id ? '▾' : '▸' }}</span>
                  {{ row.name }}
                </td>
                <td class="cell-muted">{{ row.description || '—' }}</td>
                <td>
                  <div class="badges">
                    <span v-for="f in row.fields" :key="f.id" class="badge">{{ f.name }}</span>
                    <span v-if="row.fields.length === 0" class="cell-muted">Нет полей</span>
                  </div>
                </td>
                <td class="cell-muted">{{ row.created_by }}</td>
                <td v-if="isAuth" class="col-action">
                  <button class="delete-btn" title="Удалить тип" @click.stop="handleDeleteType(row.id)">
                    <icons-trash class="delete-btn__icon" />
                  </button>
                </td>
              </tr>

              <tr v-if="expandedId === row.id" class="expanded-row">
                <td :colspan="isAuth ? 5 : 4">
                  <div class="field-panel">
                    <div class="field-panel__title">Поля типа «{{ row.name }}»</div>
                    <div class="field-panel__list">
                      <div v-for="f in row.fields" :key="f.id" class="field-tag">
                        <span>{{ f.name }}</span>
                        <span class="field-tag__type">{{ f.field_type }}</span>
                        <button v-if="isAuth" class="field-tag__remove" title="Убрать поле" @click="handleRemoveField(f.id, row.id)">×</button>
                      </div>
                      <div v-if="row.fields.length === 0" class="cell-muted">Поля не добавлены</div>
                    </div>

                    <div v-if="isAuth" class="field-panel__add">
                      <ui-select-field
                        v-model="addFieldState[row.id]"
                        :options="availableFieldOptions(row)"
                        label="Добавить поле"
                        placeholder="Выберите поле"
                        class="field-panel__select"
                      />
                      <ui-btn :disabled="!addFieldState[row.id]" @click="handleAddField(row.id)">
                        Добавить
                      </ui-btn>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </ui-page-section>
  </container>
</template>

<script setup lang="ts">
import { useCollectionStore } from '@/store/collection'
import type { CollectionTypeTableRow } from '@/store/collection'
import { useModalStore } from '@/store/modal'
import { useAuthStore } from '@/store/auth'

const collectionStore = useCollectionStore()
const { open } = useModalStore()
const { isAuth } = storeToRefs(useAuthStore())
const { fieldsList } = storeToRefs(collectionStore)

const loading = ref(true)
const rows = ref<CollectionTypeTableRow[]>([])
const expandedId = ref<number | null>(null)
const addFieldState = ref<Record<number, number | null>>({})

const handleCreateType = () => open('createType')

const loadTable = async () => {
  rows.value = await collectionStore.getCollectionTypesTable()
}

const toggleExpanded = (id: number) => {
  expandedId.value = expandedId.value === id ? null : id
}

const availableFieldOptions = (row: CollectionTypeTableRow) => {
  const usedIds = new Set(row.fields.map(f => f.fieldId))
  return (fieldsList.value ?? [])
    .filter(f => !usedIds.has(f.id))
    .map(f => ({ value: f.id, label: f.name }))
}

const handleDeleteType = async (typeId: number) => {
  await collectionStore.deleteCollectionType(typeId)
  await loadTable()
}

const handleRemoveField = async (collectionTypeFieldId: number, typeId: number) => {
  await collectionStore.deleteCollectionTypeField(collectionTypeFieldId)
  await loadTable()
  expandedId.value = typeId
}

const handleAddField = async (typeId: number) => {
  const fieldId = addFieldState.value[typeId]
  if (!fieldId) return
  await collectionStore.createCurrentCollectionField({ collection_type_id: typeId, field_id: Number(fieldId) })
  addFieldState.value[typeId] = null
  await loadTable()
  expandedId.value = typeId
}

onMounted(async () => {
  await Promise.all([
    loadTable(),
    !fieldsList.value ? collectionStore.getFields() : Promise.resolve(),
  ])
  loading.value = false
})

watch(() => collectionStore.collectionTypeList, async () => {
  await loadTable()
})
</script>

<style scoped lang="scss">
.state {
  text-align: center;
  color: $gray600;
  font-size: 14px;
  padding: 40px 0;
}

.table-wrap {
  overflow-x: auto;
  border-radius: 10px;
  border: 1px solid $gray300;
}

.table {
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 10px 16px;
    text-align: left;
    border-bottom: 1px solid $gray300;
  }

  th {
    font-weight: 600;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    background: $gray200;
    color: $gray600;
  }

  tbody .main-row {
    cursor: pointer;

    &:hover td {
      background: rgba(132, 88, 255, 0.03);
    }
  }

  tbody tr:last-child td {
    border-bottom: none;
  }
}

.cell-name {
  font-weight: 600;
  color: $gray900;
  white-space: nowrap;
}

.cell-muted {
  color: $gray600;
  font-size: 13px;
}

.expand-icon {
  display: inline-block;
  width: 16px;
  color: $gray600;
  font-size: 11px;
}

.badges {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.badge {
  font-size: 11px;
  font-weight: 600;
  background: rgba(132, 88, 255, 0.08);
  color: $primary;
  padding: 2px 8px;
  border-radius: 20px;
  white-space: nowrap;
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
  margin: 0 auto;

  &:hover {
    color: $red400;
    background: rgba(220, 53, 69, 0.08);
  }

  &__icon {
    width: 16px;
    height: 16px;
  }
}

.expanded-row td {
  background: $gray200;
  padding: 0;
  border-bottom: 1px solid $gray300;
}

.field-panel {
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  &__title {
    font-weight: 700;
    font-size: 13px;
    color: $gray900;
  }

  &__list {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  &__add {
    display: flex;
    align-items: flex-end;
    gap: 8px;
  }

  &__select {
    min-width: 220px;
  }
}

.field-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: $white;
  border: 1px solid $gray300;
  border-radius: 20px;
  padding: 4px 10px;
  font-size: 13px;
  color: $gray900;

  &__type {
    font-size: 11px;
    color: $gray600;
  }

  &__remove {
    background: none;
    border: none;
    cursor: pointer;
    color: $gray600;
    font-size: 16px;
    line-height: 1;
    padding: 0 2px;
    display: flex;
    align-items: center;

    &:hover {
      color: $red400;
    }
  }
}
</style>
