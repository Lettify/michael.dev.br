import Matter from 'matter-js';
import { stack } from '../data';

const { Engine, Bodies, Body, Composite, Mouse, MouseConstraint, Query } = Matter;

export interface StackPhysicsOptions {
  isFallback?: boolean;
  onDegrade?: () => void;
}

export interface StackPhysicsInstance {
  start: () => void;
  update: (deltaMs: number) => void;
  shake: () => void;
  setEco: (enabled: boolean) => void;
  isFallback: boolean;
}

export function createStackPhysics(box: HTMLElement, options?: StackPhysicsOptions): StackPhysicsInstance {
  const layer = box.querySelector<HTMLElement>('.stack__pills')!;
  const touch = window.matchMedia('(pointer: coarse)').matches;

  let W = box.clientWidth;
  let H = box.clientHeight;
  const small = W < 640;

  const fontSize = { lg: small ? 22 : 40, md: small ? 16 : 26, sm: small ? 13 : 18 };
  const items = stack.map((s) => {
    const el = document.createElement('div');
    el.className = `pill pill--${s.variant}`;
    el.style.fontSize = `${fontSize[s.size]}px`;
    el.style.padding = `${fontSize[s.size] * 0.55}px ${fontSize[s.size] * 1.05}px`;
    el.innerHTML = `${s.label}${s.tag ? `<i>${s.tag}</i>` : ''}`;
    layer.appendChild(el);
    return { el, w: 0, h: 0, body: null as Matter.Body | null };
  });

  items.forEach((it) => {
    it.w = it.el.offsetWidth;
    it.h = it.el.offsetHeight;
  });

  if (options?.isFallback) {
    box.classList.add('is-fallback-layout');
    items.forEach((it) => it.el.classList.add('is-ready'));

    return {
      start: () => {},
      update: () => {},
      shake: () => {
        items.forEach((it, idx) => {
          it.el.animate(
            [
              { transform: 'translateY(0) scale(1)' },
              { transform: 'translateY(-10px) scale(1.05)' },
              { transform: 'translateY(0) scale(1)' },
            ],
            {
              duration: 450,
              delay: idx * 25,
              easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
            },
          );
        });
      },
      setEco: () => {},
      isFallback: true,
    };
  }

  const engine = Engine.create({ enableSleeping: false });
  engine.gravity.y = 1.1;
  const world = engine.world;

  let walls: Matter.Body[] = [];
  const buildWalls = () => {
    if (walls.length) Composite.remove(world, walls);
    const t = 400;
    const opts = { isStatic: true, render: { visible: false } };
    walls = [
      Bodies.rectangle(W / 2, H + t / 2, W + t * 2, t, opts),
      Bodies.rectangle(-t / 2, H / 2 - 1000, t, H * 2 + 2000, opts),
      Bodies.rectangle(W + t / 2, H / 2 - 1000, t, H * 2 + 2000, opts),
      Bodies.rectangle(W / 2, -1600 - t / 2, W + t * 2, t, opts),
    ];
    Composite.add(world, walls);
  };
  buildWalls();

  let started = false;
  let degraded = false;
  let testFrameCount = 0;
  let slowFrameCount = 0;

  const degradeToStaticLayout = () => {
    if (degraded) return;
    degraded = true;
    started = false;
    Composite.clear(world, false);
    box.classList.add('is-fallback-layout');
    items.forEach((it) => {
      it.el.style.transform = '';
      it.el.classList.add('is-ready');
    });
    options?.onDegrade?.();
  };

  const start = () => {
    if (started || degraded) return;
    started = true;
    items.forEach((it, i) => {
      const x = Math.min(Math.max(Math.random() * W, it.w / 2 + 10), W - it.w / 2 - 10);
      const y = -120 - i * (small ? 60 : 70) - Math.random() * 80;
      it.body = Bodies.rectangle(x, y, it.w, it.h, {
        chamfer: { radius: it.h / 2 },
        restitution: 0.45,
        friction: 0.08,
        frictionAir: 0.012,
        density: 0.0018,
        angle: (Math.random() - 0.5) * 0.8,
      });
      Composite.add(world, it.body);
      it.el.classList.add('is-ready');
    });
  };

  const mouse = Mouse.create(box);
  const m = mouse as unknown as Record<string, EventListener>;
  box.removeEventListener('wheel', m.mousewheel);
  box.removeEventListener('mousewheel', m.mousewheel);
  box.removeEventListener('DOMMouseScroll', m.mousewheel);

  if (touch) {
    box.removeEventListener('touchmove', m.mousemove);
    box.removeEventListener('touchstart', m.mousedown);
    box.removeEventListener('touchend', m.mouseup);

    const kickAt = (clientX: number, clientY: number, vy = -16) => {
      if (degraded) return;
      const r = box.getBoundingClientRect();
      const pt = { x: clientX - r.left, y: clientY - r.top };
      const bodies = items.map((i) => i.body).filter(Boolean) as Matter.Body[];
      Query.point(bodies, pt).forEach((b) => {
        Body.setVelocity(b, { x: (Math.random() - 0.5) * 14, y: vy - Math.random() * 6 });
        Body.setAngularVelocity(b, (Math.random() - 0.5) * 0.5);
      });
    };

    box.addEventListener('click', (e) => kickAt(e.clientX, e.clientY, -18));
    box.addEventListener(
      'pointermove',
      (e) => {
        if (e.pointerType === 'touch' || e.pointerType === 'pen') {
          kickAt(e.clientX, e.clientY, -10);
        }
      },
      { passive: true },
    );
  } else {
    const mc = MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.2, damping: 0.1, render: { visible: false } } as Matter.IConstraintDefinition,
    });
    Composite.add(world, mc);
    window.addEventListener('mouseup', m.mouseup);

    let last = { x: 0, y: 0 };
    box.addEventListener('pointermove', (e) => {
      if (degraded) return;
      const r = box.getBoundingClientRect();
      const pt = { x: e.clientX - r.left, y: e.clientY - r.top };
      const dx = pt.x - last.x;
      const dy = pt.y - last.y;
      last = pt;
      if (mc.body) return;
      const bodies = items.map((i) => i.body).filter(Boolean) as Matter.Body[];
      Query.point(bodies, pt).forEach((b) => {
        Body.setVelocity(b, { x: b.velocity.x + dx * 0.25, y: b.velocity.y + dy * 0.25 - 1.5 });
      });
    });
  }

  const resize = () => {
    if (degraded) return;
    W = box.clientWidth;
    H = box.clientHeight;
    buildWalls();
    items.forEach((it) => {
      if (!it.body) return;
      const p = it.body.position;
      if (p.x > W - it.w / 2 || p.x < it.w / 2 || p.y > H) {
        Body.setPosition(it.body, { x: Math.min(Math.max(p.x, it.w / 2), W - it.w / 2), y: Math.min(p.y, H - it.h) });
      }
    });
  };

  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(resize, 200);
  });

  const update = (deltaMs: number) => {
    if (!started || degraded) return;

    if (testFrameCount < 40) {
      testFrameCount++;
      if (deltaMs > 42) {
        slowFrameCount++;
        if (slowFrameCount >= 8) {
          degradeToStaticLayout();
          return;
        }
      }
    }

    Engine.update(engine, Math.min(deltaMs, 1000 / 60));
    for (const it of items) {
      if (!it.body) continue;
      const { x, y } = it.body.position;
      it.el.style.transform = `translate3d(${x - it.w / 2}px, ${y - it.h / 2}px, 0) rotate(${it.body.angle}rad)`;
    }
  };

  const shake = () => {
    if (degraded) {
      items.forEach((it, idx) => {
        it.el.animate(
          [
            { transform: 'translateY(0) scale(1)' },
            { transform: 'translateY(-10px) scale(1.05)' },
            { transform: 'translateY(0) scale(1)' },
          ],
          {
            duration: 450,
            delay: idx * 25,
            easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
          },
        );
      });
      return;
    }

    items.forEach((it) => {
      if (it.body) Body.setVelocity(it.body, { x: (Math.random() - 0.5) * 20, y: -15 - Math.random() * 15 });
    });
  };

  const setEco = (enabled: boolean) => {
    engine.enableSleeping = enabled;
  };

  return {
    start,
    update,
    shake,
    setEco,
    get isFallback() {
      return degraded;
    },
  };
}
