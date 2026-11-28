import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { animate, inView, hover } from 'motion';

gsap.registerPlugin(ScrollTrigger);

const email = 'rioadrianaaa12@gmail.com';
const root = document.documentElement;
const themeButton = document.querySelector('.theme-toggle');
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#primary-navigation');
const contactForm = document.querySelector('.contact-form');
const contactStatus = document.querySelector('.form-submit p');
const submitButton = contactForm.querySelector('[type="submit"]');
document.querySelector('.copyright').textContent = `© ${new Date().getFullYear()} JINOVA`;

try {
  const savedTheme = localStorage.getItem('jinova-theme');
  if (savedTheme === 'light' || savedTheme === 'dark') root.dataset.theme = savedTheme;
} catch {
  /* Theme remains usable when storage is unavailable. */
}

function updateThemeControl() {
  const light = root.dataset.theme === 'light';
  themeButton.setAttribute('aria-label', `Aktifkan mode ${light ? 'gelap' : 'terang'}`);
  themeButton.title = `Mode ${light ? 'gelap' : 'terang'}`;
  themeButton.querySelector('.theme-glyph').textContent = light ? '◐' : '☼';
  themeButton.querySelector('.theme-label').textContent = light ? 'Gelap' : 'Terang';
  document.querySelector('meta[name="theme-color"]').content = light ? '#f4f4f1' : '#050505';
}

updateThemeControl();
themeButton.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
  root.classList.add('theme-changing');
  clearTimeout(themeButton.themeTimer);
  themeButton.themeTimer = setTimeout(
    () => root.classList.remove('theme-changing'),
    220,
  );
  updateThemeControl();
  try {
    localStorage.setItem('jinova-theme', root.dataset.theme);
  } catch {
    /* Theme remains usable for this session. */
  }
});

function setMenu(open) {
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.querySelector('span:first-child').textContent = open ? 'Tutup' : 'Menu';
  menuButton.querySelector('.menu-icon').classList.toggle('is-open', open);
  nav.classList.toggle('is-open', open);
}

const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
let lenis = null;

