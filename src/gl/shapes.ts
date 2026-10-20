import * as THREE from 'three';

export type ShapeName = 'sphere' | 'code' | 'network' | 'galaxy' | 'knot' | 'king' | 'orb';

const TAU = Math.PI * 2;
const rand = (min: number, max: number) => min + Math.random() * (max - min);
const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;

/** Planet-like halo: a tilted ring + a thin spherical shell (hero). */
function sphere(n: number): Float32Array {
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const k = i * 3;
    if (i < n * 0.62) {
      const a = Math.random() * TAU;
      const r = 2.25 + Math.pow(Math.random(), 1.6) * 1.9;
      out[k] = Math.cos(a) * r;
      out[k + 1] = gauss() * 0.06;
      out[k + 2] = Math.sin(a) * r;
    } else {
      const u = Math.random() * 2 - 1;
      const a = Math.random() * TAU;
      const r = rand(1.9, 2.05);
      const s = Math.sqrt(1 - u * u);
      out[k] = s * Math.cos(a) * r;
      out[k + 1] = u * r;
      out[k + 2] = s * Math.sin(a) * r;
    }
  }
  return out;
}

/** Points sampled from a rendered string. */
function text(n: number, str: string, worldWidth: number, font: string): Float32Array {
  const W = 1024;
  const H = 420;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = font;
  // shrink font if needed
  let size = parseInt(font.match(/(\d+)px/)?.[1] ?? '300', 10);
  while (ctx.measureText(str).width > W * 0.92 && size > 40) {
    size -= 10;
    ctx.font = font.replace(/\d+px/, `${size}px`);
  }
  ctx.fillText(str, W / 2, H / 2 + size * 0.04);

  const data = ctx.getImageData(0, 0, W, H).data;
  const pixels: number[] = [];
  for (let y = 0; y < H; y += 2) {
    for (let x = 0; x < W; x += 2) {
      if (data[(y * W + x) * 4] > 140) pixels.push(x, y);
    }
  }
  const out = new Float32Array(n * 3);
  const scale = worldWidth / W;
  const count = pixels.length / 2;
  for (let i = 0; i < n; i++) {
    const p = Math.floor(Math.random() * count) * 2;
    out[i * 3] = (pixels[p] - W / 2 + rand(-1, 1)) * scale;
    out[i * 3 + 1] = -(pixels[p + 1] - H / 2 + rand(-1, 1)) * scale;
    out[i * 3 + 2] = gauss() * 0.22;
  }
  return out;
}

/** Wireframe icosahedron: nodes and edges — "systems". */
function network(n: number): Float32Array {
  const geo = new THREE.IcosahedronGeometry(2.3, 1);
  const edges = new THREE.EdgesGeometry(geo, 1);
  const e = edges.attributes.position.array as Float32Array;
  const segs = e.length / 6;
  const verts = geo.attributes.position.array as Float32Array;
  const vcount = verts.length / 3;
  const out = new Float32Array(n * 3);
  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  for (let i = 0; i < n; i++) {
    const k = i * 3;
    if (i < n * 0.22) {
      const v = Math.floor(Math.random() * vcount) * 3;
      const r = Math.pow(Math.random(), 2) * 0.18;
      const th = Math.random() * TAU;
      const ph = Math.acos(Math.random() * 2 - 1);
      out[k] = verts[v] + r * Math.sin(ph) * Math.cos(th);
      out[k + 1] = verts[v + 1] + r * Math.sin(ph) * Math.sin(th);
      out[k + 2] = verts[v + 2] + r * Math.cos(ph);
    } else {
      const s = Math.floor(Math.random() * segs) * 6;
      a.set(e[s], e[s + 1], e[s + 2]);
      b.set(e[s + 3], e[s + 4], e[s + 5]);
      a.lerp(b, Math.random());
      out[k] = a.x + gauss() * 0.02;
      out[k + 1] = a.y + gauss() * 0.02;
      out[k + 2] = a.z + gauss() * 0.02;
    }
  }
  geo.dispose();
  edges.dispose();
  return out;
}

/** Spiral galaxy. */
function galaxy(n: number): Float32Array {
  const out = new Float32Array(n * 3);
  const arms = 4;
  for (let i = 0; i < n; i++) {
    const k = i * 3;
    const r = Math.pow(Math.random(), 1.4) * 6.2 + 0.15;
    const arm = (i % arms) / arms;
    const angle = arm * TAU + r * 0.9;
    const spread = Math.pow(Math.random(), 3) * (0.25 + r * 0.12);
    const sa = Math.random() * TAU;
    out[k] = Math.cos(angle) * r + Math.cos(sa) * spread;
    out[k + 1] = gauss() * 0.12 * (1.2 - r / 7);
    out[k + 2] = Math.sin(angle) * r + Math.sin(sa) * spread;
  }
  return out;
}

