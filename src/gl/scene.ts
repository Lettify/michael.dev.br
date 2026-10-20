import * as THREE from 'three';
import { buildShapes, type ShapeName } from './shapes';
import {
  blobFragment,
  blobVertex,
  particlesFragment,
  particlesVertex,
  starsFragment,
  starsVertex,
} from './shaders';

interface Layout {
  x: number;
  y: number;
  scale: number;
  alpha: number;
  orb: number;
  tiltX: number;
  tiltZ: number;
  spin: boolean;
}

const MORPH_DURATION = 2.1;

export class Universe {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private lastTime = performance.now();
  private time = 0;

  private shapes!: Record<ShapeName, Float32Array>;
  private count: number;
  private geo = new THREE.BufferGeometry();
  private pMat!: THREE.ShaderMaterial;
  private group = new THREE.Group();
  private posAttr!: THREE.BufferAttribute;
  private fromAttr!: THREE.BufferAttribute;
  private rand!: Float32Array;
  private mix = 1;

  private orbGroup = new THREE.Group();
  private blobMat!: THREE.ShaderMaterial;
  private blob!: THREE.Mesh;
  private moon!: THREE.Mesh;
  private stars!: THREE.Points;
  private starsMat!: THREE.ShaderMaterial;

  private current: ShapeName = 'sphere';
  private layout!: Layout;
  private mouse = { x: 0, y: 0, tx: 0, ty: 0, speed: 0 };
  private velocity = 0;
  private heroProgress = 0;
  private burst = 0;
  private orbScale = 0;
  private alpha = 0;
  private intro = 0;
  private running = true;
  private mobile: boolean;

