import React, { useState, useEffect } from 'react'
import { useAccessibility } from '../context/AccessibilityContext'
import '../styles/AccessibilityToolbar.css'

const tools = [
  { key: 'tts',      icon: '🔊', label: 'Text to Speech' },
  { key: 'contrast', icon: '🌓', label: 'High Contrast'  },
  { key: 'dyslexic', icon: '📖', label: 'Dyslexic Font'  },
  { key: 'focus',    icon: '🎯', label: 'Focus Mode'     },
  { key: 'ruler',    icon: '📏', label: 'Reading Ruler'  },
]

export default function AccessibilityToolbar() {
  const {
    ttsEnabled, setTtsEnabled,
    highContrast, setHighContrast,
    dyslexicFont, setDyslexicFont,
    fontSize, increaseFontSize, decreaseFontSize,
    focusMode, setFocusMode,
    readingRuler, setReadingRuler,
  } = useAccessibility()

  const [collapsed, setCollapsed] = useState(false)
  const [rulerY,    setRulerY]    = useState(0)

  useEffect(() => {
    if (!readingRuler) return
    const handleMouseMove = (e) => setRulerY(e.clientY)
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [readingRuler])

  const isActive = (key) => {
    if (key === 'tts')      return ttsEnabled
    if (key === 'contrast') return highContrast
    if (key === 'dyslexic') return dyslexicFont
    if (key === 'focus')    return focusMode
    if (key === 'ruler')    return readingRuler
    return false
  }

  const handleToggle = (key) => {
    if (key === 'tts')      setTtsEnabled((p)   => !p)
    if (key === 'contrast') setHighContrast((p)  => !p)
    if (key === 'dyslexic') setDyslexicFont((p)  => !p)
    if (key === 'focus')    setFocusMode((p)     => !p)
    if (key === 'ruler')    setReadingRuler((p)  => !p)
  }

  return (
    <>
      {readingRuler && <div className="reading-ruler" style={{ top: rulerY - 12 }} />}
      <div className={`a11y-toolbar ${collapsed ? 'collapsed' : ''}`}>
        <button className="a11y-collapse-btn" onClick={() => setCollapsed((p) => !p)}>
          {collapsed ? '♿' : '✕'}
        </button>
        {!collapsed && (
          <>
            <p className="a11y-heading">Accessibility</p>
            {tools.map(({ key, icon, label }) => (
              <button
                key={key}
                className={`a11y-btn ${isActive(key) ? 'active' : ''}`}
                onClick={() => handleToggle(key)}
                title={label}
              >
                <span className="a11y-icon">{icon}</span>
                <span className="a11y-label">{label}</span>
              </button>
            ))}
            <div className="a11y-font-size">
              <p className="a11y-label-text">Font Size</p>
              <div className="a11y-font-controls">
                <button className="a11y-size-btn" onClick={decreaseFontSize}>A−</button>
                <span className="a11y-size-display">{fontSize}px</span>
                <button className="a11y-size-btn" onClick={increaseFontSize}>A+</button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}