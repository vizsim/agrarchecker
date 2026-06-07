// cropHighlight.js — geteilte Hover-Hervorhebung einer Kulturart auf der Karte.
//
// Wird von der Anbaukulturen-Liste (cropFilter.js) und der Analyse (cropAnalysis.js)
// genutzt: Hover über eine Kulturart → diese bleibt kräftig, alle anderen werden
// abgeblendet. Nur ein setPaintProperty auf dem sichtbaren Jahr-Layer (billig,
// kein Nachladen).
//
// `isCropHighlightBusy()` ist kurz nach jeder Highlight-Änderung true, damit der
// dadurch ausgelöste Karten-Repaint (→ "idle") in cropAnalysis NICHT zu einem
// Plot-Neuaufbau führt (das würde sonst mouseenter neu feuern → Endlosschleife).

const BASE_OPACITY = 0.5;
const HL_STRONG = 0.9;
const HL_FADE = 0.12;

let busy = false;
let busyTimer = null;

function activeYear() {
  return document.getElementById("agrar-layer-slider")?.value;
}

export function highlightCrop(map, code) {
  const year = activeYear();
  if (!year) return;
  const id = `agrar_vector_${year}`;
  if (!map.getLayer(id)) return;

  busy = true;
  if (busyTimer) clearTimeout(busyTimer);
  busyTimer = setTimeout(() => { busy = false; }, 250);

  map.setPaintProperty(
    id,
    "fill-opacity",
    code == null
      ? BASE_OPACITY
      : ["case", ["==", ["get", "ctm_majority"], code], HL_STRONG, HL_FADE]
  );
}

export function isCropHighlightBusy() {
  return busy;
}
