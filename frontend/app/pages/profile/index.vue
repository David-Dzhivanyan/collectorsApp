<template>
  <container>
    <div v-if="currentUser" class="info">
      <div class="title">
        {{ currentUser.firstName }}
        {{ currentUser.lastName }}
      </div>
      <a v-if="currentUser.phone" :href="`tel:${currentUser.phone}`">
        {{ currentUser.phone }}
      </a>
      <a :href="`mailto:${currentUser.email}`">
        {{ currentUser.email }}
      </a>
    </div>
  </container>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/user'

const { currentUser } = storeToRefs(useUserStore())
</script>

<style scoped lang="scss">
.info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  box-shadow: $box-shadow-default;
  padding: 16px 20px;
  border-radius: 8px;
}

.title {
  @include header-3;
}
</style>
