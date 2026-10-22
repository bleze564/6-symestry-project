import { useFormik } from 'formik'
import { number, object, string } from 'yup'
import { useAppDispatch } from '../../../../app/hooks'
import { Button } from '../../../../components/ui'
import { categoriesByType } from '../../categories'
import { CategorySelect } from '../category-select/CategorySelect'
import { createTransaction } from '../../transactionsSlice'
import type { TransactionType } from '../../types'
import './transaction-form.css'

type TransactionFormProps = { type: TransactionType }
type FormValues = { description: string; categoryId: string; amount: string; occurredAt: string }

function todayAsInputValue(): string {
  const now = new Date()
  return String(now.getFullYear()) + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0')
}

export function TransactionForm({ type }: TransactionFormProps) {
  const dispatch = useAppDispatch()
  const categories = categoriesByType[type]
  const today = todayAsInputValue()

  const formik = useFormik<FormValues>({
    initialValues: { description: '', categoryId: categories[0].id, amount: '', occurredAt: today },
    validationSchema: object({
      description: string().trim().max(80, 'Не більше ніж 80 символів').required('Введіть опис'),
      categoryId: string().required('Оберіть категорію'),
      amount: number()
        .typeError('Введіть суму')
        .positive('Сума має бути більшою за нуль')
        .max(100000000, 'Завелика сума')
        .required('Введіть суму'),
      occurredAt: string().required('Оберіть дату'),
    }),
    onSubmit: async (values, helpers) => {
      const amountMinorUnits = Math.round(Number(values.amount) * 100)
      if (!Number.isSafeInteger(amountMinorUnits) || amountMinorUnits <= 0) {
        helpers.setFieldError('amount', 'Перевірте суму')
        return
      }

      try {
        await dispatch(createTransaction({
          type,
          description: values.description.trim(),
          categoryId: values.categoryId,
          amountMinorUnits,
          currency: 'UAH',
          occurredAt: values.occurredAt,
        })).unwrap()
      } catch (error) {
        helpers.setStatus(error instanceof Error ? error.message : 'Не вдалося зберегти операцію.')
        return
      }

      helpers.setStatus(undefined)
      helpers.resetForm({ values: { description: '', categoryId: categories[0].id, amount: '', occurredAt: today } })
    },
  })

  return (
    <form className="transaction-form" onSubmit={formik.handleSubmit} noValidate>
      <label className="transaction-form__field">
        <span>Опис</span>
        <input
          name="description"
          placeholder={type === 'expense' ? 'Наприклад, продукти' : 'Наприклад, зарплата'}
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          aria-invalid={formik.touched.description && Boolean(formik.errors.description)}
        />
        <small className="transaction-form__hint" aria-live="polite">
          {formik.touched.description ? formik.errors.description : ''}
        </small>
      </label>

      <label className="transaction-form__field">
        <span>Категорія</span>
        <CategorySelect
          categories={categories}
          value={formik.values.categoryId}
          type={type}
          onChange={(categoryId) => void formik.setFieldValue('categoryId', categoryId)}
          onBlur={() => void formik.setFieldTouched('categoryId', true)}
        />
        <small className="transaction-form__hint" aria-hidden="true" />
      </label>

      <div className="transaction-form__row">
        <label className="transaction-form__field">
          <span>Сума, ₴</span>
          <input
            name="amount"
            type="number"
            min="0.01"
            step="0.01"
            inputMode="decimal"
            placeholder="0,00"
            value={formik.values.amount}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            aria-invalid={formik.touched.amount && Boolean(formik.errors.amount)}
          />
          <small className="transaction-form__hint" aria-live="polite">
            {formik.touched.amount ? formik.errors.amount : ''}
          </small>
        </label>

        <label className="transaction-form__field">
          <span>Дата</span>
          <input name="occurredAt" type="date" value={formik.values.occurredAt} onChange={formik.handleChange} onBlur={formik.handleBlur} />
          <small className="transaction-form__hint" aria-hidden="true" />
        </label>
      </div>

      <div className="transaction-form__actions">
        {formik.status && <p className="transaction-form__server-error" role="alert">{formik.status}</p>}
        <Button className="transaction-form__submit" variant="orange-shadow" type="submit" disabled={formik.isSubmitting}>{formik.isSubmitting ? 'Зберігаємо…' : 'Внести'}</Button>
        <Button className="transaction-form__clear" variant="gray" type="button" disabled={formik.isSubmitting} onClick={() => formik.resetForm({ values: { description: '', categoryId: categories[0].id, amount: '', occurredAt: today } })}>Очистити</Button>
      </div>
    </form>
  )
}
