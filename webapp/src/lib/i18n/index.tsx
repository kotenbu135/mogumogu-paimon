'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { Lang, Translations } from './types'
import { ja } from './ja'
import { en } from './en'

const TRANSLATIONS: Record<Lang, Translations> = { ja, en }
const STORAGE_KEY = 'mogumogu-lang'

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

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Lang | null
    if (stored === 'en' || stored === 'ja') {
      setLangState(stored)
      document.documentElement.lang = stored
    }
  }, [])

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    localStorage.setItem(STORAGE_KEY, next)
    document.documentElement.lang = next
  }, [])

  return (
    <LanguageContext value={{ t: TRANSLATIONS[lang], lang, setLang }}>
      {children}
    </LanguageContext>
  )
}

export function useTranslation() {
  return useContext(LanguageContext)
}
