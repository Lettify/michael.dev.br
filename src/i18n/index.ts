import type { Lang } from './translations';
import { translations } from './translations';
import { renderPersonalHud } from '../ui/personal-hud';

let currentLang: Lang = 'pt';
type LangChangeListener = (lang: Lang) => void;
const listeners: LangChangeListener[] = [];

export function getLang(): Lang {
  return currentLang;
}

export function getTranslation(path: string, lang: Lang = currentLang): string {
  const parts = path.split('.');
  let current: unknown = translations[lang];
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return path;
    }
  }
  return typeof current === 'string' ? current : path;
}

export function onLangChange(fn: LangChangeListener) {
  listeners.push(fn);
}

export function setLang(lang: Lang) {
  currentLang = lang;
  try {
    localStorage.setItem('ms_lang', lang);
  } catch {}

  document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';

  // Update text elements with [data-i18n]
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    if (key) {
      el.textContent = getTranslation(key, lang);
    }
  });

  // Update HTML elements with [data-i18n-html]
  document.querySelectorAll<HTMLElement>('[data-i18n-html]').forEach((el) => {
    const key = el.dataset.i18nHtml;
    if (key) {
      el.innerHTML = getTranslation(key, lang);
    }
  });

  // Update placeholders with [data-i18n-placeholder]
  document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[data-i18n-placeholder]').forEach((el) => {
    const key = el.dataset.i18nPlaceholder;
    if (key) {
      el.placeholder = getTranslation(key, lang);
    }
  });

  // Update switcher button visual state
  document.querySelectorAll<HTMLElement>('.lang-pill, .btn-lang').forEach((el) => {
    const l = el.dataset.lang || el.dataset.setLang;
    if (l) {
      el.classList.toggle('is-active', l === lang);
    }
  });

  // Update HUD Container if present
  const hudContainer = document.querySelector<HTMLElement>('.js-bio-hud-container');
  if (hudContainer) {
    hudContainer.innerHTML = renderPersonalHud(lang);
  }

  // Notify registered callbacks (e.g. project tracks, case studies)
  listeners.forEach((fn) => fn(lang));
}

export function initI18n(): Lang {
  let initialLang: Lang = 'pt';
  try {
    const saved = localStorage.getItem('ms_lang') as Lang | null;
    if (saved === 'pt' || saved === 'en') {
      initialLang = saved;
    } else if (typeof navigator !== 'undefined' && navigator.language) {
      initialLang = navigator.language.toLowerCase().startsWith('en') ? 'en' : 'pt';
    }
  } catch {}

  setLang(initialLang);
  return initialLang;
}
