//featureCounter.js

export function updateVisibleFeatureCount(map, currentZoomLock, LAYERS, paintStyles) {
  const zoom = map.getZoom();
  let features = [];

  const zoomLockText = currentZoomLock
    ? `<span class="zoom-lock">🔒 ${currentZoomLock}</span>`
    : "";

  const zoomText = `Zoomlevel: ${zoom.toFixed(2)}${zoomLockText ? ` [${zoomLockText}]` : ""}`;


  document.getElementById("feature-count").innerHTML =
     `<div>${zoomText}</div>`;
 }
