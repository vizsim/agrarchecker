
// setupLayerToggles.js

// export function setupLayerToggles(map, applyZoomLock, applyLegendVisibility) {



import { applyZoomLock } from "../utils/zoomLock.js";



export function setupToggle(map, checkboxId, layerIds, applyZoomLock, applyLegendVisibility) {
  const checkbox = document.getElementById(checkboxId);
  if (!checkbox) return;

  checkbox.addEventListener("change", (e) => {
    const visibility = e.target.checked ? "visible" : "none";

    layerIds.forEach(layerId => {
      if (map.getLayer(layerId)) {
        map.setLayoutProperty(layerId, "visibility", visibility);
      }
    });

    applyZoomLock();
    applyLegendVisibility();
  });
}



export function setupLayerToggles(map, originalMinZoom, setCurrentZoomLock, applyLegendVisibility) {
  const zoomLock = () => applyZoomLock(map, originalMinZoom, setCurrentZoomLock);


  // Einfachere Handhabung der Layer


  //  setupToggle(map, "toggle-agrar_2019", ["agrar_vector_2019","agrar_raster_2019"], zoomLock, applyLegendVisibility);
  //  setupToggle(map, "toggle-agrar_2020", ["agrar_vector_2020","agrar_raster_2020"], zoomLock, applyLegendVisibility);

  //  setupToggle(map, "toggle-agrar_2021", ["agrar_vector_2021","agrar_raster_2021"], zoomLock, applyLegendVisibility);
  //  setupToggle(map, "toggle-agrar_2022", ["agrar_vector_2022","agrar_raster_2022"], zoomLock, applyLegendVisibility);







}
