import { useEffect, useRef, useState } from 'react';

const services = [
  { number: '01', title: 'Web & aplikasi', detail: 'Landing page, website bisnis, dan aplikasi web yang nyaman dipakai di desktop maupun ponsel.' },
  { number: '02', title: 'Aplikasi mobile', detail: 'Aplikasi untuk ponsel dengan alur yang jelas, dari kebutuhan awal sampai siap dicoba.' },
  { number: '03', title: 'Game & interaksi', detail: 'Prototipe dan game interaktif yang berangkat dari mekanik inti dan pengalaman pemain.' },
];

function getInitialTheme() {
  const saved = localStorage.getItem('ilhae-theme');
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export default function App() {
  const [theme, setTheme] = useState(getInitialTheme);
  const [isSpinning, setIsSpinning] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const stageRef = useRef(null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('ilhae-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((current) => current === 'light' ? 'dark' : 'light');
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;

    let frame = 0;
    const updateDepth = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const bounds = stage.getBoundingClientRect();
        const center = (bounds.top + bounds.height / 2 - window.innerHeight / 2) / window.innerHeight;
        const offset = Math.max(-1, Math.min(1, center)) * -14;
        stage.style.setProperty('--scroll-offset', offset.toFixed(1) + 'px');
      });
    };

    updateDepth();
    window.addEventListener('scroll', updateDepth, { passive: true });
    window.addEventListener('resize', updateDepth);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', updateDepth);
      window.removeEventListener('resize', updateDepth);
    };
  }, []);

  const handleParallaxPointerMove = (event) => {
    if (event.pointerType === 'touch') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 12;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 12;
    event.currentTarget.style.setProperty('--tilt-x', x.toFixed(1) + 'deg');
    event.currentTarget.style.setProperty('--tilt-y', y.toFixed(1) + 'deg');
  };

  const resetParallaxPointer = (event) => {
    event.currentTarget.style.setProperty('--tilt-x', '0deg');
    event.currentTarget.style.setProperty('--tilt-y', '0deg');
  };


  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="wordmark" href="#home" aria-label="ILHAE, kembali ke atas">ILHAE<span className="wordmark-period">.</span></a>
        <nav className="desktop-nav" aria-label="Navigasi utama">
          <a href="#layanan">Layanan</a>
          <a href="#pendekatan">Pendekatan</a>
          <a href="#kontak">Kontak</a>
        </nav>
        <button className="theme-toggle" type="button" onClick={toggleTheme} aria-label={theme === 'light' ? 'Aktifkan mode gelap' : 'Aktifkan mode terang'} title={theme === 'light' ? 'Mode gelap' : 'Mode terang'}>
          <span className="theme-glyph" aria-hidden="true">{theme === 'light' ? '◐' : '☼'}</span>
          <span className="theme-label">{theme === 'light' ? 'Gelap' : 'Terang'}</span>
        </button>
      </header>

      <section className="hero" id="home" aria-labelledby="hero-title">
        <div className="hero-kicker"><span className="kicker-rule" /> Studio pengembangan digital</div>
        <div className="hero-main">
        <h1 className="hero-title" id="hero-title">Ide baik<br />perlu <span className="hero-italic">dibangun.</span></h1>
        <div className="hero-visual">
          <div ref={stageRef} className={`cube-stage${isSpinning ? ' is-spinning' : ''}`} role="img" aria-label="Animasi 3D ILHAE untuk web, mobile, dan game" onPointerMove={handleParallaxPointerMove} onPointerLeave={resetParallaxPointer}>
            <div className="parallax-scene">
              <div className="parallax-plane plane-game"><span>GAME</span></div>
              <div className="parallax-plane plane-mobile"><span>MOBILE</span></div>
              <div className="parallax-plane plane-web"><span>WEB</span></div>
              <div className="cube">
                <span className="cube-face cube-front">IL</span>
                <span className="cube-face cube-back">HAE</span>
                <span className="cube-face cube-right">01</span>
                <span className="cube-face cube-left">I.</span>
                <span className="cube-face cube-top"></span>
                <span className="cube-face cube-bottom"></span>
              </div>
            </div>
          </div>
          <button className="motion-toggle" type="button" onClick={() => setIsSpinning((value) => !value)} aria-pressed={isSpinning}>
            {isSpinning ? 'Jeda putaran' : 'Putar bentuk'}
          </button>
        </div>
        </div>
        <div className="hero-foot">
          <p className="hero-copy">Untuk individu, bisnis, dan tim yang ingin mengubah ide menjadi website, aplikasi mobile, atau game. ILHAE membantu menyusun arah, lalu membangunnya bertahap.</p>
          <a className="text-link" href="#layanan">Lihat yang kami bangun <span aria-hidden="true">↓</span></a>
        </div>
        <div className="hero-index" aria-hidden="true"><span>01</span><span className="index-line"/><span>04</span></div>
      </section>

      <section className="services section-pad" id="layanan" aria-labelledby="services-title">
        <div className="section-heading">
          <p className="eyebrow">Yang kami kerjakan <span> / 01</span></p>
          <h2 id="services-title">Produk digital<br />yang punya tujuan.</h2>
        </div>
        <div className="service-list">
          {services.map((service) => (
            <article className="service-row" key={service.number}>
              <span className="service-number">{service.number}</span>
              <h3>{service.title}</h3>
              <p>{service.detail}</p>
              <span className="row-mark" aria-hidden="true">+</span>
            </article>
          ))}
        </div>
      </section>

      <section className="approach section-pad" id="pendekatan" aria-labelledby="approach-title">
        <div className="approach-label"><p className="eyebrow">Cara kami berpikir <span> / 02</span></p></div>
        <div className="approach-content">
          <h2 id="approach-title">Mulai dari masalah.<br /><span>Pilih solusi yang<br />tepat untuk pengguna.</span></h2>
          <p>Setiap proyek dimulai dengan tujuan dan kebutuhan pengguna. Setelah ruang lingkupnya jelas, kami memilih platform yang sesuai, membangun bagian inti, lalu meninjau hasilnya bersama.</p>
          <ol className="process-list" aria-label="Tahapan pengerjaan proyek">
            <li><span>01</span><div><h3>Pahami kebutuhan</h3><p>Sepakati tujuan, pengguna, dan masalah yang ingin diselesaikan.</p></div></li>
            <li><span>02</span><div><h3>Tentukan arah</h3><p>Pilih fitur inti, platform, dan batas pekerjaan yang realistis.</p></div></li>
            <li><span>03</span><div><h3>Bangun dan tinjau</h3><p>Kerjakan produk secara bertahap dan periksa hasilnya.</p></div></li>
            <li><span>04</span><div><h3>Siapkan rilis</h3><p>Rapikan hasil akhir dan catat langkah berikutnya.</p></div></li>
          </ol>
        </div>

      </section>

      <section className="founder section-pad" id="founder" aria-labelledby="founder-title">
        <div className="founder-heading">
          <p className="eyebrow">Orang di balik ILHAE <span> / 03</span></p>
          <h2 id="founder-title">Dibangun<br />oleh <span>satu orang.</span></h2>
        </div>
        <article className="founder-profile">
          <div className="founder-photo-wrap">
            <div className="founder-avatar" role="img" aria-label="Avatar ilustrasi Rio Adriana">
              <svg viewBox="0 0 400 470" aria-hidden="true" focusable="false">
                <circle className="avatar-halo" cx="200" cy="210" r="166" />
                <path className="avatar-body" d="M42 470c8-96 63-151 140-163 7-1 12-7 12-14v-19h12v19c0 7 5 13 12 14 77 12 132 67 140 163H42Z" />
                <path className="avatar-head" d="M116 166c0-60 35-99 84-99s84 39 84 99v32c0 58-37 100-84 100s-84-42-84-100v-32Z" />
                <path className="avatar-hair" d="M112 172c-10-73 26-122 90-122 60 0 91 41 86 112-17-7-32-20-45-39-24 25-68 41-131 49Z" />
                <path className="avatar-detail" d="M151 216h12m74 0h12M176 263c15 10 33 10 48 0" />
              </svg>
            </div>
          </div>
          <div className="founder-caption">
            <div>
              <h3>Rio Adriana</h3>
              <p>Founder &amp; Developer</p>
            </div>
            <span className="founder-specialty">Web · Mobile · Game</span>
          </div>
          <div className="founder-links" aria-label="Tautan Rio Adriana">
            <a href="https://github.com/RioAdrna" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://www.linkedin.com/in/rio-adriana-548416215/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="https://rioadrn.vercel.app/" target="_blank" rel="noopener noreferrer">Portofolio</a>
          </div>
        </article>
      </section>

      <section className="contact section-pad" id="kontak" aria-labelledby="contact-title">
        <p className="eyebrow">Ada ide yang ingin diwujudkan? <span> / 04</span></p>
        <h2 id="contact-title">Mulai dari<br /><span>satu percakapan.</span></h2>
        <p className="contact-note">Punya kebutuhan web, aplikasi mobile, atau game? Kirim gambaran singkat proyekmu lewat email.</p>
        <a className="contact-link" href="mailto:rioadrianaaa12@gmail.com?subject=Diskusi%20proyek%20ILHAE">Email Rio <span>rioadrianaaa12@gmail.com</span></a>
      </section>

      <footer className="footer">
        <a className="wordmark footer-mark" href="#home">ILHAE<span className="wordmark-period">.</span></a>
        <span>Produk digital, dibangun dengan jelas.</span>
        <a href="#home" className="back-top">Kembali ke atas ↑</a>
        <span className="copyright">© {new Date().getFullYear()} ILHAE</span>
      </footer>
    </main>
  );
}