/** Torus knot tube (p=2, q=3). */
function knot(n: number): Float32Array {
  const out = new Float32Array(n * 3);
  const R = 1.55;
  const tube = 0.42;
  const curve = (t: number, v: THREE.Vector3) => {
    const p = 2;
    const q = 3;
    const cu = Math.cos(t);
    const su = Math.sin(t);
    const quOverP = (q / p) * t;
    const cs = Math.cos(quOverP);
    v.set(R * (2 + cs) * 0.5 * cu, R * (2 + cs) * su * 0.5, R * Math.sin(quOverP) * 0.5);
    return v;
  };
  const p1 = new THREE.Vector3();
  const p2 = new THREE.Vector3();
  const T = new THREE.Vector3();
  const N = new THREE.Vector3();
  const B = new THREE.Vector3();
  for (let i = 0; i < n; i++) {
    const t = Math.random() * TAU * 2;
    curve(t, p1);
    curve(t + 0.01, p2);
    T.subVectors(p2, p1);
    N.addVectors(p2, p1);
    B.crossVectors(T, N).normalize();
    N.crossVectors(B, T).normalize();
    const a = Math.random() * TAU;
    const r = tube * (0.75 + Math.random() * 0.25);
    const k = i * 3;
    out[k] = p1.x * 1.35 + r * (Math.cos(a) * N.x + Math.sin(a) * B.x);
    out[k + 1] = p1.y * 1.35 + r * (Math.cos(a) * N.y + Math.sin(a) * B.y);
    out[k + 2] = p1.z * 1.35 + r * (Math.cos(a) * N.z + Math.sin(a) * B.z);
  }
  return out;
}

/** Chess king (lathe surface + cross). */
function king(n: number): Float32Array {
  const profile: [number, number][] = [
    [0.0, 0.0],
    [0.0, 1.3],
    [0.16, 1.3],
    [0.24, 1.12],
    [0.36, 1.12],
    [0.46, 0.94],
    [0.62, 0.72],
    [1.0, 0.58],
    [1.7, 0.45],
    [2.35, 0.4],
    [2.45, 0.78],
    [2.6, 0.78],
    [2.7, 0.5],
    [3.25, 0.7],
    [3.42, 0.64],
    [3.55, 0.3],
    [3.62, 0.0],
  ];
  const segW: number[] = [];
  let total = 0;
  for (let i = 0; i < profile.length - 1; i++) {
    const [y0, r0] = profile[i];
    const [y1, r1] = profile[i + 1];
    const w = Math.hypot(y1 - y0, r1 - r0) * ((r0 + r1) / 2 + 0.05);
    total += w;
    segW.push(total);
  }
  const out = new Float32Array(n * 3);
  const crossN = Math.floor(n * 0.08);
  for (let i = 0; i < n; i++) {
    const k = i * 3;
    if (i < crossN) {
      // cross on top
      const vertical = Math.random() < 0.6;
      if (vertical) {
        out[k] = rand(-0.11, 0.11);
        out[k + 1] = rand(3.6, 4.45);
      } else {
        out[k] = rand(-0.38, 0.38);
        out[k + 1] = rand(3.92, 4.12);
      }
      out[k + 2] = rand(-0.11, 0.11);
    } else {
      const pick = Math.random() * total;
      let s = 0;
      while (segW[s] < pick) s++;
      const [y0, r0] = profile[s];
      const [y1, r1] = profile[s + 1];
      const t = Math.random();
      const y = y0 + (y1 - y0) * t;
      const r = r0 + (r1 - r0) * t + gauss() * 0.015;
      const a = Math.random() * TAU;
      out[k] = Math.cos(a) * r;
      out[k + 1] = y;
      out[k + 2] = Math.sin(a) * r;
    }
    out[k + 1] -= 2.2;
  }
  return out;
}

export function buildShapes(n: number): Record<ShapeName, Float32Array> {
  const s = sphere(n);
  return {
    sphere: s,
    orb: s,
    code: text(n, '</>', 6.4, "800 330px 'Syne Variable', 'Syne', sans-serif"),
    network: network(n),
    galaxy: galaxy(n),
    knot: knot(n),
    king: king(n),
  };
}
