<template>
  <modals-base title="Создать аккаунт">
    <div class="content">
      <div class="fields">
        <ui-text-field
          v-model="formValues.email"
          label="Почта*"
          :is-error="errors.email"
          @update:model-value="() => handleInput('email')"
        />
        <ui-text-field
          v-model="formValues.firstName"
          label="Имя*"
          :is-error="errors.firstName"
          @update:model-value="() => handleInput('firstName')"
        />
        <ui-text-field
          v-model="formValues.lastName"
          label="Фамилия*"
          :is-error="errors.lastName"
          @update:model-value="() => handleInput('lastName')"
        />
        <ui-text-field
          v-model="formValues.username"
          label="Логин*"
          :is-error="errors.username"
          @update:model-value="() => handleInput('username')"
        />
        <ui-text-field
          v-model="formValues.password"
          label="Пароль*" type="password"
          :is-error="errors.password"
          @update:model-value="() => handleInput('password')"
        />
        <ui-text-field
          v-model="formValues.repeatPassword"
          label="Повторите пароль*"
          type="password"
          :is-error="errors.repeatPassword"
          @update:model-value="() => handleInput('repeatPassword')"
        />
      </div>
      <div class="btns">
        <ui-btn class="btn" @click="handleReg">
          Зарегистрироваться
        </ui-btn>
        <div class="link" @click="handleClick">
          У меня есть аккаунт
        </div>
      </div>
    </div>
  </modals-base>
</template>

<script setup lang="ts">
import type { RegData } from '@/types'
import { useAuthStore } from '@/store/auth'
import { useModalStore } from '@/store/modal'

const { register } = useAuthStore()
const { close, open } = useModalStore()
type FormData = { repeatPassword: string } & RegData

const formValues = ref<FormData>({
  username: 'opelik417',
  password: '12421242qwe',
  email: 'test@mail.com',
  firstName: 'Давид',
  lastName: 'Дживанян',
  phone: '+79831238931',
  repeatPassword: '12421242qwe',
 })

const errors = ref<Record <keyof FormData, boolean>>({
  username: false,
  password: false,
  email: false,
  firstName: false,
  lastName: false,
  phone: false,
  repeatPassword: false,
 })

const handleReg = async () => {
  Object.entries(formValues.value).forEach(([key, value]) => {
    if (value === '') {
      errors.value[key] = true
    }
  })

  if (formValues.value.password !== formValues.value.repeatPassword) {
    errors.value.repeatPassword = true
  }

  if (checkErrors()) {
    return 1
  }

  const { repeatPassword, ...data } = formValues.value
  await register(data)
  close()
}

const handleClick = async () => {
  close()
  open('login')
}

const handleInput = (fieldName: keyof FormData) => {
  errors.value[fieldName] = false
}

function checkErrors() {
  return Object.values(errors.value).some(Boolean)
}
</script>

<style scoped lang="scss">
.content {
  width: 500px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

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
</style>
