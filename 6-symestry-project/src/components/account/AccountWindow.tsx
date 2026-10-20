import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../ui/Button/Button'
import { GoogleMark } from '../ui/GoogleMark'
import { Text } from '../ui/Text/Text'
import './account-window.css'

type AccountWindowProps = {
  mode: 'login' | 'register'
}

export function AccountWindow({ mode }: AccountWindowProps) {
  const isRegister = mode === 'register'

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return (
    <section className="account-window" aria-label={isRegister ? 'Реєстрація' : 'Вхід'}>
      <Text className="account-window__intro">
        Ви можете авторизуватися за допомогою акаунта Google
      </Text>

      <Button variant="google" type="button">
        <GoogleMark />
        Google
      </Button>

      <Text className="account-window__hint">
        Або {isRegister ? 'зареєструйтеся' : 'увійдіть'} за допомогою електронної пошти та пароля
      </Text>

      <form className="account-window__form" onSubmit={handleSubmit}>
        <label className="account-window__field">
          <span>Електронна пошта</span>
          <input type="email" name="email" placeholder="you@email.com" required />
        </label>

        <label className="account-window__field">
          <span>Пароль</span>
          <input type="password" name="password" placeholder="••••••••" minLength={6} required />
        </label>

        <div className="account-window__actions">
          <Button variant="orange-shadow" type="submit">
            {isRegister ? 'РЕЄСТРАЦІЯ' : 'УВІЙТИ'}
          </Button>
          <Link
            className="button button--gray-shadow"
            to={isRegister ? '/login' : '/register'}
          >
            {isRegister ? 'УВІЙТИ' : 'РЕЄСТРАЦІЯ'}
          </Link>
        </div>
      </form>
    </section>
  )
}
