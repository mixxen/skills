// Runs fn after the browser has painted the current frame.
export function scheduleAfterRender(fn: () => void): () => void {
  let id = requestAnimationFrame(() => {
    id = window.setTimeout(fn, 0);
  });
  return () => { cancelAnimationFrame(id); clearTimeout(id); };
}
