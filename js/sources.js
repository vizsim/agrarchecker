// sources.js — zentrale Liste der Datenquellen (Zenodo-DOIs), die im Popover
// hinter "Thünen-Institut" (oben im Panel) verlinkt werden.
//
// Stand entspricht den aktuell dargestellten Jahren 2019–2022 (Raster v202 +
// Vektor v201). Beim Integrieren neuer Jahre hier ergänzen — DOIs siehe
// docs/thuenen_crop_type_maps_todo.md.

export const SOURCE_CITATION =
  "Schwieder et al. (2024): National-scale crop type maps for Germany from Sentinel-1, Sentinel-2 & Landsat. Thünen-Institut.";

export const SOURCE_LICENSE = "CC BY 4.0";

export const SOURCE_GROUPS = [
  {
    title: "Anbaukarten – Raster (v202)",
    items: [
      { label: "2017–2021", doi: "10.5281/zenodo.10640528" },
      { label: "2022", doi: "10.5281/zenodo.10645427" },
      // 2023: { doi: "10.5281/zenodo.15309479" }, 2024: { doi: "10.5281/zenodo.17122646" }
    ],
  },
  {
    title: "Felder – Vektor (v201)",
    items: [
      { label: "2017–2021", doi: "10.5281/zenodo.10619783" },
      { label: "2022", doi: "10.5281/zenodo.10621629" },
      // 2023: { doi: "10.5281/zenodo.17135735" }
    ],
  },
];
