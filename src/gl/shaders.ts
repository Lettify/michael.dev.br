// Ashima 3D simplex noise (MIT) — compact version
export const noise3D = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
`;

/* ---------------- Blob (iridescent orb) ---------------- */
export const blobVertex = /* glsl */ `
uniform float uTime;
uniform float uAmp;
uniform float uFreq;
varying vec3 vNormal;
varying vec3 vView;
varying float vDisp;
${noise3D}

vec3 displace(vec3 p){
  vec3 n = normalize(p);
  float d = snoise(n * uFreq + vec3(uTime * 0.18, uTime * 0.12, 0.0)) * uAmp;
  d += snoise(n * uFreq * 2.6 - uTime * 0.35) * uAmp * 0.28;
  return p + n * d;
}
vec3 orthogonal(vec3 v){
  return normalize(abs(v.x) > abs(v.z) ? vec3(-v.y, v.x, 0.0) : vec3(0.0, -v.z, v.y));
}
void main(){
  vec3 p = displace(position);
  vec3 nrm = normalize(position);
  float eps = 0.012;
  vec3 t = orthogonal(nrm);
  vec3 b = normalize(cross(nrm, t));
  vec3 p1 = displace(position + t * eps);
  vec3 p2 = displace(position + b * eps);
  vec3 n = normalize(cross(p1 - p, p2 - p));
  vDisp = length(p) - length(position);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vNormal = normalize(normalMatrix * n);
  vView = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}
`;

export const blobFragment = /* glsl */ `
uniform float uTime;
uniform float uHue;
varying vec3 vNormal;
varying vec3 vView;
varying float vDisp;

vec3 palette(float t){
  vec3 a = vec3(0.55, 0.32, 0.78);
  vec3 b = vec3(0.45, 0.30, 0.30);
  vec3 c = vec3(1.0, 1.0, 1.0);
  vec3 d = vec3(0.72 + uHue, 0.88 + uHue, 0.98 + uHue);
  return a + b * cos(6.28318 * (c * t + d));
}

void main(){
  vec3 n = normalize(vNormal);
  vec3 v = normalize(vView);
  vec3 L = normalize(vec3(-0.6, 0.8, 0.7));
  float fres = pow(1.0 - max(dot(n, v), 0.0), 2.4);
  float diff = max(dot(n, L), 0.0);

  vec3 deep = vec3(0.06, 0.015, 0.18);
  vec3 mid = vec3(0.45, 0.16, 0.88);
  vec3 col = mix(deep, mid, diff * 0.85 + vDisp * 1.2);

  // Cinematic chromatic dispersion
  vec3 iridR = palette(fres * 0.92 + vDisp * 2.0 + uTime * 0.05);
  vec3 iridG = palette(fres * 0.88 + vDisp * 2.0 + uTime * 0.05 + 0.04);
  vec3 iridB = palette(fres * 0.84 + vDisp * 2.0 + uTime * 0.05 + 0.08);
  vec3 irid = vec3(iridR.r, iridG.g, iridB.b);
  col += irid * fres * 1.45;

  float spec = pow(max(dot(reflect(-L, n), v), 0.0), 38.0);
  col += vec3(1.2, 0.95, 1.2) * spec * 1.05;

  // Soft rim / backlight glow
  float back = pow(max(dot(n, normalize(vec3(0.7, -0.4, -0.3))), 0.0), 2.2);
  col += vec3(0.95, 0.35, 1.0) * back * 0.42;

  // Cyan secondary highlight
  float side = pow(max(dot(n, normalize(vec3(-0.8, -0.2, 0.5))), 0.0), 3.0);
  col += vec3(0.3, 0.85, 1.0) * side * 0.32;

  gl_FragColor = vec4(col, 1.0);
}
`;

/* ---------------- Morphing particles ---------------- */
export const particlesVertex = /* glsl */ `
attribute vec3 aFrom;
attribute float aRand;
attribute float aSize;
uniform float uMix;
uniform float uTime;
uniform float uSize;
uniform float uPixelRatio;
uniform float uBurst;
uniform vec2 uMouse;
uniform float uMouseRadius;
uniform float uSpeed;
varying float vRand;
varying float vDepth;

