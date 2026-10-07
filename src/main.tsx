import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Check, ChevronDown, Instagram, Menu, Minus, Plus, Send, Sparkles, X } from 'lucide-react';
import './styles.css';

const instagram = 'https://www.instagram.com/';
const facebook = 'https://www.facebook.com/';
const whatsapp = 'https://wa.me/27679393256';
const image = (name: string) => `${import.meta.env.BASE_URL}images/${name}`;

const photos = [
  { src: image('tablescape-editorial.jpg'), title: 'Gather beautifully', label: 'Styled tables', category: 'Celebrations' },
  { src: image('kids-party.jpg'), title: 'A little magic', label: 'Children\'s parties', category: 'Kids' },
  { src: image('milestone-evening.jpg'), title: 'After dark', label: 'Milestone moments', category: 'Celebrations' },
  { src: image('sculptural-backdrop.jpg'), title: 'Make an entrance', label: 'Statement backdrops', category: 'Backdrops' },
  { src: image('bridal-shower.jpg'), title: 'Soft & striking', label: 'Bridal showers', category: 'Celebrations' },
  { src: image('corporate-evening.jpg'), title: 'The big occasion', label: 'Corporate events', category: 'Celebrations' },
];

const eventTypes = ['Children\'s party', 'Baby shower', 'Bridal shower', 'Birthday / milestone', 'Matric celebration', 'Other event'];
const addOns = [
  { id: 'backdrop', label: 'Custom backdrop' },
  { id: 'balloons', label: 'Balloon styling' },
  { id: 'letters', label: 'Light-up letters or numbers' },
  { id: 'bouncy', label: 'White bouncy house / inflatable' },
  { id: 'styling', label: 'Full event styling' },
];

type Photo = typeof photos[number];

function Curve({ color = '#ffffff', flip = false }: { color?: string; flip?: boolean }) {
  return <svg className={`curve ${flip ? 'curve-flip' : ''}`} viewBox="0 0 1440 92" preserveAspectRatio="none" aria-hidden="true"><path fill={color} d="M0 32C160 78 305 89 470 67c169-22 260-67 440-53 176 13 329 60 530 29v49H0Z" /></svg>;
}

