import { useBuild } from "../contexts/BuildContext";

export default function Inspector() {
  const { selected, updateCodeText, updateStyle } = useBuild();

  return (
    <div
      style={{
        width: 260,
        padding: 16,
        borderLeft: "1px solid #ddd",
        fontFamily: "sans-serif",
      }}
    >
      <h3>🎯 Inspector</h3>

      {selected ? (
        <>
          <p>
            <b>{selected.tag}</b>
          </p>
          <p>
            <b>Node:</b> {selected.nodeId}
          </p>

          {/* TEXT */}
          <div style={{ marginTop: 16 }}>
            <label style={{ display: "block", fontSize: 12, marginBottom: 4 }}>
              Text
            </label>
            <input
              type="text"
              placeholder="Edit text"
              style={{ width: "100%", padding: "4px 8px" }}
              onChange={(e) => updateCodeText(e.target.value)}
            />
          </div>

          {/* BACKGROUND COLOR */}
          <div style={{ marginTop: 16 }}>
            <label style={{ display: "block", fontSize: 12, marginBottom: 4 }}>
              Background color
            </label>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type="color"
                value={selected.style.backgroundColor ?? "#000000"}
                style={{ width: "40px", height: "30px" }}
                onChange={(e) => updateStyle("backgroundColor", e.target.value)}
              />
              <input
                type="text"
                value={selected.style.backgroundColor ?? ""}
                readOnly // ← Add this to prevent onChange
                style={{
                  flex: 1,
                  padding: "4px 8px",
                  backgroundColor: "#f5f5f5",
                }}
              />
            </div>
          </div>

          {/* TEXT COLOR */}
          <div style={{ marginTop: 16 }}>
            <label style={{ display: "block", fontSize: 12, marginBottom: 4 }}>
              Color
            </label>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type="color"
                value={selected.style.color ?? ""}
                style={{ width: "40px", height: "30px" }}
                readOnly
                onChange={(e) => updateStyle("color", e.target.value)}
              />
              <input
                type="text"
                value={selected.style.color ?? ""}
                placeholder={selected.style.color}
                style={{ flex: 1, padding: "4px 8px" }}
              />
            </div>
          </div>

          {/* MARGIN */}
          <div style={{ marginTop: 16 }}>
            <label style={{ display: "block", fontSize: 12, marginBottom: 4 }}>
              Margin
            </label>
            <input
              type="text"
              value={selected.style.margin ?? ""}
              style={{ width: "100%", padding: "4px 8px" }}
              onChange={(e) => updateStyle("margin", e.target.value)}
            />
          </div>

          {/* PADDING */}
          <div style={{ marginTop: 16 }}>
            <label style={{ display: "block", fontSize: 12, marginBottom: 4 }}>
              Padding
            </label>
            <input
              type="text"
              value={selected.style.padding ?? ""}
              style={{ width: "100%", padding: "4px 8px" }}
              onChange={(e) => updateStyle("padding", e.target.value)}
            />
          </div>

          {/* BORDER STYLE */}
          <div style={{ marginTop: 16 }}>
            <label style={{ display: "block", fontSize: 12, marginBottom: 4 }}>
              Border style
            </label>
            <select
              style={{ width: "100%", padding: "4px 8px" }}
              onChange={(e) => updateStyle("borderStyle", e.target.value)}
            >
              <option value="">None</option>
              <option value="solid">Solid</option>
              <option value="dashed">Dashed</option>
              <option value="dotted">Dotted</option>
              <option value="double">Double</option>
            </select>
          </div>

          {/* BORDER COLOR */}
          <div style={{ marginTop: 16 }}>
            <label style={{ display: "block", fontSize: 12, marginBottom: 4 }}>
              Border color
            </label>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type="color"
                style={{ width: "40px", height: "30px" }}
                onChange={(e) => updateStyle("borderColor", e.target.value)}
              />
              <input
                type="text"
                style={{ flex: 1, padding: "4px 8px" }}
                onChange={(e) => updateStyle("borderColor", e.target.value)}
              />
            </div>
          </div>

          {/* BORDER WIDTH */}
          <div style={{ marginTop: 16 }}>
            <label style={{ display: "block", fontSize: 12, marginBottom: 4 }}>
              Border width
            </label>
            <select
              style={{ width: "100%", padding: "4px 8px" }}
              value={
                String(selected.style.borderWidth || "").replace("px", "") ||
                "1"
              }
              onChange={(e) =>
                updateStyle("borderWidth", `${e.target.value}px`)
              }
            >
              <option value="0">None</option>
              <option value="1">1px</option>
              <option value="2">2px</option>
              <option value="4">4px</option>
              <option value="8">8px</option>
            </select>
          </div>
        </>
      ) : (
        <p style={{ color: "#666", fontSize: 14 }}>
          Click an element in the preview to edit
        </p>
      )}
    </div>
  );
}
