<template>
  <modals-base title="Создать аккаунт">
    <div class="content">
      <div class="fields">
        <ui-text-field v-model="formValues.email" label="Почта*" :is-error="errors.email" @update:model-value="() => handleInput('email')" />
        <ui-text-field v-model="formValues.firstName" label="Имя*" :is-error="errors.firstName" @update:model-value="() => handleInput('firstName')" />
        <ui-text-field v-model="formValues.lastName" label="Фамилия*" :is-error="errors.lastName" @update:model-value="() => handleInput('lastName')" />
        <ui-text-field v-model="formValues.username" label="Логин*" :is-error="errors.username" @update:model-value="() => handleInput('username')" />
        <ui-text-field v-model="formValues.password" label="Пароль*" type="password" :is-error="errors.password" @update:model-value="() => handleInput('password')" />
        <ui-text-field v-model="formValues.repeatPassword" label="Повторите пароль*" type="password" :is-error="errors.repeatPassword" @update:model-value="() => handleInput('repeatPassword')" />
      </div>
      <div class="footer">
        <ui-btn @click="handleReg">Зарегистрироваться</ui-btn>
        <span class="link" @click="handleClick">У меня есть аккаунт</span>
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
  username: '', password: '', email: '',
  firstName: '', lastName: '', phone: '', repeatPassword: '',
})

const errors = ref<Record<keyof FormData, boolean>>({
  username: false, password: false, email: false,
  firstName: false, lastName: false, phone: false, repeatPassword: false,
})

const handleReg = async () => {
  Object.entries(formValues.value).forEach(([key, value]) => {
    if (value === '') errors.value[key as keyof FormData] = true
  })
  if (formValues.value.password !== formValues.value.repeatPassword) {
    errors.value.repeatPassword = true
  }
  if (Object.values(errors.value).some(Boolean)) return

  const { repeatPassword, ...data } = formValues.value
  await register(data)
  close()
}

const handleClick = () => {
  close()
  open('login')
}

const handleInput = (fieldName: keyof FormData) => {
  errors.value[fieldName] = false
}
</script>

<style scoped lang="scss">
.content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.link {
  font-size: 13px;
  color: $gray600;
  cursor: pointer;

  &:hover {
    color: $primary;
  }
}
</style>
