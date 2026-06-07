// popupHandlers.js

import { cropTypeTranslation, CROPS } from "../cropTypes.js";

// Schneller Lookup: ctm_majority → Farbe (für den Farbpunkt im Popup)
const colorByCode = Object.fromEntries(CROPS.map((c) => [c.code, c.color]));

export function setupAgrarVectorPopups(map) {
    const popup = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 12,
        className: "agrar-popup",
    });

    const renderAgrarTooltip = (props) => {
        const rawCrop = props.crop_type;
        const translatedCrop = cropTypeTranslation[rawCrop] ?? rawCrop ?? "–";
        const color = colorByCode[props.ctm_majority] ?? "transparent";
        const area = props.area_ha?.toFixed(2) ?? "–";

        return `
        <div class="agrar-popup-card">
          <div class="agrar-popup-head">
            <span class="agrar-popup-swatch" style="background:${color}"></span>
            <span class="agrar-popup-crop">${translatedCrop}</span>
          </div>
          <dl class="agrar-popup-grid">
            <dt>Fläche</dt><dd>${area} ha</dd>
            <dt>CTM-Code</dt><dd>${props.ctm_majority ?? "–"}</dd>
            <dt>Feld-ID</dt><dd>${props.id ?? "–"}</dd>
          </dl>
        </div>`;
    };

    ["agrar_vector_2019", "agrar_vector_2020", "agrar_vector_2021", "agrar_vector_2022"].forEach((layerId) => {
        map.on("mousemove", layerId, (e) => {
            const html = renderAgrarTooltip(e.features[0].properties);
            popup.setLngLat(e.lngLat).setHTML(html).addTo(map);
            map.getCanvas().style.cursor = "pointer";
        });

        map.on("mouseleave", layerId, () => {
            popup.remove();
            map.getCanvas().style.cursor = "";
        });
    });
}
