import '@fontsource-variable/syne';
import '@fontsource-variable/manrope';
import '@fontsource-variable/jetbrains-mono';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import { Universe } from './gl/scene';
import type { ShapeName } from './gl/shapes';
import { projects } from './data';
import { split } from './ui/split';
import { initCursor, initMagnetic, initProximity, initScramble, initTilt } from './ui/interactions';
import { createStackPhysics } from './ui/physics';
import { sound } from './ui/sound';

gsap.registerPlugin(ScrollTrigger);

const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s)!;
const $$ = <T extends HTMLElement = HTMLElement>(s: string, r: ParentNode = document) =>
  Array.from(r.querySelectorAll<T>(s));
const pad = (n: number) => String(n).padStart(2, '0');
const clamp = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b);
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

/* ================================================================== */
/* Projects                                                            */
/* ================================================================== */
function renderProjects() {
  const track = $('.js-work-track');
  track.innerHTML =
    projects
      .map(
        (p, i) => `
    <a class="project" href="${p.url}" target="_blank" rel="noopener" data-cursor="${p.live ? 'Visitar' : 'Código'}">
      <div class="project__media" style="--h1:${p.hues[0]};--h2:${p.hues[1]}">
        <div class="project__grid"></div>
        <span class="project__glyph">${p.glyph}</span>
        <span class="project__badge ${p.live ? 'is-live' : ''}">${p.badge}</span>
        <span class="project__glare"></span>
      </div>
      <div class="project__info">
        <div class="project__meta mono"><span>${pad(i + 1)} — ${p.kind}</span><span>${p.year}</span></div>
        <h3 class="project__title">${p.title}</h3>
        <span class="project__arrow" aria-hidden="true">↗</span>
        <p class="project__desc">${p.description}</p>
        <div class="project__tags">${p.tags.map((t) => `<span>${t}</span>`).join('')}</div>
      </div>
    </a>`,
      )
      .join('') +
    `
    <a class="project project--more" href="https://github.com/Lettify?tab=repositories" target="_blank" rel="noopener" data-cursor="GitHub">
      <div class="project__media">
        <div class="project__more">Ver tudo<br/>no GitHub ↗<small>26 repositórios públicos</small></div>
      </div>
    </a>`;
  $('.js-work-total').textContent = pad(projects.length);
}
renderProjects();

/* ================================================================== */
/* WebGL universe                                                      */
/* ================================================================== */
let universe: Universe | null = null;
try {
  universe = new Universe($<HTMLCanvasElement>('#gl'));
} catch (err) {
  console.warn('WebGL indisponível — seguindo sem 3D.', err);
  $('#gl').remove();
}

/* ================================================================== */
/* Smooth scroll                                                       */
/* ================================================================== */
const lenis = new Lenis({ lerp: reduced ? 1 : 0.085, touchMultiplier: 1.3 });
lenis.stop();
lenis.on('scroll', ScrollTrigger.update);

const nav = $('.nav');
lenis.on('scroll', (l: Lenis) => {
  if (document.documentElement.classList.contains('menu-open')) return;
  if (l.scroll > 300 && l.direction === 1) nav.classList.add('is-hidden');
  else if (l.direction === -1 || l.scroll < 300) nav.classList.remove('is-hidden');
});

let physics: ReturnType<typeof createStackPhysics> | null = null;
let physicsActive = false;

/* Marquees driven by scroll velocity */
const marquees = $$('[data-marquee]').map((track) => {
  const row = $('.marquee__row', track);
  for (let i = 0; i < 3; i++) track.appendChild(row.cloneNode(true));
  return { track, row, dir: Number(track.dataset.marquee), offset: 0, w: row.offsetWidth };
});
let scrollDir = 1;
window.addEventListener('resize', () => marquees.forEach((m) => (m.w = m.row.offsetWidth)));

const projectEls = () => $$('.project');
let skew = 0;

gsap.ticker.add((time, delta) => {
  lenis.raf(time * 1000);
  const v = lenis.velocity || 0;
  if (Math.abs(v) > 0.1) scrollDir = Math.sign(v);

  universe?.setVelocity(v);
  universe?.tick();

  if (physicsActive) physics?.update(delta);

  // marquee
  const dt = delta / 1000;
  const sk = clamp(-v * 0.35, -10, 10);
  for (const m of marquees) {
    m.offset += (55 + Math.abs(v) * 22) * dt * m.dir * scrollDir;
    const x = -(((m.offset % m.w) + m.w) % m.w);
    m.track.style.transform = `translate3d(${x}px,0,0) skewX(${sk}deg)`;
  }

  // card skew in the horizontal gallery
  skew += (clamp(v * -0.12, -6, 6) - skew) * 0.12;
  if (Math.abs(skew) > 0.01) projectEls().forEach((el) => (el.style.transform = `skewX(${skew}deg)`));
});
gsap.ticker.lagSmoothing(0);

