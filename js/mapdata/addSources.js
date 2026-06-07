export function addSources(map, { MAPILLARY_TOKEN }) {
  // SOURCES

  const pmtilesBaseURL = "https://f003.backblazeb2.com/file/agrarchecker/";

  const addPMTilesSource = (id, filename) => {
    if (!map.getSource(id)) {
      map.addSource(id, {
        type: "vector",
        url: `pmtiles://${pmtilesBaseURL}${filename}`
      });
    }
  };

  // Agrar-Vektor (Felder, Zoom 10–11)
  addPMTilesSource("agrar_vector_2019", "CTM_GER_2019_seg_v201_10-11.pmtiles");
  addPMTilesSource("agrar_vector_2020", "CTM_GER_2020_seg_v201_10-11.pmtiles");
  addPMTilesSource("agrar_vector_2021", "CTM_GER_2021_seg_v201_10-11.pmtiles");
  addPMTilesSource("agrar_vector_2022", "CTM_GER_2022_seg_v201_10-11.pmtiles");

  // Agrar-Raster (Übersicht, Zoom 5–10)
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
    maxzoom: 14,
  });

  // on-the-fly-GeoJSON: Hover point
  map.addSource("hover-point", {
    type: "geojson",
    data: { type: "FeatureCollection", features: [] }
  });

  // Basemaps (OSM Carto, Esri) und Terrain (Mapterhorn) werden keyless in
  // js/map/basemapTerrain.js angelegt — siehe addBasemaps()/setTerrain3D().
}
