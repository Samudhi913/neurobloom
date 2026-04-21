import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/Landing.css'

const features = [
  { icon: '🧠', title: 'Built for Every Brain',       desc: 'Designed specifically for learners with ADHD, Dyslexia, Autism, and other learning differences.' },
  { icon: '🎯', title: 'Personalised Learning Paths', desc: 'Our recommendation engine adapts to your skill level and emotional readiness — so every lesson feels just right.' },
  { icon: '♿', title: 'Full Accessibility Tools',    desc: 'Text to speech, dyslexic fonts, contrast modes, focus tools and more — all available with one click.' },
  { icon: '📊', title: 'Progress You Can See',        desc: 'Students, parents and teachers each get their own dashboard to track growth and celebrate wins.' },
  { icon: '💬', title: 'A Supportive Community',      desc: 'Connect with peers, share experiences, and never feel alone on your learning journey.' },
  { icon: '🌤️', title: 'Readiness-Aware Learning',   desc: 'Check in with your focus, confidence and energy before each session. NeuroBloom adapts accordingly.' },
]

const steps = [
  { number: '01', title: 'Create Your Account',        desc: 'Sign up as a student, teacher, or parent and set up your learning profile in minutes.' },
  { number: '02', title: 'Check Your Readiness',       desc: 'Answer 3 quick questions about your focus, confidence and energy before each session.' },
  { number: '03', title: 'Take a Short Quiz',          desc: 'Answer 5 subject questions so we understand your current knowledge level.' },
  { number: '04', title: 'Get Your Recommendation',   desc: 'Our engine picks the best difficulty level for you based on your readiness and quiz score.' },
]

const testimonials = [
  { quote: 'NeuroBloom is the first platform that actually feels like it was made for me. The dyslexic font and focus mode make such a difference.', name: 'Aisha, 14',  role: 'Student with Dyslexia', emoji: '🌸' },
  { quote: 'Being able to see each student\'s progress and readiness trends has completely changed how I support my class.',                          name: 'Mr. Perera', role: 'Special Education Teacher', emoji: '📚' },
  { quote: 'My son used to dread learning. Now he opens NeuroBloom on his own every morning. That says everything.',                                  name: 'Priya',      role: 'Parent', emoji: '💜' },
]

export default function Landing() {
  return (
    <div className="landing">
      {/* HERO */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-badge">🌸 Neurodivergent-First Learning</div>
          <h1 className="hero-title">Learning that works <br /><span className="hero-highlight">for your brain</span></h1>
          <p className="hero-desc">NeuroBloom is a personalised learning platform built for students with ADHD, Dyslexia, Autism, and other learning differences. Every feature, every lesson, every tool — designed with your needs in mind.</p>
          <div className="hero-actions">
            <Link to="/register" className="hero-btn primary">Start Learning Free</Link>
            <Link to="/courses"  className="hero-btn secondary">Browse Courses</Link>
          </div>
          <div className="hero-stats">
            <div className="hero-stat"><strong>500+</strong><span>Courses</span></div>
            <div className="hero-stat-divider" />
            <div className="hero-stat"><strong>3</strong><span>Difficulty Levels</span></div>
            <div className="hero-stat-divider" />
            <div className="hero-stat"><strong>100%</strong><span>Accessible</span></div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card floating"><span className="hero-card-icon">🧠</span><p>Personalised just for you</p></div>
          <div className="hero-card floating delay-1"><span className="hero-card-icon">😊</span><p>Readiness-aware recommendations</p></div>
          <div className="hero-card floating delay-2"><span className="hero-card-icon">🎯</span><p>Learn at your own pace</p></div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="about-section">
        <div className="section-inner">
          <div className="about-text">
            <h2>What is NeuroBloom?</h2>
            <p>NeuroBloom is an adaptive e-learning platform built from the ground up for neurodivergent learners. We believe that every child learns differently — and that the right environment, tools, and support can help every learner thrive.</p>
            <p>Whether you're a student who learns better with audio, a parent wanting to track your child's progress, or a teacher looking for smarter ways to support your class — NeuroBloom brings it all together in one calm, accessible space.</p>
            <Link to="/register" className="about-link">Join NeuroBloom →</Link>
          </div>
          <div className="about-pills">
            {['ADHD Friendly','Dyslexia Support','Autism Inclusive','Sensory Considerate','Low Distraction','Pace Flexible'].map((tag) => (
              <span key={tag} className="about-pill">{tag}</span>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features-section">
        <div className="section-inner">
          <div className="section-header"><h2>Everything you need to bloom</h2><p>Tools and features designed with neurodivergent learners at the centre</p></div>
          <div className="features-grid">
            {features.map((f) => (
              <div key={f.title} className="feature-card">
                <span className="feature-icon">{f.icon}</span>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-section">
        <div className="section-inner">
          <div className="section-header"><h2>How NeuroBloom works</h2><p>Getting started is simple — we'll guide you every step of the way</p></div>
          <div className="steps-list">
            {steps.map((s, i) => (
              <div key={s.number} className="step">
                <div className="step-number">{s.number}</div>
                <div className="step-content"><h3>{s.title}</h3><p>{s.desc}</p></div>
                {i < steps.length - 1 && <div className="step-connector" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials-section">
        <div className="section-inner">
          <div className="section-header"><h2>Learners are blooming 🌸</h2><p>Real stories from our community</p></div>
          <div className="testimonials-grid">
            {testimonials.map((t) => (
              <div key={t.name} className="testimonial-card">
                <span className="testimonial-emoji">{t.emoji}</span>
                <p className="testimonial-quote">"{t.quote}"</p>
                <div className="testimonial-author"><strong>{t.name}</strong><span>{t.role}</span></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-inner">
          <h2>Ready to start your journey?</h2>
          <p>Join NeuroBloom today — it's free to get started.</p>
          <div className="cta-actions">
            <Link to="/register" className="hero-btn primary">Create Free Account</Link>
            <Link to="/login"    className="hero-btn secondary">Sign In</Link>
          </div>
        </div>
      </section>

      <footer className="footer"><p>🌸 NeuroBloom — Built with care for every kind of mind.</p></footer>
    </div>
  )
}