import { useState } from 'react'
import { useFormik } from 'formik'
import { object, ref, string } from 'yup'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../../../app/hooks'
import { userSignedIn } from '../../authSlice'
import { authApi } from '../../authApi'
import { Button, Text } from '../../../../components/ui'
import './account-window.css'

type AccountWindowProps = { mode: 'login' | 'register' }
type FormValues = { email: string; password: string; confirmPassword: string }

export function AccountWindow({ mode }: AccountWindowProps) {
  const isRegister = mode === 'register'
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [message, setMessage] = useState('')

  const formik = useFormik<FormValues>({
    initialValues: { email: '', password: '', confirmPassword: '' },
    validationSchema: object({
      email: string().email('Введіть коректну електронну пошту').required('Вкажіть електронну пошту'),
      password: string().min(6, 'Пароль має містити щонайменше 6 символів').required('Вкажіть пароль'),
      confirmPassword: isRegister
        ? string().oneOf([ref('password')], 'Паролі не збігаються').required('Повторіть пароль')
        : string(),
    }),
    onSubmit: async (values) => {
      const email = values.email.trim().toLowerCase()
      setMessage('')
      try {
        const credentials = { email, password: values.password }
        const response = isRegister
          ? await authApi.register(credentials)
          : await authApi.login(credentials)
        dispatch(userSignedIn(response.user))
        navigate('/dashboard', { replace: true })
      } catch (error) {
        setMessage(error instanceof Error ? error.message : 'Не вдалося виконати запит.')
      }
    },
  })

  return (
    <section className="account-window" aria-label={isRegister ? 'Реєстрація' : 'Вхід'}>
      <Text className="account-window__intro">Увійдіть або створіть акаунт, щоб керувати фінансами</Text>
      <Text className="account-window__hint">
        {isRegister ? 'Створіть акаунт за допомогою електронної пошти та пароля' : 'Або увійдіть за допомогою електронної пошти та пароля'}
      </Text>

      {message && <p className="account-window__message" role="status">{message}</p>}

      <form className="account-window__form" onSubmit={formik.handleSubmit} noValidate>
        <label className="account-window__field">
          <span>Електронна пошта</span>
          <input type="email" name="email" autoComplete="email" placeholder="you@email.com" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} aria-invalid={formik.touched.email && Boolean(formik.errors.email)} />
          {formik.touched.email && formik.errors.email && <span className="account-window__error">{formik.errors.email}</span>}
        </label>
        <label className="account-window__field">
          <span>Пароль</span>
          <input type="password" name="password" autoComplete={isRegister ? 'new-password' : 'current-password'} placeholder="Щонайменше 6 символів" value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} aria-invalid={formik.touched.password && Boolean(formik.errors.password)} />
          {formik.touched.password && formik.errors.password && <span className="account-window__error">{formik.errors.password}</span>}
        </label>
        {isRegister && (
          <label className="account-window__field">
            <span>Повторіть пароль</span>
            <input type="password" name="confirmPassword" autoComplete="new-password" placeholder="Повторіть пароль" value={formik.values.confirmPassword} onChange={formik.handleChange} onBlur={formik.handleBlur} aria-invalid={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)} />
            {formik.touched.confirmPassword && formik.errors.confirmPassword && <span className="account-window__error">{formik.errors.confirmPassword}</span>}
          </label>
        )}
        <div className="account-window__actions">
          <Button variant="orange-shadow" type="submit" disabled={formik.isSubmitting}>{isRegister ? 'Зареєструватися' : 'Увійти'}</Button>
          <Button className="account-window__switch" variant="gray-shadow" type="button" onClick={() => navigate(isRegister ? '/login' : '/register')}>
            {isRegister ? 'Увійти' : 'Реєстрація'}
          </Button>
        </div>
      </form>
    </section>
  )
}
