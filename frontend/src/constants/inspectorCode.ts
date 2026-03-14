const inspectorCode = `
let hoveredEl: HTMLElement | null = null;

document.addEventListener("mousemove", (e) => {
  const target = e.target;
  if (!(target instanceof HTMLElement)) return;

  const el = target.closest("[data-node-id]") as HTMLElement | null;
  if (!el) return;

  if (hoveredEl === el) return;

  if (hoveredEl) hoveredEl.style.outline = "";

  el.style.outline = "2px solid #3b82f6";
  el.style.outlineOffset = "-2px";

  hoveredEl = el;
});

document.addEventListener("mouseleave", () => {
  if (hoveredEl) {
    hoveredEl.style.outline = "";
    hoveredEl = null;
  }
});

document.addEventListener("click", (e) => {
  const target = e.target;
  if (!(target instanceof HTMLElement)) return;

  const el = target.closest("[data-node-id]");
  if (!el) return;

  const nodeId = el.getAttribute("data-node-id");
  if (!nodeId) return;

  window.parent.postMessage(
    {
      type: "ELEMENT_SELECTED",
      payload: {
        tag: el.tagName,
        nodeId,
        className: el.className,
        inlineStyle: el.getAttribute("style"),
      },
    },
    "*"
  );
});
`

export { inspectorCode }