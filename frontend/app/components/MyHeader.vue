<template>
  <header class="header">
    <container class="container">
      <nuxt-link to="/" class="logo-link">
        <icons-logo class="logo" />
        CollectorsApp
      </nuxt-link>

      <div class="links">
        <nuxt-link v-if="isAuth" to="/my-collections" class="link-item">Мои коллекции</nuxt-link>
        <nuxt-link to="/users" class="link-item">Пользователи</nuxt-link>
        <nuxt-link to="/collection-type" class="link-item">Типы коллекций</nuxt-link>
        <nuxt-link to="/field-list" class="link-item">Поля коллекций</nuxt-link>
        <nuxt-link v-if="isAuth" to="/messages" class="link-item messages-link">
          Сообщения
          <span v-if="unreadTotal > 0" class="badge">{{ unreadTotal }}</span>
        </nuxt-link>
      </div>

      <GlobalSearch class="global-search-wrap" />

      <div class="navs">
        <nuxt-link v-if="isAuth" to="/profile" class="profile-link">
          <div class="profile-icon">
            <img v-if="currentUser?.avatar" :src="uploadUrl(currentUser.avatar)" class="avatar-img" alt="" />
            <icons-profile v-else class="profile" />
          </div>
          <span class="profile-name">{{ currentUser?.username }}</span>
        </nuxt-link>
        <ui-btn class="entry-btn" @click="handleEntry">
          {{ isAuth ? 'Выйти' : 'Войти' }}
        </ui-btn>
      </div>

      <!-- Burger button -->
      <button class="burger" :class="{ open: menuOpen }" aria-label="Меню" @click="menuOpen = !menuOpen">
        <span /><span /><span />
      </button>
    </container>

    <!-- Mobile menu -->
    <div v-if="menuOpen" class="mobile-menu" @click="menuOpen = false">
      <nuxt-link v-if="isAuth" to="/my-collections" class="mobile-link">Мои коллекции</nuxt-link>
      <nuxt-link to="/users" class="mobile-link">Пользователи</nuxt-link>
      <nuxt-link to="/collection-type" class="mobile-link">Типы коллекций</nuxt-link>
      <nuxt-link to="/field-list" class="mobile-link">Поля коллекций</nuxt-link>
      <nuxt-link v-if="isAuth" to="/messages" class="mobile-link">
        Сообщения
        <span v-if="unreadTotal > 0" class="badge badge--inline">{{ unreadTotal }}</span>
      </nuxt-link>
      <div class="mobile-menu__divider" />
      <nuxt-link v-if="isAuth" to="/profile" class="mobile-link">Профиль</nuxt-link>
      <button class="mobile-entry" @click="handleEntry">
        {{ isAuth ? 'Выйти' : 'Войти' }}
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/store/auth'
import { useModalStore } from '@/store/modal'
import { useUserStore } from '@/store/user'
import { useChatStore } from '@/store/chat'
import { useUploadUrl } from '@/composables/useUploadUrl'

const { open } = useModalStore()
const { isAuth } = storeToRefs(useAuthStore())
const { logout } = useAuthStore()
const { currentUser } = storeToRefs(useUserStore())
const { unreadTotal } = storeToRefs(useChatStore())

const uploadUrl = useUploadUrl()
const menuOpen = ref(false)

const handleEntry = async () => {
  menuOpen.value = false
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
  position: relative;
  z-index: 100;
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
  flex-shrink: 0;
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

  @include mobile { display: none; }
}

.profile-link {
  display: flex;
  gap: 8px;
  align-items: center;
  cursor: pointer;

  &:hover {
    color: $primary;
    .profile { fill: $primary; }
  }
}

.profile-name {
  @include tablet { display: none; }
}

.links {
  display: flex;
  gap: 12px;

  @include mobile { display: none; }
}

.profile-icon {
  background: $gray300;
  border-radius: 50%;
  width: 42px;
  height: 42px;
  padding: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.profile {
  width: 100%;
  height: 100%;
}

.global-search-wrap {
  flex-shrink: 0;
}

.entry-btn {
  padding: 2px 8px;
}

.messages-link {
  position: relative;
}

.badge {
  position: absolute;
  top: -6px;
  right: -10px;
  background: $primary;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  border-radius: 10px;
  padding: 1px 5px;
  min-width: 16px;
  text-align: center;
  line-height: 1.4;

  &--inline {
    position: static;
    display: inline-block;
  }
}

// ─── Burger ───────────────────────────────────────────────────────────────────

.burger {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 36px;
  height: 36px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  flex-shrink: 0;

  span {
    display: block;
    width: 100%;
    height: 2px;
    background: $gray900;
    border-radius: 2px;
    transition: transform 0.2s, opacity 0.2s;
  }

  &.open {
    span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
    span:nth-child(2) { opacity: 0; }
    span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
  }

  @include mobile { display: flex; }
}

// ─── Mobile menu ──────────────────────────────────────────────────────────────

.mobile-menu {
  display: none;
  flex-direction: column;
  background: $white;
  border-top: 1px solid $gray300;
  padding: 8px 0 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);

  @include mobile { display: flex; }

  &__divider {
    height: 1px;
    background: $gray300;
    margin: 8px 16px;
  }
}

.mobile-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  font-size: 15px;
  color: $gray900;
  text-decoration: none;
  transition: background 0.15s;

  &:hover, &.router-link-active {
    background: $gray200;
    color: $primary;
  }
}

.mobile-entry {
  margin: 8px 16px 0;
  padding: 10px;
  background: $primary;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  text-align: center;
  transition: opacity 0.15s;

  &:hover { opacity: 0.85; }
}
</style>
