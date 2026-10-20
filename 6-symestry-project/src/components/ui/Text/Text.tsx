import type { ComponentPropsWithoutRef } from 'react'
import './text.css'

export type TextVariant = 'default' | 'black' | 'error'

type TextProps = ComponentPropsWithoutRef<'p'> & {
  variant?: TextVariant
}

export function Text({
  children,
  className = '',
  variant = 'default',
  ...paragraphProps
}: TextProps) {
  const classes = ['ui-text', `ui-text--${variant}`, className]
    .filter(Boolean)
    .join(' ')

  return (
    <p className={classes} {...paragraphProps}>
      {children}
    </p>
  )
}
