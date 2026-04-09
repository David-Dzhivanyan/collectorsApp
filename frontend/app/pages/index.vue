<template>
  <div class="home">

    <!-- DASHBOARD (auth) -->
    <template v-if="isAuth">
      <section class="dashboard">
        <container>
          <div class="dashboard__header">
            <div>
              <h1 class="dashboard__title">
                Добро пожаловать, {{ currentUser?.firstName }}
              </h1>
              <p class="dashboard__sub">Ваш личный кабинет коллекционера</p>
            </div>
            <ui-btn @click="router.push('/my-collections')">Мои коллекции</ui-btn>
          </div>

          <div class="dashboard__grid">
            <!-- My collections widget -->
            <div class="widget">
              <div class="widget__head">
                <span class="widget__title">Мои коллекции</span>
                <nuxt-link to="/my-collections" class="widget__link">Все →</nuxt-link>
              </div>
              <div v-if="collectionsLoading" class="widget__state">Загрузка...</div>
              <div v-else-if="myCollections.length === 0" class="widget__state">Нет коллекций</div>
              <div v-else class="widget__list">
                <nuxt-link
                  v-for="c in myCollections.slice(0, 5)"
                  :key="c.id"
                  :to="`/my-collections/${c.id}`"
                  class="widget__row"
                >
                  <span class="widget__row-name">{{ c.name }}</span>
                  <span class="widget__row-meta">{{ c.collection_type_id.name }}</span>
                </nuxt-link>
              </div>
            </div>

            <!-- Chats widget -->
            <div class="widget">
              <div class="widget__head">
                <span class="widget__title">
                  Сообщения
                  <span v-if="unreadTotal > 0" class="widget__badge">{{ unreadTotal }}</span>
                </span>
                <nuxt-link to="/messages" class="widget__link">Все →</nuxt-link>
              </div>
              <div v-if="chatsLoading" class="widget__state">Загрузка...</div>
              <div v-else-if="chats.length === 0" class="widget__state">Нет диалогов</div>
              <div v-else class="widget__list">
                <nuxt-link
                  v-for="chat in chats.slice(0, 5)"
                  :key="chat.id"
                  :to="`/messages/${chat.id}`"
                  class="widget__row"
                >
                  <span class="widget__row-name">
                    {{ chat.otherUser.firstName }} {{ chat.otherUser.lastName }}
                    <span v-if="chat.unreadCount > 0" class="widget__badge widget__badge--sm">
                      {{ chat.unreadCount }}
                    </span>
                  </span>
                  <span class="widget__row-meta">
                    <template v-if="chat.lastMessage?.type === 'item'">📦 {{ chat.lastMessage.content }}</template>
                    <template v-else-if="chat.lastMessage">{{ chat.lastMessage.content }}</template>
                    <template v-else>Нет сообщений</template>
                  </span>
                </nuxt-link>
              </div>
            </div>

            <!-- Users widget -->
            <div class="widget">
              <div class="widget__head">
                <span class="widget__title">Коллекционеры</span>
                <nuxt-link to="/users" class="widget__link">Все →</nuxt-link>
              </div>
              <p class="widget__desc">Просматривайте коллекции других пользователей и общайтесь в чате</p>
              <div v-if="usersLoading" class="widget__state">Загрузка...</div>
              <div v-else class="widget__list">
                <nuxt-link
                  v-for="u in otherUsers.slice(0, 5)"
                  :key="u.id"
                  :to="`/users/${u.id}`"
                  class="widget__row widget__row--user"
                >
                  <div class="widget__avatar">
                    <img v-if="u.avatar" :src="uploadUrl(u.avatar)" class="widget__avatar-img" alt="" />
                    <icons-profile v-else class="widget__avatar-icon" />
                  </div>
                  <div>
                    <div class="widget__row-name">{{ u.firstName }} {{ u.lastName }}</div>
                    <div class="widget__row-meta">@{{ u.username }}</div>
                  </div>
                </nuxt-link>
              </div>
            </div>
          </div>
        </container>
      </section>
    </template>

    <!-- LANDING (guest) -->
    <template v-else>
      <!-- HERO -->
      <section class="hero">
        <container class="hero__inner">
          <div class="hero__content">
            <div class="hero__badge">Бесплатно · Без ограничений</div>
            <h1 class="hero__title">Управляйте своими&nbsp;коллекциями как&nbsp;профессионал</h1>
            <p class="hero__subtitle">
              Создавайте любые типы коллекций с гибкими полями, отслеживайте каждый экспонат и&nbsp;просматривайте данные в удобной таблице.
            </p>
            <div class="hero__actions">
              <ui-btn class="hero__btn hero__btn--primary" @click="open('register')">
                Начать бесплатно
              </ui-btn>
              <nuxt-link to="/users" class="hero__btn hero__btn--secondary">
                Смотреть коллекционеров
              </nuxt-link>
            </div>
          </div>
          <div class="hero__visual">
            <div class="hero__card">
              <div class="hero__card-title">Монеты СССР</div>
              <div class="hero__card-row hero__card-row--header">
                <span>Название</span><span>Год</span><span>Состояние</span>
              </div>
              <div class="hero__card-row">
                <span>1 копейка</span><span>1961</span><span class="tag tag--green">MS-65</span>
              </div>
              <div class="hero__card-row">
                <span>10 копеек</span><span>1937</span><span class="tag tag--yellow">VF-30</span>
              </div>
              <div class="hero__card-row">
                <span>1 рубль</span><span>1970</span><span class="tag tag--purple">PF-68</span>
              </div>
            </div>
          </div>
        </container>
      </section>

      <!-- STATS -->
      <section class="stats">
        <container>
          <div class="stats__grid">
            <div class="stats__item">
              <div class="stats__num">{{ stats?.users ?? '—' }}</div>
              <div class="stats__label">Коллекционеров</div>
            </div>
            <div class="stats__item">
              <div class="stats__num">{{ stats?.collections ?? '—' }}</div>
              <div class="stats__label">Коллекций</div>
            </div>
            <div class="stats__item">
              <div class="stats__num">{{ stats?.items ?? '—' }}</div>
              <div class="stats__label">Предметов</div>
            </div>
          </div>
        </container>
      </section>

      <!-- USERS -->
      <section class="community">
        <container>
          <div class="community__head">
            <h2 class="section-title">Сообщество коллекционеров</h2>
            <nuxt-link to="/users" class="community__all">Все пользователи →</nuxt-link>
          </div>
          <p class="community__desc">
            CollectorsApp объединяет людей с общими интересами. Находите коллекционеров со схожими увлечениями, просматривайте их коллекции, общайтесь в чате и делитесь интересными находками прямо из таблицы.
          </p>
          <div v-if="allUsers.length > 0" class="community__grid">
            <nuxt-link
              v-for="u in allUsers.slice(0, 6)"
              :key="u.id"
              :to="`/users/${u.id}`"
              class="user-card"
            >
              <div class="user-card__avatar">
                <img v-if="u.avatar" :src="uploadUrl(u.avatar)" class="user-card__avatar-img" alt="" />
                <icons-profile v-else class="user-card__avatar-icon" />
              </div>
              <div class="user-card__name">{{ u.firstName }} {{ u.lastName }}</div>
              <div class="user-card__username">@{{ u.username }}</div>
            </nuxt-link>
          </div>
          <div v-else class="community__empty">
            Будьте первым — зарегистрируйтесь и начните свою коллекцию
          </div>
        </container>
      </section>

      <!-- FEATURES -->
      <section class="features">
        <container>
          <h2 class="section-title">Всё что нужно для коллекционера</h2>
          <div class="features__grid">
            <div class="feature-card">
              <div class="feature-card__icon">🗂️</div>
              <div class="feature-card__title">Гибкие типы коллекций</div>
              <div class="feature-card__text">Создавайте собственные типы — монеты, книги, марки, карточки. Каждый тип со своим набором полей.</div>
            </div>
            <div class="feature-card">
              <div class="feature-card__icon">⚙️</div>
              <div class="feature-card__title">Динамические поля</div>
              <div class="feature-card__text">Строки, числа, даты, варианты ответа, флаги — добавляйте любые поля и настраивайте структуру под себя.</div>
            </div>
            <div class="feature-card">
              <div class="feature-card__icon">💬</div>
              <div class="feature-card__title">Чат с коллекционерами</div>
              <div class="feature-card__text">Общайтесь с другими пользователями, делитесь предметами из своих коллекций прямо в чате.</div>
            </div>
          </div>
        </container>
      </section>

      <!-- CTA -->
      <section class="cta">
        <container>
          <div class="cta__inner">
            <h2 class="cta__title">Начните прямо сейчас</h2>
            <p class="cta__text">Регистрация займёт меньше минуты</p>
            <ui-btn class="cta__btn" @click="open('register')">
              Зарегистрироваться бесплатно
            </ui-btn>
          </div>
        </container>
      </section>
    </template>

  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/store/auth'
