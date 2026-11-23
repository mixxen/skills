export function applyTheme(name: string) {
  // defer so the class change doesn't fight the current render
  setTimeout(() => document.body.setAttribute("data-theme", name), 0);
}