function App() {
  const [scroll, setScroll] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [lightbox, setLightbox] = useState<Photo | null>(null);
  const [filter, setFilter] = useState('All');
  const [eventType, setEventType] = useState(eventTypes[0]);
  const [guests, setGuests] = useState(30);
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [selected, setSelected] = useState<string[]>(['backdrop', 'balloons']);
  const [letters, setLetters] = useState('');
  const [notes, setNotes] = useState('');
  useEffect(() => {
    const update = () => setScroll(window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight));
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, []);

  useEffect(() => {
    if (!window.matchMedia('(pointer:fine) and (prefers-reduced-motion:no-preference)').matches) return;
    const mark = document.querySelector<HTMLElement>('.cursor-mark');
    const ring = document.querySelector<HTMLElement>('.cursor-ring');
    const particles = Array.from(document.querySelectorAll<HTMLElement>('.cursor-trail span'));
    if (!mark || !ring) return;
    const pointer = { x: -100, y: -100 };
    const ringPosition = { x: -100, y: -100 };
    const positions = particles.map(() => ({ x: -100, y: -100 }));
    let initialized = false;
    const move = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      mark.style.transform = `translate3d(${pointer.x}px,${pointer.y}px,0)`;
      if (!initialized) {
        ringPosition.x = pointer.x;
        ringPosition.y = pointer.y;
        positions.forEach(position => { position.x = pointer.x; position.y = pointer.y; });
        initialized = true;
      }
    };
    let frame = 0;
    const animate = () => {
      ringPosition.x += (pointer.x - ringPosition.x) * .23;
      ringPosition.y += (pointer.y - ringPosition.y) * .23;
      ring.style.transform = `translate3d(${ringPosition.x}px,${ringPosition.y}px,0)`;
      positions.forEach((position, index) => {
        const lead = index === 0 ? ringPosition : positions[index - 1];
        position.x += (lead.x - position.x) * .4;
        position.y += (lead.y - position.y) * .4;
        particles[index].style.transform = `translate3d(${position.x}px,${position.y}px,0)`;
      });
      frame = requestAnimationFrame(animate);
    };
    window.addEventListener('pointermove', move);
    animate();
    return () => { window.removeEventListener('pointermove', move); cancelAnimationFrame(frame); };
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') { setLightbox(null); setChatOpen(false); setMenuOpen(false); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const chosen = useMemo(() => addOns.filter(item => selected.includes(item.id)), [selected]);
  const letterCount = letters.replace(/[^a-z0-9]/gi, '').length;
  const visiblePhotos = filter === 'All' ? photos : photos.filter(photo => photo.category === filter);
  const quoteText = useMemo(() => [
    'Hi NexWeb AI Studios! I explored your Luma & Lace events website concept and would like to discuss a similar website.',
    'Here is the sample event brief I built:',
    `Event: ${eventType}`,
    `Guests: approximately ${guests}`,
    `Date: ${date || 'To be confirmed'}`,
    `Location: ${location.trim() || 'To be confirmed'}`,
    `Interested in: ${chosen.length ? chosen.map(item => item.label).join(', ') : 'Please advise'}`,
    selected.includes('letters') ? `Light-up wording: ${letters.trim() || 'To be discussed'} (${letterCount} letters/numbers)` : '',
    notes.trim() ? `Notes: ${notes.trim()}` : '',
    'Please contact me about a website like this. Thank you!',
  ].filter(Boolean).join('\n'), [eventType, guests, date, location, chosen, selected, letters, letterCount, notes]);
  const quoteLink = `${whatsapp}?text=${encodeURIComponent(quoteText)}`;
  const toggle = (id: string) => setSelected(current => current.includes(id) ? current.filter(x => x !== id) : [...current, id]);
  const closeMenu = () => setMenuOpen(false);

  return <>
    <div className="progress" style={{ transform: `scaleX(${scroll})` }} />
    <div className="cursor-mark" aria-hidden="true">✳</div>
    <div className="cursor-ring" aria-hidden="true" />
    <div className="cursor-trail" aria-hidden="true">{Array.from({ length: 7 }, (_, index) => <span key={index} />)}</div>
    <header className={`site-header ${scroll > 0.03 ? 'scrolled' : ''}`}>
      <a className="brand" href="#top" onClick={closeMenu} aria-label="Luma and Lace, back to top"><span className="brand-star">✳</span><span>LUMA & LACE<span className="brand-sub">EVENT STYLING</span></span></a>
      <nav className={menuOpen ? 'nav open' : 'nav'} aria-label="Main navigation">
        <a href="#about" onClick={closeMenu}>About</a><a href="#services" onClick={closeMenu}>What we do</a><a href="#work" onClick={closeMenu}>Gallery</a><a href="#quote" onClick={closeMenu}>Build a quote</a>
        <a className="nav-social" href={instagram} target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={18} /></a>
      </nav>
      <a className="header-cta" href="#quote">Let’s celebrate <ArrowRight size={16} /></a>
      <button className="menu-toggle icon-btn" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
    </header>

    <main id="top">
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-images" aria-hidden="true"><img className="hero-main-photo" src={image('hero-editorial.jpg')} alt="" /><img className="hero-side-photo" src={image('tablescape-editorial.jpg')} alt="" /></div>
        <div className="hero-overlay" />
        <div className="hero-copy wrap">
          <span className="eyebrow hero-eyebrow"><span className="eyebrow-line" /> THE ART OF CELEBRATING</span>
          <h1 id="hero-heading">For the moments<br />you <em>never</em> forget<span className="hero-period">.</span></h1>
          <p>Thoughtful details. Bold backdrops. A celebration that feels unmistakably yours.</p>
          <div className="hero-actions"><a className="btn btn-coral" href="#quote">Build your quote <ArrowRight size={19} /></a><a className="hero-text-link" href="#work">Explore our work <ArrowDown size={17} /></a></div>
        </div>
        <div className="hero-bottom"><span>MADE TO CELEBRATE</span><span>01 / 04</span></div>
        <Curve color="#f9f9f6" />
      </section>

      <section className="intro" id="about">
        <div className="wrap intro-grid"><div className="section-kicker"><span className="asterisk">✳</span> THE LUMA & LACE FEELING</div><div><h2>Ordinary isn’t<br /><em>our thing.</em></h2><p>Imagine celebrations shaped around colour, texture and the details people remember. Luma & Lace is a creative event-styling concept by NexWeb AI Studios, built to show how a distinctive events brand can come to life online.</p><a className="text-link" href="#services">See the possibilities <ArrowRight size={19} /></a></div></div>
      </section>

      <div className="ticker" aria-hidden="true"><div className="ticker-track">MAKE IT UNFORGETTABLE <span>✳</span> THE MOMENT IS YOURS <span>✳</span> MAKE IT UNFORGETTABLE <span>✳</span> THE MOMENT IS YOURS <span>✳</span></div></div>

      <section className="services" id="services">
        <div className="wrap"><div className="section-head"><div><span className="eyebrow">01 / WHAT WE DO</span><h2>Every reason<br />to <em>celebrate.</em></h2></div><p>Personal touches, statement installations and the kind of atmosphere that stays with you.</p></div>
          <div className="service-feature"><div className="service-image"><img src={image('kids-party.jpg')} alt="Illustrative children's birthday party styling" loading="lazy" /><span className="image-sticker">THE LITTLE<br />BIG DAYS <Sparkles size={20} /></span></div><div className="service-info"><span className="service-number">01 /</span><h3>Children’s<br /><em>parties</em></h3><p>Playful colours, custom themes and a setting made for their biggest smiles.</p><a href="#quote" className="round-arrow" aria-label="Explore children's party quote options"><ArrowRight /></a></div></div>
          <div className="service-list"><a href="#quote"><span>02</span><strong>Baby & bridal showers</strong><ArrowRight /></a><a href="#quote"><span>03</span><strong>Birthdays & milestones</strong><ArrowRight /></a><a href="#quote"><span>04</span><strong>Matric celebrations</strong><ArrowRight /></a><a href="#quote"><span>05</span><strong>Backdrops, balloons & hire</strong><ArrowRight /></a></div>
        </div>
        <Curve color="#173b37" />
      </section>

      <section className="showcase" id="work">
        <div className="wrap"><div className="showcase-head"><div><span className="eyebrow">02 / EVENT INSPIRATION</span><h2>Every scene<br />tells <em>a story.</em></h2></div><a className="white-link" href={instagram} target="_blank" rel="noreferrer">Visit Instagram <ArrowRight size={18} /></a></div>
          <div className="filters" role="group" aria-label="Filter gallery">{['All', 'Kids', 'Celebrations', 'Backdrops'].map(item => <button key={item} className={filter === item ? 'active' : ''} onClick={() => setFilter(item)}>{item}</button>)}</div>
          <div className="gallery-grid">{visiblePhotos.map((photo, index) => <button className={`gallery-item gallery-item-${index}`} key={photo.src} onClick={() => setLightbox(photo)} aria-label={`View ${photo.label}`}><img src={photo.src} alt={`Illustrative ${photo.label.toLowerCase()} styling`} loading="lazy" /><span className="gallery-caption"><span><small>{photo.label}</small><strong>{photo.title}</strong></span><span className="gallery-plus"><Plus size={21} /></span></span></button>)}</div>
          <p className="photo-credit">Original AI-generated imagery created for this fictional event concept. These are not photographs of completed events.</p>
        </div>
      </section>

      <section className="statement"><Curve color="#fa6b58" flip /><div className="wrap statement-inner"><span className="statement-spark">✳</span><p>Not just an event.<br /><em>A feeling.</em></p><span className="statement-outline">L</span></div><Curve color="#f9f9f6" /></section>

      <section className="quote" id="quote"><div className="wrap quote-layout"><div className="quote-intro"><span className="eyebrow">03 / AN ENQUIRY WITH PERSONALITY</span><h2>Make it<br /><em>your own.</em></h2><p>Try the event quote builder to see how a beautiful site can turn a visitor’s ideas into a clear, useful enquiry. This is an interactive concept, not an event booking service.</p><div className="quote-photo"><img src={image('sculptural-backdrop.jpg')} alt="Illustrative sculptural event backdrop" loading="lazy" /><div className="quote-photo-note">YOUR VISION<br />OUR DETAILS <span>✳</span></div></div></div>
        <div className="quote-builder"><div className="builder-top"><span>BUILD YOUR QUOTE</span><span>LUMA & LACE <span className="tiny-star">✳</span></span></div><div className="builder-body">
          <div className="field-row"><label className="field"><span>What are we celebrating?</span><select value={eventType} onChange={e => setEventType(e.target.value)}>{eventTypes.map(type => <option key={type}>{type}</option>)}</select><ChevronDown size={17} /></label><label className="field"><span>When’s the big day?</span><input type="date" value={date} onChange={e => setDate(e.target.value)} /></label></div>
          <div className="field-row"><div className="field"><span>How many guests?</span><div className="stepper"><button type="button" onClick={() => setGuests(Math.max(1, guests - 5))} aria-label="Remove five guests"><Minus size={17} /></button><output>{guests}</output><button type="button" onClick={() => setGuests(Math.min(1000, guests + 5))} aria-label="Add five guests"><Plus size={17} /></button></div></div><label className="field"><span>Where is it happening?</span><input placeholder="Town or venue" value={location} onChange={e => setLocation(e.target.value)} maxLength={80} /></label></div>
          <fieldset className="addons"><legend>What would you love to include?</legend><div>{addOns.map(item => <label key={item.id} className={selected.includes(item.id) ? 'addon active' : 'addon'}><input type="checkbox" checked={selected.includes(item.id)} onChange={() => toggle(item.id)} /><span className="checkmark">{selected.includes(item.id) && <Check size={15} />}</span><span>{item.label}</span></label>)}</div></fieldset>
          {selected.includes('letters') && <label className="field letters-field"><span>Spell it out in lights</span><input placeholder="e.g. LOVE, 21 or initials" value={letters} onChange={e => setLetters(e.target.value.toUpperCase())} maxLength={32} /><small>{letterCount} individual illuminated characters · spaces and punctuation excluded</small></label>}
          <label className="field notes-field"><span>Anything else we should know?</span><textarea placeholder="Colours, theme, setup wishes..." value={notes} onChange={e => setNotes(e.target.value)} maxLength={500} rows={3} /></label>
          <div className="brief"><span>YOUR EVENT BRIEF</span><p>{eventType} · {guests} guests{date ? ` · ${new Date(`${date}T12:00:00`).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}` : ''}</p><small>{chosen.length ? chosen.map(item => item.label).join(' / ') : 'Add your favourite details above'}{selected.includes('letters') && letters.trim() ? ` / “${letters.trim()}” (${letterCount} characters)` : ''}</small></div>
          <a className="btn btn-dark submit" href={quoteLink} target="_blank" rel="noreferrer">Send concept brief to NexWeb <Send size={18} /></a><p className="price-note">This is a website concept. No event pricing or booking is provided.</p>
        </div></div></div></section>

      <section className="contact"><Curve color="#173b37" flip /><div className="wrap contact-inner"><span className="eyebrow">LET’S CREATE SOMETHING WONDERFUL</span><h2>Ready when<br /><em>you are.</em></h2><a className="btn btn-coral" href={`${whatsapp}?text=${encodeURIComponent('Hi NexWeb! I saw the Luma & Lace events website concept and would like to talk about a site for my business.')}`} target="_blank" rel="noreferrer">Chat with NexWeb <ArrowRight size={19} /></a><div className="contact-links"><a href={instagram} target="_blank" rel="noreferrer"><Instagram size={17} /> Instagram</a><a href={facebook} target="_blank" rel="noreferrer">Facebook <ArrowRight size={17} /></a></div></div></section>
    </main>

    <footer><div className="wrap footer-inner"><a className="footer-brand" href="#top">LUMA & LACE<span>EVENT STYLING</span></a><span>AN ORIGINAL WEBSITE CONCEPT</span><div><a href={instagram} target="_blank" rel="noreferrer">INSTAGRAM</a><a href={facebook} target="_blank" rel="noreferrer">FACEBOOK</a><a href="#top">BACK TO TOP <ArrowUp size={15} /></a></div></div><div className="wrap footer-bottom"><span>Fictional brand · AI-generated imagery</span><a href="https://nxwbstudios.co.za" target="_blank" rel="noreferrer">Created by <strong>NexWeb AI Studios</strong></a></div></footer>

    <div className="floating-actions">{scroll > 0.22 && <button className="back-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top" title="Back to top"><ArrowUp size={19} /></button>}{chatOpen && <div className="chat-preview"><button className="chat-close" onClick={() => setChatOpen(false)} aria-label="Close chat preview"><X size={16} /></button><small>LUMA & LACE · WEBSITE CONCEPT</small><strong>Let’s talk about your website!</strong><p>Inspired by this site? Let’s shape a website for your business.</p><a href={`${whatsapp}?text=${encodeURIComponent('Hi NexWeb! I saw the Luma & Lace concept and would like to discuss a website for my business.')}`} target="_blank" rel="noreferrer">Start a chat <ArrowRight size={16} /></a></div>}<button className="chat-toggle" onClick={() => setChatOpen(!chatOpen)} aria-label={chatOpen ? 'Close WhatsApp chat preview' : 'Open WhatsApp chat preview'} title="Chat on WhatsApp"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.5 3.5A11.7 11.7 0 0 0 12.1 0 11.9 11.9 0 0 0 1.9 17.9L0 24l6.3-1.8A11.9 11.9 0 0 0 24 12.1a11.7 11.7 0 0 0-3.5-8.6ZM12.1 22a9.7 9.7 0 0 1-5-1.4l-.4-.2-3.7 1 1-3.6-.3-.4A9.9 9.9 0 1 1 12.1 22Zm5.4-7.4c-.3-.2-1.7-.9-2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1a8.1 8.1 0 0 1-2.4-1.5 8.8 8.8 0 0 1-1.7-2.1c-.2-.3 0-.5.1-.7l.5-.6.3-.5c.1-.2 0-.4 0-.6l-.9-2c-.2-.5-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4a3.3 3.3 0 0 0-1 2.4c0 1.4 1 2.8 1.2 3 .1.2 2 3.2 4.9 4.4.7.3 1.3.5 1.8.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.1-.3-.2-.6-.4Z" /></svg></button></div>
    {lightbox && <div className="lightbox" role="dialog" aria-modal="true" aria-label={lightbox.label} onClick={() => setLightbox(null)}><button className="lightbox-close" onClick={() => setLightbox(null)} aria-label="Close photo"><X /></button><img src={lightbox.src} alt={`Illustrative ${lightbox.label.toLowerCase()} styling`} /><div><span>{lightbox.label}</span><span>AI-generated concept imagery</span></div><button className="lightbox-prev" onClick={event => { event.stopPropagation(); setLightbox(photos[(photos.indexOf(lightbox) + photos.length - 1) % photos.length]); }} aria-label="Previous photo"><ArrowLeft /></button><button className="lightbox-next" onClick={event => { event.stopPropagation(); setLightbox(photos[(photos.indexOf(lightbox) + 1) % photos.length]); }} aria-label="Next photo"><ArrowRight /></button></div>}
  </>;
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
