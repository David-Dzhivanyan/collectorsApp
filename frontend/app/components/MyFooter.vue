<template>
  <footer class="footer">
    <div class="top">
      <container>
        <div class="top-content">
          <div class="top-text">
            <b class="top-title">У вас остались вопросы?</b>
            <span>Ответим в течение 10 минут</span>
          </div>
          <div class="top-form">
            <ui-text-field v-model="name" placeholder="Ваше имя" />
            <ui-text-field v-model="tel" placeholder="Номер телефона" type="number" />
            <ui-btn>Заказать звонок</ui-btn>
          </div>
        </div>
      </container>
    </div>
    <div class="bottom">
      <container>
        <div class="bottom-content">
          <div class="bottom-logo">
            <nuxt-link to="/" class="logo-link">
              <icons-logo class="logo" />
              CollectorsApp
            </nuxt-link>
            <div class="rights">
              Информация, размещенная на сайте, представлена для ознакомления и не является публичной офертой
              <br />
              2026 © Все права защищены
            </div>
          </div>
          <div class="bottom-menu">
            Меню

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
          </div>
        </div>
      </container>
    </div>
  </footer>
</template>

<script setup lang="ts">
const name = ref('')
const tel = ref('')
</script>

<style scoped lang="scss">
.footer {
  width: 100%;
  box-shadow: $box-shadow-header;
  color: $white;
  margin-top: 44px;
}

.top {
  background-color: $gray800;
}

.top-content {
  display: flex;
  gap: 90px;
  align-items: center;
}

.top-text {
  display: flex;
  flex-direction: column;
}

.top-title {
  font-size: 20px;
}

.top-form {
  display: flex;
  align-items: center;
  gap: 12px;
}

.bottom {
  background-color: $gray900;
}

.bottom-content {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
}

.bottom-logo {
  display: flex;
  flex-direction: column;
  gap: 12px;
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

.rights {
  font-size: 12px;
  color: $gray600;
}

.bottom-menu {
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-size: 18px;
}

.links {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.link-item {
  color: $gray300;
  font-size: 16px;
}
</style>
