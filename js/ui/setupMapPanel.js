// setupMapPanel.js — Karten-Panel unten links (Stil aus vizsim/nettobreite):
// Toggle-Button öffnet ein einklappbares Panel mit Basemap-Auswahl
// (Positron / OSM Carto / Esri) und Switches für Geländerelief (3D-Terrain +
// Hillshade) und 3D-Gebäude. Alles keyless (OpenFreeMap + Mapterhorn),
// siehe js/map/basemapTerrain.js.

import { setBasemap, setRelief, setBuildings } from "../map/basemapTerrain.js";

export function setupMapPanel(map) {
  // Panel auf-/zuklappen
  const panel = document.getElementById("map-settings-panel");
  const panelToggle = document.getElementById("map-settings-toggle");
  if (panelToggle && panel) {
    panelToggle.addEventListener("click", () => {
      const collapsed = panel.classList.toggle("is-collapsed");
      panelToggle.setAttribute("aria-expanded", String(!collapsed));
    });
    document.addEventListener("click", (e) => {
      if (!panel.contains(e.target) && !panelToggle.contains(e.target)) {
        panel.classList.add("is-collapsed");
        panelToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Basemap-Umschalter (positron / osm / satellite)
  document.querySelectorAll(".basemap-btn[data-basemap]").forEach((btn) => {
    btn.addEventListener("click", () => {
      setBasemap(map, btn.dataset.basemap);
      document.querySelectorAll(".basemap-btn").forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
    });
  });

  // Geländerelief (3D-Terrain + Hillshade, Mapterhorn)
  const reliefToggle = document.getElementById("toggle-relief");
  if (reliefToggle) {
    reliefToggle.addEventListener("change", (e) => setRelief(map, e.target.checked));
  }

  // 3D-Gebäude (OpenFreeMap)
  const buildingsToggle = document.getElementById("toggle-buildings");
  if (buildingsToggle) {
    buildingsToggle.addEventListener("change", (e) => setBuildings(map, e.target.checked));
  }
}
