// Gallery + Lightbox + Calendar + Testimonials
const { useState: useState2, useEffect: useEffect2, useRef: useRef2, useMemo } = React;

function Gallery({ groups }) {
  const tabs = Object.keys(groups);
  const [tab, setTab] = useState2(tabs[0]);
  const [lbIdx, setLbIdx] = useState2(-1);
  const items = groups[tab];

  useEffect2(() => {
    const onKey = e => {
      if (lbIdx < 0) return;
      if (e.key === 'Escape') setLbIdx(-1);
      if (e.key === 'ArrowRight') setLbIdx(i => (i + 1) % items.length);
      if (e.key === 'ArrowLeft') setLbIdx(i => (i - 1 + items.length) % items.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lbIdx, items.length]);

  return (
    <section className="gallery" id="gallery">
      <div className="container">
        <div className="section-head">
          <div className="eyebrow">Notre galerie</div>
          <h2>Quand les <span className="accent">souvenirs</span> deviennent images</h2>
          <p>Quelques moments capturés dans nos murs — décors, mises en scène et célébrations passées.</p>
        </div>

        <div className="gallery-tabs">
          {tabs.map(t => (
            <button key={t} className={'gallery-tab' + (t === tab ? ' active' : '')} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>

        <div className="gallery-grid reveal">
          {items.map((src, i) => (
            <div key={src+i} className="gallery-item" style={{backgroundImage: `url(${src})`}} onClick={() => setLbIdx(i)}>
              <div className="zoom-icon"><Icon.Search size={32}/></div>
            </div>
          ))}
        </div>
      </div>

      <div className={'lightbox' + (lbIdx >= 0 ? ' open' : '')} onClick={(e) => { if (e.target === e.currentTarget) setLbIdx(-1); }}>
        {lbIdx >= 0 && <img src={items[lbIdx]} className="lightbox-img" alt="" />}
        <button className="lightbox-close" onClick={() => setLbIdx(-1)} aria-label="Fermer"><Icon.Close size={20}/></button>
        <button className="lightbox-nav prev" onClick={() => setLbIdx(i => (i - 1 + items.length) % items.length)} aria-label="Précédent"><Icon.Arrow dir="left" size={18}/></button>
        <button className="lightbox-nav next" onClick={() => setLbIdx(i => (i + 1) % items.length)} aria-label="Suivant"><Icon.Arrow size={18}/></button>
        {lbIdx >= 0 && <div className="lightbox-counter">{String(lbIdx+1).padStart(2,'0')} / {String(items.length).padStart(2,'0')}</div>}
      </div>
    </section>
  );
}

const MONTHS = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
const DOWS = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];

function Calendar({ bookings: fallbackBookings }) {
  const SB = window.LAYELINA_SUPABASE || {};
  const sbReady = Boolean(SB.url && SB.anonKey);

  const [view, setView] = useState2({ year: 2026, month: 4 });
  const [selected, setSelected] = useState2(null);
  const [bookings, setBookings] = useState2(fallbackBookings || {});
  const [loading, setLoading] = useState2(sbReady);
  const [submitting, setSubmitting] = useState2(false);
  const [submitError, setSubmitError] = useState2(null);
  const [submitDone, setSubmitDone] = useState2(false);
  const [form, setForm] = useState2({ event_type: 'Mariage', client_name: '', client_phone: '', client_email: '', notes: '' });

  // Fetch bookings from Supabase on mount
  useEffect2(() => {
    if (!sbReady) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${SB.url}/rest/v1/bookings?select=date,status`, {
          headers: { apikey: SB.anonKey, Authorization: `Bearer ${SB.anonKey}` },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const rows = await res.json();
        if (cancelled) return;
        const map = {};
        rows.forEach(r => { map[r.date] = r.status; });
        setBookings(map);
      } catch (err) {
        // Fall back to whatever was passed in (data.js seed)
        console.warn('Calendar: failed to load Supabase bookings, using fallback', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const days = useMemo(() => {
    const first = new Date(view.year, view.month, 1);
    const lastDay = new Date(view.year, view.month + 1, 0).getDate();
    let startDow = first.getDay() - 1; // Mon=0
    if (startDow < 0) startDow = 6;
    const arr = [];
    for (let i = 0; i < startDow; i++) arr.push(null);
    for (let d = 1; d <= lastDay; d++) {
      const dateStr = `${view.year}-${String(view.month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      arr.push({ day: d, dateStr, status: bookings[dateStr] || 'available' });
    }
    return arr;
  }, [view, bookings]);

  const move = (delta) => {
    let m = view.month + delta;
    let y = view.year;
    if (m < 0) { m = 11; y -= 1; }
    if (m > 11) { m = 0; y += 1; }
    setView({ year: y, month: m });
  };

  const onSelectDate = (dateStr, status) => {
    if (status === 'booked') return;
    setSubmitError(null);
    setSubmitDone(false);
    setSelected(dateStr);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!selected || !sbReady) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const payload = {
        date: selected,
        status: 'pending',
        event_type: form.event_type || null,
        client_name: form.client_name.trim() || null,
        client_phone: form.client_phone.trim() || null,
        client_email: form.client_email.trim() || null,
        notes: form.notes.trim() || null,
      };
      const res = await fetch(`${SB.url}/rest/v1/bookings`, {
        method: 'POST',
        headers: {
          apikey: SB.anonKey,
          Authorization: `Bearer ${SB.anonKey}`,
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const txt = await res.text();
        if (res.status === 409 || /duplicate key/i.test(txt)) {
          throw new Error('Cette date a déjà été demandée — choisissez-en une autre.');
        }
        throw new Error('Erreur lors de l\'envoi. Réessayez ou contactez-nous.');
      }
      setBookings(prev => ({ ...prev, [selected]: 'pending' }));
      setSubmitDone(true);
      setForm({ event_type: 'Mariage', client_name: '', client_phone: '', client_email: '', notes: '' });
    } catch (err) {
      setSubmitError(err.message || String(err));
    } finally {
      setSubmitting(false);
    }
  };

  const todayStr = '2026-04-27';
  const selectedStatus = selected ? (bookings[selected] || 'available') : null;
  const formField = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <section className="calendar" id="calendar">
      <div className="container">
        <div className="section-head">
          <div className="eyebrow">Disponibilité</div>
          <h2>Réservez votre <span className="accent">date</span></h2>
          <p>Consultez les créneaux libres et envoyez-nous une demande pour la date qui vous convient.</p>
        </div>

        <div className="calendar-wrap">
          <div className="calendar-info">
            <h3>Vérifiez les <span className="accent">disponibilités</span></h3>
            <p>Cliquez sur une date libre pour démarrer votre demande de réservation. Les week-ends de haute saison (mai à septembre) se réservent rapidement.</p>
            <div className="legend">
              <div className="legend-item"><span className="legend-dot available"></span> Disponible</div>
              <div className="legend-item"><span className="legend-dot pending"></span> En attente</div>
              <div className="legend-item"><span className="legend-dot booked"></span> Complet</div>
              <div className="legend-item"><span className="legend-dot selected"></span> Sélectionnée</div>
            </div>
            {loading && <div className="cal-selected-info"><span>Chargement des disponibilités...</span></div>}

            {selected && !submitDone && selectedStatus === 'available' && (
              <form className="cal-booking-form" onSubmit={onSubmit}>
                <strong>{new Date(selected).toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}</strong>
                <label>Type d'événement
                  <select value={form.event_type} onChange={formField('event_type')}>
                    <option>Mariage</option>
                    <option>Fiançailles</option>
                    <option>Henné</option>
                    <option>Anniversaire</option>
                    <option>Séminaire</option>
                    <option>Autre</option>
                  </select>
                </label>
                <label>Nom complet
                  <input type="text" required value={form.client_name} onChange={formField('client_name')} placeholder="Votre nom" />
                </label>
                <label>Téléphone
                  <input type="tel" required value={form.client_phone} onChange={formField('client_phone')} placeholder="+216 ..." />
                </label>
                <label>Email <span className="muted">(optionnel)</span>
                  <input type="email" value={form.client_email} onChange={formField('client_email')} placeholder="vous@exemple.com" />
                </label>
                <label>Notes <span className="muted">(optionnel)</span>
                  <textarea rows={2} value={form.notes} onChange={formField('notes')} placeholder="Nombre d'invités, exigences spéciales..." />
                </label>
                {submitError && <div className="cal-form-error">{submitError}</div>}
                <div className="cal-form-actions">
                  <button type="button" className="btn-ghost" onClick={() => setSelected(null)} disabled={submitting}>Annuler</button>
                  <button type="submit" className="btn-primary" disabled={submitting}>
                    {submitting ? 'Envoi...' : 'Envoyer la demande'}
                  </button>
                </div>
              </form>
            )}

            {selected && selectedStatus === 'pending' && !submitDone && (
              <div className="cal-selected-info">
                <strong>{new Date(selected).toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}</strong>
                <span>Cette date est en attente de confirmation. Contactez-nous pour plus d'infos.</span>
              </div>
            )}

            {submitDone && (
              <div className="cal-selected-info success">
                <strong>Demande envoyée ✓</strong>
                <span>Nous vous recontactons sous 24 h pour confirmer la date du {selected && new Date(selected).toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' })}.</span>
              </div>
            )}
          </div>

          <div className="calendar-grid-wrap">
            <div className="cal-header">
              <button className="cal-nav" onClick={() => move(-1)}><Icon.Arrow dir="left"/></button>
              <div className="cal-month">{MONTHS[view.month]} <span className="year">{view.year}</span></div>
              <button className="cal-nav" onClick={() => move(1)}><Icon.Arrow/></button>
            </div>
            <div className="cal-grid">
              {DOWS.map(d => <div key={d} className="cal-dow">{d}</div>)}
              {days.map((d, i) => d === null
                ? <div key={'e'+i} className="cal-day empty"></div>
                : <button
                    key={d.dateStr}
                    className={[
                      'cal-day',
                      d.status,
                      d.dateStr === todayStr ? 'today' : '',
                      d.dateStr === selected ? 'selected' : ''
                    ].filter(Boolean).join(' ')}
                    onClick={() => onSelectDate(d.dateStr, d.status)}
                    disabled={d.status === 'booked'}
                  >{d.day}</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials({ items }) {
  const [idx, setIdx] = useState2(0);
  useEffect2(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % items.length), 7000);
    return () => clearInterval(t);
  }, [items.length]);

  return (
    <section className="testimonials" id="testimonials">
      <div className="container">
        <div className="section-head">
          <div className="eyebrow">Ils nous ont fait confiance</div>
          <h2>Les voix de <span className="accent">nos invités</span></h2>
        </div>

        <div className="testimonial-quote-mark">"</div>
        <div className="testimonial-track">
          {items.map((t, i) => (
            <div key={i} className={'testimonial' + (i === idx ? ' active' : '')}>
              <div className="testimonial-stars">
                {Array.from({length: t.stars}).map((_, j) => <Icon.Star key={j}/>)}
              </div>
              <div className="testimonial-text">« {t.text} »</div>
              <div className="testimonial-author">{t.author}</div>
              <div className="testimonial-event">{t.event}</div>
            </div>
          ))}
        </div>

        <div className="testimonial-controls">
          <button className="t-arrow" onClick={() => setIdx(i => (i - 1 + items.length) % items.length)} aria-label="Précédent"><Icon.Arrow dir="left"/></button>
          <div className="t-dots">
            {items.map((_, i) => <button key={i} className={'t-dot' + (i === idx ? ' active' : '')} onClick={() => setIdx(i)} aria-label={`Avis ${i+1}`}/>)}
          </div>
          <button className="t-arrow" onClick={() => setIdx(i => (i + 1) % items.length)} aria-label="Suivant"><Icon.Arrow/></button>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Gallery, Calendar, Testimonials });
