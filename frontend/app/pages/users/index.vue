<template>
  <container>
    <ui-page-section>
      <template #title>Пользователи</template>

      <input
        v-model="search"
        class="search"
        type="text"
        placeholder="Поиск по имени или логину..."
      />

      <div v-if="loading" class="state">Загрузка...</div>
      <div v-else-if="filtered.length === 0" class="state">Ничего не найдено</div>

      <div v-else class="list">
        <nuxt-link
          v-for="user in filtered"
          :key="user.id"
          :to="`/users/${user.id}`"
          class="card"
        >
          <div class="card__avatar">
            <img v-if="user.avatar" :src="uploadUrl(user.avatar)" class="card__avatar-img" alt="" />
            <icons-profile v-else class="card__avatar-icon" />
          </div>
          <div class="card__info">
            <span class="card__name">{{ user.firstName }} {{ user.lastName }}</span>
            <span class="card__username">@{{ user.username }}</span>
          </div>
        </nuxt-link>
      </div>
    </ui-page-section>
  </container>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/user'
import type { User } from '@/store/user'
import { useUploadUrl } from '@/composables/useUploadUrl'

const { getUsers } = useUserStore()
const uploadUrl = useUploadUrl()

const loading = ref(true)
const users = ref<User[]>([])
const search = ref('')

const filtered = computed(() => {
  const q = search.value.toLowerCase()
  return users.value.filter(
    (u) =>
      u.username.toLowerCase().includes(q) ||
      u.firstName.toLowerCase().includes(q) ||
      u.lastName.toLowerCase().includes(q),
  )
})

onMounted(async () => {
  try {
    users.value = await getUsers()
  } finally {
    loading.value = false
  }
})
</script>

<style scoped lang="scss">
.search {
  width: 100%;
  padding: 9px 14px;
  border: 1px solid $gray300;
  border-radius: 8px;
  font-size: 14px;
  color: $gray900;
  background: $white;
  outline: none;
  margin-bottom: 12px;
  transition: border-color 0.15s, box-shadow 0.15s;

  &::placeholder { color: $gray600; }
  &:focus {
    border-color: $primary;
    box-shadow: 0 0 0 3px rgba(132, 88, 255, 0.12);
  }
}

.state {
  text-align: center;
  color: $gray600;
  font-size: 14px;
  padding: 40px 0;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 20px;
  border: 1px solid $gray300;
  border-radius: 10px;
  text-decoration: none;
  color: $gray900;
  transition: border-color 0.15s, box-shadow 0.15s;

  &:hover {
    border-color: $primary;
    box-shadow: 0 2px 12px rgba(132, 88, 255, 0.12);
  }

  &__avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: $gray300;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  &__avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__avatar-icon {
    width: 22px;
    height: 22px;
    fill: $gray600;
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  &__name {
    font-weight: 600;
    font-size: 15px;
  }

  &__username {
    font-size: 13px;
    color: $gray600;
  }
}
</style>
