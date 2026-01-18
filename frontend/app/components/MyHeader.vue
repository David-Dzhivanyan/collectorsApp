<template>
  <header class="header">
    <container class="container">
      <nuxt-link to="/" class="logo-link">
        <icons-logo class="logo" />
        CollectorsApp
      </nuxt-link>

      <div class="links">
        <nuxt-link to="/my-collections" class="link-item">
          Мои коллекции
        </nuxt-link>
        <nuxt-link to="/collection-type" class="link-item">
          Типы коллекций
        </nuxt-link>
        <nuxt-link to="/field-list" class="link-item">
          Поля коллекций
        </nuxt-link>
      </div>

      <div class="navs">
        <nuxt-link to="/profile" class="profile-link">
          <div class="profile-icon">
            <icons-profile class="profile" />
          </div>
          {{ currentUser?.username }}
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
  box-shadow: $box-shadow-header;
}

.container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.logo-link {
  font-family: 'Exo 2', 'sans-serif';
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
  align-items: center;
  gap: 8px;
  height: 100%;
}

.profile-link {
  display: flex;
  gap: 8px;
  align-items: center;
  cursor: pointer;

  &:hover {
    color: $primary;

    .profile {
      fill: $primary;
    }
  }
}

.links {
  display: flex;
  gap: 12px;
}

.profile-icon {
  background: $gray300;
  border-radius: 32px;
  width: 42px;
  height: 42px;
  padding: 8px;
}

.profile {
  width: 100%;
  height: 100%;
}

.entry-btn {
  padding: 2px 8px;
}
</style>
