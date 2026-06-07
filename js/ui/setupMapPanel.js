// setupMapPanel.js — Karten-Panel unten links (Stil aus vizsim/nettobreite):
// Toggle-Button öffnet ein einklappbares Panel mit Basemap-Auswahl (Standard /
// Satellit) und iOS-Style-Switches für Terrain (3D) und Hillshade.
//
// Ersetzt die alten #basemap-thumbnails / #terrain-controls und die inline an
// #toggleTerrain / #toggleHillshade gehängten Handler.

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

  // Basemap-Umschalter (Standard = Positron-Vektor, Satellit = Esri-Raster)
  document.querySelectorAll(".basemap-btn[data-basemap]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const isSatellite = btn.dataset.basemap === "satellite";
      if (map.getLayer("satellite-layer")) {
        map.setLayoutProperty("satellite-layer", "visibility", isSatellite ? "visible" : "none");
      }
      document.querySelectorAll(".basemap-btn").forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
    });
  });

  // Terrain (3D-Überhöhung)
  const terrainToggle = document.getElementById("toggleTerrain");
  if (terrainToggle) {
    terrainToggle.addEventListener("change", (e) => {
      map.setTerrain(e.target.checked ? { source: "terrain", exaggeration: 1.5 } : null);
    });
  }

  // Hillshade-Layer
  const hillshadeToggle = document.getElementById("toggleHillshade");
  if (hillshadeToggle) {
    hillshadeToggle.addEventListener("change", (e) => {
      if (map.getLayer("hillshade-layer")) {
        map.setLayoutProperty("hillshade-layer", "visibility", e.target.checked ? "visible" : "none");
      }
    });
  }
}
