import { useEffect, useRef, useState } from 'react';
import logoLight from './assets/JINOVA logo.png';
import rioSilhouette from './assets/RioSiluet.jpeg';

const services = [
  { number: '01', title: 'Web & aplikasi', detail: 'Landing page, website bisnis, dan aplikasi web yang nyaman dipakai di desktop maupun ponsel.' },
  { number: '02', title: 'Aplikasi mobile', detail: 'Aplikasi ponsel dengan alur yang jelas, dari kebutuhan awal sampai siap dicoba.' },
  { number: '03', title: 'Game & interaksi', detail: 'Pembuatan prototipe dan game interaktif.' },
];

const process = [
  ['01', 'Pahami kebutuhan', 'Sepakati tujuan, pengguna, dan masalah yang ingin diselesaikan.'],
  ['02', 'Tentukan arah', 'Pilih fitur inti, platform, dan batas pekerjaan yang realistis.'],
  ['03', 'Bangun dan tinjau', 'Kerjakan produk secara bertahap dan periksa hasilnya bersama.'],
  ['04', 'Siapkan rilis', 'Rapikan hasil akhir dan catat langkah berikutnya.'],
];

const faqs = [
  ['Layanan apa yang tersedia?', 'JINOVA mengerjakan website, aplikasi mobile, serta prototipe dan game.'],
  ['Bagaimana memulai proyek?', 'Kirim gambaran kebutuhan lewat formulir atau email. Kita bisa membahas detailnya setelah itu.'],
  ['Berapa lama pengerjaannya?', 'Waktu pengerjaan ditentukan oleh kebutuhan dan ruang lingkup proyek.'],
  ['Apakah ada layanan setelah proyek selesai?', 'Dukungan setelah rilis dapat dibicarakan sesuai kebutuhan proyek.'],
];

const email = 'rioadrianaaa12@gmail.com';

function getInitialTheme() {
  try {
    const saved = localStorage.getItem('jinova-theme');
    if (saved === 'light' || saved === 'dark') return saved;
  } catch { /* Storage can be unavailable in private browsing. */ }
  return 'dark';
}

function Arrow({ diagonal = false }) {
  return <span aria-hidden="true" className="arrow-mark">{diagonal ? '↗' : '→'}</span>;
}

