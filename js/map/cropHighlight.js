// cropHighlight.js — geteilte Hover-Hervorhebung einer Kulturart auf der Karte.
//
// Wird von der Anbaukulturen-Liste (cropFilter.js) und der Analyse (cropAnalysis.js)
// genutzt: Hover über eine Kulturart → diese bleibt kräftig, alle anderen werden
// abgeblendet. Nur ein setPaintProperty auf dem sichtbaren Jahr-Layer (billig,
// kein Nachladen). Da nur die fill-opacity geändert wird (kein Ausschnitt-/Zoom-/
// Filterwechsel), löst das in cropAnalysis keinen Plot-Neuaufbau aus.

const BASE_OPACITY = 0.5;
const HL_STRONG = 0.9;
const HL_FADE = 0.12;

function activeYear() {
  return document.getElementById("agrar-layer-slider")?.value;
}

export function highlightCrop(map, code) {
  const year = activeYear();
  if (!year) return;
  const id = `agrar_vector_${year}`;
  if (!map.getLayer(id)) return;

  map.setPaintProperty(
    id,
    "fill-opacity",
    code == null
      ? BASE_OPACITY
      : ["case", ["==", ["get", "ctm_majority"], code], HL_STRONG, HL_FADE]
  );
}
