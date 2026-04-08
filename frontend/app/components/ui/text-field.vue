<template>
  <div class="text-field" :class="{ 'text-field--error': isError }">
    <label v-if="label" class="text-field__label" :for="id">{{ label }}</label>
    <input
      :id="id"
      v-model="model"
      class="text-field__input"
      :type="type"
      :name="id"
      :placeholder="placeholder"
    />
  </div>
</template>

<script setup lang="ts">
export type TextFieldProps = {
  label?: string
  modelValue?: string | number
  type?: 'number' | 'text' | 'search' | 'password' | 'email'
  placeholder?: string
  isError?: boolean
}

const props = withDefaults(defineProps<TextFieldProps>(), {
  type: 'text',
  isError: false,
})

const id = computed(() => props.label?.replace(/\s+/g, '-').toLowerCase())
const model = defineModel<string | number>()
</script>

<style scoped lang="scss">
.text-field {
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

  &__input {
    border: 1.5px solid $gray300;
    border-radius: 8px;
    padding: 4px 8px;
    font-size: 14px;
    color: $gray900;
    background: $white;
    outline: none;
    transition: border-color 0.15s;

    &::placeholder {
      color: $gray600;
    }

    &:focus {
      border-color: $primary;
    }
  }

  &--error &__input {
    border-color: $red400;
  }

  &--error &__label {
    color: $red400;
  }
}
</style>
