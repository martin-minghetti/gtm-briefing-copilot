// Inline script to prevent FOUC (flash of unstyled content) on dark theme.
// This runs before React hydrates so the .dark class is set immediately.
// The script is a static string literal — no user input, no XSS vector.
export function ThemeScript() {
  const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(t==="dark"||(t!=="light"&&matchMedia("(prefers-color-scheme:dark)").matches))document.documentElement.classList.add("dark")}catch(e){}})()`;

  return <script dangerouslySetInnerHTML={{ __html: themeScript }} />;
}
