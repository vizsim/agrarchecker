export function addSources(map, { MAPTILER_API_KEY, MAPILLARY_TOKEN }) {
  // SOURCES

  const pmtilesBaseURL = "https://f003.backblazeb2.com/file/agrarchecker/";
  // const pmtilesBaseURL = "./data/";

  const addPMTilesSource = (id, filename) => {
    if (!map.getSource(id)) {
      map.addSource(id, {
        type: "vector",
        url: `pmtiles://${pmtilesBaseURL}${filename}`
      });
    }
  };


  addPMTilesSource("agrar_vector_2019", "CTM_GER_2019_seg_v201_10-11.pmtiles");
  addPMTilesSource("agrar_vector_2020", "CTM_GER_2020_seg_v201_10-11.pmtiles");
  addPMTilesSource("agrar_vector_2021", "CTM_GER_2021_seg_v201_10-11.pmtiles");
  addPMTilesSource("agrar_vector_2022", "CTM_GER_2022_seg_v201_10-11.pmtiles");


  // addPMTilesSource("agrar_raster_2021", "CTM_GER_2021_rgba_til10.pmtiles");


  map.addSource("agrar_raster_2019", {
    type: "raster",
    url: `pmtiles://${pmtilesBaseURL}CTM_GER_2019_rgba_til10.pmtiles`,
    tileSize: 256
  });
    map.addSource("agrar_raster_2020", {
    type: "raster",
    url: `pmtiles://${pmtilesBaseURL}CTM_GER_2020_rgba_til10.pmtiles`,
    tileSize: 256
  });
  map.addSource("agrar_raster_2021", {
    type: "raster",
    url: `pmtiles://${pmtilesBaseURL}CTM_GER_2021_rgba_til10.pmtiles`,
    tileSize: 256
  });
  map.addSource("agrar_raster_2022", {
    type: "raster",
    url: `pmtiles://${pmtilesBaseURL}CTM_GER_2022_rgba_til10.pmtiles`,
    tileSize: 256
  });





  // Mapillary
  map.addSource("mapillary-images", {
    type: "vector",
    tiles: [
      `https://tiles.mapillary.com/maps/vtp/mly1_public/2/{z}/{x}/{y}?access_token=${MAPILLARY_TOKEN}`
    ],
    minzoom: 14,
    // maxzoom: 14.99
    maxzoom: 14,
  });

  // // Raster: Satellite
  // map.addSource("satellite", {
  //   type: "raster",
  //   tiles: [
  //     `https://api.maptiler.com/tiles/satellite-v2/{z}/{x}/{y}.jpg?key=${MAPTILER_API_KEY}`
  //   ],
  //   tileSize: 256,
  //   attribution: "© MapTiler"
  // });


  // Raster: Satellite ESRI
  map.addSource("satellite", {
    type: "raster",
    tiles: [
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
    ],
    tileSize: 256,
    attribution: "Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community"
  });



// map.addSource("satellite", {
//   type: "raster",
//   tiles: [
//     "https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/Wayback/Image2019_12/MapServer/tile/{z}/{y}/{x}"
//   ],
//   tileSize: 256,
//   attribution: "Esri Wayback Imagery © Esri, Maxar, Earthstar Geographics"
// });

// map.addLayer({
//   id: "wayback-2020",
//   type: "raster",
//   source: "wayback-2020",
// });




  // Raster: Hillshade
  map.addSource("hillshade", {
    type: "raster",
    url: `https://api.maptiler.com/tiles/hillshades/tiles.json?key=${MAPTILER_API_KEY}`,
    tileSize: 256,
    attribution: "© MapTiler"
  });
  // Raster-DEM: Terrain
  map.addSource("terrain", {
    type: "raster-dem",
    url: `https://api.maptiler.com/tiles/terrain-rgb-v2/tiles.json?key=${MAPTILER_API_KEY}`,
    tileSize: 256,
    encoding: "mapbox",
    attribution: "© MapTiler"
  });

  // on-the-fly-GeoJSON: Hover point
  map.addSource("hover-point", {
    type: "geojson",
    data: { type: "FeatureCollection", features: [] }
  });

}