/* Anchor links */
document.addEventListener('click', (e) => {
  const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
  if (!a) return;
  const id = a.getAttribute('href')!;
  e.preventDefault();
  if (document.documentElement.classList.contains('menu-open')) toggleMenu(false);
  const target = id === '#top' ? 0 : document.querySelector<HTMLElement>(id);
  if (target === null) return;
  lenis.scrollTo(target, { duration: 1.8, easing: (t) => 1 - Math.pow(1 - t, 4) });
});

/* ================================================================== */
/* Menu                                                                */
/* ================================================================== */
const menuBtn = $('.nav__menu');
let menuOpen = false;
function toggleMenu(open = !menuOpen) {
  menuOpen = open;
  const html = document.documentElement;
  const at = `${window.innerWidth - 56}px 56px`;
  menuBtn.setAttribute('aria-expanded', String(open));
  $('.menu').setAttribute('aria-hidden', String(!open));
  gsap.killTweensOf(['.menu__bg', '.menu__links a > *', '.menu__foot']);
  if (open) {
    html.classList.add('menu-open');
    nav.classList.remove('is-hidden');
    lenis.stop();
    gsap.fromTo('.menu__bg', { clipPath: `circle(0% at ${at})` }, { clipPath: `circle(150% at ${at})`, duration: 1, ease: 'expo.inOut' });
    gsap.fromTo('.menu__links a > *', { yPercent: 110 }, { yPercent: 0, duration: 1, stagger: 0.05, delay: 0.35, ease: 'expo.out' });
    gsap.fromTo('.menu__foot', { opacity: 0, y: 20 }, { opacity: 1, y: 0, delay: 0.7, duration: 0.6 });
  } else {
    lenis.start();
    gsap.to('.menu__links a > *', { yPercent: -110, duration: 0.5, stagger: 0.03, ease: 'power3.in' });
    gsap.to('.menu__foot', { opacity: 0, duration: 0.3 });
    gsap.to('.menu__bg', {
      clipPath: `circle(0% at ${at})`,
      duration: 0.9,
      delay: 0.25,
      ease: 'expo.inOut',
      onComplete: () => html.classList.remove('menu-open'),
    });
  }
}
menuBtn.addEventListener('click', () => toggleMenu());
window.addEventListener('keydown', (e) => e.key === 'Escape' && menuOpen && toggleMenu(false));

/* ================================================================== */
/* Text splitting                                                      */
/* ================================================================== */
const heroChars = $$('.hero__line').flatMap((el) => split(el, { chars: true, mask: false }).chars);
const contactChars = $$('.contact__line > span').flatMap((el) => split(el, { chars: true, mask: false }).chars);
void contactChars;
const leadWords = $$('[data-split-words]').map((el) => ({ el, words: split(el).words }));
const titleChars = $$('[data-split-chars]').map((el) => ({ el, chars: split(el, { chars: true }).chars }));
const scrubWords = $$('[data-scrub-words]').map((el) => ({ el, words: split(el, { mask: false }).words }));
const footerBig = $('.footer__big');

