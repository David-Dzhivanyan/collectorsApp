<template>
  <modals-base :title="currentCollection?.name || ''">
    <div class="content">
      {{ currentCollection?.description }}
    </div>
    <div v-for="field in currentCollectionFields" :key="field.id">
      {{ field.field_id.name }}
      {{ field.field_id.field_type }}
    </div>
    <ui-btn @click="() => { isAddField = !isAddField }">
      {{ !isAddField ? 'Добавить поле' : 'Скрыть' }}
    </ui-btn>
    <div v-if="isAddField">
      <fields-list />
    </div>
  </modals-base>
</template>

<script setup lang="ts">
import { useCollectionStore } from '@/store/collection'

const { currentCollection, currentCollectionFields } = storeToRefs(useCollectionStore())
const { getCurrentCollectionTypeField } = useCollectionStore()

const isAddField = ref(false)

onMounted(async () => {
  if (currentCollection.value) {
    await getCurrentCollectionTypeField(currentCollection.value.id)
  }
})
</script>

<style scoped lang="scss">
.content {
  width: 600px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
