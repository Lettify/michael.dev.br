export interface GraphicsCapabilities {
  hasWebGL: boolean;
  isSoftware: boolean;
  reducedMotion: boolean;
  isFallback: boolean;
  renderer: string;
  vendor: string;
  isMobile: boolean;
  maxParticles: number;
  maxDpr: number;
  tier: 'high' | 'medium' | 'low' | 'fallback';
}

const SOFTWARE_RENDERER_PATTERNS = [
  'swiftshader',
  'llvmpipe',
  'softpipe',
  'software',
  'basic render driver',
  'mesa',
  'microsoft basic render',
  'vmware',
  'virtualbox',
  'lavapipe',
  'gdi generic',
];

export function detectGraphicsCapabilities(): GraphicsCapabilities {
  const isMobile = window.matchMedia('(max-width: 900px), (pointer: coarse)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let hasWebGL = false;
  let isSoftware = false;
  let renderer = '';
  let vendor = '';

  const testCanvas = document.createElement('canvas');
  let gl: WebGL2RenderingContext | WebGLRenderingContext | null = null;

  try {
    const contextAttributes: WebGLContextAttributes = {
      failIfMajorPerformanceCaveat: true,
      powerPreference: 'high-performance',
    };
    gl = testCanvas.getContext('webgl2', contextAttributes) || testCanvas.getContext('webgl', contextAttributes);
    if (gl) {
      hasWebGL = true;
    }
  } catch {
    hasWebGL = false;
  }

  if (gl) {
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || '';
      vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || '';
    } else {
      renderer = gl.getParameter(gl.RENDERER) || '';
      vendor = gl.getParameter(gl.VENDOR) || '';
    }

    const loseContext = gl.getExtension('WEBGL_lose_context');
    if (loseContext) {
      loseContext.loseContext();
    }
  } else {
    try {
      const fallbackGl = testCanvas.getContext('webgl2') || testCanvas.getContext('webgl');
      if (fallbackGl) {
        const debugInfo = fallbackGl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          renderer = fallbackGl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || '';
          vendor = fallbackGl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || '';
        }
        isSoftware = true;
        const loseContext = fallbackGl.getExtension('WEBGL_lose_context');
        if (loseContext) {
          loseContext.loseContext();
        }
      }
    } catch {
      // Ignora erro no fallback de detecção
    }
  }

  const normalizedRenderer = renderer.toLowerCase();
  if (SOFTWARE_RENDERER_PATTERNS.some((pattern) => normalizedRenderer.includes(pattern))) {
    isSoftware = true;
  }

  const isFallback = !hasWebGL || isSoftware || reducedMotion;

  if (isFallback) {
    return {
      hasWebGL,
      isSoftware,
      reducedMotion,
      isFallback: true,
      renderer,
      vendor,
      isMobile,
      maxParticles: 0,
      maxDpr: 1,
      tier: 'fallback',
    };
  }

  if (isMobile) {
    return {
      hasWebGL: true,
      isSoftware: false,
      reducedMotion: false,
      isFallback: false,
      renderer,
      vendor,
      isMobile: true,
      maxParticles: 4800,
      maxDpr: Math.min(window.devicePixelRatio, 1.5),
      tier: 'low',
    };
  }

  const isHighEndDesktop =
    window.innerWidth >= 1440 &&
    !normalizedRenderer.includes('intel') &&
    (normalizedRenderer.includes('nvidia') ||
      normalizedRenderer.includes('geforce') ||
      normalizedRenderer.includes('radeon') ||
      normalizedRenderer.includes('apple'));

  const maxParticles = isHighEndDesktop ? 16000 : 10000;
  const maxDpr = isHighEndDesktop ? Math.min(window.devicePixelRatio, 1.75) : Math.min(window.devicePixelRatio, 1.5);
  const tier = isHighEndDesktop ? 'high' : 'medium';

  return {
    hasWebGL: true,
    isSoftware: false,
    reducedMotion: false,
    isFallback: false,
    renderer,
    vendor,
    isMobile: false,
    maxParticles,
    maxDpr,
    tier,
  };
}
