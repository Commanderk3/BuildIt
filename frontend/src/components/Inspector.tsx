import { useBuild } from "../contexts/BuildContext";

export default function Inspector() {
  const { selected, updateCodeText, updateStyle } = useBuild();

  return (
    <div className="p-4 border-l border-border/50 font-sans text-foreground bg-background h-full overflow-y-auto">
      <h3 className="font-semibold mb-4">Inspector</h3>

      {selected ? (
        <div className="space-y-4">
          <div>
            <p className="text-sm">
              <span className="font-medium">{selected.tag}</span>
              <span className="text-muted-foreground/60 ml-2 text-xs">
                {selected.nodeId}
              </span>
            </p>
          </div>

          {/* TEXT */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground/80">Text</label>
            <input
              type="text"
              value={selected.text}
              placeholder="Edit text"
              className="w-full px-2 py-1 text-sm bg-background border border-border/50 rounded-md focus:outline-none focus:border-primary/50 focus:ring-0"
              onChange={(e) => updateCodeText(e.target.value)}
            />
          </div>

          {/* BACKGROUND COLOR */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground/80">Background</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={selected.style.backgroundColor ?? "#000000"}
                className="w-8 h-8 rounded border border-border/50"
                onChange={(e) => updateStyle("backgroundColor", e.target.value)}
              />
              <input
                type="text"
                value={selected.style.backgroundColor ?? ""}
                readOnly
                className="flex-1 px-2 py-1 text-sm bg-muted/30 border border-border/50 rounded-md"
              />
            </div>
          </div>

          {/* TEXT COLOR */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground/80">Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={selected.style.color ?? "#000000"}
                className="w-8 h-8 rounded border border-border/50"
                onChange={(e) => updateStyle("color", e.target.value)}
              />
              <input
                type="text"
                value={selected.style.color ?? ""}
                className="flex-1 px-2 py-1 text-sm bg-background border border-border/50 rounded-md"
                onChange={(e) => updateStyle("color", e.target.value)}
              />
            </div>
          </div>

          {/* MARGIN */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground/80">Margin</label>
            <input
              type="text"
              value={selected.style.margin ?? ""}
              className="w-full px-2 py-1 text-sm bg-background border border-border/50 rounded-md"
              onChange={(e) => updateStyle("margin", e.target.value)}
            />
          </div>

          {/* PADDING */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground/80">Padding</label>
            <input
              type="text"
              value={selected.style.padding ?? ""}
              className="w-full px-2 py-1 text-sm bg-background border border-border/50 rounded-md"
              onChange={(e) => updateStyle("padding", e.target.value)}
            />
          </div>

          {/* BORDER */}
          <div className="space-y-3">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground/80">Border style</label>
              <select
                className="w-full px-2 py-1 text-sm bg-background border border-border/50 rounded-md"
                onChange={(e) => updateStyle("borderStyle", e.target.value)}
              >
                <option value="">None</option>
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
                <option value="dotted">Dotted</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground/80">Border color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  className="w-8 h-8 rounded border border-border/50"
                  onChange={(e) => updateStyle("borderColor", e.target.value)}
                />
                <input
                  type="text"
                  className="flex-1 px-2 py-1 text-sm bg-background border border-border/50 rounded-md"
                  onChange={(e) => updateStyle("borderColor", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground/80">Border width</label>
              <select
                className="w-full px-2 py-1 text-sm bg-background border border-border/50 rounded-md"
                value={String(selected.style.borderWidth || "").replace("px", "") || "1"}
                onChange={(e) => updateStyle("borderWidth", `${e.target.value}px`)}
              >
                <option value="0">None</option>
                <option value="1">1px</option>
                <option value="2">2px</option>
                <option value="4">4px</option>
              </select>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground/60">
          Click an element in the preview to edit
        </p>
      )}
    </div>
  );
}