void main(){
  float d = clamp((uMix - aRand * 0.35) / 0.65, 0.0, 1.0);
  d = d * d * (3.0 - 2.0 * d);
  vec3 p = mix(aFrom, position, d);
  vec3 dir = normalize(p + vec3(0.0001));
  p += dir * sin(d * 3.14159) * 0.8 * aRand;

  // idle drift
  float t = uTime * 0.6;
  p += vec3(
    sin(t + aRand * 40.0),
    cos(t * 0.9 + aRand * 25.0),
    sin(t * 0.7 + aRand * 13.0)
  ) * (0.025 + uSpeed * 0.06);

  // easter-egg burst
  p += dir * uBurst * (0.5 + aRand) * 2.5;

  vec4 world = modelMatrix * vec4(p, 1.0);

  // mouse repulsion in world space
  vec2 diff = world.xy - uMouse;
  float dist = length(diff);
  float force = smoothstep(uMouseRadius, 0.0, dist);
  world.xy += normalize(diff + vec2(0.0001)) * force * 0.55;
  world.z += force * 0.4;

  vec4 mv = viewMatrix * world;
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * aSize * uPixelRatio * (1.0 / -mv.z) * (1.0 + force * 0.8);
  vRand = aRand;
  vDepth = clamp((-mv.z - 4.0) / 10.0, 0.0, 1.0);
}
`;

export const particlesFragment = /* glsl */ `
uniform float uAlpha;
uniform float uHue;
varying float vRand;
varying float vDepth;

void main(){
  vec2 uv = gl_PointCoord - 0.5;
  float r = length(uv);
  if (r > 0.5) discard;

  // Cinematic dual-corona profile: hot core + soft optical halo
  float core = exp(-r * 8.5);
  float halo = smoothstep(0.5, 0.05, r);
  float intensity = core * 0.78 + halo * 0.42;

  // Micro starlight diffraction spikes on select bright stars
  if (vRand > 0.91) {
    vec2 sUv = abs(uv);
    float spike = max(
      smoothstep(0.035, 0.0, sUv.x) * smoothstep(0.48, 0.0, sUv.y),
      smoothstep(0.035, 0.0, sUv.y) * smoothstep(0.48, 0.0, sUv.x)
    );
    intensity += spike * (vRand - 0.91) * 7.5;
  }

  // Harmonic cosmic palette: Deep Indigo -> Electric Violet -> Neon Magenta -> Ethereal Cyan
  vec3 indigo  = vec3(0.42, 0.18, 0.92);
  vec3 lilac   = vec3(0.78, 0.72, 1.0);
  vec3 magenta = vec3(0.96, 0.42, 0.98);
  vec3 cyan    = vec3(0.45, 0.88, 1.0);

  vec3 col = mix(indigo, lilac, smoothstep(0.15, 0.75, vRand));
  col = mix(col, magenta, smoothstep(0.78, 0.93, fract(vRand * 7.0 + uHue)));
  col = mix(col, cyan, smoothstep(0.94, 0.985, fract(vRand * 13.0 + uHue * 1.5)));

  // Overbright HDR core for the top stars to trigger cinematic bloom
  col = mix(col, vec3(1.3, 1.25, 1.45), step(0.97, vRand));

  float a = intensity * uAlpha * mix(1.0, 0.35, vDepth);
  gl_FragColor = vec4(col, a);
}
`;

/* ---------------- Cinematic Screen Warp & Dispersion ---------------- */
export const cinematicShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uWarp: { value: 0 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform float uWarp;
    varying vec2 vUv;

    void main() {
      vec2 uv = vUv;
      vec2 center = vec2(0.5);
      vec2 dir = uv - center;
      float dist = length(dir);

      // Scroll velocity-driven chromatic warp
      float aberration = 0.0012 + uWarp * 0.0035 * dist;
      vec2 uvR = uv - dir * aberration;
      vec2 uvG = uv;
      vec2 uvB = uv + dir * aberration;

      float r = texture2D(tDiffuse, uvR).r;
      float g = texture2D(tDiffuse, uvG).g;
      float b = texture2D(tDiffuse, uvB).b;
      float a = texture2D(tDiffuse, uvG).a;

      // Microscopic quantum stardust shimmer
      float noise = (fract(sin(dot(uv + fract(uTime * 0.05), vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.008;

      gl_FragColor = vec4(r + noise, g + noise, b + noise, a);
    }
  `,
};

/* ---------------- Background stars ---------------- */
export const starsVertex = /* glsl */ `
attribute float aRand;
uniform float uTime;
uniform float uPixelRatio;
varying float vTw;
void main(){
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  vTw = 0.45 + 0.55 * sin(uTime * (0.6 + aRand * 2.0) + aRand * 50.0);
  gl_PointSize = (1.0 + aRand * 2.2) * uPixelRatio;
}
`;

export const starsFragment = /* glsl */ `
varying float vTw;
void main(){
  float r = length(gl_PointCoord - 0.5);
  if (r > 0.5) discard;
  float a = smoothstep(0.5, 0.0, r) * vTw * 0.75;
  gl_FragColor = vec4(vec3(0.85, 0.8, 1.0), a);
}
`;
