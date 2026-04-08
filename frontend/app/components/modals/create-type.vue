<template>
  <modals-base title="Новый тип коллекции">
    <div class="content">
      <ui-text-field v-model="formValues.name" label="Название" />
      <ui-text-field v-model="formValues.description" label="Описание" />

      <div class="fields-picker">
        <span class="fields-picker__label">Поля</span>
        <div v-if="!fieldsList || fieldsList.length === 0" class="fields-picker__empty">
          Нет доступных полей
        </div>
        <div v-else class="fields-picker__chips">
          <button
            v-for="field in fieldsList"
            :key="field.id"
            type="button"
            class="chip"
            :class="{ 'chip--active': selectedFieldIds.has(field.id) }"
            @click="toggleField(field.id)"
          >
            <span class="chip__name">{{ field.name }}</span>
            <span class="chip__type">{{ fieldTypeLabel(field.field_type) }}</span>
            <svg v-if="selectedFieldIds.has(field.id)" class="chip__check" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <div class="footer">
        <ui-btn :loading="submitting" @click="handleCreate">Создать</ui-btn>
      </div>
    </div>
  </modals-base>
</template>

<script setup lang="ts">
import type { CreateCollectionTypeRequest } from '@/store/collection'
import { useCollectionStore } from '@/store/collection'
import { useModalStore } from '@/store/modal'

const { close } = useModalStore()
const collectionStore = useCollectionStore()
const { fieldsList } = storeToRefs(collectionStore)

const formValues = ref<CreateCollectionTypeRequest>({ name: '', description: '' })
const selectedFieldIds = ref(new Set<number>())
const submitting = ref(false)

const fieldTypeLabel = (type: string) => {
  const map: Record<string, string> = {
    string: 'строка',
    number: 'число',
    date: 'дата',
    select: 'выбор',
    boolean: 'да/нет',
  }
  return map[type] ?? type
}

const toggleField = (id: number) => {
  if (selectedFieldIds.value.has(id)) {
    selectedFieldIds.value.delete(id)
  } else {
    selectedFieldIds.value.add(id)
  }
}

const handleCreate = async () => {
  submitting.value = true
  try {
    const created = await collectionStore.createCollectionTypeWithFields(
      formValues.value,
      [...selectedFieldIds.value],
    )
    await collectionStore.getCollectionTypes()
    close()
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  if (!fieldsList.value) {
    await collectionStore.getFields()
  }
})
</script>

<style scoped lang="scss">
.content {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 4px;
}

.fields-picker {
  display: flex;
  flex-direction: column;
  gap: 8px;

  &__label {
    font-size: 12px;
    font-weight: 600;
    color: $gray600;
    text-transform: uppercase;
    letter-spacing: 0.4px;
  }

  &__empty {
    font-size: 13px;
    color: $gray600;
  }

  &__chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  border-radius: 20px;
  border: 1.5px solid $gray300;
  background: $white;
  cursor: pointer;
  font-size: 13px;
  color: $gray900;
  transition: border-color 0.15s, background 0.15s, color 0.15s;
  outline: none;

  &:hover {
    border-color: $primary;
  }

  &--active {
    border-color: $primary;
    background: rgba(132, 88, 255, 0.07);
    color: $primary;

    .chip__type {
      color: rgba(132, 88, 255, 0.7);
    }
  }

  &__name {
    font-weight: 600;
  }

  &__type {
    font-size: 11px;
    color: $gray600;
  }

  &__check {
    width: 13px;
    height: 13px;
    color: $primary;
    flex-shrink: 0;
  }
}
</style>
