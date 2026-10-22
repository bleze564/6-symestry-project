import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import type { CategoryOption } from '../../categories'
import './category-select.css'

type CategorySelectProps = {
  categories: CategoryOption[]
  value: string
  type: 'expense' | 'income'
  onChange: (value: string) => void
  onBlur: () => void
}

type CategoryStyle = CSSProperties & { '--category-color': string }

export function CategorySelect({ categories, value, type, onChange, onBlur }: CategorySelectProps) {
  const selectedIndex = Math.max(0, categories.findIndex((category) => category.id === value))
  const selectedCategory = categories[selectedIndex]
  const listId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(selectedIndex)

  useEffect(() => {
    if (!isOpen) return

    function closeOnOutsidePointer(event: PointerEvent) {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) {
        setIsOpen(false)
        onBlur()
      }
    }

    document.addEventListener('pointerdown', closeOnOutsidePointer)
    return () => document.removeEventListener('pointerdown', closeOnOutsidePointer)
  }, [isOpen, onBlur])

  function openMenu(index = selectedIndex) {
    setActiveIndex(index)
    setIsOpen(true)
  }

  function selectCategory(index: number) {
    const category = categories[index]
    if (!category) return

    onChange(category.id)
    onBlur()
    setIsOpen(false)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (!isOpen) {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        openMenu()
      }
      return
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((index) => (index + 1) % categories.length)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((index) => (index - 1 + categories.length) % categories.length)
    } else if (event.key === 'Home') {
      event.preventDefault()
      setActiveIndex(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      setActiveIndex(categories.length - 1)
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      selectCategory(activeIndex)
    } else if (event.key === 'Escape') {
      event.preventDefault()
      setIsOpen(false)
      onBlur()
    }
  }

  return (
    <div className={`category-select${isOpen ? ' category-select--open' : ''}`} ref={rootRef}>
      <button
        aria-activedescendant={isOpen ? `${listId}-option-${activeIndex}` : undefined}
        aria-controls={`${listId}-list`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Категорія"
        className="category-select__trigger"
        onClick={() => (isOpen ? setIsOpen(false) : openMenu())}
        onBlur={(event) => {
          if (event.relatedTarget instanceof Node && rootRef.current?.contains(event.relatedTarget)) return
          setIsOpen(false)
          onBlur()
        }}
        onKeyDown={handleKeyDown}
        type="button"
      >
        <span className="category-select__value">
          <span className="category-select__icon" style={{ '--category-color': selectedCategory.color } as CategoryStyle} aria-hidden="true">
            {selectedCategory.icon}
          </span>
          <span className="category-select__label">{selectedCategory.label}</span>
        </span>
        <svg className={`category-select__chevron${isOpen ? ' is-open' : ''}`} aria-hidden="true" viewBox="0 0 24 24" fill="none">
          <path d="m7 10 5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {isOpen && (
        <div className={`category-select__menu category-select__menu--${type}`} id={`${listId}-list`} role="listbox" aria-label="Оберіть категорію">
          <div className="category-select__menu-heading">
            <span>{type === 'expense' ? 'Категорії витрат' : 'Категорії доходів'}</span>
            <span>{categories.length} варіантів</span>
          </div>
          <div className="category-select__options">
            {categories.map((category, index) => (
              <button
                aria-selected={category.id === value}
                className={`category-select__option${category.id === value ? ' is-selected' : ''}${index === activeIndex ? ' is-active' : ''}`}
                id={`${listId}-option-${index}`}
                key={category.id}
                onClick={() => selectCategory(index)}
                onMouseEnter={() => setActiveIndex(index)}
                onPointerDown={(event) => event.preventDefault()}
                role="option"
                type="button"
              >
                <span className="category-select__icon" style={{ '--category-color': category.color } as CategoryStyle} aria-hidden="true">
                  {category.icon}
                </span>
                <span className="category-select__option-label">{category.label}</span>
                {category.id === value && <span className="category-select__check" aria-hidden="true">✓</span>}
              </button>
            ))}
          </div>
          <div className="category-select__menu-footer"><span />Виберіть одну категорію</div>
        </div>
      )}
    </div>
  )
}
