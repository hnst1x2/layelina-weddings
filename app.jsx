// Main app
const { useState: useStateApp, useEffect: useEffectApp } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "gold-classic",
  "titleFont": "cormorant",
  "heroStyle": "slider"
}/*EDITMODE-END*/;

const PALETTES = {
  'gold-classic': { gold: '#b08a4a', goldDeep: '#8a6a32', goldLight: '#d4b87a', goldBright: '#e8c987', bg: '#fbf8f3', bgCream: '#f5efe4', bgDeep: '#1a1410', label: 'Or classique' },
  'rose-gold':    { gold: '#b87a6a', goldDeep: '#92584a', goldLight: '#d6a496', goldBright: '#e8b8a8', bg: '#fbf6f3', bgCream: '#f5e8e0', bgDeep: '#1f1612', label: 'Or rose' },
  'champagne':    { gold: '#a89060', goldDeep: '#806a44', goldLight: '#d4c08a', goldBright: '#ead4a0', bg: '#faf7f0', bgCream: '#f0e8d4', bgDeep: '#181410', label: 'Champagne' },
  'emerald-gold': { gold: '#9a7a3a', goldDeep: '#7a5e26', goldLight: '#c8a86a', goldBright: '#dcc086', bg: '#f7f5ee', bgCream: '#ece8d8', bgDeep: '#0f1814', label: 'Émeraude' },
  'midnight':     { gold: '#c0a060', goldDeep: '#9a7e44', goldLight: '#dcc285', goldBright: '#ecd29a', bg: '#f0eee8', bgCream: '#dcd8cc', bgDeep: '#0a0e1a', label: 'Nuit' },
};

const FONTS = {
  cormorant: { stack: "'Cormorant Garamond', Georgia, serif", label: 'Cormorant' },
  playfair: { stack: "'Playfair Display', Georgia, serif", label: 'Playfair' },
  marcellus: { stack: "'Marcellus', Georgia, serif", label: 'Marcellus' },
  italiana: { stack: "'Italiana', Georgia, serif", label: 'Italiana' },
};

function App() {
  const D = window.LAYELINA_DATA;
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [scrolled, setScrolled] = useStateApp(false);
  const [heroDark, setHeroDark] = useStateApp(true);
  const [mobileOpen, setMobileOpen] = useStateApp(false);

  // Apply palette
  useEffectApp(() => {
    const p = PALETTES[tweaks.palette] || PALETTES['gold-classic'];
    const r = document.documentElement;
    r.style.setProperty('--gold', p.gold);
    r.style.setProperty('--gold-deep', p.goldDeep);
    r.style.setProperty('--gold-light', p.goldLight);
    r.style.setProperty('--gold-bright', p.goldBright);
    r.style.setProperty('--bg', p.bg);
    r.style.setProperty('--bg-cream', p.bgCream);
    r.style.setProperty('--bg-deep', p.bgDeep);
  }, [tweaks.palette]);

  // Apply font
  useEffectApp(() => {
    const f = FONTS[tweaks.titleFont] || FONTS.cormorant;
    document.documentElement.style.setProperty('--display', f.stack);
    document.documentElement.style.setProperty('--serif', f.stack);
  }, [tweaks.titleFont]);

  // Scroll
  useEffectApp(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 80);
      setHeroDark(window.scrollY < window.innerHeight - 100);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Reveal on scroll
  useEffectApp(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  });

  return (
    <>
      <Nav heroDark={heroDark} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} scrolled={scrolled} logo={D.brand.logo} />
      <Hero slides={D.hero_slides} heroStyle={tweaks.heroStyle} />
      <About stats={D.stats} />
      <Services services={D.services} />
      <Events items={D.events_grid} />
      <Gallery groups={D.gallery} />
      <Calendar bookings={D.bookings} />
      <Testimonials items={D.testimonials} />
      <Contact brand={D.brand} />
      <MapSection brand={D.brand} />
      <Footer brand={D.brand} />

      <a href={`https://wa.me/${D.brand.whatsapp}?text=Bonjour%20Layelina%2C%20je%20souhaite%20me%20renseigner.`} target="_blank" rel="noopener noreferrer" className="fab-whatsapp" aria-label="WhatsApp">
        <Icon.Whatsapp/>
      </a>

      <TweaksPanel title="Tweaks">
        <TweakSection title="Palette de couleurs">
          <TweakRadio
            value={tweaks.palette}
            onChange={v => setTweak('palette', v)}
            options={Object.entries(PALETTES).map(([k, v]) => ({ value: k, label: v.label }))}
          />
        </TweakSection>
        <TweakSection title="Police de titre">
          <TweakRadio
            value={tweaks.titleFont}
            onChange={v => setTweak('titleFont', v)}
            options={Object.entries(FONTS).map(([k, v]) => ({ value: k, label: v.label }))}
          />
        </TweakSection>
        <TweakSection title="Style du Hero">
          <TweakRadio
            value={tweaks.heroStyle}
            onChange={v => setTweak('heroStyle', v)}
            options={[
              { value: 'image', label: 'Image' },
              { value: 'slider', label: 'Slider' },
              { value: 'video', label: 'Animé' },
            ]}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);
