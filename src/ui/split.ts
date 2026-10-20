export interface SplitResult {
  words: HTMLElement[];
  chars: HTMLElement[];
}

interface SplitOptions {
  chars?: boolean;
  mask?: boolean;
}

/**
 * Splits an element's text into word (and optionally char) spans while
 * preserving inline children such as <em> or <strong>.
 */
export function split(el: HTMLElement, { chars = false, mask = true }: SplitOptions = {}): SplitResult {
  const result: SplitResult = { words: [], chars: [] };
  const label = el.textContent?.replace(/\s+/g, ' ').trim() ?? '';
  if (!el.hasAttribute('aria-label')) el.setAttribute('aria-label', label);

  const walk = (node: Node, parent: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const parts = (node.textContent ?? '').split(/(\s+)/);
      const frag = document.createDocumentFragment();
      for (const part of parts) {
        if (!part) continue;
        if (/^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(' '));
          continue;
        }
        const word = document.createElement('span');
        word.className = 'split-word';
        word.setAttribute('aria-hidden', 'true');
        if (chars) {
          for (const ch of Array.from(part)) {
            const c = document.createElement('span');
            c.className = 'split-char';
            c.textContent = ch;
            word.appendChild(c);
            result.chars.push(c);
          }
        } else {
          word.textContent = part;
        }
        result.words.push(word);
        if (mask) {
          const m = document.createElement('span');
          m.className = 'split-mask';
          m.appendChild(word);
          frag.appendChild(m);
        } else {
          frag.appendChild(word);
        }
      }
      parent.replaceChild(frag, node);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      Array.from(node.childNodes).forEach((child) => walk(child, node));
    }
  };

  Array.from(el.childNodes).forEach((child) => walk(child, el));
  return result;
}
