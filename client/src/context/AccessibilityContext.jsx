import React, { createContext, useContext, useState, useEffect } from 'react'

const AccessibilityContext = createContext()

export const AccessibilityProvider = ({ children }) => {
  const [ttsEnabled,   setTtsEnabled]   = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [dyslexicFont, setDyslexicFont] = useState(false)
  const [fontSize,     setFontSize]     = useState(16)
  const [focusMode,    setFocusMode]    = useState(false)
  const [readingRuler, setReadingRuler] = useState(false)

  useEffect(() => { document.body.classList.toggle('high-contrast', highContrast) }, [highContrast])
  useEffect(() => { document.body.classList.toggle('dyslexic-font', dyslexicFont) }, [dyslexicFont])
  useEffect(() => { document.body.classList.toggle('focus-mode',    focusMode)    }, [focusMode])

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`
    document.body.style.fontSize            = `${fontSize}px`
  }, [fontSize])

  useEffect(() => {
    if (!ttsEnabled) {
      window.speechSynthesis.cancel()
      document.body.style.cursor = 'default'
      return
    }
    document.body.style.cursor = 'text'
    const handleClick = (e) => {
      const text = e.target.innerText || e.target.textContent
      if (!text || text.trim() === '') return
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text.trim())
      utterance.rate  = 0.9
      utterance.pitch = 1
      window.speechSynthesis.speak(utterance)
    }
    document.addEventListener('click', handleClick)
    return () => {
      document.removeEventListener('click', handleClick)
      document.body.style.cursor = 'default'
      window.speechSynthesis.cancel()
    }
  }, [ttsEnabled])

  const increaseFontSize = () => setFontSize((p) => Math.min(p + 2, 26))
  const decreaseFontSize = () => setFontSize((p) => Math.max(p - 2, 12))

  return (
    <AccessibilityContext.Provider value={{
      ttsEnabled, setTtsEnabled,
      highContrast, setHighContrast,
      dyslexicFont, setDyslexicFont,
      fontSize, increaseFontSize, decreaseFontSize,
      focusMode, setFocusMode,
      readingRuler, setReadingRuler,
    }}>
      {children}
    </AccessibilityContext.Provider>
  )
}

export const useAccessibility = () => useContext(AccessibilityContext)