  constructor(canvas: HTMLCanvasElement) {
    this.mobile = window.matchMedia('(max-width: 900px), (pointer: coarse)').matches;
    this.count = this.mobile ? 7000 : 16000;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !this.mobile,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.mobile ? 1.5 : 1.75));

    this.camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    this.camera.position.set(0, 0, 9);

    this.buildStars();
    this.buildOrb();
    this.scene.add(this.group, this.orbGroup);
    this.group.rotation.order = 'ZXY';

    this.resize();
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('pointermove', (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      this.mouse.speed = Math.min(this.mouse.speed + Math.hypot(nx - this.mouse.tx, ny - this.mouse.ty) * 2, 1.5);
      this.mouse.tx = nx;
      this.mouse.ty = ny;
    });
    document.addEventListener('visibilitychange', () => {
      this.running = !document.hidden;
      if (this.running) this.lastTime = performance.now();
    });
  }

  /** Builds particle shapes (call after fonts load so text shapes use the display font). */
  init() {
    this.shapes = buildShapes(this.count);
    const n = this.count;
    this.rand = new Float32Array(n);
    const sizes = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      this.rand[i] = Math.random();
      sizes[i] = 0.35 + Math.pow(Math.random(), 3) * 1.6;
    }
    // start exploded far away, then collapse into the hero shape
    const from = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(Math.random() * 2 - 1);
      const r = 9 + Math.random() * 10;
      from[i * 3] = r * Math.sin(ph) * Math.cos(th);
      from[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
      from[i * 3 + 2] = r * Math.cos(ph) - 6;
    }
    this.posAttr = new THREE.BufferAttribute(new Float32Array(this.shapes.sphere), 3);
    this.fromAttr = new THREE.BufferAttribute(from, 3);
    this.geo.setAttribute('position', this.posAttr);
    this.geo.setAttribute('aFrom', this.fromAttr);
    this.geo.setAttribute('aRand', new THREE.BufferAttribute(this.rand, 1));
    this.geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));

    this.pMat = new THREE.ShaderMaterial({
      vertexShader: particlesVertex,
      fragmentShader: particlesFragment,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uMix: { value: 0 },
        uTime: { value: 0 },
        uSize: { value: this.mobile ? 34 : 30 },
        uPixelRatio: { value: this.renderer.getPixelRatio() },
        uBurst: { value: 0 },
        uMouse: { value: new THREE.Vector2(99, 99) },
        uMouseRadius: { value: 1.3 },
        uSpeed: { value: 0 },
        uAlpha: { value: 0 },
        uHue: { value: 0 },
      },
    });
    const points = new THREE.Points(this.geo, this.pMat);
    points.frustumCulled = false;
    this.group.add(points);
    this.mix = 0;
    this.layout = this.getLayout('sphere');
  }

  private buildStars() {
    const n = this.mobile ? 900 : 2000;
    const pos = new Float32Array(n * 3);
    const rnd = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(Math.random() * 2 - 1);
      const r = 18 + Math.random() * 30;
      pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
      pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
      pos[i * 3 + 2] = r * Math.cos(ph) - 10;
      rnd[i] = Math.random();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('aRand', new THREE.BufferAttribute(rnd, 1));
    this.starsMat = new THREE.ShaderMaterial({
      vertexShader: starsVertex,
      fragmentShader: starsFragment,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uPixelRatio: { value: 1 } },
    });
    this.stars = new THREE.Points(g, this.starsMat);
    this.scene.add(this.stars);
  }

  private buildOrb() {
    this.blobMat = new THREE.ShaderMaterial({
      vertexShader: blobVertex,
      fragmentShader: blobFragment,
      uniforms: {
        uTime: { value: 0 },
        uAmp: { value: 0.26 },
        uFreq: { value: 1.25 },
        uHue: { value: 0 },
      },
    });
    this.blob = new THREE.Mesh(new THREE.IcosahedronGeometry(1.3, this.mobile ? 28 : 56), this.blobMat);
    this.orbGroup.add(this.blob);

    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xc4b5fd,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const rings = new THREE.Group();
    const r1 = new THREE.Mesh(new THREE.TorusGeometry(1.95, 0.004, 6, 256), ringMat);
    const r2 = new THREE.Mesh(new THREE.TorusGeometry(2.45, 0.0025, 6, 256), ringMat.clone());
    (r2.material as THREE.MeshBasicMaterial).opacity = 0.2;
    rings.add(r1, r2);
    rings.rotation.set(Math.PI / 2 - 0.32, 0, -0.22);
    this.moon = new THREE.Mesh(
      new THREE.SphereGeometry(0.055, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xf5d0fe }),
    );
    rings.add(this.moon);
    this.orbGroup.add(rings);
    this.orbGroup.scale.setScalar(0.0001);
  }

  private halfSize() {
    const h = Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2)) * this.camera.position.z;
    return { hw: h * this.camera.aspect, hh: h };
  }

  private getLayout(name: ShapeName): Layout {
    const m = this.camera.aspect < 0.9;
    const { hw } = this.halfSize();
    const side = m ? 0 : hw * 0.48;
    const base = { x: 0, y: 0, scale: 1, alpha: 1, orb: 0, tiltX: 0, tiltZ: 0, spin: true };
    switch (name) {
      case 'sphere':
        return { ...base, scale: m ? 0.7 : 1, orb: m ? 0.75 : 1, tiltX: 0.32, tiltZ: -0.22 };
      case 'code':
        return { ...base, x: side, y: m ? 1.4 : 0.1, scale: m ? 0.5 : 0.85, alpha: m ? 0.4 : 0.85, spin: false };
      case 'network':
        return { ...base, x: side, scale: m ? 0.6 : 0.9, alpha: m ? 0.35 : 0.65, tiltX: 0.2 };
      case 'galaxy':
        return { ...base, y: -0.2, scale: m ? 0.75 : 1, alpha: 0.7, tiltX: 1.05, tiltZ: 0.35 };
      case 'knot':
        return { ...base, y: -0.2, scale: m ? 0.55 : 0.95, alpha: 0.85, tiltX: 0.3 };
      case 'king':
        return { ...base, x: side * 1.05, scale: m ? 0.55 : 0.95, alpha: m ? 0.4 : 0.95, tiltX: 0.12 };
      case 'orb':
        return {
          ...base,
          y: m ? 0.85 : 0,
          scale: m ? 0.52 : 0.9,
          alpha: m ? 0.5 : 0.9,
          orb: m ? 0.52 : 0.85,
          tiltX: 0.32,
          tiltZ: -0.22,
        };
    }
  }

  morphTo(name: ShapeName) {
    if (!this.shapes || name === this.current) return;
    const from = this.fromAttr.array as Float32Array;
    const to = this.posAttr.array as Float32Array;
    const m = this.mix;
    for (let i = 0; i < this.count; i++) {
      const r = this.rand[i];
      let d = Math.min(Math.max((m - r * 0.35) / 0.65, 0), 1);
      d = d * d * (3 - 2 * d);
      const k = i * 3;
      let x = from[k] + (to[k] - from[k]) * d;
      let y = from[k + 1] + (to[k + 1] - from[k + 1]) * d;
      let z = from[k + 2] + (to[k + 2] - from[k + 2]) * d;
      const len = Math.hypot(x, y, z) || 1;
      const s = Math.sin(d * Math.PI) * 0.8 * r;
      x += (x / len) * s;
      y += (y / len) * s;
      z += (z / len) * s;
      from[k] = x;
      from[k + 1] = y;
      from[k + 2] = z;
    }
    to.set(this.shapes[name]);
    this.fromAttr.needsUpdate = true;
    this.posAttr.needsUpdate = true;
    this.mix = 0;

    const prevSpin = this.layout.spin;
    this.current = name;
    this.layout = this.getLayout(name);
    if (prevSpin && !this.layout.spin) {
      // unwrap accumulated spin so the sway starts from the nearest angle
      const y = this.group.rotation.y;
      this.group.rotation.y = Math.atan2(Math.sin(y), Math.cos(y));
    }
  }

  setVelocity(v: number) {
    this.velocity = v;
  }

  setHeroProgress(p: number) {
    this.heroProgress = p;
  }

  explode() {
    this.burst = 1;
  }

  startIntro() {
    this.intro = 1;
  }

  private resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.fov = w / h < 0.9 ? 48 : 35;
    this.camera.updateProjectionMatrix();
    if (this.pMat) {
      this.pMat.uniforms.uPixelRatio.value = this.renderer.getPixelRatio();
      this.layout = this.getLayout(this.current);
    }
    this.starsMat.uniforms.uPixelRatio.value = this.renderer.getPixelRatio();
  }

  tick() {
    if (!this.running || !this.pMat) return;
    const now = performance.now();
    const dt = Math.min((now - this.lastTime) / 1000, 0.05);
    this.lastTime = now;
    this.time += dt;
    const t = this.time;
    const L = this.layout;
    const k = 1 - Math.exp(-dt * 2.6);
    const kFast = 1 - Math.exp(-dt * 6);

    // mouse
    this.mouse.x += (this.mouse.tx - this.mouse.x) * kFast;
    this.mouse.y += (this.mouse.ty - this.mouse.y) * kFast;
    this.mouse.speed *= Math.exp(-dt * 2.5);
    const vel = Math.min(Math.abs(this.velocity) / 40, 1.5);

    // morph progress (only once intro has started)
    if (this.intro > 0) this.mix = Math.min(this.mix + dt / MORPH_DURATION, 1);
    this.burst *= Math.exp(-dt * 1.6);

    const u = this.pMat.uniforms;
    u.uMix.value = this.mix;
    u.uTime.value = t;
    u.uSpeed.value += (vel - u.uSpeed.value) * kFast;
    u.uBurst.value = this.burst;
    u.uHue.value = (t * 0.02) % 1;
    this.alpha += ((this.intro > 0 ? L.alpha : 0) - this.alpha) * k;
    u.uAlpha.value = this.alpha;

    const { hw, hh } = this.halfSize();
    (u.uMouse.value as THREE.Vector2).set(this.mouse.x * hw, this.mouse.y * hh);

    // group transform
    const g = this.group;
    g.position.x += (L.x - g.position.x) * k;
    const heroLift = this.current === 'sphere' ? this.heroProgress * 1.4 : 0;
    g.position.y += (L.y + heroLift - g.position.y) * k;
    const s = g.scale.x + (L.scale - g.scale.x) * k;
    g.scale.setScalar(s);
    g.rotation.x += (L.tiltX + this.mouse.y * 0.08 - g.rotation.x) * k;
    g.rotation.z += (L.tiltZ - g.rotation.z) * k;
    if (L.spin) {
      g.rotation.y += dt * (0.09 + vel * 0.6) + this.mouse.x * dt * 0.05;
    } else {
      g.rotation.y += (Math.sin(t * 0.5) * 0.35 + this.mouse.x * 0.25 - g.rotation.y) * k;
    }

    // orb
    const orbTarget = this.intro > 0 ? L.orb * (1 - this.heroProgress * 0.35 * (this.current === 'sphere' ? 1 : 0)) : 0;
    this.orbScale += (orbTarget - this.orbScale) * (1 - Math.exp(-dt * 3.2));
    this.orbGroup.scale.setScalar(Math.max(this.orbScale, 0.0001) * s);
    this.orbGroup.visible = this.orbScale > 0.002;
    this.orbGroup.position.copy(g.position);
    this.blob.rotation.y += dt * 0.15;
    this.blob.rotation.x = this.mouse.y * 0.3;
    this.blob.rotation.z = -this.mouse.x * 0.3;
    this.moon.position.set(Math.cos(t * 0.6) * 2.45, Math.sin(t * 0.6) * 2.45, 0);

    // blob reacts to cursor proximity and scroll speed
    const orbScreen = this.orbGroup.position.clone().project(this.camera);
    const near = Math.max(0, 1 - Math.hypot(orbScreen.x - this.mouse.x, (orbScreen.y - this.mouse.y) / this.camera.aspect) * 2.2);
    const bu = this.blobMat.uniforms;
    const ampTarget = 0.24 + near * 0.18 + this.mouse.speed * 0.12 + vel * 0.1 + this.burst * 0.4;
    bu.uAmp.value += (ampTarget - bu.uAmp.value) * k;
    bu.uTime.value = t * (1 + near * 0.6);
    bu.uHue.value = Math.sin(t * 0.15) * 0.06;

    // stars & camera parallax
    this.starsMat.uniforms.uTime.value = t;
    this.stars.rotation.y = t * 0.01;
    this.stars.rotation.x = this.heroProgress * 0.1;
    this.camera.position.x += (this.mouse.x * 0.45 - this.camera.position.x) * k;
    this.camera.position.y += (this.mouse.y * 0.3 - this.camera.position.y) * k;
    this.camera.lookAt(0, 0, 0);

    this.renderer.render(this.scene, this.camera);
  }
}
