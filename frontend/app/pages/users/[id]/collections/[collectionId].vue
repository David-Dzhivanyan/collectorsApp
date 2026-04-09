<template>
  <container class="page-container">
    <div class="page-header">
      <nuxt-link :to="`/users/${userId}`" class="back-link">← Назад</nuxt-link>
      <div class="page-header__row">
        <div>
          <h1 class="title">{{ collectionName }}</h1>
          <span class="subtitle">{{ collectionTypeName }}</span>
        </div>
      </div>
    </div>

    <div v-if="loading" class="state">Загрузка...</div>

    <template v-else-if="tableData">
      <div v-if="tableData.fields.length === 0" class="state">
        Нет полей в данном типе коллекции
      </div>
      <div v-else-if="tableData.items.length === 0" class="state">
        Коллекция пуста
      </div>

      <div v-else class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th>Фото</th>
              <th>Название</th>
              <th v-for="field in tableData.fields" :key="field.id">
                {{ field.name }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in tableData.items" :key="item.id" class="data-row">
              <td class="col-photo">
                <template v-if="item.photos?.length">
                  <div
                    class="photo-thumb"
                    @click="openLightbox(item.photos.map(f => uploadUrl(f)), 0)"
                  >
                    <img :src="uploadUrl(item.photos[0])" class="photo-thumb__img" alt="" />
                    <span v-if="item.photos.length > 1" class="photo-thumb__badge">
                      {{ item.photos.length }}
                    </span>
                  </div>
                </template>
                <template v-else>—</template>
              </td>
              <td>{{ item.name }}</td>
              <td v-for="field in tableData.fields" :key="field.id">
                <template v-if="field.field_type === 'boolean'">
                  {{ item.values[String(field.id)] === true ? '✓' : item.values[String(field.id)] === false ? '✗' : '—' }}
                </template>
                <template v-else-if="field.field_type === 'date' && item.values[String(field.id)]">
                  {{ new Date(item.values[String(field.id)] as string).toLocaleDateString('ru-RU') }}
                </template>
                <template v-else>
                  {{ item.values[String(field.id)] ?? '—' }}
                </template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <item-photo-lightbox
      v-if="lightboxOpen"
      :photos="lightboxPhotos"
      :initial-index="lightboxIndex"
      @close="lightboxOpen = false"
    />
  </container>
</template>

<script setup lang="ts">
import { useCollectionStore } from '@/store/collection'
import { useUserStore } from '@/store/user'
import type { CollectionTableResponse } from '@/store/collection'
import { useUploadUrl } from '@/composables/useUploadUrl'

const route = useRoute()
const userId = Number(route.params.id)
const collectionId = Number(route.params.collectionId)
const uploadUrl = useUploadUrl()

const { getUserCollectionsPublic, getCollectionTablePublic } = useCollectionStore()
const { getUsers } = useUserStore()

const loading = ref(true)
const tableData = ref<CollectionTableResponse | null>(null)
const collectionName = ref('')
const collectionTypeName = ref('')

const lightboxPhotos = ref<string[]>([])
const lightboxIndex = ref(0)
const lightboxOpen = ref(false)

const openLightbox = (photos: string[], index: number) => {
  lightboxPhotos.value = photos
  lightboxIndex.value = index
  lightboxOpen.value = true
}

onMounted(async () => {
  try {
    const [collections, table] = await Promise.all([
      getUserCollectionsPublic(userId),
      getCollectionTablePublic(collectionId),
    ])
    const match = collections.find((c) => c.id === collectionId)
    if (match) {
      collectionName.value = match.name
      collectionTypeName.value = match.collection_type_id.name
    }
    tableData.value = table
  } finally {
    loading.value = false
  }
})
</script>

<style scoped lang="scss">
.page-container {
  flex-grow: 1;
}

.page-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 24px;
  margin-bottom: 20px;

  &__row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
  }
}

.back-link {
  font-size: 14px;
  color: $black;
  text-decoration: none;
  opacity: 0.5;
  width: fit-content;

  &:hover { opacity: 1; }
}

.title {
  @include header-3;
  font-weight: 700;
  color: $gray900;
}

.subtitle {
  font-size: 14px;
  color: $gray600;
}

.state {
  margin-top: 40px;
  text-align: center;
  color: $gray600;
  font-size: 14px;
}

.table-wrap {
  overflow-x: auto;
  border-radius: 10px;
  border: 1px solid $gray300;
}

.table {
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 10px 16px;
    text-align: left;
    border-bottom: 1px solid $gray300;
    white-space: nowrap;
  }

  th {
    font-weight: 600;
    font-size: 13px;
    background: $gray200;
    color: $gray600;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }
}

.data-row:hover td {
  background: $gray200;
}

.col-photo {
  width: 64px;
  text-align: center;
}

.photo-thumb {
  position: relative;
  display: inline-block;
  cursor: pointer;
  border-radius: 6px;
  overflow: hidden;
  width: 44px;
  height: 44px;

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  &__badge {
    position: absolute;
    bottom: 2px;
    right: 2px;
    background: rgba(0, 0, 0, 0.65);
    color: #fff;
    font-size: 10px;
    font-weight: 700;
    border-radius: 4px;
    padding: 1px 4px;
    line-height: 1.4;
  }
}
</style>