/* ================================================================== */
/* Scroll animations                                                   */
/* ================================================================== */
function initScrollAnimations() {
  // --- horizontal work gallery (created first so later triggers account for pin spacing)
  const track = $('.js-work-track');
  const distance = () => Math.max(track.scrollWidth - window.innerWidth, 0);
  const current = $('.js-work-current');
  const bar = $('.js-work-bar');
  const total = projects.length;
  const horizontal = gsap.to(track, {
    x: () => -distance(),
    ease: 'none',
    scrollTrigger: {
      trigger: '.work',
      start: 'top top',
      end: () => `+=${distance()}`,
      pin: true,
      scrub: 0.8,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        bar.style.transform = `scaleX(${self.progress})`;
        current.textContent = pad(Math.min(total, Math.floor(self.progress * total) + 1));
      },
    },
  });
  $$('.project__glyph').forEach((glyph) => {
    gsap.fromTo(
      glyph,
      { xPercent: 25 },
      {
        xPercent: -25,
        ease: 'none',
        scrollTrigger: {
          trigger: glyph.closest('.project')!,
          containerAnimation: horizontal,
          start: 'left right',
          end: 'right left',
          scrub: true,
        },
      },
    );
  });

  // --- hero scroll-out
  const heroST = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true };
  ScrollTrigger.create({ ...heroST, onUpdate: (s) => universe?.setHeroProgress(s.progress) });
  gsap.to('.hero__line:first-child', { xPercent: -14, ease: 'none', scrollTrigger: heroST });
  gsap.to('.hero__line:last-child', { xPercent: 14, ease: 'none', scrollTrigger: heroST });
  gsap.to('.hero__title', { yPercent: -18, opacity: 0.1, ease: 'none', scrollTrigger: heroST });
  gsap.to('.hero__bottom, .hero__meta', { opacity: 0, y: -60, ease: 'none', scrollTrigger: { ...heroST, end: '40% top' } });

  // --- WebGL shape per section
  $$('[data-gl]').forEach((section) => {
    const shape = section.dataset.gl as ShapeName;
    ScrollTrigger.create({
      trigger: section,
      start: 'top 55%',
      end: 'bottom 55%',
      onEnter: () => {
        universe?.morphTo(shape);
        sound.morph();
      },
      onEnterBack: () => {
        universe?.morphTo(shape);
        sound.morph();
      },
    });
  });

  // --- active nav link
  $$('.nav__links a').forEach((link) => {
    const section = document.querySelector<HTMLElement>(link.getAttribute('href')!);
    if (!section) return;
    ScrollTrigger.create({
      trigger: section,
      start: 'top center',
      end: 'bottom center',
      onToggle: (self) => link.classList.toggle('is-active', self.isActive),
    });
  });

  // --- progress bar
  gsap.to('.progress i', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });

  // --- lead paragraphs (masked words)
  leadWords.forEach(({ el, words }) => {
    gsap.from(words, {
      yPercent: 110,
      rotate: 3,
      duration: 1.2,
      ease: 'expo.out',
      stagger: 0.018,
      scrollTrigger: { trigger: el, start: 'top 80%' },
    });
  });

  // --- section titles (masked chars)
  titleChars.forEach(({ el, chars }) => {
    gsap.from(chars, {
      yPercent: 120,
      rotate: 6,
      duration: 1.1,
      ease: 'expo.out',
      stagger: 0.025,
      scrollTrigger: { trigger: el, start: 'top 85%' },
    });
  });

  // --- manifesto: words light up with scroll
  scrubWords.forEach(({ el, words }) => {
    gsap.to(words, {
      opacity: 1,
      stagger: 0.1,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 75%', end: 'bottom 45%', scrub: true },
    });
  });
  gsap.from('.manifesto__code span', {
    x: -40,
    opacity: 0,
    stagger: 0.15,
    duration: 1,
    ease: 'expo.out',
    scrollTrigger: { trigger: '.manifesto__code', start: 'top 90%' },
  });

  // --- fades
  $$('[data-fade]').forEach((el) => {
    gsap.from(el, {
      y: 50,
      opacity: 0,
      duration: 1.2,
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 90%' },
    });
  });

  // --- counters
  $$('[data-count]').forEach((el) => {
    const end = Number(el.dataset.count);
    const obj = { v: end > 1000 ? end - 40 : 0 };
    el.textContent = String(Math.round(obj.v));
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () =>
        gsap.to(obj, {
          v: end,
          duration: 2,
          ease: 'expo.out',
          onUpdate: () => (el.textContent = String(Math.round(obj.v))),
        }),
    });
  });

  // --- services
  $$('.service').forEach((el) => {
    gsap.from(el, {
      y: 70,
      opacity: 0,
      duration: 1.2,
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 92%' },
    });
  });

  // --- 3D cards
  gsap.from('.card3d', {
    y: 120,
    rotationX: -35,
    opacity: 0,
    transformOrigin: '50% 100%',
    duration: 1.4,
    ease: 'expo.out',
    stagger: 0.12,
    scrollTrigger: { trigger: '.beyond__grid', start: 'top 85%' },
  });

  // --- contact
  gsap.from('.contact__line > span', {
    yPercent: 105,
    duration: 1.4,
    ease: 'expo.out',
    stagger: 0.12,
    scrollTrigger: { trigger: '.contact__title', start: 'top 80%' },
  });
  gsap.from('.contact__orb', {
    scale: 0,
    rotate: -90,
    duration: 1.6,
    ease: 'elastic.out(1, 0.5)',
    scrollTrigger: { trigger: '.contact__row', start: 'top 85%' },
  });
  gsap.from('.contact__link', {
    x: 60,
    opacity: 0,
    stagger: 0.1,
    duration: 1.2,
    ease: 'expo.out',
    scrollTrigger: { trigger: '.contact__row', start: 'top 85%' },
  });

  // --- footer giant word
  gsap.from(footerBig, {
    yPercent: 60,
    scale: 0.9,
    opacity: 0,
    ease: 'none',
    scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'bottom bottom', scrub: true },
  });

  // --- stack physics
  ScrollTrigger.create({
    trigger: '.stack__box',
    start: 'top 75%',
    end: 'bottom top',
    onEnter: () => physics?.start(),
    onToggle: (self) => (physicsActive = self.isActive),
  });
  ScrollTrigger.create({
    trigger: '.stack__box',
    start: 'top bottom',
    end: 'bottom top',
    onToggle: (self) => (physicsActive = self.isActive),
  });
}

