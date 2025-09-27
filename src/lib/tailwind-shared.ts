// tailwind-shared.js (ES module, no bundler)
export const tailwindSheetReady = (async () => {
    // Constructable stylesheets are widely supported (Chrome/Edge/Firefox/Safari 17+)
    const supportsConstructable =
      'adoptedStyleSheets' in Document.prototype &&
      'replaceSync' in CSSStyleSheet.prototype;
  
    const url = new URL('./dist/output.css', import.meta.url);
    const res = await fetch(url);
    const cssText = await res.text();
  
    if (supportsConstructable) {
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(cssText);
      return sheet; // shared, reuse in all components
    }
  
    // Fallback: return the raw CSS so components can <style> inject it
    return cssText;
})();