if (!prefersReducedMotion) {
  lenis = new Lenis({
    duration: 1.15,
    smoothWheel: true,
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
}

menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
document.addEventListener('click', (event) => {
  const anchor = event.target.closest('a[href^="#"]');
  if (!anchor || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const href = anchor.getAttribute('href');
  if (!href || href === '#') return;
  const target = document.getElementById(decodeURIComponent(href.slice(1)));
  if (!target) return;
  event.preventDefault();
  if (location.hash !== href) history.pushState(null, '', href);
  if (lenis) {
    lenis.scrollTo(target);
  } else {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  if (nav.classList.contains('is-open')) setMenu(false);
});

const sectionIds = ['tentang', 'layanan', 'karya', 'proses', 'teknologi', 'studio', 'kontak'];
let frame = 0;
function updateScrollState() {
  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(() => {
    const marker = scrollY + 150;
    let current = sectionIds[0];
    sectionIds.forEach((id) => {
      const section = document.getElementById(id);
      if (section && section.offsetTop <= marker) current = id;
    });
    nav.querySelectorAll('a[href^="#"]').forEach((link) => {
      const active = link.hash === `#${current}`;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    const scrollable = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    root.style.setProperty('--page-progress', Math.min(1, Math.max(0, scrollY / scrollable)));
  });
}

addEventListener('scroll', updateScrollState, { passive: true });
addEventListener('resize', updateScrollState, { passive: true });
updateScrollState();

const revealItems = document.querySelectorAll('[data-reveal]');
if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver(
    (entries, currentObserver) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      }
    }),
    { threshold: 0.14, rootMargin: '0px 0px -35px 0px' },
  );
  revealItems.forEach((item) => observer.observe(item));
}

function splitTextIntoWords(element) {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  let node;
  while ((node = walker.nextNode())) {
    if (node.textContent.trim()) textNodes.push(node);
  }

  textNodes.forEach((textNode) => {
    const fragment = document.createDocumentFragment();
    const parts = textNode.textContent.split(/(\s+)/);
    parts.forEach((part) => {
      if (!part) return;
      if (/^\s+$/.test(part)) {
        fragment.appendChild(document.createTextNode(part));
      } else {
        const wrap = document.createElement('span');
        wrap.className = 'word-wrap';
        const inner = document.createElement('span');
        inner.className = 'word-inner';
        inner.textContent = part;
        wrap.appendChild(inner);
        fragment.appendChild(wrap);
      }
    });
    textNode.parentNode.replaceChild(fragment, textNode);
  });

  return element.querySelectorAll('.word-inner');
}

if (!prefersReducedMotion) {
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    const heroWords = splitTextIntoWords(heroTitle);
    gsap.from(heroWords, {
      yPercent: 100,
      opacity: 0,
      duration: 0.75,
      stagger: 0.06,
      ease: 'power3.out',
      clearProps: 'transform,opacity',
    });
  }

  document.querySelectorAll('main h2').forEach((heading) => {
    const words = splitTextIntoWords(heading);
    if (!words.length) return;
    gsap.from(words, {
      yPercent: 100,
      opacity: 0,
      duration: 0.7,
      stagger: 0.05,
      ease: 'power3.out',
      clearProps: 'transform,opacity',
      scrollTrigger: {
        trigger: heading,
        start: 'top 85%',
        once: true,
      },
    });
  });

  const cards = document.querySelectorAll('.service-row, .work-card, .process-step, .tech-card, .studio-card, .faq-item');
  cards.forEach((card, index) => {
    card.style.opacity = '0';
    inView(
      card,
      () => {
        animate(
          card,
          { opacity: [0, 1], y: [24, 0] },
          { duration: 0.55, delay: (index % 4) * 0.06, easing: [0.22, 1, 0.36, 1] },
        );
      },
      { amount: 0.15 },
    );

    hover(card, (element) => {
      animate(element, { y: -4, scale: 1.01 }, { duration: 0.22, easing: 'ease-out' });
      return () => animate(element, { y: 0, scale: 1 }, { duration: 0.22, easing: 'ease-out' });
    });
  });
}

document.querySelectorAll('.faq-item button').forEach((button) => {
  button.addEventListener('click', () => {
    const item = button.closest('.faq-item');
    const open = button.getAttribute('aria-expanded') !== 'true';
    document.querySelectorAll('.faq-item').forEach((faq) => {
      faq.classList.toggle('is-open', faq === item && open);
      faq.querySelector('button').setAttribute('aria-expanded', String(faq === item && open));
      faq.querySelector('.faq-answer').setAttribute('aria-hidden', String(faq !== item || !open));
    });
  });
});

contactForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const { VITE_EMAILJS_SERVICE_ID: serviceId, VITE_EMAILJS_TEMPLATE_ID: templateId, VITE_EMAILJS_PUBLIC_KEY: publicKey } = import.meta.env;
  if (!serviceId || !templateId || !publicKey) {
    contactStatus.textContent = 'Pengiriman belum aktif. Atur ID layanan, ID template, dan public key EmailJS terlebih dahulu.';
    return;
  }
  const form = new FormData(contactForm);
  submitButton.disabled = true;
  submitButton.firstChild.textContent = 'Mengirim… ';
  contactStatus.textContent = 'Mengirim pesan…';
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
    contactForm.reset();
    contactStatus.textContent = 'Pesan berhasil dikirim. Terima kasih sudah menghubungi JINOVA.';
  } catch {
    contactStatus.textContent = 'Pesan belum berhasil dikirim. Coba lagi beberapa saat lagi.';
  } finally {
    submitButton.disabled = false;
    submitButton.firstChild.textContent = 'Kirim pesan ';
  }
});
