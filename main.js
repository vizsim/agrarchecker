

// 📦 Geocoder & Styles
import { setupPhotonGeocoder } from './js/utils/geocoder.js';
import { paintStyles, getCircleColorPaint } from './js/styleConfig.js';

// 📦 Kartenfunktionen
import { addSources } from "./js/mapdata/addSources.js";
// import { loadAllIcons } from "./loadAllIcons.js";
import { addLayers } from "./js/mapdata/addLayers.js";
import { addBasemapTerrain } from "./js/map/basemapTerrain.js";

// // 📦 UI & Interaktion
import { setupMapPanel } from './js/ui/setupMapPanel.js';
import { setupLayerToggles } from './js/ui/setupLayerToggles.js';
import { setupCropFilter } from './js/ui/cropFilter.js';
import { setupCropAnalysis } from './js/ui/cropAnalysis.js';
// import { setupScenarioControls } from './js/ui/setupScenarioControls.js';
import { updateVisibleFeatureCount } from './js/ui/featureCounter.js';

// import { applyZoomLock } from './js/utils/zoomLock.js';

// 📦 Popups
import {

  setupAgrarVectorPopups,
  // setupAccidentPopups,
  // setupAccClusterPopups,
  // setupMovebisPopups,
  // setupHVSPopups,
  // setupMaxspeedPopups,
  // setupUspeedPopups,
  // setupOBSPopups,
  // setupLaerm1Popups,
  // setupLaerm2Popups,
  // setupSchoolsPopups,
  // setupHealthPopups,
  // setupPlaygroundsPopups,

} from './js/ui/popupHandlers.js';

// 📦 Legende
import {
  applyLegendVisibility,
  setupLegendToggleHandlers,
  // setupLegendSectionCheckboxes
} from './js/ui/legendHandlers.js';

// // 📦 Permalink
// import {
//   Permalink,
//   // applyPermalink,
//   updatePermalink,
//   cleanupLegacyPermalink,
//   // encodeList, beteiligungMap, yearMap,
//   setupPermalinkHandling
// } from './js/utils/permalink.js';

// import { setupPermalinkHandling } from './js/utils/permalink.js';


// 📦 Sonstiges
// import { setupPieChartImageGeneration } from './js/utils/generatePieIcon.js';
import { setupMapillary } from "./js/utils/useMapillary.js";



let MAPILLARY_TOKEN = '';

let originalMinZoom = 6;
let originalMaxZoom = 20;

let currentZoomLock = null;

const isInitializingRef = { value: true }; // für Permalink-Module etc.

const isLocalhost = location.hostname === "localhost";

export const LAYERS = {
  accidents: ["accident-points"],
  symbols: ["beteiligung-symbols"],
  clusters: ["pie-clusters-fine-layer", "pie-clusters-coarse-layer"]
};




(async () => {
  try {
    // handle the config import based on the environment  for the api keys
    const config = await import(isLocalhost ? './js/config/config.js' : './js/config/config.public.js');
    ({ MAPILLARY_TOKEN } = config);
    console.log(`🔑 ${isLocalhost ? "Lokale config.js" : "config.public.js"} geladen`);

    // cleanupLegacyPermalink();

    initMap();

  } catch (err) {
    console.error("❌ Konfig konnte nicht geladen werden:", err);
  }
})();



async function initMap() {
  /// somehow this is needed to load the pmtiles protocol
  const pmtilesBaseURL = "https://f003.backblazeb2.com/file/unfallkarte-data/";
  const protocol = new pmtiles.Protocol(name => `${pmtilesBaseURL}${name}`);
  maplibregl.addProtocol("pmtiles", protocol.tile);


  window.map = new maplibregl.Map({
    container: "map",
    // Keyless Basemap: gehosteter OpenFreeMap-Positron-Style (Tiles+Sprite+Glyphs)
    style: "https://tiles.openfreemap.org/styles/positron",
    center: [13.634, 52.315], // Default center
    zoom: 12,                 // Default zoom
    minZoom: 6,
    maxZoom: 20
  });

  // const map = await createBaseMap();                // 1. Karte erzeugen


  /// load MAP
  map.on("load", () => {

    initializeMapModules(map);               // 2. Module initialisieren

    // addLayers(map); 

    setupMapillary(map, { originalMinZoom, setCurrentZoomLock: z => currentZoomLock = z, applyLegendVisibility });

    //    map.setLayoutProperty("mapillary-images-layer", "visibility", "visible");
    // map.setLayoutProperty("mapillary-images-halo", "visibility", "visible");

    setupUI(map);                                     // 3. UI & Layer-Toggles
    // setupScenarioControls(map);
    // setupLegend(map);                          // 4. Legende initialisieren 

    // setupMapillary(map, { originalMinZoom, setCurrentZoomLock: z => currentZoomLock = z, applyLegendVisibility });


    setupPopups(map);                          // 5. Popups initialisieren

    // setupAgrarLayerSlider(map);
    setupAgrarLayerSlider(map, [2019, 2020, 2021, 2022]);
    setupCropFilter(map, [2019, 2020, 2021, 2022]);
    setupCropAnalysis(map, [2019, 2020, 2021, 2022]);

    //map.once("load", updateLegendVisibilityByZoom);
    //updateLegendVisibilityByZoom();

    // // setupPermalinkHandling(map); // 6. Permalink-Handling initialisieren
    // setupPermalinkHandling(map, {
    //   paintStyles,
    //   updateLayerFilter,
    //   updateVisibleFeatureCount: () => updateVisibleFeatureCount(map, currentZoomLock, LAYERS, paintStyles),
    //   isInitializingRef
    // });


    setupEventHandlers(map);                          // 8. moveend / zoomend etc.

  });

}





