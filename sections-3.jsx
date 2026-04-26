// Contact + Map + Footer
const { useState: useState3 } = React;

function Contact({ brand }) {
  const [submitted, setSubmitted] = useState3(false);
  const [form, setForm] = useState3({
    name: '', phone: '', email: '', event_type: '', date: '', guests: '', message: ''
  });

  const submit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const upd = (k) => (e) => setForm(f => ({...f, [k]: e.target.value}));

  return (
    <section className="contact" id="contact">
      <div className="container">
        <div className="section-head">
          <div className="eyebrow">Demande de réservation</div>
          <h2>Construisons ensemble<br/><span className="accent" style={{color:'var(--gold-light)'}}>votre événement</span></h2>
          <p>Envoyez-nous votre demande — nous revenons vers vous sous 24h avec un devis personnalisé et une visite de la salle.</p>
        </div>

        <div className="contact-grid">
          <div>
            <div className="contact-info-block">
              <div className="contact-info-icon"><Icon.Phone/></div>
              <div>
                <h4>Téléphone & WhatsApp</h4>
                <p><a href={`tel:${brand.phoneRaw}`}>{brand.phone}</a></p>
                <p style={{fontSize:13, marginTop:4}}>Disponible tous les jours, 9h – 21h</p>
              </div>
            </div>
            <div className="contact-info-block">
              <div className="contact-info-icon"><Icon.Pin/></div>
              <div>
                <h4>Adresse</h4>
                <p>{brand.address}</p>
                <p>{brand.location}, {brand.region}</p>
              </div>
            </div>
            <div className="contact-info-block">
              <div className="contact-info-icon"><Icon.Clock/></div>
              <div>
                <h4>Visite de la salle</h4>
                <p>Sur rendez-vous, du lundi au samedi.</p>
                <p style={{fontSize:13, marginTop:4}}>Une équipe vous accompagne lors de votre visite.</p>
              </div>
            </div>
            <div className="contact-info-block">
              <div className="contact-info-icon"><Icon.FB size={16}/></div>
              <div>
                <h4>Suivez-nous</h4>
                <p>
                  <a href={brand.facebook} target="_blank" rel="noopener noreferrer">Facebook — Salle des fêtes Layelina</a>
                </p>
              </div>
            </div>
          </div>

          <div className="contact-form">
            {submitted ? (
              <div className="form-success">
                <div className="form-success-icon"><Icon.Check/></div>
                <h3>Demande envoyée</h3>
                <p>Merci ! Nous revenons vers vous sous 24h. Pour toute urgence, contactez-nous au {brand.phone}.</p>
              </div>
            ) : (
              <form onSubmit={submit}>
                <div className="form-row">
                  <div className="field">
                    <label>Nom complet *</label>
                    <input type="text" required value={form.name} onChange={upd('name')} placeholder="Ex. Salma Belkaid"/>
                  </div>
                  <div className="field">
                    <label>Téléphone *</label>
                    <input type="tel" required value={form.phone} onChange={upd('phone')} placeholder="+216 XX XXX XXX"/>
                  </div>
                </div>
                <div className="field">
                  <label>Email</label>
                  <input type="email" value={form.email} onChange={upd('email')} placeholder="vous@exemple.com"/>
                </div>
                <div className="form-row">
                  <div className="field">
                    <label>Type d'événement *</label>
                    <select required value={form.event_type} onChange={upd('event_type')}>
                      <option value="">— Sélectionner —</option>
                      <option>Mariage</option>
                      <option>Fiançailles</option>
                      <option>Wtyia</option>
                      <option>Conférence / Séminaire</option>
                      <option>Autre</option>
                    </select>
                  </div>
                  <div className="field">
                    <label>Date souhaitée</label>
                    <input type="date" value={form.date} onChange={upd('date')}/>
                  </div>
                </div>
                <div className="field">
                  <label>Nombre d'invités estimé</label>
                  <select value={form.guests} onChange={upd('guests')}>
                    <option value="">— Sélectionner —</option>
                    <option>Moins de 100</option>
                    <option>100 – 200</option>
                    <option>200 – 300</option>
                    <option>300 – 400</option>
                    <option>400 – 500</option>
                  </select>
                </div>
                <div className="field">
                  <label>Votre message</label>
                  <textarea value={form.message} onChange={upd('message')} placeholder="Parlez-nous de votre projet, vos préférences, vos questions…"></textarea>
                </div>
                <button type="submit" className="form-submit">Envoyer ma demande →</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function MapSection({ brand }) {
  const mapEmbed = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3267.234!2d10.9116124!3d35.0385384!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sSalle+des+f%C3%AAtes+Layelina!5e0!3m2!1sfr!2stn!4v1700000000000";
  return (
    <section className="map-section" id="map">
      <div className="map-grid">
        <div className="map-info">
          <div className="eyebrow">Plan d'accès</div>
          <h2>Nous trouver à<br/><span className="accent">Jebeniana</span></h2>
          <p style={{marginBottom: 32}}>À quelques minutes du centre de Sfax, dans un cadre paisible et facilement accessible.</p>

          <div className="address-line">
            <span className="icon"><Icon.Pin size={20}/></span>
            <div>
              <strong>Adresse</strong>
              <span>{brand.address}<br/>{brand.location}, {brand.region}</span>
            </div>
          </div>
          <div className="address-line">
            <span className="icon"><Icon.Phone size={20}/></span>
            <div>
              <strong>Téléphone</strong>
              <span>{brand.phone}</span>
            </div>
          </div>
          <div style={{marginTop: 28}}>
            <a href={brand.maps} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{background:'var(--gold)', color:'#fff'}}>
              Itinéraire Google Maps <Icon.Arrow size={12}/>
            </a>
          </div>
        </div>
        <div className="map-frame">
          <iframe src={mapEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Plan Layelina"></iframe>
        </div>
      </div>
    </section>
  );
}

function Footer({ brand }) {
  return (
    <footer>
      <div className="footer-grid">
        <div className="footer-brand">
          <img src="assets/logo.png" alt="Layelina" style={{height: 110, width: 'auto', marginBottom: 12, filter: 'brightness(1.1)'}}/>
          <div className="footer-brand-name">Layelina</div>
          <div className="footer-brand-tag">— Là où vos plus belles soirées prennent vie</div>
          <p>Salle des fêtes de prestige à Jebeniana, Sfax. Mariages, fiançailles, Wtyia et événements professionnels jusqu'à 500 invités.</p>
          <div className="footer-socials">
            <a href={brand.facebook} target="_blank" rel="noopener noreferrer" className="footer-social" aria-label="Facebook"><Icon.FB/></a>
            <a href={`https://wa.me/${brand.whatsapp}`} target="_blank" rel="noopener noreferrer" className="footer-social" aria-label="WhatsApp"><Icon.Whatsapp size={16}/></a>
            <a href={`tel:${brand.phoneRaw}`} className="footer-social" aria-label="Téléphone"><Icon.Phone size={16}/></a>
          </div>
        </div>
        <div className="footer-col">
          <h5>Navigation</h5>
          <ul>
            <li><a href="#about">À propos</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#gallery">Galerie</a></li>
            <li><a href="#calendar">Disponibilité</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h5>Événements</h5>
          <ul>
            <li><a href="#services">Mariages</a></li>
            <li><a href="#services">Fiançailles</a></li>
            <li><a href="#services">Wtyia</a></li>
            <li><a href="#services">Séminaires</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h5>Contact</h5>
          <ul>
            <li>{brand.address}</li>
            <li>{brand.location}</li>
            <li><a href={`tel:${brand.phoneRaw}`}>{brand.phone}</a></li>
            <li><a href={`https://wa.me/${brand.whatsapp}`} target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div>© 2026 Salle des fêtes Layelina. Tous droits réservés.</div>
        <div>Jebeniana, Gouvernorat de Sfax — Tunisie</div>
      </div>
    </footer>
  );
}

Object.assign(window, { Contact, MapSection, Footer });
