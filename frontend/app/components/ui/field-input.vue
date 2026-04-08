<template>
  <!-- boolean: toggle -->
  <div v-if="field.field_type === 'boolean'" class="field-input field-input--boolean">
    <span class="field-input__label" :class="{ 'field-input__label--error': isError }">
      {{ field.name }}<span v-if="field.is_required" class="field-input__required">*</span>
    </span>
    <label class="toggle">
      <input
        type="checkbox"
        class="toggle__input"
        :checked="booleanValue"
        @change="onBooleanChange"
      />
      <span class="toggle__track" />
    </label>
    <span v-if="isError && errorMessage" class="field-input__error">{{ errorMessage }}</span>
  </div>

  <!-- date: native date picker styled like text-field -->
  <div v-else-if="field.field_type === 'date'" class="field-input">
    <label class="field-input__label" :class="{ 'field-input__label--error': isError }">
      {{ field.name }}<span v-if="field.is_required" class="field-input__required">*</span>
    </label>
    <input
      type="date"
      class="field-input__date"
      :class="{ 'field-input__date--error': isError }"
      :value="dateInputValue"
      @change="onDateChange"
    />
    <span v-if="isError && errorMessage" class="field-input__error">{{ errorMessage }}</span>
  </div>

  <!-- string | number | select -->
  <div v-else class="field-input">
    <ui-text-field
      :label="field.name + (field.is_required ? ' *' : '')"
      :type="field.field_type === 'number' ? 'number' : 'text'"
      :model-value="(modelValue as string | number)"
      :is-error="isError"
      @update:model-value="emit('update:modelValue', $event)"
    />
    <span v-if="isError && errorMessage" class="field-input__error">{{ errorMessage }}</span>
  </div>
</template>

<script setup lang="ts">
import type { CollectionTableField } from '@/store/collection'

const props = defineProps<{
  field: CollectionTableField
  modelValue: unknown
  isError?: boolean
  errorMessage?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: unknown): void
}>()

const booleanValue = computed(() =>
  props.modelValue === true || props.modelValue === 'true'
)

const onBooleanChange = (e: Event) => {
  emit('update:modelValue', (e.target as HTMLInputElement).checked)
}

const dateInputValue = computed(() => {
  if (!props.modelValue) return ''
  return String(props.modelValue).slice(0, 10)
})

const onDateChange = (e: Event) => {
  const v = (e.target as HTMLInputElement).value
  emit('update:modelValue', v ? new Date(v + 'T00:00:00').toISOString() : '')
}
</script>

<style scoped lang="scss">
.field-input {
  display: flex;
  flex-direction: column;
  gap: 4px;

  &--boolean {
    flex-direction: row;
    align-items: center;
    gap: 10px;
    padding: 4px 0;
  }

  &__label {
    font-size: 12px;
    font-weight: 600;
    color: $gray600;
    text-transform: uppercase;
    letter-spacing: 0.4px;

    &--error {
      color: $red400;
    }
  }

  &__required {
    color: $red400;
    margin-left: 2px;
  }

  &__date {
    border: 1.5px solid $gray300;
    border-radius: 8px;
    padding: 4px 8px;
    font-size: 14px;
    color: $gray900;
    background: $white;
    outline: none;
    transition: border-color 0.15s;
    cursor: pointer;

    &:focus {
      border-color: $primary;
    }

    &--error {
      border-color: $red400;
    }
  }

  &__error {
    font-size: 11px;
    color: $red400;
    margin-top: -2px;
  }
}

// Toggle switch
.toggle {
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  flex-shrink: 0;

  &__input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  &__track {
    display: inline-block;
    width: 36px;
    height: 20px;
    border-radius: 10px;
    background: $gray300;
    transition: background 0.15s;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      top: 3px;
      left: 3px;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: $white;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
      transition: transform 0.15s;
    }
  }

  &__input:checked + &__track {
    background: $primary;

    &::after {
      transform: translateX(16px);
    }
  }
}
</style>