//////////////////////// some funcions ////////////////

// function setupAgrarLayerSlider(map, years) {
//   const slider = document.getElementById("agrar-layer-slider");

//   // Initialzustand: zeige das erste Jahr
//   const initialYear = years[0];
//   years.forEach(year => {
//     const visibility = year === initialYear ? "visible" : "none";
//     map.setLayoutProperty(`agrar_vector_${year}`, "visibility", visibility);
//     map.setLayoutProperty(`agrar_raster_${year}`, "visibility", visibility);
//   });

//     const yearDisplay = document.getElementById("agrar-layer-year");
// yearDisplay.textContent = slider.value;



//   // Reagiere auf Slider-Änderungen
// slider.addEventListener("input", () => {
//   const selectedYear = slider.value;
//   yearDisplay.textContent = selectedYear;

//   years.forEach(year => {
//     const visibility = year === selectedYear ? "visible" : "none";
//     map.setLayoutProperty(`agrar_vector_${year}`, "visibility", visibility);
//     map.setLayoutProperty(`agrar_raster_${year}`, "visibility", visibility);
//   });
// });

// }


function setupAgrarLayerSlider(map) {
  const slider = document.getElementById("agrar-layer-slider");
  const yearDisplay = document.getElementById("agrar-layer-year");

  // initial state
  map.setLayoutProperty("agrar_vector_2019", "visibility", "visible");
  map.setLayoutProperty("agrar_raster_2019", "visibility", "visible");
  map.setLayoutProperty("agrar_vector_2020", "visibility", "none");
  map.setLayoutProperty("agrar_raster_2020", "visibility", "none");
  map.setLayoutProperty("agrar_vector_2021", "visibility", "none");
  map.setLayoutProperty("agrar_raster_2021", "visibility", "none");
  map.setLayoutProperty("agrar_vector_2022", "visibility", "none");
  map.setLayoutProperty("agrar_raster_2022", "visibility", "none");




  slider.addEventListener("input", () => {
    const year = slider.value;
    // Initial Anzeige
    yearDisplay.textContent = slider.value;

    map.setLayoutProperty("agrar_vector_2019", "visibility", year === "2019" ? "visible" : "none");
    map.setLayoutProperty("agrar_raster_2019", "visibility", year === "2019" ? "visible" : "none");
    map.setLayoutProperty("agrar_vector_2020", "visibility", year === "2020" ? "visible" : "none");
    map.setLayoutProperty("agrar_raster_2020", "visibility", year === "2020" ? "visible" : "none");
    map.setLayoutProperty("agrar_vector_2021", "visibility", year === "2021" ? "visible" : "none");
    map.setLayoutProperty("agrar_raster_2021", "visibility", year === "2021" ? "visible" : "none");
    map.setLayoutProperty("agrar_vector_2022", "visibility", year === "2022" ? "visible" : "none");
    map.setLayoutProperty("agrar_raster_2022", "visibility", year === "2022" ? "visible" : "none");

  });
}


function getSelectedCheckboxValues(group) {
  return Array.from(document.querySelectorAll(`input[data-group="${group}"]:checked`))
    .map(cb => parseInt(cb.value));
}

function getSelectedBeteiligungen() {
  return Array.from(document.querySelectorAll('input[data-field]:checked'))
    .map(cb => cb.dataset.field);
}

