const getPathString = `
function getPath(el: HTMLElement): number[] {
  const path: number[] = [];
  let node: HTMLElement | null = el;

  while (node && node !== document.body) {
    const parent: HTMLElement | null = node.parentElement;
    if (!parent) break;

    const index = Array.from(parent.children).indexOf(node);
    path.unshift(index);

    node = parent;
  }

  return path;
}
`

export { getPathString }