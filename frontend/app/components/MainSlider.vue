<template>
  <base-slider class="slider">
    <SwiperSlide v-for="slide in slides" :key="slide.title" class="slide">
      <div class="slide-container">
        <div class="slide-text">
          <h3>{{ slide.title }}</h3>
          <p>
            {{ slide.text }}
          </p>
        </div>
        <img :src="slide.src" alt="img" class="slide-img" />
      </div>
    </SwiperSlide>
  </base-slider>
</template>

<script setup lang="ts">
import { SwiperSlide } from 'swiper/vue'

const slides = [
  {
    title: 'Collectors App!',
    text: 'Создавай свои уникальные коллекции!',
    src: '/images/main-slider/slide1.jpg',
  },
  {
    title: 'Это просто!',
    text: 'Понятный и простой интерфейс позволит создавать большие и проработанные коллекции',
    src: '/images/main-slider/slide2.webp',
  },
  {
    title: 'Делись своими коллекциями с окружающими.',
    text: 'Приглашай друзей, ищи нужные предметы, пиши владельцам и пополняй свою коллекцию',
    src: '/images/main-slider/slide3.jpg',
  },
]
</script>

<style scoped lang="scss">
.slider {
}

.slide {
  height: 350px;
  background: linear-gradient(225deg, #ff6f32 0%, #ff385c 57.81%, #ff3998 100%);

  color: $white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  border-radius: 24px;
  max-width: 1420px;
  padding: 60px;
}

.slide-container {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  align-items: center;
}

.slide-img {
  border-radius: 8px;
  max-height: 250px;
  margin-left: auto;
}
</style>
