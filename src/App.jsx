import { useState, useEffect, useRef, useCallback } from 'react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'

/* ── Intersection Observer hook ── */
function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.unobserve(el) } },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}

function Reveal({ children, className = '' }) {
  const ref = useReveal()
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>
}


/* ══════════════════ NAVBAR ══════════════════ */
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40)
      const sections = ['home','about','services','portfolio','reviews','contact']
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i])
        if (el && el.getBoundingClientRect().top <= 150) { setActiveSection(sections[i]); break }
      }
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleClick = () => setMenuOpen(false)

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`} id="navbar">
      <div className="navbar-inner">
        <a href="#home" className="logo-link"><img src="/logo.png" alt="WIBLY" className="logo-img" /></a>
        <ul className={`nav-links${menuOpen ? ' open' : ''}`}>
          {[['home','Home'],['about','About'],['services','Services'],['portfolio','Portfolio'],['pricing','Pricing']].map(([id,label]) => (
            <li key={id}><a href={`#${id}`} className={activeSection===id?'active':''} onClick={handleClick}>{label}</a></li>
          ))}
          <li><a href="#contact" className="nav-cta" onClick={handleClick}>Get A Free Quote</a></li>
        </ul>
        <button className={`hamburger${menuOpen?' open':''}`} onClick={()=>setMenuOpen(!menuOpen)} aria-label="Menu">
          <span/><span/><span/>
        </button>
      </div>
    </nav>
  )
}

