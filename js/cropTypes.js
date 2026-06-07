// cropTypes.js — zentrale Quelle der Wahrheit für die Anbaukulturen (CTM).
//
// Aus dieser Definition werden generiert:
//   1. die Karten-Einfärbung (fill-color match-Expression)  → js/mapdata/addLayers.js
//   2. die Legende / der Filter im rechten Panel             → js/ui/cropFilter.js
//   3. die Popup-Übersetzung (EN → DE)                       → js/ui/popupHandlers.js
//
// Farben entsprechen exakt der bisherigen Thünen-CTM-Legende.
// `code` = ctm_majority, `en` = crop_type (Originalfeld für Popups).

export const CROP_GROUPS = [
  {
    title: "Getreide & Mais",
    crops: [
      { code: 1101, label: "Winterweizen",  en: "Winter wheat",   color: "rgb(251,251,22)" },
      { code: 1102, label: "Wintergerste",  en: "Winter barley",  color: "rgb(228,206,63)" },
      { code: 1103, label: "Winterroggen",  en: "Winter rye",     color: "rgb(234,127,18)" },
      { code: 1201, label: "Sommergerste",  en: "Spring barley",  color: "rgb(194,75,45)" },
      { code: 1202, label: "Sommerhafer",   en: "Spring oat",     color: "rgb(180,23,23)" },
      { code: 1300, label: "Mais",          en: "Maize",          color: "rgb(55,237,216)" },
    ],
  },
  {
    title: "Hackfrüchte",
    crops: [
      { code: 1401, label: "Kartoffeln",    en: "Potato",         color: "rgb(195,125,238)" },
      { code: 1402, label: "Zuckerrübe",    en: "Sugar beet",     color: "rgb(154,12,238)" },
    ],
  },
  {
    title: "Ölfrüchte",
    crops: [
      { code: 1501, label: "Winterraps",    en: "Winter rapeseed", color: "rgb(238,67,156)" },
      { code: 1502, label: "Sonnenblumen",  en: "Sunflower",       color: "rgb(227,0,247)" },
    ],
  },
  {
    title: "Eiweißpflanzen",
    crops: [
      { code: 1611, label: "Erbse",         en: "Peas",            color: "rgb(94,176,132)" },
      { code: 1612, label: "Ackerbohne",    en: "Broad bean",      color: "rgb(91,240,158)" },
      { code: 1613, label: "Lupine",        en: "Lupin",           color: "rgb(157,245,163)" },
      { code: 1614, label: "Soja",          en: "Soy",             color: "rgb(212,237,177)" },
    ],
  },
  {
    title: "Grünland & Futter",
    crops: [
      { code: 200,  label: "Dauergrünland", en: "Permanent grassland",  color: "rgb(105,194,41)" },
      { code: 1602, label: "Ackerfutter",   en: "Cultivated grassland", color: "rgb(145,255,0)" },
    ],
  },
  {
    title: "Dauerkulturen",
    crops: [
      { code: 4001, label: "Rebflächen",    en: "Grapevine",       color: "rgb(130,128,186)" },
      { code: 4002, label: "Hopfen",        en: "Hops",            color: "rgb(74,20,134)" },
      { code: 4003, label: "Plantagen",     en: "Orchard",         color: "rgb(106,81,163)" },
    ],
  },
  {
    title: "Sonstige & Sonderkulturen",
    crops: [
      { code: 1603, label: "Gartenbauerzeugnisse",   en: "Vegetables",                color: "rgb(251,33,17)" },
      { code: 3001, label: "Gehölz",                 en: "Small woody features",      color: "rgb(5,131,5)" },
      { code: 3002, label: "Sonstige landw. Flächen", en: "Other agricultural areas", color: "rgb(212,212,212)" },
      { code: 3003, label: "Brachen",                en: "Fallow land",               color: "rgb(178,206,68)" },
      { code: 3004, label: "Sonstige Flächen",       en: "Other areas",               color: "rgb(111,111,111)" },
    ],
  },
];

// Flache Liste aller Kulturarten (Reihenfolge = Gruppenreihenfolge)
export const CROPS = CROP_GROUPS.flatMap((group) => group.crops);

// fill-color-Expression für die Vektor-Layer: ["match", ["get","ctm_majority"], code, color, …, fallback]
export function getCropFillColorExpression() {
  const expr = ["match", ["get", "ctm_majority"]];
  for (const crop of CROPS) {
    expr.push(crop.code, crop.color);
  }
  expr.push("rgba(0, 0, 0, 0)"); // fallback = transparent
  return expr;
}

// EN → DE Übersetzung für Popups (zusätzliche Synonyme, die nicht als eigene Kategorie geführt werden)
export const cropTypeTranslation = {
  ...Object.fromEntries(CROPS.map((c) => [c.en, c.label])),
  "Small woody features on other land": "Gehölz auf sonstigen Flächen",
};
