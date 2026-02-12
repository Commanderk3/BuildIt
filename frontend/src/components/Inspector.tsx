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

          {/* PADDING */}
          <div style={{ marginTop: 16 }}>
            <label style={{ display: "block", fontSize: 12, marginBottom: 4 }}>
              Padding
            </label>
            <input
              type="text"
              placeholder="20px"
              style={{ width: "100%", padding: "4px 8px" }}
              onChange={(e) => updateStyle("padding", e.target.value)}
            />
          </div>

          {/* BACKGROUND */}
          <div style={{ marginTop: 16 }}>
            <label style={{ display: "block", fontSize: 12, marginBottom: 4 }}>
              Background
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="color"
                onChange={(e) => updateStyle("backgroundColor", e.target.value)}
              />
              <span style={{ fontSize: 12, color: "#666" }}>
                Click to change
              </span>
            </div>
          </div>

          {/* TEXT COLOR */}
          <div style={{ marginTop: 16 }}>
            <label style={{ display: "block", fontSize: 12, marginBottom: 4 }}>
              Text color
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="color"
                onChange={(e) => updateStyle("color", e.target.value)}
              />
              <span style={{ fontSize: 12, color: "#666" }}>
                Click to change
              </span>
            </div>
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