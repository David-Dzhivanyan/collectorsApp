<template>
  <div class="home">
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
            <ui-btn class="hero__btn hero__btn--primary" @click="handleStart">
              {{ isAuth ? 'Мои коллекции' : 'Начать бесплатно' }}
            </ui-btn>
            <nuxt-link to="/collection-type" class="hero__btn hero__btn--secondary">
              Смотреть типы коллекций
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
            <div class="feature-card__icon">📊</div>
            <div class="feature-card__title">Табличный просмотр</div>
            <div class="feature-card__text">Все элементы коллекции в одной таблице. Быстро находите нужное и управляйте записями.</div>
          </div>
        </div>
      </container>
    </section>

    <!-- HOW IT WORKS -->
    <section class="how">
      <container>
        <h2 class="section-title">Как это работает</h2>
        <div class="how__steps">
          <div class="how__step">
            <div class="how__step-num">1</div>
            <div class="how__step-title">Создайте тип коллекции</div>
            <div class="how__step-text">Назовите тип и опишите его — например «Виниловые пластинки»</div>
          </div>
          <div class="how__divider" />
          <div class="how__step">
            <div class="how__step-num">2</div>
            <div class="how__step-title">Добавьте поля</div>
            <div class="how__step-text">Выберите какие данные хранить: исполнитель, год, жанр, состояние</div>
          </div>
          <div class="how__divider" />
          <div class="how__step">
            <div class="how__step-num">3</div>
            <div class="how__step-title">Заполняйте коллекцию</div>
            <div class="how__step-text">Добавляйте экспонаты и просматривайте всё в виде удобной таблицы</div>
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
          <ui-btn class="cta__btn" @click="handleStart">
            {{ isAuth ? 'Перейти к коллекциям' : 'Зарегистрироваться бесплатно' }}
          </ui-btn>
        </div>
      </container>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/store/auth'
import { useModalStore } from '@/store/modal'

const { isAuth } = storeToRefs(useAuthStore())
const { open } = useModalStore()
const router = useRouter()

const handleStart = () => {
  if (isAuth.value) {
    router.push('/my-collections')
  } else {
    open('register')
  }
}
</script>

<style scoped lang="scss">
.home {
  display: flex;
  flex-direction: column;
  gap: 80px;
  padding-bottom: 80px;
}

// HERO
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

  // mock table card
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

  &--green {
    background: rgba(34, 197, 94, 0.1);
    color: #16a34a;
  }

  &--yellow {
    background: rgba(234, 179, 8, 0.1);
    color: #b45309;
  }

  &--purple {
    background: rgba(132, 88, 255, 0.1);
    color: $primary;
  }
}

// FEATURES
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

  &__icon {
    font-size: 32px;
  }

  &__title {
    font-weight: 700;
    font-size: 16px;
    color: $gray900;
  }

  &__text {
    font-size: 14px;
    color: $gray600;
    line-height: 1.6;
  }
}

// HOW IT WORKS
.how {
  &__steps {
    display: flex;
    align-items: flex-start;
    gap: 0;
    margin-top: 40px;
  }

  &__step {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 0 16px;

    &-num {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: linear-gradient(225deg, #40c6ff 0%, #4086f1 50%, #8458ff 100%);
      color: $white;
      font-weight: 700;
      font-size: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
      flex-shrink: 0;
    }

    &-title {
      font-weight: 700;
      font-size: 15px;
      color: $gray900;
      margin-bottom: 8px;
    }

    &-text {
      font-size: 14px;
      color: $gray600;
      line-height: 1.6;
    }
  }

  &__divider {
    flex-shrink: 0;
    width: 60px;
    height: 2px;
    background: $gray300;
    margin-top: 24px;
    align-self: flex-start;
  }
}

// CTA
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

  &__title {
    @include header-2;
    font-weight: 700;
    color: $white;
  }

  &__text {
    color: $gray600;
    font-size: 15px;
  }

  &__btn {
    margin-top: 12px;
    padding: 12px 32px;
    font-weight: 600;
    font-size: 15px;
    border-radius: 10px;
  }
}

.section-title {
  @include header-2;
  font-weight: 700;
  color: $gray900;
  text-align: center;
}
</style>
