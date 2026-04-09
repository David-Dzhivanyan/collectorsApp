<template>
  <container>
    <div v-if="currentUser" class="profile">
      <!-- Avatar -->
      <div class="avatar-wrap">
        <div class="avatar">
          <img v-if="currentUser.avatar" :src="uploadUrl(currentUser.avatar)" class="avatar__img" alt="" />
          <icons-profile v-else class="avatar__icon" />
        </div>
        <div class="avatar-actions">
          <label class="avatar-btn">
            {{ currentUser.avatar ? 'Сменить' : 'Загрузить фото' }}
            <input type="file" accept="image/*" hidden @change="handleAvatarUpload" />
          </label>
          <button v-if="currentUser.avatar" class="avatar-btn avatar-btn--danger" @click="handleAvatarDelete">
            Удалить
          </button>
        </div>
      </div>

      <!-- Info -->
      <div class="info">
        <div class="title">{{ currentUser.firstName }} {{ currentUser.lastName }}</div>
        <a v-if="currentUser.phone" :href="`tel:${currentUser.phone}`">{{ currentUser.phone }}</a>
        <a :href="`mailto:${currentUser.email}`">{{ currentUser.email }}</a>
      </div>
    </div>
  </container>
</template>

<script setup lang="ts">
import { notify } from '@kyvg/vue3-notification'
import { useUserStore } from '@/store/user'
import { useUploadUrl } from '@/composables/useUploadUrl'

const { currentUser } = storeToRefs(useUserStore())
const { uploadAvatar, deleteAvatar } = useUserStore()
const uploadUrl = useUploadUrl()

const handleAvatarUpload = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  ;(e.target as HTMLInputElement).value = ''
  try {
    await uploadAvatar(file)
    notify({ title: 'Фото профиля обновлено', type: 'success' })
  } catch {
    notify({ title: 'Не удалось загрузить фото', type: 'error' })
  }
}

const handleAvatarDelete = async () => {
  try {
    await deleteAvatar()
    notify({ title: 'Фото профиля удалено', type: 'success' })
  } catch {
    notify({ title: 'Не удалось удалить фото', type: 'error' })
  }
}
</script>

<style scoped lang="scss">
.profile {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px 0;
}

.avatar-wrap {
  display: flex;
  align-items: center;
  gap: 16px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: $gray300;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__icon {
    width: 40px;
    height: 40px;
    fill: $gray600;
  }
}

.avatar-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.avatar-btn {
  font-size: 13px;
  color: $primary;
  cursor: pointer;
  background: none;
  border: 1px solid $primary;
  border-radius: 6px;
  padding: 5px 12px;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: rgba(132, 88, 255, 0.08);
  }

  &--danger {
    color: $red400;
    border-color: $red400;

    &:hover {
      background: rgba(220, 53, 69, 0.08);
    }
  }
}

.info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  box-shadow: $box-shadow-default;
  padding: 16px 20px;
  border-radius: 8px;
}

.title {
  @include header-3;
}
</style>
