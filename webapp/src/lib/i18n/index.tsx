'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { Lang, Translations } from './types'
import { en } from './en'

const STORAGE_KEY = 'mogumogu-lang'

async function loadTranslations(locale: Lang): Promise<Translations> {
  if (locale === 'en') return en
  const { ja } = await import('./ja')
  return ja
}

interface LanguageContextValue {
  t: Translations
  lang: Lang
  setLang: (lang: Lang) => void
}

const LanguageContext = createContext<LanguageContextValue>({
  t: en,
  lang: 'en',
  setLang: () => {},
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en')
  const [translations, setTranslations] = useState<Translations>(en)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Lang | null
    if (stored === 'en' || stored === 'ja') {
      setLangState(stored)
      document.documentElement.lang = stored
      loadTranslations(stored).then(setTranslations)
    }
  }, [])

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    localStorage.setItem(STORAGE_KEY, next)
    document.documentElement.lang = next
    loadTranslations(next).then(setTranslations)
  }, [])

  return (
    <LanguageContext value={{ t: translations, lang, setLang }}>
      {children}
    </LanguageContext>
  )
}

export function useTranslation() {
  return useContext(LanguageContext)
}
