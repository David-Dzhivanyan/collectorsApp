<template>
  <div class="text-field" :class="{ ['error']: isError }">
    <label class="label" :for="id">
      {{ label }}
    </label>
    <input :id="id" v-model="model" class="input" :type="type" :name="id" />
  </div>
</template>

<script setup lang="ts">
export type TextFieldProps = {
  label: string
  modelValue?: string | number
  type?: 'number' | 'text' | 'search' | 'password' | 'email'
  isError?: boolean
}

const props = withDefaults(defineProps<TextFieldProps>(), {
  type: 'text',
  isError: false,
})

const id = computed(() => props.label.replace(/\s+/g, '-').toLowerCase())
const model = defineModel<string | number>()
</script>

<style scoped lang="scss">
.text-field {
  display: flex;
  flex-direction: column;
}

.input {
  margin-top: 2px;
  border: 1px solid $black;
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
