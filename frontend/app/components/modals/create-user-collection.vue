<template>
  <modals-base title="Создать коллекцию">
    <div class="content">
      <ui-select-field
        v-model="formValues.collection_type_id"
        :options="options"
        label="Тип коллекции"
        @update:model-value="(value: number | string | null) => onChangeType(value)"
      />
      <ui-text-field v-model="formValues.name" label="Название коллекции" />
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
import { useCollectionStore } from '@/store/collection'
import { useModalStore } from '@/store/modal'
import { useUserStore } from '@/store/user'

const { close } = useModalStore()

const { collectionTypeList } = storeToRefs(useCollectionStore())
const { getCollectionTypes, createUserCollection, getUserCollections } = useCollectionStore()
const { currentUser } = storeToRefs(useUserStore())

const formValues = ref<{ name: string, collection_type_id: number }>({ name: '', collection_type_id: -1 })

const options = computed<SelectFieldProps['options']>(() => {
  const result: SelectFieldProps['options'] = []
  collectionTypeList.value?.forEach(item => {
    result.push({ value: item.id, label: item.name })
  })

  return result
})

const handleCreate = async () => {
  await createUserCollection(formValues.value)
  if (currentUser.value) {
    await getUserCollections(currentUser.value.id)
  }
}

const onChangeType = async (option: number | string | null) => {
  const currentOption = options.value.find(item => {
    return item.value === option
  })

  formValues.value.name = currentOption?.label || ''
}

onMounted(async () => {
  if (!collectionTypeList.value) {
    await getCollectionTypes()
  }
})
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
