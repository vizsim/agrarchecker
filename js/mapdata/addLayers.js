
export function addLayers(map) {

  // LAYERS – ggf. aufräumen/splitten später (siehe vorherige Ideen)



  // // add VECTOR layers 
  // function addAgarVector2021Layers(map) {
  //   // Polygon Layer: zoom 14+
  //   map.addLayer({
  //     id: "agrar_vector_2021",
  //     type: "fill",
  //     source: "agrar_vector_2021",
  //     "source-layer": "poly",
  //     // filter: ["==", ["geometry-type"], "Polygon"],
  //     filter: ["all"],
  //     minzoom: 10,
  //     layout: {
  //       visibility: "none"
  //     },
  //     paint: {
  //       "fill-color": [
  //         "match",
  //         ["get", "ctm_majority"],

  //         200, "rgba(105, 194, 41, 1)",       // Dauergrünland
  //         1101, "rgba(251, 251, 22, 1)",      // Winterweizen
  //         1102, "rgba(228, 206, 63, 1)",      // Wintergerste
  //         1103, "rgba(234, 127, 18, 1)",      // Winterroggen
  //         1201, "rgba(194, 75, 45, 1)",       // Sommergerste
  //         1202, "rgba(180, 23, 23, 1)",       // Sommerhafer
  //         1300, "rgba(55, 237, 216, 1)",      // Mais
  //         1401, "rgba(195, 125, 238, 1)",     // Kartoffeln
  //         1402, "rgba(154, 12, 238, 1)",      // Zuckerrübe
  //         1501, "rgba(238, 67, 156, 1)",      // Winterraps
  //         1502, "rgba(227, 0, 247, 1)",       // Sonnenblumen
  //         1602, "rgba(145, 255, 0, 1)",       // Ackerfutter
  //         1603, "rgba(251, 33, 17, 1)",       // Gartenbauerzeugnisse
  //         1611, "rgba(94, 176, 132, 1)",      // Erbse
  //         1612, "rgba(91, 240, 158, 1)",      // Ackerbohne
  //         1613, "rgba(157, 245, 163, 1)",     // Lupine
  //         1614, "rgba(212, 237, 177, 1)",     // Soja
  //         3001, "rgba(5, 131, 5, 1)",         // Gehölz
  //         3002, "rgba(212, 212, 212, 1)",     // Sonstige landw. Flächen
  //         3003, "rgba(178, 206, 68, 1)",      // Brachen
  //         3004, "rgba(111, 111, 111, 1)",     // Sonstige Flächen
  //         4001, "rgba(130, 128, 186, 1)",     // Rebflaechen
  //         4002, "rgba(74, 20, 134, 1)",       // Hopfen
  //         4003, "rgba(106, 81, 163, 1)",      // Plantagen

  //         "rgba(0, 0, 0, 0)" // fallback = transparent
  //       ],
  //       "fill-opacity": 0.5,
  //       "fill-outline-color": "#1B4D3E"
  //     }

  //   });

  // }


  // function addAgarVector2022Layers(map) {
  //   // Polygon Layer: zoom 14+
  //   map.addLayer({
  //     id: "agrar_vector_2022",
  //     type: "fill",
  //     source: "agrar_vector_2022",
  //     "source-layer": "poly",
  //     // filter: ["==", ["geometry-type"], "Polygon"],
  //     filter: ["all"],
  //     minzoom: 10,
  //     layout: {
  //       visibility: "none"
  //     },
  //     paint: {
  //       "fill-color": [
  //         "match",
  //         ["get", "ctm_majority"],

  //         200, "rgba(105, 194, 41, 1)",       // Dauergrünland
  //         1101, "rgba(251, 251, 22, 1)",      // Winterweizen
  //         1102, "rgba(228, 206, 63, 1)",      // Wintergerste
  //         1103, "rgba(234, 127, 18, 1)",      // Winterroggen
  //         1201, "rgba(194, 75, 45, 1)",       // Sommergerste
  //         1202, "rgba(180, 23, 23, 1)",       // Sommerhafer
  //         1300, "rgba(55, 237, 216, 1)",      // Mais
  //         1401, "rgba(195, 125, 238, 1)",     // Kartoffeln
  //         1402, "rgba(154, 12, 238, 1)",      // Zuckerrübe
  //         1501, "rgba(238, 67, 156, 1)",      // Winterraps
  //         1502, "rgba(227, 0, 247, 1)",       // Sonnenblumen
  //         1602, "rgba(145, 255, 0, 1)",       // Ackerfutter
  //         1603, "rgba(251, 33, 17, 1)",       // Gartenbauerzeugnisse
  //         1611, "rgba(94, 176, 132, 1)",      // Erbse
  //         1612, "rgba(91, 240, 158, 1)",      // Ackerbohne
  //         1613, "rgba(157, 245, 163, 1)",     // Lupine
  //         1614, "rgba(212, 237, 177, 1)",     // Soja
  //         3001, "rgba(5, 131, 5, 1)",         // Gehölz
  //         3002, "rgba(212, 212, 212, 1)",     // Sonstige landw. Flächen
  //         3003, "rgba(178, 206, 68, 1)",      // Brachen
  //         3004, "rgba(111, 111, 111, 1)",     // Sonstige Flächen
  //         4001, "rgba(130, 128, 186, 1)",     // Rebflaechen
  //         4002, "rgba(74, 20, 134, 1)",       // Hopfen
  //         4003, "rgba(106, 81, 163, 1)",      // Plantagen

  //         "rgba(0, 0, 0, 0)" // fallback = transparent
  //       ],
  //       "fill-opacity": 0.5,
  //       "fill-outline-color": "#1B4D3E"
  //     }

  //   });

  // }

function addAgrarVectorLayer(map, year) {
  map.addLayer({
    id: `agrar_vector_${year}`,
    type: "fill",
    source: `agrar_vector_${year}`,
    "source-layer": "poly",
    filter: ["all"],
    minzoom: 10,
    layout: {
      visibility: "none"
    },
    paint: {
      "fill-color": [
        "match",
        ["get", "ctm_majority"],

        200, "rgba(105, 194, 41, 1)",       // Dauergrünland
        1101, "rgba(251, 251, 22, 1)",      // Winterweizen
        1102, "rgba(228, 206, 63, 1)",      // Wintergerste
        1103, "rgba(234, 127, 18, 1)",      // Winterroggen
        1201, "rgba(194, 75, 45, 1)",       // Sommergerste
        1202, "rgba(180, 23, 23, 1)",       // Sommerhafer
        1300, "rgba(55, 237, 216, 1)",      // Mais
        1401, "rgba(195, 125, 238, 1)",     // Kartoffeln
        1402, "rgba(154, 12, 238, 1)",      // Zuckerrübe
        1501, "rgba(238, 67, 156, 1)",      // Winterraps
        1502, "rgba(227, 0, 247, 1)",       // Sonnenblumen
        1602, "rgba(145, 255, 0, 1)",       // Ackerfutter
        1603, "rgba(251, 33, 17, 1)",       // Gartenbauerzeugnisse
        1611, "rgba(94, 176, 132, 1)",      // Erbse
        1612, "rgba(91, 240, 158, 1)",      // Ackerbohne
        1613, "rgba(157, 245, 163, 1)",     // Lupine
        1614, "rgba(212, 237, 177, 1)",     // Soja
        3001, "rgba(5, 131, 5, 1)",         // Gehölz
        3002, "rgba(212, 212, 212, 1)",     // Sonstige landw. Flächen
        3003, "rgba(178, 206, 68, 1)",      // Brachen
        3004, "rgba(111, 111, 111, 1)",     // Sonstige Flächen
        4001, "rgba(130, 128, 186, 1)",     // Rebflaechen
        4002, "rgba(74, 20, 134, 1)",       // Hopfen
        4003, "rgba(106, 81, 163, 1)",      // Plantagen

        "rgba(0, 0, 0, 0)" // fallback = transparent
      ],
      "fill-opacity": 0.5,
      "fill-outline-color": "#1B4D3E"
    }
  });
}








// AGRAR RASTER LAYER

  // function addAgarRaster2021Layer(map) {
  //   map.addLayer({
  //     id: "agrar_raster_2021",
  //     type: "raster",
  //     source: "agrar_raster_2021",
  //     minzoom: 5,
  //     maxzoom: 10,
  //     layout: {
  //       visibility: "none"
  //     },
  //     paint: {
  //       "raster-opacity": 0.5
  //     }
  //   });
  // }

  //   function addAgarRaster2022Layer(map) {
  //   map.addLayer({
  //     id: "agrar_raster_2022",
  //     type: "raster",
  //     source: "agrar_raster_2022",
  //     minzoom: 5,
  //     maxzoom: 10,
  //     layout: {
  //       visibility: "none"
  //     },
  //     paint: {
  //       "raster-opacity": 0.5
  //     }
  //   });
  // }

  function addAgrarRasterLayer(map, year) {
  const layerId = `agrar_raster_${year}`;
  const sourceId = `agrar_raster_${year}`;

  map.addLayer({
    id: layerId,
    type: "raster",
    source: sourceId,
    minzoom: 5,
    maxzoom: 10,
    layout: {
      visibility: "none"
    },
    paint: {
      "raster-opacity": 0.5
    }
  });
}









  function addMapillaryLayer(map) {
    // ⬇️ Soft halo for pano
    map.addLayer({
      id: "mapillary-images-halo",
      type: "circle",
      source: "mapillary-images",
      "source-layer": "image",
      minzoom: 14,
      maxzoom: 21,
      layout: {
        visibility: "none"
      },
      filter: ["==", ["to-string", ["get", "is_pano"]], "true"],
      paint: {
        "circle-color": "#0077ff",
        "circle-radius": [
          "interpolate", ["linear"], ["zoom"],
          14, 6,
          15, 8,
          17, 10
        ],
        "circle-opacity": 0.3
      }
    });

    // ⬆️ Main circle on top
    map.addLayer({
      id: "mapillary-images-layer",
      type: "circle",
      source: "mapillary-images",
      "source-layer": "image",
      minzoom: 14,
      maxzoom: 21,
      layout: {
        visibility: "none"
      },
      paint: {
        "circle-color": [
          "match",
          ["to-string", ["get", "is_pano"]],
          "true", "#0077ff",
          "false", "#00b955",
          "#999999"
        ],
        "circle-radius": [
          "interpolate", ["linear"], ["zoom"],
          14, 3,
          16, 4,
          17, 5
        ]
      }
    });
  }


  function addRasterLayers(map) {
    // Satellite layer (optional: insert below a specific layer)
    map.addLayer({
      id: "satellite-layer",
      type: "raster",
      source: "satellite",
      layout: { visibility: "none" }
    }, "agrar_vector_2019"); // insert below accident points layer

    // Hillshade layer
    map.addLayer({
      id: "hillshade-layer",
      type: "raster",
      source: "hillshade",
      layout: { visibility: "none" }, // initial hidden
      paint: {
        "raster-opacity": 0.3
      }
    });

    // Disable terrain initially (can be enabled dynamically)
    map.setTerrain(null);
  }






  // change the map order


  // addSchoolsLayer(map);
  // addHealthLayer(map);
  // addPlaygroundsLayer(map);


  // addAccidentLayersToMap(map);
  // addAccidentClusterLayers(map);

  // addScenario1Layers(map);
  // addScenario2Layers(map);
  // addScenario3Layers(map);
  // addScenario4Layers(map);
  // addScenario5Layers(map);
  // addScenario6Layers(map);
  // addScenario7Layers(map);
  // addScenario8Layers(map);

  // addMaxspeedLayers(map);
  // addMaxspeedMinorLayers(map);
  // addMovebisLayer(map);
  // addOBSLayer(map);
  // addHvsLayer(map);
  // addLaermLayer(map);
  // addUspeedLayer(map);


[2019, 2020, 2021, 2022].forEach(year => {
  addAgrarVectorLayer(map, year);
});

[2019, 2020, 2021, 2022].forEach(year => {
  addAgrarRasterLayer(map, year);
});

  // addAgarVector2021Layers(map);
  // addAgarVector2022Layers(map);



  // addAgarRaster2021Layer(map);
  // addAgarRaster2022Layer(map);

  addMapillaryLayer(map);

  addRasterLayers(map);

}