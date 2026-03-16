import chroma from "chroma-js";
import colors from "tailwindcss/colors";

type StyleMap = Record<string, string>;

function tailwindColorToHex(token: string): string | null {
  try {
    const cleanToken = token.split("/")[0];

    const parts = cleanToken.split("-");
    const colorName = parts[0];
    const shade = parts[1] ?? "500";

    if (!colorName) return null;

    const palette = (colors as Record<string, string | Record<string, string>>)[colorName];
    if (!palette) return null;

    let value: string | undefined;

    if (typeof palette === "string") {
      value = palette;
    }
    else {
      value = palette[shade];
    }

    if (!value) return null;

    return chroma(value).hex();

  } catch {
    return null;
  }
}


function resolveTailwindColor(token: string): string | null {
  try {
    const tsColor = token.replace(/^(bg|text|border)-/, "");
    const hex = tsColor ? tailwindColorToHex(tsColor) : null;
    return hex;
  } catch {
    console.error("Color resolution failed");
    return null;
  }
}

function parseTailwind(className?: string): StyleMap {
  if (!className) return {};

  const result: StyleMap = {};
  const classes = className.split(/\s+/);

  for (const c of classes) {
    if (c.startsWith("bg-")) {
      const resolved = resolveTailwindColor(c);
      console.log("resolved", resolved);
      if (resolved) result.backgroundColor = resolved;
    } else if (c.startsWith("text-")) {
      const resolved = resolveTailwindColor(c);
      if (resolved) result.color = resolved;
      console.log("**", resolved);
    } else if (c === "border") {
      result.borderWidth = "1px";
    } else if (/^border-\d+$/.test(c)) {
      const width = c.split("-")[1];
      result.borderWidth = `${width}px`;
    } else if (
      c === "border-solid" ||
      c === "border-dashed" ||
      c === "border-dotted" ||
      c === "border-double" ||
      c === "border-none"
    ) {
      result.borderStyle = c.replace("border-", "");
    } else if (c.startsWith("border-")) {
      const resolved = resolveTailwindColor(c);
      if (resolved) {
        result.borderColor = resolved;
      }
    } else if (/^p-\d/.test(c)) {
      result.padding = c;
    } else if (/^m-\d/.test(c)) {
      result.margin = c;
    }
  }

  return result;
}

function parseInlineStyle(inlineStyle?: string | null): StyleMap {
  if (!inlineStyle) return {};

  const result: StyleMap = {};

  inlineStyle.split(";").forEach((rule) => {
    const [prop, value] = rule.split(":");
    if (!prop || !value) return;

    const camel = prop.trim().replace(/-([a-z])/g, (_, g) => g.toUpperCase());

    result[camel] = value.trim();
  });

  return result;
}

export function getStylesOfNode(
  inlineStyle?: string | null,
  className?: string,
) {
  const tw = parseTailwind(className);
  const inline = parseInlineStyle(inlineStyle);

  return {
    ...tw,
    ...inline, // overwrite
  };
}
