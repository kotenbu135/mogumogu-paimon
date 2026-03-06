'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { Lang, Translations } from './types'
import { ja } from './ja'

const STORAGE_KEY = 'mogumogu-lang'

async function loadTranslations(locale: Lang): Promise<Translations> {
  if (locale === 'ja') return ja
  const { en } = await import('./en')
  return en
}

interface LanguageContextValue {
  t: Translations
  lang: Lang
  setLang: (lang: Lang) => void
}

const LanguageContext = createContext<LanguageContextValue>({
  t: ja,
  lang: 'ja',
  setLang: () => {},
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('ja')
  const [translations, setTranslations] = useState<Translations>(ja)

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
