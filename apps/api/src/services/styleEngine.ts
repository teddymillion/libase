// Color harmony rules — maps each color to colors it pairs well with
const COLOR_HARMONY: Record<string, string[]> = {
  black:  ["white", "grey", "red", "yellow", "pink", "orange", "purple", "beige", "navy", "green", "blue"],
  white:  ["black", "navy", "grey", "brown", "beige", "red", "green", "blue", "pink", "orange"],
  grey:   ["black", "white", "navy", "pink", "purple", "red", "yellow"],
  navy:   ["white", "grey", "beige", "brown", "yellow", "orange", "red"],
  brown:  ["white", "beige", "navy", "green", "orange", "yellow"],
  beige:  ["brown", "white", "navy", "black", "green", "orange"],
  red:    ["black", "white", "grey", "navy", "beige"],
  green:  ["white", "beige", "brown", "navy", "black", "yellow"],
  blue:   ["white", "grey", "beige", "brown", "navy", "black"],
  yellow: ["black", "navy", "grey", "brown", "white"],
  pink:   ["black", "white", "grey", "navy", "beige"],
  orange: ["black", "white", "navy", "brown", "beige"],
  purple: ["black", "white", "grey", "beige"],
};

// Style compatibility — which styles work together
const STYLE_COMPAT: Record<string, string[]> = {
  casual:       ["casual", "streetwear", "sporty"],
  formal:       ["formal"],
  traditional:  ["traditional", "formal"],
  sporty:       ["sporty", "casual"],
  streetwear:   ["streetwear", "casual"],
};

export function colorsMatch(colorsA: string[], colorsB: string[]): boolean {
  // Same color family always works
  if (colorsA.some((c) => colorsB.includes(c))) return true;
  // Check harmony map
  return colorsA.some((a) =>
    (COLOR_HARMONY[a] || []).some((harmonic) => colorsB.includes(harmonic))
  );
}

export function stylesMatch(styleA: string, styleB: string): boolean {
  return (STYLE_COMPAT[styleA] || []).includes(styleB);
}

export function getOutfitVibeLabel(styles: string[], colors: string[]): string {
  const hasBlackWhite = colors.some((c) => ["black", "white"].includes(c));
  const hasBold       = colors.some((c) => ["red", "orange", "yellow"].includes(c));
  const isForml       = styles.includes("formal") || styles.includes("traditional");
  const isSporty      = styles.includes("sporty");
  const isStreet      = styles.includes("streetwear");

  if (isForml)       return "Sharp and polished 🔥";
  if (isSporty)      return "Ready to move 💪";
  if (isStreet)      return "Streets are yours 🧢";
  if (hasBold)       return "Bold and confident ⚡";
  if (hasBlackWhite) return "Clean and timeless 🖤";
  return "Looking fresh ✨";
}
