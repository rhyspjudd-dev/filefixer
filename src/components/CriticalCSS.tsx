// Critical CSS that must load immediately to prevent white backgrounds
export default function CriticalCSS() {
  return (
    <style dangerouslySetInnerHTML={{
      __html: `
        /* Critical CSS for immediate loading - only fallbacks, no !important */
        html {
          background-color: #1a1a1a;
          color: #ffffff;
        }
        
        body {
          background-color: var(--background, #1a1a1a);
          color: var(--text, #ffffff);
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        /* Basic CSS variables as fallback only */
        :root {
          --background: #1a1a1a;
          --text: #ffffff;
          --color-turquoise: #40E0D0;
          --color-chartreuse: #7FFF00;
          --color-night: #1a1a1a;
        }
      `
    }} />
  );
}