function updateLayerFilter(shouldUpdatePermalink = true, force = false) {
  if (isInitializingRef.value && !force) return;

  const uk_vals = getSelectedCheckboxValues("UKATEGORIE");
  const uart_vals = getSelectedCheckboxValues("UART");
  const utyp_vals = getSelectedCheckboxValues("UTYP1");
  const ujahr_vals = getSelectedCheckboxValues("UJAHR");
  const beteiligungen = getSelectedBeteiligungen();

  // Hauptfilterlogik
  let filter = ["all"];

  filter.push(["in", "UKATEGORIE", ...(uk_vals.length > 0 ? uk_vals : [-1])]);
  filter.push(["in", "UART", ...(uart_vals.length > 0 ? uart_vals : [-1])]);
  filter.push(["in", "UTYP1", ...(utyp_vals.length > 0 ? utyp_vals : [-1])]);
  filter.push(["in", "UJAHR", ...(ujahr_vals.length > 0 ? ujahr_vals : [-1])]);

  const beteiligungExpr = beteiligungen.length > 0
    ? ["any", ...beteiligungen.map(f => ["==", f, 1])]
    : ["==", "UKATEGORIE", -1]; // "unschädlicher" Filter
  filter.push(beteiligungExpr);



  // Filter anwenden
  [...LAYERS.accidents, ...LAYERS.symbols].forEach(layerId => {
    if (map.getLayer(layerId)) map.setFilter(layerId, filter);
  });

  // map.once("idle", updateVisibleFeatureCount);
  map.once("idle", () => updateVisibleFeatureCount(map, currentZoomLock, LAYERS, paintStyles));

  if (shouldUpdatePermalink && !isInitializingRef.value) {
    updatePermalink(map, isInitializingRef);
  }
}










function addNavigationControl(map) {
  const nav = new maplibregl.NavigationControl();

  // ⚠️ Nicht über addControl platzieren:
  const customNavContainer = document.getElementById("custom-nav-control");
  customNavContainer.appendChild(nav.onAdd(map)); // ← MapLibre API-konform

  // Kompass-Reset aktivieren:
  setTimeout(() => {
    const compass = customNavContainer.querySelector('.maplibregl-ctrl-compass');
    if (compass) {
      compass.addEventListener('click', () => {
        map.setPitch(0);
        map.easeTo({ bearing: 0 });
      });
    }
  }, 100);
}



function setupPopups(map) {
  setupAgrarVectorPopups(map);
  // setupAccClusterPopups(map);
  // setupMovebisPopups(map);
  // setupHVSPopups(map);
  // setupMaxspeedPopups(map);
  // setupUspeedPopups(map);
  // setupOBSPopups(map);
  // setupLaerm1Popups(map);
  // setupLaerm2Popups(map);
}

function setupLegend(map) {

  setupLegendToggleHandlers();
  setupLegendSectionCheckboxes(updateLayerFilter);

  updateColorStyle();
  // updateVisibleFeatureCount();
  updateVisibleFeatureCount(map, currentZoomLock, LAYERS, paintStyles);
}


function setupUI(map) {
  setupMapPanel(map);
  setupLegendToggleHandlers(); // großer Pfeil: ganzes Panel ein-/ausklappen
  setupLayerToggles(
    map,
    originalMinZoom,
    z => currentZoomLock = z,
    applyLegendVisibility
  );

  // Ganze Sektions-Überschrift klickbar (nicht nur der Pfeil)
  document.querySelectorAll('.legend-section-title.section-toggle').forEach(title => {
    title.addEventListener('click', () => {
      const section = document.querySelector(`.legend-section[data-section="${title.dataset.sectionId}"]`);
      if (!section) return;
      const arrow = title.querySelector('.section-arrow');
      const collapsed = section.classList.toggle('collapsed');
      if (arrow) arrow.classList.toggle('open', !collapsed);
    });
  });
}


function setupEventHandlers(map) {

  map.on("moveend", () => updateVisibleFeatureCount(map, currentZoomLock, LAYERS, paintStyles));
  map.on("zoomend", () => updateVisibleFeatureCount(map, currentZoomLock, LAYERS, paintStyles));

  applyLegendVisibility();
}



function initializeMapModules(map) {
  setupPhotonGeocoder(map);
  // setupPieChartImageGeneration(map);
  addNavigationControl(map);
  addSources(map, { MAPILLARY_TOKEN });
  addLayers(map);
  addBasemapTerrain(map); // keyless OSM/Esri-Basemaps nach den Datenlayern einfügen
}