/* ================================================================== */
/* Hero intro                                                          */
/* ================================================================== */
function heroIntro() {
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.from(heroChars, { yPercent: 110, rotate: 10, opacity: 0, duration: 1.6, stagger: 0.045 }, 0)
    .from('.hero .reveal-line > span', { yPercent: 110, duration: 1.2, stagger: 0.08 }, 0.5)
    .from('.hero__meta', { opacity: 0, y: 20, duration: 1.2, stagger: 0.1 }, 0.7)
    .from('.hero__scroll', { scale: 0, rotate: -180, duration: 1.6, ease: 'elastic.out(1, 0.6)' }, 0.8)
    .from(nav, { yPercent: -100, opacity: 0, duration: 1.2 }, 0.6);
  return tl;
}

/* ================================================================== */
/* Preloader + boot                                                    */
/* ================================================================== */
async function boot() {
  const fonts = document.fonts
    ? Promise.all([
        document.fonts.load("800 100px 'Syne Variable'"),
        document.fonts.load("800 80px 'Manrope Variable'"),
        document.fonts.load("400 16px 'JetBrains Mono Variable'"),
      ]).then(() => document.fonts.ready)
    : Promise.resolve();
  const fontsWithTimeout = Promise.race([fonts, new Promise((r) => setTimeout(r, 3000))]);

  const odoH = $('.js-odo-h');
  const odoT = $('.js-odo-t');
  const odoO = $('.js-odo-o');
  const ringProg = $<SVGCircleElement>('.preloader__ring-prog');
  const hexEl = $('.js-pl-hex');
  const pctEl = $('.js-pl-pct');
  const bar = $('.preloader__bar i');
  const msg = $('.preloader__msg');
  const logs = $$('.preloader__log');
  const circumference = 2 * Math.PI * 128; // 804.25

  const messages = [
    'Inicializando pipeline WebGL',
    'Compilando shaders Simplex 3D',
    'Sanitizando SQL & tipagem',
    'Calibrando física Matter.js',
    'Calculando xeque-mate',
    'Universo pronto',
  ];

  const counter = { v: 0 };
  const count = gsap.to(counter, {
    v: 100,
    duration: reduced ? 0.45 : 2.7,
    ease: 'expo.inOut',
    onUpdate: () => {
      const v = counter.v;
      const p = v / 100;

      // Smooth mechanical odometer reels (11 items on tens/ones so 9 -> 0 wraps smoothly)
      const onesRaw = v % 10;
      const onesCarry = Math.max(0, onesRaw - 9);
      const tensBase = Math.floor(v / 10) % 10;
      const tensSmooth = v >= 100 ? 10 : tensBase + onesCarry;
      const hundredsSmooth = v >= 99 ? v - 99 : 0;

      odoH.style.transform = `translate3d(0, ${-(hundredsSmooth * 50).toFixed(3)}%, 0)`;
      odoT.style.transform = `translate3d(0, ${-(tensSmooth * (100 / 11)).toFixed(3)}%, 0)`;
      odoO.style.transform = `translate3d(0, ${-((v >= 100 ? 10 : onesRaw) * (100 / 11)).toFixed(3)}%, 0)`;

      // Orbital SVG progress arc & linear bar
      ringProg.style.strokeDashoffset = String(circumference * (1 - p));
      bar.style.transform = `scaleX(${p})`;

      // Hex & numeric telemetry
      const rounded = Math.round(v);
      const hex = Math.round(p * 255)
        .toString(16)
        .toUpperCase()
        .padStart(2, '0');
      hexEl.textContent = `0x${hex}`;
      pctEl.textContent = `${String(rounded).padStart(3, '0')} / 100`;
      msg.textContent = messages[Math.min(messages.length - 1, Math.floor(p * messages.length))];

      // Step logs
      const activeStep = Math.min(logs.length - 1, Math.floor(p * logs.length));
      logs.forEach((log, idx) => {
        log.classList.toggle('is-done', idx < activeStep || rounded === 100);
        log.classList.toggle('is-active', idx === activeStep && rounded < 100);
      });
    },
  });

  await fontsWithTimeout;
  universe?.init();
  physics = createStackPhysics($('.stack__box'));
  await count.then();

  initScrollAnimations();
  initCursor();
  initMagnetic();
  initScramble();
  initTilt('[data-tilt]', '.card3d__inner', 12);
  initTilt('.id-card', '.id-card__inner', 10);
  initTilt('.project', '.project__media', 9);
  initProximity();

  const preloader = $('.preloader');
  preloader.classList.add('is-exiting');

  const out = gsap.timeline({ onComplete: () => preloader.remove() });
  out
    .to('.preloader__dial', { scale: 1.12, opacity: 0, duration: 0.65, ease: 'power3.in' }, 0)
    .to('.preloader__top, .preloader__bottom, .preloader__glow', { opacity: 0, y: -16, duration: 0.5, ease: 'power2.in' }, 0.05)
    .to(
      '.preloader__shutters span',
      {
        scaleY: 0,
        duration: 1.05,
        ease: 'expo.inOut',
        stagger: { each: 0.055, from: 'center' },
      },
      0.25,
    )
    .add(() => {
      document.body.classList.remove('is-loading');
      lenis.start();
      universe?.startIntro();
      heroIntro();
      ScrollTrigger.refresh();
    }, 0.55);
}
boot();

