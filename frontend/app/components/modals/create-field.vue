<template>
  <modals-base title="Новое поле">
    <div class="content">
      <ui-text-field v-model="formValues.name" label="Название" />
      <ui-text-field v-model="formValues.description" label="Описание" />
      <ui-select-field v-model="formValues.field_type" :options="options" label="Тип поля" />

      <div v-if="formValues.field_type === 'select'" class="options-editor">
        <span class="options-editor__label">Варианты ответа</span>
        <div class="options-editor__list">
          <div v-for="(opt, idx) in selectOptions" :key="idx" class="options-editor__item">
            <ui-text-field v-model="selectOptions[idx]" :label="''" class="options-editor__field" />
            <button type="button" class="options-editor__remove" @click="removeOption(idx)">
              <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
        </div>
        <button type="button" class="options-editor__add" @click="addOption">+ Добавить вариант</button>
      </div>

      <div class="footer">
        <ui-btn @click="handleCreate">Создать</ui-btn>
      </div>
    </div>
  </modals-base>
</template>

<script setup lang="ts">
import type { SelectFieldProps } from '@/components/ui/select-field.vue'
import type { CreateFieldRequest } from '@/store/collection'
import { useCollectionStore } from '@/store/collection'
import { useModalStore } from '@/store/modal'

const { close } = useModalStore()
const { getFields, createField } = useCollectionStore()

const formValues = ref<CreateFieldRequest>({ name: '', description: '', field_type: 'string' })
const selectOptions = ref<string[]>([''])

const options: SelectFieldProps['options'] = [
  { value: 'string', label: 'Строка' },
  { value: 'number', label: 'Число' },
  { value: 'date', label: 'Дата' },
  { value: 'select', label: 'Вариант ответа' },
  { value: 'boolean', label: 'Да/Нет' },
]

const addOption = () => selectOptions.value.push('')
const removeOption = (idx: number) => selectOptions.value.splice(idx, 1)

const handleCreate = async () => {
  const payload: CreateFieldRequest = { ...formValues.value }
  if (formValues.value.field_type === 'select') {
    payload.options = selectOptions.value.map(o => o.trim()).filter(Boolean)
  }
  await createField(payload)
  await getFields()
  close()
}
</script>

<style scoped lang="scss">
.content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 4px;
}

.options-editor {
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

  &__list {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  &__field {
    flex: 1;
  }

  &__remove {
    flex-shrink: 0;
    width: 28px;
    height: 28px;
    border: none;
    background: none;
    color: $gray600;
    cursor: pointer;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.1s, color 0.1s;

    svg {
      width: 14px;
      height: 14px;
    }

    &:hover {
      background: rgba(255, 80, 80, 0.1);
      color: #e53e3e;
    }
  }

  &__add {
    align-self: flex-start;
    background: none;
    border: none;
    color: $primary;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    padding: 2px 0;

    &:hover {
      opacity: 0.8;
    }
  }
}
</style>
