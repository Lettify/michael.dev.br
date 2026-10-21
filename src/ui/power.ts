export interface BatteryManager extends EventTarget {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
  addEventListener(type: 'chargingchange' | 'levelchange', listener: (this: BatteryManager, ev: Event) => void): void;
}

export type EcoReason = 'low-battery' | 'reduced-motion' | 'adaptive-fps' | 'manual' | 'restored';

export function initPowerManager(onEcoChange: (eco: boolean, reason: EcoReason) => void) {
  let isEco = false;

  const updateEco = (eco: boolean, reason: EcoReason) => {
    if (isEco === eco) return;
    isEco = eco;
    onEcoChange(eco, reason);
  };

  // 1. Reduced motion preference
  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reducedMotionQuery.matches) {
    updateEco(true, 'reduced-motion');
  }
  reducedMotionQuery.addEventListener('change', (e) => {
    if (e.matches) updateEco(true, 'reduced-motion');
    else updateEco(false, 'restored');
  });

  // 2. Battery Status API (Chrome / Android / Edge)
  interface NavigatorWithBattery extends Navigator {
    getBattery?: () => Promise<BatteryManager>;
  }
  const nav = navigator as NavigatorWithBattery;
  if (typeof nav.getBattery === 'function') {
    nav
      .getBattery()
      .then((battery) => {
        const checkBattery = () => {
          // Discharging and battery level <= 20%
          if (!battery.charging && battery.level <= 0.2) {
            updateEco(true, 'low-battery');
          } else if (battery.charging || battery.level > 0.25) {
            if (!reducedMotionQuery.matches) {
              updateEco(false, 'restored');
            }
          }
        };
        checkBattery();
        battery.addEventListener('levelchange', checkBattery);
        battery.addEventListener('chargingchange', checkBattery);
      })
      .catch(() => {});
  }

  // 3. Adaptive FPS Watchdog (Dynamic GPU throttling if device stutters)
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  let slowFrames = 0;
  let lastCheck = performance.now();
  let frameCount = 0;

  const monitorFps = () => {
    frameCount++;
    const now = performance.now();
    if (now - lastCheck >= 1200) {
      const fps = (frameCount * 1000) / (now - lastCheck);
      frameCount = 0;
      lastCheck = now;

      // If mobile/touch device drops below 26 FPS for 3 consecutive intervals, engage eco mode
      if (isTouch && fps < 26 && !isEco) {
        slowFrames++;
        if (slowFrames >= 3) {
          updateEco(true, 'adaptive-fps');
        }
      } else {
        slowFrames = Math.max(0, slowFrames - 1);
      }
    }
    requestAnimationFrame(monitorFps);
  };
  requestAnimationFrame(monitorFps);

  return {
    isEco: () => isEco,
    setManualEco: (eco: boolean) => updateEco(eco, 'manual'),
  };
}
