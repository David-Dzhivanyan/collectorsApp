<template>
  <header class="header">
    <container class="container">
      <nuxt-link to="/" class="logo-link">
        <icons-logo class="logo" />
        CollectorsApp
      </nuxt-link>
      <div class="navs">
        <nuxt-link to="/profile" class="profile-link">
          {{ currentUser?.username }}
          <icons-profile class="profile" />
        </nuxt-link>
        <ui-btn class="entry-btn" @click="handleEntry">
          {{ isAuth ? 'Выйти' : 'Войти' }}
        </ui-btn>
      </div>
    </container>
  </header>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/store/auth'
import { useModalStore } from '@/store/modal'
import { useUserStore } from '@/store/user'

const { open } = useModalStore()
const { isAuth } = storeToRefs(useAuthStore())
const { logout } = useAuthStore()
const { currentUser } = storeToRefs(useUserStore())

const handleEntry = async () => {
  if (isAuth.value) {
    await logout()
  } else {
    open('login')
  }
}
</script>

<style scoped lang="scss">
.header {
  width: 100%;
  box-shadow: $box-shadow-default;
}

.container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.logo-link {
  font-family: 'Mogra', 'sans-serif';
  display: flex;
  align-items: center;
  gap: 8px;
  margin-right: 20px;
  color: $primary;
}

.logo {
  width: 30px;
  height: 30px;
  fill: $primary;
}

.navs {
  display: flex;
  gap: 8px;
  height: 100%;
}

.profile-link {
  display: flex;
  align-items: center;
  cursor: pointer;
  height: 30px;

  &:hover {
    color: $primary;

    .profile {
      fill: $primary;
    }
  }
}

.profile {
  width: 100%;
  height: 100%;
}

.entry-btn {
  padding: 2px 8px;
}
</style>