export default function App() {
  const [theme, setTheme] = useState(getInitialTheme);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('tentang');
  const [openFaq, setOpenFaq] = useState(null);
  const [contactStatus, setContactStatus] = useState('');
  const [sendingContact, setSendingContact] = useState(false);
  const themeTimerRef = useRef(null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#050505' : '#f4f4f1');
    try { localStorage.setItem('jinova-theme', theme); } catch { /* Theme remains usable for this session. */ }
  }, [theme]);

  useEffect(() => () => {
    window.clearTimeout(themeTimerRef.current);
    document.documentElement.classList.remove('theme-changing');
  }, []);

  useEffect(() => {
    const sectionIds = ['tentang', 'layanan', 'karya', 'proses', 'teknologi', 'studio', 'kontak'];
    let frame = 0;
    const updateActiveSection = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const marker = window.scrollY + 150;
        let current = sectionIds[0];
        sectionIds.forEach((id) => {
          const section = document.getElementById(id);
          if (section && section.offsetTop <= marker) current = id;
        });
        setActiveSection(current);
      });
    };
    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('resize', updateActiveSection, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', updateActiveSection);
      window.removeEventListener('resize', updateActiveSection);
    };
  }, []);

  useEffect(() => {
    const handleInternalAnchor = (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target.closest('a[href^="#"]');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.getElementById(decodeURIComponent(href.slice(1)));
      if (!target) return;
      event.preventDefault();
      if (window.location.hash !== href) window.history.pushState(null, '', href);
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    document.addEventListener('click', handleInternalAnchor);
    return () => document.removeEventListener('click', handleInternalAnchor);
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const revealItems = document.querySelectorAll('[data-reveal]');
    if (reducedMotion || !('IntersectionObserver' in window)) {
      revealItems.forEach((item) => item.classList.add('is-visible'));
      return undefined;
    }
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -35px 0px' });
    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let frame = 0;
    let scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const updateProgress = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const progress = Math.min(1, Math.max(0, window.scrollY / scrollable));
        document.documentElement.style.setProperty('--page-progress', progress);
      });
    };
    const updateDimensions = () => {
      scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      updateProgress();
    };
    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateDimensions, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  const submitProjectInquiry = async (event) => {
    event.preventDefault();
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    if (!serviceId || !templateId || !publicKey) {
      setContactStatus('Pengiriman belum aktif. Atur ID layanan, ID template, dan public key EmailJS terlebih dahulu.');
      return;
    }
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    setSendingContact(true);
    setContactStatus('Mengirim pesan…');
    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          template_params: {
            to_email: email,
            from_name: form.get('name'),
            reply_to: form.get('email'),
            phone: form.get('phone') || 'Tidak dicantumkan',
            company: form.get('company') || 'Tidak dicantumkan',
            service: form.get('service'),
            budget: form.get('budget') || 'Belum ditentukan',
            details: form.get('details'),
          },
        }),
      });
      if (!response.ok) throw new Error('EmailJS request failed');
      formElement.reset();
      setContactStatus('Pesan berhasil dikirim. Terima kasih sudah menghubungi JINOVA.');
    } catch {
      setContactStatus('Pesan belum berhasil dikirim. Coba lagi beberapa saat lagi.');
    } finally {
      setSendingContact(false);
    }
  };

  const toggleTheme = () => {
    const root = document.documentElement;
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    root.dataset.theme = nextTheme;
    root.classList.add('theme-changing');
    window.clearTimeout(themeTimerRef.current);
    themeTimerRef.current = window.setTimeout(() => root.classList.remove('theme-changing'), 220);
    setTheme(nextTheme);
  };
  const closeMenu = () => setMenuOpen(false);
  const navigateFromMenu = (event) => {
    event.preventDefault();
    const href = event.currentTarget.getAttribute('href');
    const target = href ? document.querySelector(href) : null;
    closeMenu();
    if (!target) return;
    if (window.location.hash !== href) window.history.pushState(null, '', href);
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="page-shell">
      <div className="scroll-progress" aria-hidden="true" />
      <a className="skip-link" href="#main-content">Langsung ke konten utama</a>
      <header className="topbar">
        <a className="wordmark" href="#home" aria-label="JINOVA, kembali ke atas" onClick={closeMenu}><img className="wordmark-logo theme-logo" src={logoLight} alt="" width="28" height="28" />JINOVA<span className="wordmark-period">.</span></a>
        <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="primary-navigation" onClick={() => setMenuOpen((open) => !open)}>
          <span>{menuOpen ? 'Tutup' : 'Menu'}</span><span className={`menu-icon${menuOpen ? ' is-open' : ''}`} aria-hidden="true"><i /><i /></span>
        </button>
        <nav className={`desktop-nav${menuOpen ? ' is-open' : ''}`} id="primary-navigation" aria-label="Navigasi utama">
          <a href="#tentang" className={activeSection === 'tentang' ? 'is-active' : ''} aria-current={activeSection === 'tentang' ? 'location' : undefined} onClick={navigateFromMenu}>Tentang</a>
          <a href="#layanan" className={activeSection === 'layanan' ? 'is-active' : ''} aria-current={activeSection === 'layanan' ? 'location' : undefined} onClick={navigateFromMenu}>Layanan</a>
          <a href="#karya" className={activeSection === 'karya' ? 'is-active' : ''} aria-current={activeSection === 'karya' ? 'location' : undefined} onClick={navigateFromMenu}>Karya</a>
          <a href="#proses" className={activeSection === 'proses' ? 'is-active' : ''} aria-current={activeSection === 'proses' ? 'location' : undefined} onClick={navigateFromMenu}>Proses</a>
          <a href="#teknologi" className={activeSection === 'teknologi' ? 'is-active' : ''} aria-current={activeSection === 'teknologi' ? 'location' : undefined} onClick={navigateFromMenu}>Pengembangan</a>
          <a href="#studio" className={activeSection === 'studio' ? 'is-active' : ''} aria-current={activeSection === 'studio' ? 'location' : undefined} onClick={navigateFromMenu}>Studio</a>
          <a href="#kontak" className={activeSection === 'kontak' ? 'is-active' : ''} aria-current={activeSection === 'kontak' ? 'location' : undefined} onClick={navigateFromMenu}>Kontak</a>
        </nav>
        <div className="topbar-actions">
          <button className="theme-toggle" type="button" onClick={toggleTheme} aria-label={theme === 'light' ? 'Aktifkan mode gelap' : 'Aktifkan mode terang'} title={theme === 'light' ? 'Mode gelap' : 'Mode terang'}>
            <span className="theme-glyph" aria-hidden="true">{theme === 'light' ? '◐' : '☼'}</span><span className="theme-label">{theme === 'light' ? 'Gelap' : 'Terang'}</span>
          </button>
          <a className="top-cta" href="#kontak">Mari bicara <Arrow diagonal /></a>
        </div>
      </header>

      <main id="main-content">
      <section className="hero" id="home" aria-labelledby="hero-title">
        <div className="hero-kicker" data-reveal><span className="kicker-rule" /> Website, aplikasi, dan game</div>
        <div className="hero-main">
          <div className="hero-copy-block">
            <p className="hero-index-label">JINOVA® <span>— 01 / 04</span></p>
            <h1 className="hero-title" id="hero-title">Ide baik<br />perlu <span className="hero-italic">dibangun.</span></h1>
          </div>
          <div className="hero-visual" data-reveal>
            <div className="logo-stage" role="img" aria-label="Logo JINOVA">
              <img className="hero-logo theme-logo" src={logoLight} alt="" width="6250" height="6250" fetchPriority="high" />
            </div>
          </div>
        </div>
        <div className="hero-foot" data-reveal>
          <p className="hero-copy">JINOVA membantu membuat website, aplikasi mobile, dan game sesuai kebutuhanmu.</p>
          <div className="hero-actions"><a className="button button-light" href="#layanan">Lihat layanan <Arrow /></a><a className="text-link" href="#kontak">Hubungi JINOVA <Arrow diagonal /></a></div>
        </div>
      </section>

      <section className="intro section-pad" id="tentang" aria-labelledby="intro-title" data-reveal>
        <div className="section-meta"><p className="eyebrow">Tentang JINOVA <span>/ 01</span></p><span className="section-coordinate">01 — 04</span></div>
        <div className="intro-content">
          <h2 id="intro-title">Studio kecil.<br /><span>Perhatian penuh pada</span><br />produk yang dibuat.</h2>
          <div className="intro-detail"><p>Kami percaya teknologi seharusnya mempermudah, bukan menambah rumit.</p><p>Setiap hal yang dibangun perlu punya tujuan dan alasan yang jelas.</p><a className="inline-link" href="#studio">Tentang studio <Arrow /></a></div>
          <div className="focus-strip"><div><span className="focus-number">03</span><span>area pengembangan</span></div><div className="focus-areas"><span>Web</span><span>Mobile</span><span>Game</span></div></div>
        </div>
      </section>

      <section className="services section-pad" id="layanan" aria-labelledby="services-title">
        <div className="section-meta"><p className="eyebrow">Yang kami kerjakan <span>/ 02</span></p><span className="section-coordinate">Layanan</span></div>
        <div className="services-content">
          <div className="section-heading"><h2 id="services-title">Yang bisa<br />kami kerjakan.</h2><p>Pilih layanan yang sesuai dengan kebutuhan proyekmu.</p></div>
          <div className="service-list">
            {services.map((service) => <article className="service-row" key={service.number}>
              <span className="service-number">{service.number}</span><div className="service-title-wrap"><h3>{service.title}</h3><p>{service.detail}</p></div>
              <a className="row-link" href={`mailto:${email}?subject=${encodeURIComponent(`Diskusi layanan ${service.title} — JINOVA`)}`} aria-label={`Tanya tentang ${service.title}`}><Arrow diagonal /></a>
            </article>)}
          </div>
        </div>
      </section>

      <section className="work section-pad" id="karya" aria-labelledby="work-title" data-reveal>
        <div className="section-meta"><p className="eyebrow">Karya &amp; eksplorasi <span>/ Link</span></p><span className="section-coordinate">Portofolio pribadi</span></div>
        <div className="work-content"><div className="work-art" aria-hidden="true"><span className="work-art-index">PORTOFOLIO PILIHAN</span><span className="work-art-title">Ideas<br />in progress<span>.</span></span><span className="work-art-link">PORTOFOLIO <Arrow diagonal /></span><div className="work-orbit orbit-one" /><div className="work-orbit orbit-two" /></div><div className="work-copy"><h2 id="work-title">Karya<br /><span>pilihan.</span></h2><p>Lihat beberapa proyek dan eksperimen di situs portofolio.</p><a className="inline-link" href="https://rioadrn.vercel.app/" target="_blank" rel="noopener noreferrer">Buka portofolio <Arrow diagonal /></a></div></div>
      </section>

      <section className="approach section-pad" id="proses" aria-labelledby="approach-title">
        <div className="section-meta"><p className="eyebrow">Cara kami bekerja <span>/ 03</span></p><span className="section-coordinate">Proses</span></div>
        <div className="approach-content" data-reveal>
          <div className="approach-heading"><h2 id="approach-title">Bahas kebutuhan.<br /><span>Susun rencana kerja.</span></h2><p>Kita sepakati fitur dan ruang lingkup proyek sebelum pengerjaan dimulai.</p></div>
          <ol className="process-list" aria-label="Tahapan pengerjaan proyek">
            {process.map(([number, title, detail]) => <li key={number}><span className="process-number">{number}</span><div><h3>{title}</h3><p>{detail}</p></div><span className="process-marker" aria-hidden="true" /></li>)}
          </ol>
        </div>
      </section>

      <section className="technology section-pad" id="teknologi" aria-labelledby="technology-title" data-reveal>
        <div className="section-meta"><p className="eyebrow">Bidang pengembangan <span>/ 04</span></p><span className="section-coordinate">Pengembangan</span></div>
        <div className="technology-content"><h2 id="technology-title">Ragam proyek.<br /><span>Satu langkah awal.</span></h2><p>Beberapa bidang yang bisa dikembangkan sesuai kebutuhan proyek.</p><ul className="technology-list" aria-label="Bidang pengembangan proyek"><li><span>01</span><strong>AI</strong><small>Otomasi &amp; asisten pintar</small></li><li><span>02</span><strong>Mobile</strong><small>Aplikasi Android &amp; iOS</small></li><li><span>03</span><strong>IoT</strong><small>Perangkat &amp; sistem terhubung</small></li><li><span>04</span><strong>Web</strong><small>Website &amp; aplikasi web</small></li><li><span>05</span><strong>Game</strong><small>Game &amp; prototipe interaktif</small></li></ul></div>
      </section>

      <section className="studio section-pad" id="studio" aria-labelledby="studio-title">
        <div className="section-meta"><p className="eyebrow">Orang di balik JINOVA <span>/ 04</span></p><span className="section-coordinate">Studio</span></div>
        <div className="studio-content" data-reveal>
          <div className="studio-heading"><p className="studio-note">Studio independen</p><h2 id="studio-title">The<br /><span>Founder &amp; developer.</span></h2><p>Menangani proyek dari pembahasan awal sampai hasilnya siap digunakan.</p></div>
          <article className="founder-profile">
            <div className="founder-photo-wrap"><img className="founder-photo" src={rioSilhouette} alt="Siluet Rio Adriana" width="895" height="1130" loading="lazy" /><span className="portrait-index">JINOVA / FOUNDER</span></div>
            <div className="founder-caption"><div><h3>Rio Adriana</h3><p>Founder &amp; Developer</p></div><span className="founder-specialty">Web · Mobile · Game</span></div>
            <div className="founder-links" aria-label="Tautan Rio Adriana"><a href="https://github.com/RioAdrna" target="_blank" rel="noopener noreferrer">GitHub <Arrow diagonal /></a><a href="https://www.linkedin.com/in/rio-adriana-548416215/" target="_blank" rel="noopener noreferrer">LinkedIn <Arrow diagonal /></a><a href="https://rioadrn.vercel.app/" target="_blank" rel="noopener noreferrer">Portofolio <Arrow diagonal /></a></div>
          </article>
        </div>
      </section>

      <section className="faq section-pad" aria-labelledby="faq-title" data-reveal>
        <div className="section-meta"><p className="eyebrow">Pertanyaan umum <span>/ Info</span></p><span className="section-coordinate">FAQ</span></div>
        <div className="faq-content"><h2 id="faq-title">Sebelum<br />mulai bicara.</h2><div className="faq-list">{faqs.map(([question, answer], index) => <article className={`faq-item${openFaq === index ? ' is-open' : ''}`} key={question}>
          <h3><button type="button" aria-expanded={openFaq === index} aria-controls={`faq-answer-${index}`} onClick={() => setOpenFaq((current) => current === index ? null : index)}><span>{question}</span><i aria-hidden="true" /></button></h3>
          <div className="faq-answer" id={`faq-answer-${index}`} aria-hidden={openFaq !== index}><div className="faq-answer-inner"><p>{answer}</p></div></div>
        </article>)}</div></div>
      </section>

      <section className="contact section-pad" id="kontak" aria-labelledby="contact-title">
        <div className="section-meta"><p className="eyebrow">Mari mulai percakapan <span>/ Contact</span></p><span className="section-coordinate">Terbuka untuk proyek</span></div>
        <div className="contact-content">
          <div className="contact-copy"><h2 id="contact-title">Hubungi<br />JINOVA.</h2><p>Kirim detail proyek langsung ke email JINOVA lewat formulir ini.</p><a className="contact-email" href={`mailto:${email}`}>{email} <Arrow diagonal /></a><span className="contact-location">Indonesia</span></div>
          <form className="contact-form" onSubmit={submitProjectInquiry}>
            <div className="form-grid"><label>Nama<span>*</span><input autoComplete="name" name="name" required placeholder="Nama Anda" /></label><label>Email<span>*</span><input autoComplete="email" name="email" type="email" required placeholder="nama@email.com" /></label>
              <label>Telepon<input autoComplete="tel" name="phone" type="tel" placeholder="Opsional" /></label><label>Perusahaan<input autoComplete="organization" name="company" placeholder="Opsional" /></label>
              <label>Layanan yang dibutuhkan<span>*</span><select name="service" required defaultValue=""><option value="" disabled>Pilih layanan</option><option>Web & aplikasi</option><option>Aplikasi mobile</option><option>Game & interaksi</option><option>Belum yakin — ingin berdiskusi</option></select></label>
              <label>Kisaran budget<input name="budget" inputMode="text" placeholder="Opsional" /></label>
              <label className="form-wide">Ceritakan gambaran proyek<span>*</span><textarea name="details" required rows="4" placeholder="Tujuan, pengguna, dan kebutuhan awal..." /></label>
            </div>
            <div className="form-submit"><p aria-live="polite">{contactStatus || '* Wajib diisi. Pesan dikirim langsung ke email JINOVA.'}</p><button className="button button-light" type="submit" disabled={sendingContact}>{sendingContact ? 'Mengirim…' : 'Kirim pesan'} <Arrow diagonal /></button></div>
          </form>
        </div>
      </section>
      </main>

      <footer className="footer">
        <a className="wordmark footer-mark" href="#home">JINOVA<span className="wordmark-period">.</span></a>
        <span className="footer-tagline">Produk digital, dibangun dengan jelas.</span>
        <nav className="footer-links" aria-label="Navigasi footer"><a href="#layanan">Layanan</a><a href="#karya">Karya</a><a href="#proses">Proses</a><a href="#kontak">Kontak</a></nav>
        <a href="#home" className="back-top">Kembali ke atas ↑</a>
        <span className="copyright">© {new Date().getFullYear()} JINOVA</span>
      </footer>
    </div>
  );
}