import { useModalStore } from '@/store/modal'
import { useUserStore } from '@/store/user'
import { useCollectionStore } from '@/store/collection'
import { useChatStore } from '@/store/chat'
import type { User } from '@/store/user'
import type { UserCollection } from '@/store/collection'
import type { CollectionType } from '@/store/collection'
import { useUploadUrl } from '@/composables/useUploadUrl'

const router = useRouter()
const { isAuth } = storeToRefs(useAuthStore())
const { open } = useModalStore()
const { currentUser } = storeToRefs(useUserStore())
const uploadUrl = useUploadUrl()

const chatStore = useChatStore()
const { chats, unreadTotal } = storeToRefs(chatStore)

type Stats = { users: number; collectionTypes: number; collections: number; items: number }

// Shared
const allUsers = ref<User[]>([])
const stats = ref<Stats | null>(null)
const usersLoading = ref(true)

// Auth only
const myCollections = ref<UserCollection[]>([])
const collectionsLoading = ref(true)
const chatsLoading = ref(true)

const otherUsers = computed(() =>
  allUsers.value.filter((u) => u.id !== currentUser.value?.id),
)

onMounted(async () => {
  const { getUsers } = useUserStore()

  const [users, statsData] = await Promise.all([
    getUsers(),
    useNuxtApp().$axios.get<Stats>('/collection/stats').then((r: any) => r.data),
  ])
  allUsers.value = users
  stats.value = statsData
  usersLoading.value = false

  if (isAuth.value) {
    collectionsLoading.value = true
    chatsLoading.value = true

    const { $axios } = useNuxtApp()
    const { data: cols } = await $axios.get<UserCollection[]>('/collection/user/my')
    myCollections.value = cols
    collectionsLoading.value = false

    await chatStore.fetchChats()
    chatsLoading.value = false
  }
})
</script>