/* ================================================================== */
/* Little delights                                                     */
/* ================================================================== */
const toastEl = $('.toast');
let toastTimer = 0;
function toast(text: string) {
  toastEl.textContent = text;
  toastEl.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toastEl.classList.remove('is-visible'), 2600);
}

// copy e-mail
$$('[data-copy]').forEach((el) =>
  el.addEventListener('click', async (e) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(el.dataset.copy!);
      toast('E-mail copiado ✦ contato@michael.dev.br');
    } catch {
      window.location.href = `mailto:${el.dataset.copy}`;
    }
  }),
);

// click the hero to make the universe pop
$('.hero').addEventListener('click', (e) => {
  if ((e.target as HTMLElement).closest('a, button')) return;
  universe?.explode();
  sound.morph();
});

// sound toggle & UI hover audio
const soundBtn = $('.nav__sound');
soundBtn.addEventListener('click', () => {
  const on = sound.toggle();
  soundBtn.classList.toggle('is-on', on);
  soundBtn.setAttribute('aria-pressed', String(on));
  toast(on ? '♫ Áudio cósmico ativado' : 'Áudio silenciado');
});
document.addEventListener('pointerover', (e) => {
  if ((e.target as HTMLElement).closest('a, button, .service, .card3d')) {
    sound.hover();
  }
});

// live GitHub stats sync (@Lettify)
fetch('https://api.github.com/users/Lettify')
  .then((r) => (r.ok ? r.json() : null))
  .then((data) => {
    if (!data) return;
    if (typeof data.public_repos === 'number') {
      $$('.js-gh-repos').forEach((el) => (el.textContent = String(data.public_repos)));
    }
    if (typeof data.followers === 'number') {
      $$('.js-gh-followers').forEach((el) => (el.textContent = String(data.followers)));
    }
  })
  .catch(() => {});

// Brasília clock
const clocks = $$('.js-clock');
const fmt = new Intl.DateTimeFormat('pt-BR', {
  timeZone: 'America/Sao_Paulo',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
});
const tickClock = () => clocks.forEach((c) => (c.textContent = fmt.format(new Date())));
tickClock();
setInterval(tickClock, 1000);

// secret words
let typed = '';
window.addEventListener('keydown', (e) => {
  if (e.key.length !== 1) return;
  typed = (typed + e.key.toLowerCase()).slice(-12);
  if (typed.endsWith('roxo')) {
    universe?.explode();
    physics?.shake();
    toast('💜 Roxo é a melhor cor. Concordo.');
  } else if (typed.endsWith('xadrez')) {
    universe?.morphTo('king');
    toast('♞ Xeque-mate.');
  } else if (typed.endsWith('lua')) {
    universe?.morphTo('orb');
    toast('🌙 local dev = "Michael"');
  }
});

console.log(
  '%c MS® %c Olá, dev curioso! Digite "roxo", "xadrez" ou "lua" na página. → contato@michael.dev.br',
  'background:linear-gradient(90deg,#7c3aed,#e879f9);color:#fff;font-weight:800;padding:6px 10px;border-radius:6px',
  'color:#c4b5fd;padding:6px',
);
