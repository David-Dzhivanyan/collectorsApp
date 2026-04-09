<template>
  <div class="global-search" ref="containerRef">
    <button class="search-btn" :class="{ active: open }" aria-label="Поиск" @click="toggle">
      <icons-search class="search-icon" />
    </button>

    <div v-if="open" class="dropdown">
      <input
        ref="inputRef"
        v-model="query"
        class="search-input"
        placeholder="Поиск предметов..."
        @input="onInput"
      />

      <div v-if="loading" class="state-msg">Поиск...</div>
      <div v-else-if="query.length > 0 && results.length === 0" class="state-msg">Ничего не найдено</div>

      <ul v-else-if="results.length > 0" class="results">
        <li v-for="item in results" :key="item.itemId" class="result-item" @click="navigate(item)">
          <span class="item-name">{{ item.itemName }}</span>
          <span class="item-meta">
            {{ item.collectionName }} · {{ item.userFirstName || item.username }}
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNuxtApp } from '#app'

interface SearchResult {
  itemId: number
  itemName: string
  collectionId: number
  collectionName: string
  userId: number
  userFirstName: string
  userLastName: string
  username: string
}

const { $axios } = useNuxtApp() as any
const router = useRouter()

const open = ref(false)
const query = ref('')
const results = ref<SearchResult[]>([])
const loading = ref(false)
const containerRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)

let debounceTimer: ReturnType<typeof setTimeout> | null = null

const toggle = () => {
  open.value = !open.value
  if (open.value) {
    nextTick(() => inputRef.value?.focus())
  } else {
    query.value = ''
    results.value = []
  }
}

const onInput = () => {
  if (debounceTimer) clearTimeout(debounceTimer)
  if (!query.value.trim()) {
    results.value = []
    loading.value = false
    return
  }
  loading.value = true
  debounceTimer = setTimeout(async () => {
    try {
      const { data } = await $axios.get('/collection/items/search', {
        params: { q: query.value },
      })
      results.value = data
    } catch {
      results.value = []
    } finally {
      loading.value = false
    }
  }, 350)
}

const navigate = (item: SearchResult) => {
  open.value = false
  query.value = ''
  results.value = []
  router.push(`/users/${item.userId}/collections/${item.collectionId}?search=${encodeURIComponent(item.itemName)}`)
}

// Close on outside click
onMounted(() => {
  document.addEventListener('click', onOutsideClick)
})
onUnmounted(() => {
  document.removeEventListener('click', onOutsideClick)
  if (debounceTimer) clearTimeout(debounceTimer)
})

const onOutsideClick = (e: MouseEvent) => {
  if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
    open.value = false
    query.value = ''
    results.value = []
  }
}
</script>

<style scoped lang="scss">
.global-search {
  position: relative;
}

.search-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: none;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  color: $gray600;
  transition: color 0.15s, background 0.15s;

  &:hover, &.active {
    color: $primary;
    background: $gray200;
  }
}

.search-icon {
  width: 20px;
  height: 20px;
  stroke: currentColor;
  fill: none;
}

.dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 340px;
  background: $white;
  border: 1px solid $gray300;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  z-index: 200;

  @include mobile {
    width: 280px;
    right: -40px;
  }
}

.search-input {
  width: 100%;
  padding: 12px 16px;
  border: none;
  border-bottom: 1px solid $gray200;
  font-size: 14px;
  outline: none;
  box-sizing: border-box;
  background: $white;

  &::placeholder { color: $gray600; }
}

.state-msg {
  padding: 14px 16px;
  font-size: 14px;
  color: $gray600;
}

.results {
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 320px;
  overflow-y: auto;
}

.result-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 10px 16px;
  cursor: pointer;
  transition: background 0.12s;

  &:hover {
    background: $gray200;
  }

  &:not(:last-child) {
    border-bottom: 1px solid $gray200;
  }
}

.item-name {
  font-size: 14px;
  font-weight: 500;
  color: $gray900;
}

.item-meta {
  font-size: 12px;
  color: $gray600;
}
</style>
