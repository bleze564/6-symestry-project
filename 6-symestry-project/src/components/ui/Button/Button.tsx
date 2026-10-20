import type { ComponentPropsWithoutRef } from 'react'
import './button.css'

export type ButtonVariant =
  | 'white'
  | 'orange'
  | 'orange-shadow'
  | 'google'
  | 'gray'
  | 'gray-shadow'

type ButtonProps = ComponentPropsWithoutRef<'button'> & {
  variant?: ButtonVariant
}

export function Button({
  children,
  className = '',
  type = 'button',
  variant = 'white',
  ...buttonProps
}: ButtonProps) {
  const classes = ['button', `button--${variant}`, className]
    .filter(Boolean)
    .join(' ')

  return (
    <button className={classes} type={type} {...buttonProps}>
      {children}
    </button>
  )
}
