<template>
  <modals-base title="Новое поле">
    <div class="content">
      <ui-text-field v-model="formValues.name" label="Название" />
      <ui-text-field v-model="formValues.description" label="Описание" />
      <ui-select-field v-model="formValues.field_type" :options="options" label="Тип поля" />
      <div class="btns">
        <ui-btn class="btn" @click="handleCreate">
          Создать
        </ui-btn>
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

const options: SelectFieldProps['options'] = [
  { value: 'string', label: 'Строка' },
  { value: 'number', label: 'Число' },
  { value: 'date', label: 'Дата' },
  { value: 'select', label: 'Вариант ответа' },
  { value: 'boolean', label: 'Да/Нет' },
]
const handleCreate = async () => {
  await createField(formValues.value)
  await getFields()
  close()
}
</script>

<style scoped lang="scss">
.content {
  display: flex;
  flex-direction: column;
  gap: 12px;

  .btns {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 8px;
  }

  .btn {
    width: fit-content;
  }

  .link {
    cursor: pointer;

    &:hover {
      color: $primary;
    }
  }
}
</style>
