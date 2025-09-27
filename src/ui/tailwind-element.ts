// tailwind-element.ts
import {LitElement} from 'lit';
import {tailwindSheetReady} from '../lib/tailwind-shared.js';

export class TailwindElement extends LitElement {
  #twInjected = false;

  override async connectedCallback() {
    super.connectedCallback();
    const result = await tailwindSheetReady;

    if (result instanceof CSSStyleSheet) {
      // Modern path: one shared constructable sheet
      const root = this.renderRoot;
      if (root instanceof ShadowRoot) {
        const current = root.adoptedStyleSheets || [];
        if (!current.includes(result)) {
          root.adoptedStyleSheets = [result, ...current];
        }
      }
      return;
    }

    // Fallback path (older Safari, etc.): inject a <style> once per component instance
    if (!this.#twInjected) {
      const style = document.createElement('style');
      style.textContent = result; // the CSS text
      this.renderRoot.prepend(style);
      this.#twInjected = true;
    }
  }
}