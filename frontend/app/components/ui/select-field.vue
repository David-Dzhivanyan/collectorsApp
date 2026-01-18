<template>
  <div class="select-field">
    <label class="label" :for="id">
      {{ label }}
    </label>
    <select
      v-model="value"
      :disabled="disabled"
      class="select"
    >
      <option
        v-if="placeholder"
        :value="null"
        disabled
      >
        {{ placeholder }}
      </option>

      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type Option = {
  label: string
  value: string | number
}

export type SelectFieldProps = {
  modelValue: string | number | null
  options: Option[]
  placeholder?: string
  label: string
  disabled?: boolean
}
const props = defineProps<SelectFieldProps>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | null): void
}>()

const id = computed(() => props.label.replace(/\s+/g, '-').toLowerCase())

const value = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
})
</script>

<style scoped lang="scss">
.select-field {
  display: flex;
  flex-direction: column;
}

.select {
  margin-top: 2px;
  border: 1px solid $black;
}
</style>
