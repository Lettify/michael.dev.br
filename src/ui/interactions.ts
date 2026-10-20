import gsap from 'gsap';

const finePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/* ------------------------------------------------------------------ */
/* Custom cursor                                                       */
/* ------------------------------------------------------------------ */
export function initCursor() {
  if (!finePointer()) return;
  document.documentElement.classList.add('has-cursor');
  const cursor = document.querySelector<HTMLElement>('.cursor')!;
  const dot = cursor.querySelector<HTMLElement>('.cursor__dot')!;
  const ring = cursor.querySelector<HTMLElement>('.cursor__ring')!;
  const label = cursor.querySelector<HTMLElement>('.cursor__label')!;
  const trailCanvas = document.querySelector<HTMLCanvasElement>('.cursor-trail');
  const ctx = trailCanvas?.getContext('2d') ?? null;

  let dpr = 1;
  const resizeTrail = () => {
    if (!trailCanvas || !ctx) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    trailCanvas.width = window.innerWidth * dpr;
    trailCanvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resizeTrail();
  window.addEventListener('resize', resizeTrail);

  interface Spark {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    life: number;
    maxLife: number;
    color: string;
    star: boolean;
    rot: number;
    vRot: number;
  }

  const PALETTE = ['#c4b5fd', '#a855f7', '#e879f9', '#f5d0fe', '#8b5cf6'];
  const sparks: Spark[] = [];
  const trail: { x: number; y: number }[] = [];
  const TRAIL_LEN = 14;

  const spawnSpark = (x: number, y: number, vx: number, vy: number, boost = 1) => {
    if (sparks.length > 90) return;
    const angle = Math.random() * Math.PI * 2;
    const speed = (0.25 + Math.random() * 1.15) * boost;
    sparks.push({
      x: x + (Math.random() - 0.5) * 8,
      y: y + (Math.random() - 0.5) * 8,
      vx: vx * 0.12 + Math.cos(angle) * speed,
      vy: vy * 0.12 + Math.sin(angle) * speed - 0.25,
      size: (1.4 + Math.random() * 2.6) * (boost > 1 ? 1.2 : 1),
      life: 0,
      maxLife: 24 + Math.random() * 28,
      color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
      star: Math.random() < 0.38,
      rot: Math.random() * Math.PI,
      vRot: (Math.random() - 0.5) * 0.08,
    });
  };

  const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const prev = { ...pos };
  const ringPos = { ...pos };
  let visible = false;

  window.addEventListener('pointermove', (e) => {
    const dx = e.clientX - pos.x;
    const dy = e.clientY - pos.y;
    const dist = Math.hypot(dx, dy);
    pos.x = e.clientX;
    pos.y = e.clientY;
    if (!visible) {
      visible = true;
      ringPos.x = pos.x;
      ringPos.y = pos.y;
      trail.length = 0;
      for (let i = 0; i < TRAIL_LEN; i++) trail.push({ x: pos.x, y: pos.y });
      gsap.to(cursor, { autoAlpha: 1, duration: 0.3 });
    }
    if (dist > 2.5) {
      const count = Math.min(3, Math.ceil(dist / 14));
      for (let i = 0; i < count; i++) {
        if (Math.random() < 0.65) spawnSpark(pos.x, pos.y, dx, dy);
      }
    }
  });
  document.addEventListener('pointerleave', () => {
    visible = false;
    gsap.to(cursor, { autoAlpha: 0, duration: 0.3 });
  });
  window.addEventListener('pointerdown', (e) => {
    cursor.classList.add('is-down');
    for (let i = 0; i < 10; i++) spawnSpark(e.clientX, e.clientY, 0, 0, 1.8);
  });
  window.addEventListener('pointerup', () => cursor.classList.remove('is-down'));

  gsap.ticker.add(() => {
    const k = 0.18;
    ringPos.x += (pos.x - ringPos.x) * k;
    ringPos.y += (pos.y - ringPos.y) * k;
    dot.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
    ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`;

    if (!ctx || !trailCanvas) return;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    // Update smooth comet ribbon points
    if (visible && trail.length === TRAIL_LEN) {
      trail[0].x += (pos.x - trail[0].x) * 0.45;
      trail[0].y += (pos.y - trail[0].y) * 0.45;
      for (let i = 1; i < TRAIL_LEN; i++) {
        trail[i].x += (trail[i - 1].x - trail[i].x) * 0.42;
        trail[i].y += (trail[i - 1].y - trail[i].y) * 0.42;
      }
      for (let i = 1; i < TRAIL_LEN; i++) {
        const t = 1 - i / TRAIL_LEN;
        ctx.beginPath();
        ctx.moveTo(trail[i - 1].x, trail[i - 1].y);
        ctx.lineTo(trail[i].x, trail[i].y);
        ctx.strokeStyle = `rgba(196, 181, 253, ${(t * 0.22).toFixed(3)})`;
        ctx.lineWidth = t * 2.4;
        ctx.lineCap = 'round';
        ctx.stroke();
      }
    }

    // Subtle idle spark near ring when moving slowly
    const speed = Math.hypot(pos.x - prev.x, pos.y - prev.y);
    prev.x = pos.x;
    prev.y = pos.y;
    if (visible && speed < 1 && Math.random() < 0.08) {
      spawnSpark(ringPos.x, ringPos.y, 0, 0, 0.5);
    }

    // Render and advance stardust particles
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.life++;
      if (s.life >= s.maxLife) {
        sparks.splice(i, 1);
        continue;
      }
      s.x += s.vx;
      s.y += s.vy;
      s.vx *= 0.96;
      s.vy = s.vy * 0.96 - 0.015;
      s.rot += s.vRot;

      const progress = s.life / s.maxLife;
      const alpha = Math.sin(progress * Math.PI) * 0.78;
      const r = s.size * (1 - progress * 0.4);

      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(s.rot);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = s.color;

      if (s.star) {
        // 4-point cosmic star
        ctx.beginPath();
        const outer = r * 1.9;
        const inner = r * 0.42;
        for (let p = 0; p < 8; p++) {
          const rad = p % 2 === 0 ? outer : inner;
          const a = (p * Math.PI) / 4;
          if (p === 0) ctx.moveTo(Math.cos(a) * rad, Math.sin(a) * rad);
          else ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
        }
        ctx.closePath();
        ctx.fill();
      } else {
        // Soft glowing orb mote
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    ctx.restore();
  });

  document.addEventListener('pointerover', (e) => {
    const target = (e.target as HTMLElement).closest<HTMLElement>('[data-cursor], a, button');
    if (!target) {
      cursor.classList.remove('is-hover', 'has-label');
      return;
    }
    const text = target.dataset.cursor;
    if (text) {
      label.textContent = text;
      cursor.classList.add('has-label');
      cursor.classList.remove('is-hover');
    } else {
      cursor.classList.add('is-hover');
      cursor.classList.remove('has-label');
    }
  });
}

/* ------------------------------------------------------------------ */
/* Magnetic elements                                                   */
/* ------------------------------------------------------------------ */
export function initMagnetic(root: ParentNode = document) {
  if (!finePointer()) return;
  root.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    const strength = parseFloat(el.dataset.magnetic || '') || 0.35;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    });
    el.addEventListener('pointerleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 1.1, ease: 'elastic.out(1, 0.35)' });
    });
  });
}

/* ------------------------------------------------------------------ */
/* Text scramble on hover                                              */
/* ------------------------------------------------------------------ */
const GLYPHS = '!<>-_\\/[]{}—=+*^?#ABCDEFXYZ01';
export function scramble(el: HTMLElement, duration = 0.6) {
  const original = el.dataset.original ?? el.textContent ?? '';
  el.dataset.original = original;
  const state = { p: 0 };
  gsap.killTweensOf(state);
  gsap.to(state, {
    p: 1,
    duration,
    ease: 'none',
    onUpdate: () => {
      const reveal = Math.floor(state.p * original.length);
      let out = '';
      for (let i = 0; i < original.length; i++) {
        const ch = original[i];
        if (i < reveal || ch === ' ') out += ch;
        else out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      el.textContent = out;
    },
    onComplete: () => {
      el.textContent = original;
    },
  });
}

export function initScramble() {
  document.querySelectorAll<HTMLElement>('[data-scramble]').forEach((el) => {
    const trigger = el.closest('a') ?? el;
    trigger.addEventListener('pointerenter', () => scramble(el));
  });
}

/* ------------------------------------------------------------------ */
/* 3D tilt                                                             */
/* ------------------------------------------------------------------ */
export function initTilt(selector: string, inner?: string, max = 10) {
  if (!finePointer()) return;
  document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
    const target = inner ? el.querySelector<HTMLElement>(inner) ?? el : el;
    const rx = gsap.quickTo(target, 'rotationX', { duration: 0.6, ease: 'power3.out' });
    const ry = gsap.quickTo(target, 'rotationY', { duration: 0.6, ease: 'power3.out' });
    gsap.set(target, { transformPerspective: 900 });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      ry((px - 0.5) * max * 2);
      rx(-(py - 0.5) * max * 2);
      target.style.setProperty('--gx', `${px * 100}%`);
      target.style.setProperty('--gy', `${py * 100}%`);
      el.querySelector<HTMLElement>('.card3d__inner')?.style.setProperty('--gx', `${px * 100}%`);
      el.querySelector<HTMLElement>('.card3d__inner')?.style.setProperty('--gy', `${py * 100}%`);
    });
    el.addEventListener('pointerleave', () => {
      rx(0);
      ry(0);
    });
  });
}

/* ------------------------------------------------------------------ */
/* Variable-font proximity (letters swell near the cursor)             */
/* ------------------------------------------------------------------ */
export function initProximity() {
  if (!finePointer()) return;
  const groups = Array.from(document.querySelectorAll<HTMLElement>('[data-proximity]'));
  const chars = groups.flatMap((g) => Array.from(g.querySelectorAll<HTMLElement>('.split-char')));
  const values = new Map<HTMLElement, number>();
  const mouse = { x: -9999, y: -9999 };
  window.addEventListener('pointermove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  gsap.ticker.add(() => {
    const vh = window.innerHeight;
    // read pass (avoid layout thrashing), then write pass
    const rects = chars.map((c) => c.getBoundingClientRect());
    chars.forEach((c, i) => {
      const r = rects[i];
      if (r.bottom < -50 || r.top > vh + 50) return;
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const radius = Math.max(r.height * 1.6, 160);
      const d = Math.hypot(mouse.x - cx, mouse.y - cy);
      const target = Math.max(0, 1 - d / radius);
      const prev = values.get(c) ?? 0;
      const next = prev + (target * target * (3 - 2 * target) - prev) * 0.14;
      if (Math.abs(next - prev) > 0.001) {
        values.set(c, next);
        c.style.setProperty('--p', next.toFixed(3));
      }
    });
  });
}
