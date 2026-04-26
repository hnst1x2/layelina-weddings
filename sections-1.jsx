// Sections: Nav, Hero, About, Services, Events
const { useState, useEffect, useRef } = React;

function Nav({ heroDark, mobileOpen, setMobileOpen, scrolled, logo }) {
  const links = [
  { href: '#about', label: 'À propos' },
  { href: '#services', label: 'Services' },
  { href: '#gallery', label: 'Galerie' },
  { href: '#calendar', label: 'Disponibilité' },
  { href: '#testimonials', label: 'Avis' },
  { href: '#contact', label: 'Contact' }];

  const cls = ['nav'];
  if (scrolled) cls.push('scrolled');else
  if (heroDark) cls.push('hero-light');

  return (
    <nav className={cls.join(' ')} style={{ height: "88px" }}>
      <a href="#top" className="nav-logo">
        <img src="assets/logo.png" alt="Layelina" className="nav-logo-img" style={{ width: "101px", height: "100px" }} />
      </a>
      <div className={'nav-links' + (mobileOpen ? ' open' : '')}>
        {links.map((l) =>
        <a key={l.href} href={l.href} className="nav-link" onClick={() => setMobileOpen(false)}>{l.label}</a>
        )}
        <a href="#contact" className="nav-cta" onClick={() => setMobileOpen(false)}>Réserver</a>
      </div>
      <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
        {mobileOpen ? <Icon.Close /> : <Icon.Menu />}
      </button>
    </nav>);

}

function Hero({ slides, heroStyle }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (heroStyle !== 'slider') return;
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [heroStyle, slides.length]);

  return (
    <section className="hero" id="top">
      {heroStyle === 'slider' ?
      <div className="hero-bg hero-slider" style={{ background: 'transparent' }}>
          {slides.map((s, i) =>
        <div key={i} className={'hero-slide' + (i === idx ? ' active' : '')} style={{ backgroundImage: `url(${s})` }} />
        )}
          <div className="hero-dots">
            {slides.map((_, i) => <button key={i} className={'hero-dot' + (i === idx ? ' active' : '')} onClick={() => setIdx(i)} aria-label={`Slide ${i + 1}`} />)}
          </div>
        </div> :
      heroStyle === 'video' ?
      <div className="hero-bg" style={{
        backgroundImage: `linear-gradient(rgba(20,15,10,0.55), rgba(20,15,10,0.7)), url(${slides[0]})`,
        animation: 'heroZoom 14s ease-in-out infinite alternate'
      }} /> :

      <div className="hero-bg" style={{ backgroundImage: `linear-gradient(rgba(20,15,10,0.55), rgba(20,15,10,0.7)), url(${slides[0]})` }} />
      }

      <div className="hero-inner">
        <div className="hero-eyebrow">Salle des fêtes — Jebeniana, Sfax</div>
        <h1>
          L'élégance d'une<br />
          <span className="accent">soirée inoubliable</span>
        </h1>
        <p className="hero-sub">
          Mariages, fiançailles, henné, anniversaires et événements professionnels —
          célébrés dans un écrin somptueux pensé pour 300 à 500 invités.
        </p>
        <div className="hero-actions">
          <a href="#contact" className="btn-primary">
            Réserver une date <Icon.Arrow size={12} />
          </a>
          <a href="#gallery" className="btn-ghost">Voir la galerie</a>
        </div>
      </div>

      <a href="#about" className="hero-scroll">Découvrir</a>
    </section>);

}

function About({ stats }) {
  return (
    <section className="about" id="about">
      <div className="container">
        <div className="about-grid">
          <div className="about-img reveal" style={{ backgroundImage: 'url(assets/scene-trone.jpg)' }}>
            <div className="about-img-tag">
              <div className="num">2022</div>
              <div className="label">Depuis</div>
            </div>
          </div>
          <div className="about-content reveal">
            <div className="eyebrow" style={{ marginBottom: 22, display: 'inline-block' }}>Notre maison</div>
            <h2>Un lieu où chaque<br /><span className="accent">détail compte.</span></h2>
            <p>
              Nichée au cœur de Jebeniana, à quelques pas de Sfax, la Salle des Fêtes Layelina
              est devenue une référence pour les célébrations de prestige dans la région.
            </p>
            <p>
              De la décoration sur-mesure à la coordination du jour J, notre équipe accompagne
              chaque famille avec la même rigueur et la même passion. Une salle modulable,
              une lumière soignée, une acoustique pensée — tout est réuni pour transformer
              vos événements en souvenirs précieux.
            </p>
            <div className="about-stats">
              {stats.map((s, i) =>
              <div key={i} className="stat">
                  <div className="num">{s.num}</div>
                  <div className="label">{s.label}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>);

}

function Services({ services }) {
  return (
    <section className="services" id="services">
      <div className="container">
        <div className="section-head">
          <div className="eyebrow">Nos prestations</div>
          <h2>Pour chaque <span className="accent">moment</span> qui compte</h2>
          <p>De l'intimité d'une cérémonie de fiançailles au faste d'un mariage de prestige, notre savoir-faire s'adapte à toutes vos célébrations.</p>
        </div>
        <div className="services-grid reveal">
          {services.map((s, i) => {
            const I = ServiceIcon[s.icon];
            return (
              <div key={i} className="service-card">
                <div className="service-icon"><I /></div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>);

          })}
        </div>
      </div>
    </section>);

}

function Events({ items }) {
  return (
    <section className="events" id="events">
      <div className="container">
        <div className="section-head">
          <div className="eyebrow">Événements signature</div>
          <h2>L'art de <span className="accent">recevoir</span></h2>
          <p>Chaque type d'événement bénéficie d'une mise en scène pensée sur-mesure, dans le respect des traditions et des envies de chacun.</p>
        </div>
        <div className="events-grid reveal">
          {items.map((it, i) =>
          <div key={i} className="event-tile" style={{ backgroundImage: `url(${it.img})` }}>
              <div className="event-tile-content">
                <div className="num">{it.num}</div>
                <h3>{it.title}</h3>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>);

}

Object.assign(window, { Nav, Hero, About, Services, Events });