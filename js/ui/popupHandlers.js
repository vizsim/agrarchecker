
// popupHandlers.js

const cropTypeTranslation = {
    "Permanent grassland": "Dauergrünland",
    "Winter wheat": "Winterweizen",
    "Winter barley": "Wintergerste",
    "Winter rye": "Winterroggen",
    "Spring barley": "Sommergerste",
    "Spring oat": "Sommerhafer",
    "Maize": "Mais",
    "Potato": "Kartoffeln",
    "Sugar beet": "Zuckerrübe",
    "Winter rapeseed": "Winterraps",
    "Sunflower": "Sonnenblumen",
    "Cultivated grassland": "Ackerfutter",
    "Vegetables": "Gartenbauerzeugnisse",
    "Peas": "Erbse",
    "Broad bean": "Ackerbohne",
    "Lupin": "Lupine",
    "Soy": "Soja",
    "Small woody features": "Gehölz",
    "Other agricultural areas": "Sonstige landwirtschaftliche Flächen",
    "Fallow land": "Brachen",
    "Other areas": "Sonstige Flächen",
    "Small woody features on other land": "Gehölz auf sonstigen Flächen",
    "Grapevine": "Rebflächen",
    "Hops": "Hopfen",
    "Orchard": "Plantagen"
};


export function setupAgrarVectorPopups(map) {
    const popup = new maplibregl.Popup({ closeButton: false, closeOnClick: false });

    const renderAgrarTooltip = (props) => {
        const rawCrop = props.crop_type;
        const translatedCrop = cropTypeTranslation[rawCrop] ?? rawCrop ?? "-";

        return `
    <div style="font-size: 12px;">
        <strong>Feld-ID: ${props.id}</strong><br/>
        <table style="border-collapse: collapse;">
            <tr><td><strong>Kulturart</strong></td><td>${translatedCrop}</td></tr>
            <tr><td><strong>CTM-Code</strong></td><td>${props.ctm_majority ?? "-"}</td></tr>
            <tr><td><strong>Fläche</strong></td><td>${props.area_ha?.toFixed(2) ?? "-"} ha</td></tr>
        </table>
    </div>
  `;
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


