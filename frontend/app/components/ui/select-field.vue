<template>
  <div ref="root" class="select-field">
    <label v-if="label" class="select-field__label">{{ label }}</label>

    <button
      type="button"
      class="select-field__trigger"
      :class="{ 'select-field__trigger--open': isOpen, 'select-field__trigger--placeholder': !selectedOption }"
      :disabled="disabled"
      @click="toggle"
    >
      <span>{{ selectedOption ? selectedOption.label : (placeholder ?? 'Выберите...') }}</span>
      <svg class="select-field__chevron" :class="{ 'select-field__chevron--up': isOpen }" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <Transition name="dropdown">
      <div v-if="isOpen" class="select-field__dropdown">
        <button
          v-for="option in options"
          :key="option.value"
          type="button"
          class="select-field__option"
          :class="{ 'select-field__option--active': option.value === modelValue }"
          @click="select(option)"
        >
          {{ option.label }}
          <svg v-if="option.value === modelValue" class="select-field__check" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'

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

const root = ref<HTMLElement | null>(null)
const isOpen = ref(false)

const selectedOption = computed(() =>
  props.options.find(o => o.value === props.modelValue) ?? null
)

const toggle = () => {
  if (!props.disabled) isOpen.value = !isOpen.value
}

const select = (option: Option) => {
  emit('update:modelValue', option.value)
  isOpen.value = false
}

onClickOutside(root, () => {
  isOpen.value = false
})
</script>

<style scoped lang="scss">
.select-field {
  position: relative;
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

  &__trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    width: 100%;
    border: 1.5px solid $gray300;
    border-radius: 8px;
    padding: 4px 8px;
    font-size: 14px;
    color: $gray900;
    background: $white;
    cursor: pointer;
    text-align: left;
    transition: border-color 0.15s;
    outline: none;
    min-height: 34px;

    &:hover:not(:disabled) {
      border-color: darken(#F1F4F9, 10%);
    }

    &--open {
      border-color: $primary;
    }

    &--placeholder span {
      color: $gray600;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  &__chevron {
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    color: $gray600;
    transition: transform 0.15s;

    &--up {
      transform: rotate(180deg);
    }
  }

  &__dropdown {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    right: 0;
    background: $white;
    border: 1.5px solid $gray300;
    border-radius: 8px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    z-index: 100;
    overflow: hidden;
    padding: 4px;
  }

  &__option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 7px 10px;
    font-size: 14px;
    color: $gray900;
    background: none;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    text-align: left;
    transition: background 0.1s;

    &:hover {
      background: $gray200;
    }

    &--active {
      color: $primary;
      font-weight: 600;
      background: rgba(132, 88, 255, 0.06);
    }
  }

  &__check {
    flex-shrink: 0;
    width: 14px;
    height: 14px;
    color: $primary;
  }
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.12s ease, transform 0.12s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
