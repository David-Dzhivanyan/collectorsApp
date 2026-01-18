<template>
  <div class="info-block">
    <h1>Начинай уже сейчас!</h1>
    <ui-btn class="reg-btn" @click="handleRegistration">
      {{ isAuth ? 'Приступить' : 'Зарегистрироваться' }}
    </ui-btn>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { useModalStore } from '@/store/modal'

const { open } = useModalStore()

const { isAuth } = storeToRefs(useAuthStore())
const router = useRouter()

const handleRegistration = async () => {
  if (isAuth) {
    router.push('/profile')
  } else {
    open('register')
  }
}
</script>

<style scoped lang="scss">
.info-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  background-color: $gray200;
  padding: 60px;
  border-radius: 24px;
}

.reg-btn {
  text-transform: uppercase;
  font-weight: 600;
  padding: 10px 18px;
}
</style>
