import type { Lang } from '../i18n/translations';
import { translations } from '../i18n/translations';

export function calculateAge(birthDate = new Date(2002, 7, 17)): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export function calculateYearsOfExp(startYear = 2016): number {
  const today = new Date();
  return Math.max(1, today.getFullYear() - startYear);
}

export function renderPersonalHud(lang: Lang = 'pt'): string {
  const t = translations[lang].bioHud;
  const age = calculateAge();
  const exp = calculateYearsOfExp();

  return `
    <div class="bio-hud" data-fade>
      <div class="bio-hud__header">
        <div class="bio-hud__title-wrap">
          <span class="bio-hud__pulse"></span>
          <span class="mono bio-hud__tag">${t.sectionTitle}</span>
        </div>
        <span class="mono bio-hud__coords">15°47′38″S 47°52′58″W // BRT</span>
      </div>

      <div class="bio-hud__grid">
        <!-- 01: Dynamic Age & Birthdate -->
        <div class="bio-card" data-tilt>
          <div class="bio-card__glass"></div>
          <div class="bio-card__top">
            <span class="bio-card__icon">✦</span>
            <span class="mono bio-card__label">${t.ageLabel}</span>
          </div>
          <div class="bio-card__value">
            <strong class="js-val-age">${age}</strong>
            <span class="bio-card__unit">${t.ageSuffix}</span>
          </div>
          <p class="bio-card__sub mono">${t.ageSub}</p>
        </div>

        <!-- 02: Dynamic Experience -->
        <div class="bio-card" data-tilt>
          <div class="bio-card__glass"></div>
          <div class="bio-card__top">
            <span class="bio-card__icon">⚡</span>
            <span class="mono bio-card__label">${t.expLabel}</span>
          </div>
          <div class="bio-card__value">
            <strong class="js-val-exp">${exp}</strong>
            <span class="bio-card__unit">${t.expSuffix}</span>
          </div>
          <p class="bio-card__sub mono">${t.expSub}</p>
        </div>

        <!-- 03: Base & Location -->
        <div class="bio-card" data-tilt>
          <div class="bio-card__glass"></div>
          <div class="bio-card__top">
            <span class="bio-card__icon">📍</span>
            <span class="mono bio-card__label">${t.locLabel}</span>
          </div>
          <div class="bio-card__value bio-card__value--text">
            <strong>${t.locValue}</strong>
          </div>
          <p class="bio-card__sub mono">${t.locSub}</p>
        </div>

        <!-- 04: Academic Degree / Studies -->
        <div class="bio-card bio-card--wide" data-tilt>
          <div class="bio-card__glass"></div>
          <div class="bio-card__top">
            <span class="bio-card__icon">🎓</span>
            <span class="mono bio-card__label">${t.eduLabel}</span>
          </div>
          <div class="bio-card__value bio-card__value--mid">
            <strong>${t.eduValue}</strong>
          </div>
          <p class="bio-card__sub mono">${t.eduSub}</p>
        </div>

        <!-- 05: Gaming & Hobbies -->
        <div class="bio-card bio-card--wide" data-tilt>
          <div class="bio-card__glass"></div>
          <div class="bio-card__top">
            <span class="bio-card__icon">🎮</span>
            <span class="mono bio-card__label">${t.gamingLabel}</span>
          </div>
          <div class="bio-card__value bio-card__value--mid">
            <strong>${t.gamingValue}</strong>
          </div>
          <p class="bio-card__sub mono">${t.gamingSub}</p>
        </div>
      </div>
    </div>
  `;
}
