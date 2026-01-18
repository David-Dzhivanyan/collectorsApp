<template>
  <div class="text-field" :class="{ ['error']: isError }">
    <label v-if="label" class="label" :for="id">
      {{ label }}
    </label>
    <input :id="id" v-model="model" class="input" :type="type" :name="id" :placeholder="placeholder" />
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
}

.label {
  margin-bottom: 8px;
}

.input {
  border: 1px solid $gray300;
  border-radius: 16px;
  padding: 12px 18px;
  outline: none;
}

.input:focus {
  border-color: $primary;
}

.error {
  .input {
    border-color: $red400;
  }

  .label {
    color: $red400;
  }
}
</style>
