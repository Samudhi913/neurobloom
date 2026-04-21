import React from 'react'
import { useAccessibility } from '../context/AccessibilityContext'
import '../styles/AssistiveTools.css'

const tools = [
  { icon: '🔊', title: 'Text to Speech',    desc: 'Turn on TTS in the toolbar, then click any text on the page to hear it read aloud at a comfortable pace.',              tip: 'Great for: Dyslexia, Visual fatigue, Auditory learners' },
  { icon: '🌓', title: 'High Contrast Mode', desc: 'Boosts the contrast of all colours across the entire site to reduce eye strain and improve readability.',               tip: 'Great for: Visual impairments, Sensory sensitivities'   },
  { icon: '📖', title: 'Dyslexic Font',      desc: 'Switches all text to OpenDyslexic — a font designed to reduce letter confusion and improve reading flow.',               tip: 'Great for: Dyslexia, Reading difficulties'               },
  { icon: '🎯', title: 'Focus Mode',         desc: 'Dims the background so only the content stands out — reducing visual clutter and distractions.',                        tip: 'Great for: ADHD, Anxiety, Sensory overload'             },
  { icon: '📏', title: 'Reading Ruler',      desc: "A soft horizontal line follows your mouse cursor to help you track which line you're reading.",                          tip: 'Great for: Dyslexia, Tracking difficulties'             },
  { icon: 'A±', title: 'Font Size Control',  desc: 'Increase or decrease the font size across the entire site using the A+ and A− buttons in the toolbar.',                 tip: 'Great for: Visual impairments, Comfort preferences'     },
]

export default function AssistiveTools() {
  const { setTtsEnabled, setHighContrast, setDyslexicFont, setFocusMode, setReadingRuler } = useAccessibility()

  const tryTool = (icon) => {
    if (icon === '🔊') setTtsEnabled((p)   => !p)
    if (icon === '🌓') setHighContrast((p) => !p)
    if (icon === '📖') setDyslexicFont((p) => !p)
    if (icon === '🎯') setFocusMode((p)    => !p)
    if (icon === '📏') setReadingRuler((p) => !p)
  }

  return (
    <div className="tools-page">
      <div className="tools-header">
        <h1>♿ Assistive Tools</h1>
        <p>Every tool on NeuroBloom is designed to make learning more comfortable, accessible, and enjoyable. All tools are available on every page — look for the toolbar on the right side of your screen.</p>
      </div>
      <div className="tools-grid">
        {tools.map((tool) => (
          <div key={tool.title} className="tool-card">
            <span className="tool-icon">{tool.icon}</span>
            <div className="tool-content">
              <h3>{tool.title}</h3>
              <p>{tool.desc}</p>
              <span className="tool-tip">💡 {tool.tip}</span>
            </div>
            {tool.icon !== 'A±' && (
              <button className="tool-try-btn" onClick={() => tryTool(tool.icon)}>Try it</button>
            )}
          </div>
        ))}
      </div>
      <div className="tools-note">
        <span>🌸</span>
        <p>All accessibility settings are applied instantly. You can toggle them on and off at any time using the toolbar on the right.</p>
      </div>
    </div>
  )
}