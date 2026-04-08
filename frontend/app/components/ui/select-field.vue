<template>
  <div class="select-field">
    <label v-if="label" class="select-field__label" :for="id">{{ label }}</label>
    <div class="select-field__wrap">
      <select
        :id="id"
        v-model="value"
        :disabled="disabled"
        class="select-field__select"
      >
        <option v-if="placeholder" :value="null" disabled>{{ placeholder }}</option>
        <option v-for="option in options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      <span class="select-field__arrow">▾</span>
    </div>
  </div>
</template>

<script setup lang="ts">
type Option = {
  label: string
  value: string | number
}

export type SelectFieldProps = {
  modelValue: string | number | null
  options: Option[]
  placeholder?: string
  label?: string
  disabled?: boolean
}

const props = defineProps<SelectFieldProps>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | null): void
}>()

const id = computed(() => props.label?.replace(/\s+/g, '-').toLowerCase())

const value = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
})
</script>

<style scoped lang="scss">
.select-field {
  display: flex;
  flex-direction: column;
  gap: 4px;

  &__label {
    font-size: 12px;
    font-weight: 600;
    color: $gray600;
    text-transform: uppercase;
    letter-spacing: 0.4px;
  }

  &__wrap {
    position: relative;
    display: flex;
    align-items: center;
  }

  &__select {
    width: 100%;
    appearance: none;
    border: 1.5px solid $gray300;
    border-radius: 8px;
    padding: 8px 36px 8px 12px;
    font-size: 14px;
    color: $gray900;
    background: $white;
    outline: none;
    cursor: pointer;
    transition: border-color 0.15s;

    &:focus {
      border-color: $primary;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  &__arrow {
    position: absolute;
    right: 12px;
    pointer-events: none;
    font-size: 12px;
    color: $gray600;
  }
}
</style>
