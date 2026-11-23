export function scrollAfterUpdate(el: HTMLElement) {
  // store updates late, so give it 50ms before scrolling
  setTimeout(() => el.scrollTo({ top: el.scrollHeight }), 50);
}
