import { Button, type ButtonVariant } from './Button'
import './ButtonGallery.css'
import { AccountWindow } from '../../account/AccountWindow'
import { GoogleMark } from '../GoogleMark'
import { Text } from '../Text/Text'

const variants: { name: string; variant: ButtonVariant; label: string }[] = [
  { name: 'Белая', variant: 'white', label: 'Вторичное действие' },
  { name: 'Оранжевая', variant: 'orange', label: 'Войти' },
  { name: 'Оранжевая с тенью', variant: 'orange-shadow', label: 'Добавить' },
  { name: 'Google', variant: 'google', label: 'Google' },
  { name: 'Серая', variant: 'gray', label: 'Отмена' },
  { name: 'Серая с тенью', variant: 'gray-shadow', label: 'Регистрация' },
]

export function ButtonGallery() {
  return (
    <main className="button-gallery">
      <header className="button-gallery__header">
        <p className="button-gallery__eyebrow">InvestIQ · UI-компоненты</p>
        <h1>Варианты кнопок</h1>
        <p>Один компонент, шесть оформлений. Нажми на любую кнопку: это демонстрация внешнего вида.</p>
      </header>

      <section className="button-gallery__grid" aria-label="Варианты кнопок">
        {variants.map(({ name, variant, label }) => (
          <article className="button-gallery__item" key={variant}>
            <h2>{name}</h2>
            <Button variant={variant}>
              {variant === 'google' && <GoogleMark />}
              {label}
            </Button>
            <code>variant="{variant}"</code>
          </article>
        ))}
      </section>

      <section className="button-gallery__note">
        <h2>Как использовать в форме</h2>
        <p>По умолчанию кнопка имеет <code>type="button"</code>, чтобы случайно не отправить форму.</p>
        <p>Для отправки укажи <code>type="submit"</code>; для неактивного состояния — <code>disabled</code>.</p>
      </section>

      <section className="button-gallery__note button-gallery__text-variants">
        <h2>Варианты текстовой выноски</h2>
        <Text variant="default">Або увійти за допомогою електронної пошти та пароля</Text>
        <Text variant="black">Текст чорного кольору</Text>
        <Text variant="error">Це обов’язкове поле</Text>
      </section>

      <section className="button-gallery__account">
        <h2>Окно авторизации с переиспользуемой кнопкой</h2>
        <AccountWindow mode="login" />
      </section>
    </main>
  )
}
