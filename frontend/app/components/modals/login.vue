<template>
  <modals-base title="Войти в аккаунт">
    <div class="content">
      <ui-text-field v-model="formValues.username" label="Логин" />
      <ui-text-field v-model="formValues.password" label="Пароль" type="password" />
      <div class="btns">
        <ui-btn class="btn" @click="handleLogin">
          Войти
        </ui-btn>
        <div class="link" @click="handleClick">
          Я не зарегистрирован
        </div>
      </div>
    </div>
  </modals-base>
</template>

<script setup lang="ts">
import type { LoginData } from '@/types'
import { useAuthStore } from '@/store/auth'
import { useModalStore } from '@/store/modal'

const { login } = useAuthStore()
const { close, open } = useModalStore()

const formValues = ref<LoginData>({ username: 'opelik417', password: '12421242qwe' })

const handleLogin = async () => {
  try {
    await login(formValues.value)
    close()
  } catch (e) {
    console.log(e)
  }
}

const handleClick = async () => {
  close()
  open('register')
}
</script>

<style scoped lang="scss">
.content {
  display: flex;
  flex-direction: column;
  gap: 12px;

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
}
</style>
