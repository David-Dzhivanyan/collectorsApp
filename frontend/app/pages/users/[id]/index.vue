<template>
  <container>
    <div class="page-header">
      <nuxt-link to="/users" class="back-link">← Все пользователи</nuxt-link>

      <div v-if="user" class="profile">
        <div class="profile__avatar">
          <img v-if="user.avatar" :src="uploadUrl(user.avatar)" class="profile__avatar-img" alt="" />
          <icons-profile v-else class="profile__avatar-icon" />
        </div>
        <div class="profile__info">
          <h1 class="profile__name">{{ user.firstName }} {{ user.lastName }}</h1>
          <span class="profile__username">@{{ user.username }}</span>
        </div>
        <ui-btn
          v-if="isAuth && !isOwnProfile"
          class="write-btn"
          @click="startChat"
        >
          Написать
        </ui-btn>
      </div>
    </div>

    <ui-page-section>
      <template #title>Коллекции</template>

      <input
        v-model="search"
        class="search"
        type="text"
        placeholder="Поиск по названию..."
      />

      <div v-if="loading" class="state">Загрузка...</div>
      <div v-else-if="collections.length === 0" class="state">У пользователя нет коллекций</div>
      <div v-else-if="filtered.length === 0" class="state">Ничего не найдено</div>

      <div v-else class="list">
        <nuxt-link
          v-for="c in filtered"
          :key="c.id"
          :to="isOwnProfile ? `/my-collections/${c.id}` : `/users/${userId}/collections/${c.id}`"
          class="card"
        >
          <div class="card__body">
            <span class="card__name">{{ c.name }}</span>
            <span class="card__meta">{{ c.collection_type_id.name }}</span>
          </div>
          <span class="card__arrow">›</span>
        </nuxt-link>
      </div>
    </ui-page-section>
  </container>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/user'
import { useCollectionStore } from '@/store/collection'
import { useAuthStore } from '@/store/auth'
import { useChatStore } from '@/store/chat'
import type { User } from '@/store/user'
import type { UserCollection } from '@/store/collection'
import { useUploadUrl } from '@/composables/useUploadUrl'

const route = useRoute()
const router = useRouter()
const userId = Number(route.params.id)
const uploadUrl = useUploadUrl()

const { isAuth } = storeToRefs(useAuthStore())
const { currentUser } = storeToRefs(useUserStore())
const isOwnProfile = computed(() => currentUser.value?.id === userId)
const chatStore = useChatStore()

const startChat = async () => {
  const chat = await chatStore.fetchOrCreateChat(userId)
  router.push(`/messages/${chat.id}`)
}

const { getUsers } = useUserStore()
const { getUserCollectionsPublic } = useCollectionStore()

const loading = ref(true)
const user = ref<User | null>(null)
const collections = ref<UserCollection[]>([])
const search = ref('')

const filtered = computed(() => {
  const q = search.value.toLowerCase()
  return collections.value.filter((c) => c.name.toLowerCase().includes(q))
})

onMounted(async () => {
  try {
    const [users, cols] = await Promise.all([
      getUsers(),
      getUserCollectionsPublic(userId),
    ])
    user.value = users.find((u) => u.id === userId) ?? null
    collections.value = cols
  } finally {
    loading.value = false
  }
})
</script>

<style scoped lang="scss">
.page-header {
  margin-top: 24px;
  margin-bottom: 8px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.back-link {
  font-size: 14px;
  color: $black;
  text-decoration: none;
  opacity: 0.5;
  width: fit-content;

  &:hover { opacity: 1; }
}

.write-btn {
  margin-left: auto;
  flex-shrink: 0;
}

.profile {
  display: flex;
  align-items: center;
  gap: 16px;

  &__avatar {
    width: 64px;
    height: 64px;
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
    width: 32px;
    height: 32px;
    fill: $gray600;
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__name {
    font-size: 22px;
    font-weight: 700;
    color: $gray900;
    margin: 0;
  }

  &__username {
    font-size: 14px;
    color: $gray600;
  }
}

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
  justify-content: space-between;
  padding: 14px 20px;
  border: 1px solid $gray300;
  border-radius: 10px;
  text-decoration: none;
  color: $gray900;
  transition: border-color 0.15s, box-shadow 0.15s;
  gap: 12px;

  &:hover {
    border-color: $primary;
    box-shadow: 0 2px 12px rgba(132, 88, 255, 0.12);
  }

  &__body {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
    flex: 1;
  }

  &__name {
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__meta {
    font-size: 13px;
    color: $gray600;
    white-space: nowrap;
  }

  &__arrow {
    font-size: 20px;
    color: $gray600;
    flex-shrink: 0;
  }
}
</style>