/* ══════════════════ HERO ══════════════════ */
function Hero() {
  return (
    <section className="lottie-hero" id="home">
      <div className="lottie-hero-glow" />
      <div className="lottie-hero-container">
        <div className="lottie-hero-grid">
          <div className="hero-load-anim">

            <h1 className="lottie-hero-title">
              Websites That
              <span className="lottie-hero-highlight">
                Grow Businesses
              </span>
            </h1>
            <p className="lottie-hero-sub">
              WIBLY creates premium websites that look world-class,
              load lightning fast, and convert visitors into customers.
            </p>
            <div className="lottie-hero-buttons">
              <a href="#contact" className="lottie-hero-btn-primary">
                Book a Free Call
              </a>
              <a href="#portfolio" className="lottie-hero-btn-secondary">
                View Portfolio
              </a>
            </div>
          </div>
          <div className="lottie-hero-right hero-load-anim" style={{ animationDelay: '0.2s' }}>
            <div className="lottie-hero-anim-glow" />
            <div className="lottie-hero-anim-box">
              <DotLottieReact
                src="/animations/hero.lottie"
                autoplay
                loop
                style={{
                  width: "100%",
                  maxWidth: "650px",
                  height: "650px"
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════ PROBLEM ══════════════════ */
function Problem() {
  const cards = [
    { icon: '🐌', title: 'Loads too slow', desc: 'Visitors leave in 3 seconds if your page doesn\'t load. Speed matters.' },
    { icon: '📱', title: 'Not mobile friendly', desc: '60% of your traffic is on phones. If it doesn\'t work on mobile, you\'re losing customers.' },
    { icon: '💸', title: 'Looks outdated', desc: 'First impressions are everything. An old website kills trust instantly.' },
  ]
  return (
    <section className="problem" id="problem">
      <div className="container">
        <Reveal><div className="section-header"><h2>Is Your Website Costing You Customers?</h2></div></Reveal>
        <div className="problem-cards">
          {cards.map((c,i) => (
            <Reveal key={i}><div className="problem-card">
              <span className="problem-icon">{c.icon}</span>
              <h3>{c.title}</h3><p>{c.desc}</p>
            </div></Reveal>
          ))}
        </div>
        <Reveal><p className="problem-bottom">Every day without a great website is a day you're losing money.</p></Reveal>
      </div>
    </section>
  )
}

/* ══════════════════ SERVICES ══════════════════ */
function Services() {
  const services = [
    { icon: '🌐', title: 'Landing Pages', desc: 'One powerful page that converts visitors into customers. Perfect for promotions, launches, and lead generation.' },
    { icon: '🏢', title: 'Business Websites', desc: '5-page professional website with Home, About, Services, Portfolio, and Contact. Your online HQ.' },
    { icon: '🛒', title: 'E-Commerce Stores', desc: 'Sell online 24/7. We build stores that are easy to manage and built to convert.' },
    { icon: '🔧', title: 'Website Maintenance', desc: 'Monthly care plans so your site stays fast, secure, and up to date.' },
  ]
  return (
    <section className="services" id="services">
      <div className="container">
        <Reveal><div className="section-header"><h2>What We Build For You</h2></div></Reveal>
        <div className="services-grid">
          {services.map((s,i) => (
            <Reveal key={i}><div className="service-card">
              <span className="service-icon">{s.icon}</span>
              <h3>{s.title}</h3><p>{s.desc}</p>
            </div></Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ══════════════════ HOW IT WORKS ══════════════════ */
function HowItWorks() {
  const steps = [
    { icon: '📋', title: 'Tell Us About Your Business', desc: 'Fill out a quick form — we learn about your goals, brand, and vision.' },
    { icon: '🎨', title: 'We Design & Build', desc: 'Our team crafts a custom, modern website tailored to your business.' },
    { icon: '✏️', title: 'You Review & Approve', desc: 'We refine until you love it. Your feedback drives every detail.' },
    { icon: '🚀', title: 'Go Live!', desc: 'Your site launches and customers start finding you online.' },
  ]
  return (
    <section className="how-it-works" id="how-it-works">
      <div className="container">
        <Reveal><div className="section-header"><h2>From Idea to Live Website</h2><p>A simple, transparent process designed to get you online fast.</p></div></Reveal>
        <div className="steps-container">
          {steps.map((s,i) => (
            <Reveal key={i}><div className="step-card">
              <div className="step-number">{i+1}</div>
              <span className="step-icon">{s.icon}</span>
              <h3>{s.title}</h3><p>{s.desc}</p>
            </div></Reveal>
          ))}
        </div>
        <Reveal><p className="process-note">⏱ Average launch time: 3–7 days</p></Reveal>
      </div>
    </section>
  )
}

/* ══════════════════ PORTFOLIO ══════════════════ */
function Portfolio() {
  const projects = [
    { name: "Bella's Bakery", tag: 'Food & Beverage', desc: 'A warm, inviting website with online menu and ordering system for a local bakery.', img: '/mockup-bakery.png' },
    { name: 'FixRight Plumbing', tag: 'Home Services', desc: 'Professional service website with integrated booking form and service area pages.', img: '/mockup-plumbing.png' },
    { name: 'Spark Fitness Studio', tag: 'Health & Fitness', desc: 'Dynamic gym website with class schedule, trainer profiles, and membership signup.', img: '/mockup-fitness.png' },
  ]
  return (
    <section className="portfolio" id="portfolio">
      <div className="container">
        <Reveal><div className="section-header"><h2>Portfolio</h2><p>Concept projects showcasing our design capabilities.</p></div></Reveal>
        <div className="portfolio-grid">
          {projects.map((p,i) => (
            <Reveal key={i}><div className="portfolio-card">
              <div className="portfolio-image">
                <img src={p.img} alt={p.name} className="portfolio-screenshot" />
                <span className="concept-badge">Concept Project</span>
              </div>
              <div className="portfolio-info">
                <span className="portfolio-tag">{p.tag}</span>
                <h3>{p.name}</h3><p>{p.desc}</p>
                <span className="btn btn-outline portfolio-btn">View Details</span>
              </div>
            </div></Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ══════════════════ TRUST REPLACEMENT ══════════════════ */
function TrustReplacement() {
  return (
    <section className="trust-replacement">
      <div className="container">
        <Reveal>
          <div className="trust-replacement-grid">
            {['Transparent, fixed pricing — no hidden fees', 'Direct communication with your designer, no account managers', 'Clear revision limits agreed upfront', 'You own the final site and domain after payment'].map((t, i) => (
              <div className="trust-replacement-item" key={i}>
                <span className="trust-check">✓</span>
                <span className="trust-text">{t}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}



/* ══════════════════ PRICING ══════════════════ */
function Pricing() {
  const plans = [
    { icon: '🚀', name: 'Launch', price: '$79', desc: 'Perfect for startups and local businesses.', cta: 'Get Started', features: ['1 Page Website','Mobile Responsive','Contact Form','Basic SEO Setup','Social Media Links','3 Revisions','3 Day Delivery'] },
    { icon: '⭐', name: 'Growth', price: '$129', popular: true, desc: 'Best for growing businesses.', cta: 'Choose Growth', features: ['Up to 5 Pages','Mobile Responsive','Contact Form','SEO Basics','Speed Optimization','Social Media Integration','5 Revisions','5 Day Delivery'] },
    { icon: '📈', name: 'Scale', price: '$199', desc: 'For businesses ready to expand.', cta: 'Scale My Business', features: ['Up to 8 Pages','Mobile Responsive','Blog Setup','Advanced Forms','Speed Optimization','Priority Support','Unlimited Revisions','7 Day Delivery'] },
  ]
  return (
    <section className="pricing" id="pricing">
      <div className="container">
        <Reveal><div className="section-header"><h2>Simple, Transparent Pricing</h2><p>No hidden fees. No surprises. Just great websites at honest prices.</p></div></Reveal>
        <div className="pricing-grid">
          {plans.map((p,i) => (
            <Reveal key={i}><div className={`pricing-card${p.popular?' popular':''}`}>
              {p.popular && <div className="popular-badge">Most Popular</div>}
              <span className="pricing-icon">{p.icon}</span>
              <h3>{p.name}</h3>
              <div className="pricing-price">{p.price}</div>
              <p className="pricing-desc">{p.desc}</p>
              <ul className="pricing-features">
                {p.features.map((f,j)=><li key={j}>{f}</li>)}
              </ul>
              <a href="#contact" className={`btn ${p.popular?'btn-primary':'btn-outline'}`} style={{width:'100%',justifyContent:'center'}}>{p.cta}</a>
            </div></Reveal>
          ))}
        </div>
        <Reveal><p className="pricing-note">💬 Not sure which plan fits? Let’s chat — no obligation.</p></Reveal>
      </div>
    </section>
  )
}

/* ══════════════════ ABOUT ══════════════════ */
function About() {
  const skills = ['React','HTML/CSS','JavaScript','Responsive Design','SEO','Web Design']
  return (
    <section className="about" id="about">
      <div className="container">
        <div className="about-content">
          <Reveal>
            <div className="about-avatar-wrap">
              <div className="about-avatar">
                <DotLottieReact
                  src="/animations/profile.lottie"
                  autoplay
                  loop
                  style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                />
              </div>
            </div>
          </Reveal>
          <Reveal>
            <div className="about-text">
              <h2>Built by Sam</h2>
              <h3>Hi, I'm Saksham — but most clients call me Sam.</h3>
              <p>I'm a web developer and founder of WIBLY, a professional web design agency built to help small businesses get the online presence they deserve.</p>
              <p>I believe every business — no matter how small — deserves a website that actually works. That brings in customers. That they're proud of.</p>
              <p>Using modern design techniques and conversion-focused strategies, I deliver agency-quality websites at prices small businesses can actually afford.</p>
              <div className="skills">
                {skills.map(s=><span className="skill-badge" key={s}>{s}</span>)}
              </div>
              <a href="#contact" className="btn btn-primary">Let's work together →</a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════ FAQ ══════════════════ */
function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)
  const faqs = [
    ['How long does it take to build my website?','Most websites are delivered within 5–7 days. Rush delivery is available for urgent projects.'],
    ['Do I need to provide anything?','Just your business info, logo (if you have one), and any content you want. We handle the rest.'],
    ['Will my website work on mobile?','100%. Every website we build is fully responsive on all screen sizes.'],
    ['What if I don\'t like the design?','We offer revisions until you\'re happy. Your satisfaction is guaranteed.'],
    ['How do I pay?','We accept international payments. 50% upfront, 50% on delivery.'],
    ['Can you update my existing website?','Yes! Contact us and we\'ll take a look at what needs to be done.'],
  ]
  return (
    <section className="faq" id="faq">
      <div className="container">
        <Reveal><div className="section-header"><h2>Got Questions? We've Got Answers.</h2></div></Reveal>
        <div className="faq-list">
          {faqs.map(([q,a],i) => (
            <Reveal key={i}>
              <div className={`faq-item${openIndex===i?' open':''}`}>
                <button className="faq-question" onClick={()=>setOpenIndex(openIndex===i?null:i)}>
                  {q}<span className="faq-icon">+</span>
                </button>
                <div className="faq-answer"><p>{a}</p></div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ══════════════════ CONTACT ══════════════════ */
function Contact() {
  const [form, setForm] = useState({ name:'', email:'', business:'', need:'', message:'' })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email is required'
    if (!form.need) e.need = 'Please select a service'
    if (!form.message.trim()) e.message = 'Message is required'
    return e
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setErrors({}); setSending(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (res.ok) { setSubmitted(true) }
      else { setErrors({ submit: 'Something went wrong. Please try again.' }) }
    } catch { setErrors({ submit: 'Network error. Please try again.' }) }
    setSending(false)
  }

  return (
    <section className="contact" id="contact">
      <div className="container">
        <Reveal><div className="section-header">
          <h2>Let's Build Something Great Together</h2>
        </div></Reveal>
        <div className="contact-grid">
          <Reveal>
            {submitted ? (
              <div className="form-success">🎉 Thank you! We'll get back to you shortly.</div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input id="name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Your name"/>
                  {errors.name && <span className="form-error">{errors.name}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input id="email" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@email.com"/>
                  {errors.email && <span className="form-error">{errors.email}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="business">Business Name</label>
                  <input id="business" value={form.business} onChange={e=>setForm({...form,business:e.target.value})} placeholder="Your business name"/>
                </div>
                <div className="form-group">
                  <label htmlFor="need">What do you need?</label>
                  <p>wibly.in@gmail.com</p>
                  <select id="need" value={form.need} onChange={e=>setForm({...form,need:e.target.value})}>
                    <option value="">Select a service...</option>
                    <option>Landing Page</option>
                    <option>Business Website</option>
                    <option>E-Commerce</option>
                    <option>Maintenance</option>
                    <option>Other</option>
                  </select>
                  {errors.need && <span className="form-error">{errors.need}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" value={form.message} onChange={e=>setForm({...form,message:e.target.value})} placeholder="Tell us about your project..."/>
                  {errors.message && <span className="form-error">{errors.message}</span>}
                </div>
                <button type="submit" className="btn btn-primary" disabled={sending}>{sending ? 'Sending...' : 'Send Message →'}</button>
                {errors.submit && <span className="form-error">{errors.submit}</span>}
              </form>
            )}
          </Reveal>
          <Reveal>
            <div className="contact-info">
              <div className="contact-trust">
                {['✓ Free Consultation','✓ No Obligation','✓ Fast Response'].map(t=>(
                  <span className="contact-trust-badge" key={t}>{t}</span>
                ))}
              </div>
              <div className="contact-info-item">
                <div className="contact-info-icon">📧</div>
                <div><h4>Email</h4><p>wibly.in@gmail.com</p></div>
              </div>
              <div className="contact-info-item">
                <div className="contact-info-icon">📱</div>
                <div><h4>Instagram</h4><p>@wibly.in</p></div>
              </div>
              <div className="contact-info-item">
                <div className="contact-info-icon">⏰</div>
                <div><h4>Response Time</h4><p>Typical response time: 2–6 hours</p></div>
              </div>
              <div className="contact-info-item">
                <div className="contact-info-icon">🌐</div>
                <div><h4>Location</h4><p>Serving clients worldwide</p></div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════ FOOTER ══════════════════ */
function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <a href="#home" className="logo-link"><img src="/logo.png" alt="WIBLY" className="footer-logo-img" /></a>
            <p>Real websites. Real results. Built for growth.</p>
          </div>
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              {['Home','Services','Portfolio','Pricing','Contact'].map(l=>(
                <li key={l}><a href={`#${l.toLowerCase()}`}>{l}</a></li>
              ))}
            </ul>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <ul className="footer-links">
              <li><a href="/privacy" target="_blank">Privacy Policy</a></li>
              <li><a href="/terms" target="_blank">Terms & Conditions</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Connect</h4>
            <div className="footer-social">
              <a href="https://instagram.com/wibly.in" target="_blank" rel="noopener noreferrer">📸 @wibly.in</a>
            </div>
            <p className="footer-email">wibly.in@gmail.com</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 WIBLY. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

/* ══════════════════ ADMIN PANEL ══════════════════ */
function AdminPanel() {
  const [token, setToken] = useState(localStorage.getItem('wibly_admin_token') || '')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(false)

  const login = async (e) => {
    e.preventDefault(); setLoginError('')
    const res = await fetch('/api/admin/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    })
    if (res.ok) {
      const data = await res.json()
      setToken(data.token); localStorage.setItem('wibly_admin_token', data.token)
    } else { setLoginError('Wrong password') }
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/submissions', { headers: { Authorization: `Bearer ${token}` } })
      if (res.ok) setSubmissions(await res.json())
      else { setToken(''); localStorage.removeItem('wibly_admin_token') }
    } catch {}
    setLoading(false)
  }

  const markRead = async (id) => {
    await fetch(`/api/submissions/${id}/read`, { method: 'PATCH', headers: { Authorization: `Bearer ${token}` } })
    fetchData()
  }

  const deleteSub = async (id) => {
    if (!confirm('Delete this submission?')) return
    await fetch(`/api/submissions/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    fetchData()
  }

  const logout = () => { setToken(''); localStorage.removeItem('wibly_admin_token') }

  useEffect(() => { if (token) fetchData() }, [token])

  if (!token) {
    return (
      <div className="admin-page">
        <div className="admin-login-box">
          <h2>🔒 WIBLY Admin</h2>
          <form onSubmit={login}>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter admin password" />
            <button type="submit" className="btn btn-primary" style={{width:'100%',justifyContent:'center'}}>Login</button>
            {loginError && <span className="form-error">{loginError}</span>}
          </form>
          <a href="/" style={{color:'var(--text-muted)', fontSize:'0.85rem', marginTop:'16px', display:'block', textAlign:'center'}}>← Back to website</a>
        </div>
      </div>
    )
  }

  const unread = submissions.filter(s => !s.read).length

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <div>
            <h1>📬 WIBLY Admin Dashboard</h1>
            <p>{submissions.length} total submissions {unread > 0 && <span className="admin-badge">{unread} new</span>}</p>
          </div>
          <div style={{display:'flex',gap:'12px'}}>
            <button className="btn btn-outline" onClick={fetchData}>↻ Refresh</button>
            <button className="btn btn-outline" onClick={logout}>Logout</button>
            <a href="/" className="btn btn-outline">← Site</a>
          </div>
        </div>
        {loading ? <p style={{textAlign:'center',padding:'40px'}}>Loading...</p> : submissions.length === 0 ? (
          <div className="admin-empty">
            <p>No submissions yet. When someone fills out the contact form, it will appear here.</p>
          </div>
        ) : (
          <div className="admin-list">
            {submissions.map(s => (
              <div key={s.id} className={`admin-card${s.read ? '' : ' unread'}`}>
                <div className="admin-card-header">
                  <div>
                    <strong>{s.name}</strong> {!s.read && <span className="admin-new-tag">NEW</span>}
                    <span className="admin-meta">{s.email} · {s.business || 'No business name'} · {s.need || 'Not specified'}</span>
                  </div>
                  <span className="admin-date">{new Date(s.timestamp).toLocaleString()}</span>
                </div>
                <p className="admin-message">{s.message}</p>
                <div className="admin-actions">
                  {!s.read && <button onClick={() => markRead(s.id)} className="btn-small">✓ Mark Read</button>}
                  <button onClick={() => deleteSub(s.id)} className="btn-small btn-danger">🗑 Delete</button>
                  <a href={`mailto:${s.email}`} className="btn-small">📧 Reply</a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/* ══════════════════ LEGAL PAGES ══════════════════ */
function PrivacyPolicy() {
  return (
    <>
      <Navbar/>
      <div className="legal-page container">
        <a href="/" className="legal-back">← Back to Home</a>
        <h1>Privacy Policy</h1>
        <p className="last-updated">Last Updated: June 17, 2026</p>
        <div className="legal-content">
          <h2>1. Information We Collect</h2>
          <p>We collect information you provide directly to us through our contact form, including your name, email address, business name, and project details.</p>
          
          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Respond to your inquiries and provide quotes</li>
            <li>Communicate with you about your project</li>
            <li>Improve our services and website experience</li>
          </ul>

          <h2>3. Information Sharing</h2>
          <p>We do not share, sell, or rent your personal information to third parties. Your data is kept strictly confidential and used only for communication between you and WIBLY.</p>

          <h2>4. Analytics</h2>
          <p>We may use basic analytics to understand how visitors interact with our website to improve user experience. This data is anonymized and does not identify individual users.</p>
        </div>
      </div>
      <Footer/>
    </>
  )
}

function TermsConditions() {
  return (
    <>
      <Navbar/>
      <div className="legal-page container">
        <a href="/" className="legal-back">← Back to Home</a>
        <h1>Terms & Conditions</h1>
        <p className="last-updated">Last Updated: June 17, 2026</p>
        <div className="legal-content">
          <h2>1. Project Scope & Delivery</h2>
          <p>All projects are subject to a clear scope of work agreed upon before commencement. Delivery timelines (e.g., 3-7 days) begin after we receive all necessary assets (logos, copy, images) from the client.</p>

          <h2>2. Revisions</h2>
          <p>Each plan includes a specific number of revisions. Additional revisions beyond the agreed scope may incur extra charges at our standard hourly rate.</p>

          <h2>3. Payment Terms</h2>
          <p>Projects require a 50% deposit upfront before work begins. The remaining 50% is due upon project completion and before the final website is transferred to your hosting account.</p>

          <h2>4. Ownership & Transfer</h2>
          <p>Upon final payment, full ownership of the website design, code, and assets is transferred to you. Domain names and hosting are the responsibility of the client, though we provide full assistance in setting them up.</p>

          <h2>5. Ongoing Maintenance</h2>
          <p>Unless a maintenance plan is purchased separately, WIBLY is not responsible for updating or maintaining the website post-launch.</p>
        </div>
      </div>
      <Footer/>
    </>
  )
}

/* ══════════════════ APP ══════════════════ */
export default function App() {
  const isAdmin = window.location.search.includes('admin')
  const path = window.location.pathname

  if (isAdmin) return <AdminPanel />
  if (path === '/privacy') return <PrivacyPolicy />
  if (path === '/terms') return <TermsConditions />

  return (
    <>
      <Navbar/>
      <Hero/>
      <Problem/>
      <Services/>
      <HowItWorks/>
      <Portfolio/>
      <TrustReplacement/>
      <Pricing/>
      <About/>
      <FAQ/>
      <Contact/>
      <Footer/>
    </>
  )
}