<style scoped lang="scss">
.home {
  display: flex;
  flex-direction: column;
  gap: 80px;
  padding-bottom: 80px;
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
.dashboard {
  padding-top: 40px;

  &__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 32px;
  }

  &__title {
    @include header-2;
    font-weight: 700;
    color: $gray900;
    margin: 0 0 4px;
  }

  &__sub {
    font-size: 14px;
    color: $gray600;
    margin: 0;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
}

.widget {
  border: 1px solid $gray300;
  border-radius: 14px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__title {
    font-weight: 700;
    font-size: 15px;
    color: $gray900;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  &__link {
    font-size: 13px;
    color: $primary;
    text-decoration: none;
    &:hover { opacity: 0.75; }
  }

  &__desc {
    font-size: 13px;
    color: $gray600;
    line-height: 1.5;
    margin: 0;
  }

  &__state {
    font-size: 13px;
    color: $gray600;
    text-align: center;
    padding: 16px 0;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 10px;
    border-radius: 8px;
    text-decoration: none;
    transition: background 0.15s;

    &:hover { background: $gray200; }

    &--user {
      gap: 10px;
      justify-content: flex-start;
    }
  }

  &__row-name {
    font-size: 14px;
    font-weight: 500;
    color: $gray900;
    display: flex;
    align-items: center;
    gap: 6px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__row-meta {
    font-size: 12px;
    color: $gray600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 140px;
  }

  &__badge {
    background: $primary;
    color: #fff;
    font-size: 10px;
    font-weight: 700;
    border-radius: 10px;
    padding: 1px 6px;
    min-width: 16px;
    text-align: center;

    &--sm {
      font-size: 9px;
      padding: 1px 5px;
    }
  }

  &__avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: $gray300;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    flex-shrink: 0;
    padding: 5px;
  }

  &__avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }

  &__avatar-icon {
    width: 100%;
    height: 100%;
    fill: $gray600;
  }
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
.hero {
  background: linear-gradient(135deg, #f5f0ff 0%, #fff 60%);
  padding: 64px 0 48px;
  border-bottom: 1px solid $gray300;

  &__inner {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 48px;
    align-items: center;
  }

  &__badge {
    display: inline-block;
    font-size: 12px;
    font-weight: 600;
    color: $primary;
    background: rgba(132, 88, 255, 0.1);
    padding: 4px 12px;
    border-radius: 20px;
    margin-bottom: 16px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }

  &__title {
    @include header-1;
    font-weight: 700;
    color: $gray900;
    margin-bottom: 16px;
  }

  &__subtitle {
    font-size: 16px;
    color: $gray600;
    line-height: 1.7;
    margin-bottom: 32px;
    max-width: 480px;
  }

  &__actions {
    display: flex;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;
  }

  &__btn {
    &--primary {
      padding: 12px 28px;
      font-weight: 600;
      font-size: 15px;
      border-radius: 10px;
    }

    &--secondary {
      padding: 11px 24px;
      font-size: 15px;
      font-weight: 500;
      color: $gray900;
      border: 1px solid $gray300;
      border-radius: 10px;
      text-decoration: none;
      transition: border-color 0.15s, color 0.15s;

      &:hover {
        border-color: $primary;
        color: $primary;
      }
    }
  }

  &__visual {
    display: flex;
    justify-content: flex-end;
  }

  &__card {
    background: $white;
    border: 1px solid $gray300;
    border-radius: 16px;
    padding: 20px;
    box-shadow: $box-shadow-secondary;
    width: 100%;
    max-width: 380px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__card-title {
    font-weight: 700;
    font-size: 15px;
    color: $gray900;
    margin-bottom: 4px;
  }

  &__card-row {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    gap: 8px;
    font-size: 13px;
    padding: 6px 8px;
    border-radius: 6px;
    color: $gray900;

    &--header {
      font-weight: 600;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: $gray600;
      background: $gray200;
    }
  }
}

.tag {
  display: inline-block;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 20px;
  width: fit-content;

  &--green { background: rgba(34, 197, 94, 0.1); color: #16a34a; }
  &--yellow { background: rgba(234, 179, 8, 0.1); color: #b45309; }
  &--purple { background: rgba(132, 88, 255, 0.1); color: $primary; }
}

// ─── STATS ────────────────────────────────────────────────────────────────────
.stats {
  &__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    text-align: center;
  }

  &__num {
    font-size: 48px;
    font-weight: 800;
    color: $primary;
    line-height: 1;
    margin-bottom: 8px;
  }

  &__label {
    font-size: 15px;
    color: $gray600;
    font-weight: 500;
  }
}

// ─── COMMUNITY ────────────────────────────────────────────────────────────────
.community {
  &__head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 32px;
  }

  &__all {
    font-size: 14px;
    color: $primary;
    text-decoration: none;
    &:hover { opacity: 0.75; }
  }

  &__desc {
    font-size: 15px;
    color: $gray600;
    line-height: 1.7;
    max-width: 600px;
    margin: 0 auto 32px;
    text-align: center;
  }

  &__empty {
    text-align: center;
    color: $gray600;
    font-size: 14px;
    padding: 32px 0;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 16px;
  }
}

.user-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px 12px;
  border: 1px solid $gray300;
  border-radius: 14px;
  text-decoration: none;
  text-align: center;
  transition: border-color 0.15s, box-shadow 0.15s;

  &:hover {
    border-color: $primary;
    box-shadow: 0 2px 12px rgba(132, 88, 255, 0.12);
  }

  &__avatar {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: $gray300;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    padding: 10px;
  }

  &__avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }

  &__avatar-icon {
    width: 100%;
    height: 100%;
    fill: $gray600;
  }

  &__name {
    font-size: 13px;
    font-weight: 600;
    color: $gray900;
    line-height: 1.3;
  }

  &__username {
    font-size: 12px;
    color: $gray600;
  }
}

// ─── FEATURES ─────────────────────────────────────────────────────────────────
.features {
  &__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    margin-top: 40px;
  }
}

.feature-card {
  padding: 28px 24px;
  border: 1px solid $gray300;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: box-shadow 0.15s, border-color 0.15s;

  &:hover {
    border-color: $primary;
    box-shadow: 0 4px 20px rgba(132, 88, 255, 0.1);
  }

  &__icon { font-size: 32px; }
  &__title { font-weight: 700; font-size: 16px; color: $gray900; }
  &__text { font-size: 14px; color: $gray600; line-height: 1.6; }
}

// ─── CTA ──────────────────────────────────────────────────────────────────────
.cta {
  &__inner {
    background: linear-gradient(135deg, $gray900 0%, $gray800 100%);
    border-radius: 24px;
    padding: 60px 40px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  &__title { @include header-2; font-weight: 700; color: $white; }
  &__text { color: $gray600; font-size: 15px; }
  &__btn { margin-top: 12px; padding: 12px 32px; font-weight: 600; font-size: 15px; border-radius: 10px; }
}

.section-title {
  @include header-2;
  font-weight: 700;
  color: $gray900;
  text-align: center;
}

// ─── RESPONSIVE ───────────────────────────────────────────────────────────────

.home {
  @include mobile { gap: 48px; }
}

// Dashboard
.dashboard {
  @include mobile { padding-top: 24px; }

  &__header {
    @include mobile { flex-direction: column; }
  }

  &__title {
    @include mobile { font-size: 22px; }
  }

  &__grid {
    @include tablet { grid-template-columns: 1fr 1fr; }
    @include mobile { grid-template-columns: 1fr; }
  }
}

// Hero
.hero {
  &__inner {
    @include tablet { gap: 24px; }
    @include mobile { grid-template-columns: 1fr; }
  }

  &__visual {
    @include mobile { display: none; }
  }

  &__title {
    @include mobile { font-size: 26px; }
  }

  &__subtitle {
    @include mobile { font-size: 14px; }
  }

  &__actions {
    @include sm { flex-direction: column; align-items: stretch; }
  }

  &__btn--secondary {
    @include sm { text-align: center; }
  }
}

// Stats
.stats {
  &__num {
    @include mobile { font-size: 36px; }
  }
}

// Community
.community {
  &__head {
    @include mobile { flex-direction: column; gap: 4px; }
  }

  &__grid {
    @include tablet { grid-template-columns: repeat(3, 1fr); }
    @include mobile { grid-template-columns: repeat(2, 1fr); }
    @include sm     { grid-template-columns: repeat(2, 1fr); }
  }
}

// Features
.features {
  &__grid {
    @include tablet { grid-template-columns: 1fr 1fr; }
    @include mobile { grid-template-columns: 1fr; }
  }
}

// Section title
.section-title {
  @include mobile { font-size: 22px; }
}
</style>
