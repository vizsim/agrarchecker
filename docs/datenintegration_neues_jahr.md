# Runbook: neues Jahr integrieren (z. B. 2023, 2024)

Konkrete, kopierbare Schritte, um ein weiteres Thünen-CTM-Jahr in den Agrarchecker
zu bekommen. DOIs/Records stehen in [thuenen_crop_type_maps_todo.md](thuenen_crop_type_maps_todo.md).

> **Status der Pipeline (verifiziert Juni 2026):** Tools vorhanden
> (`tippecanoe`, `gdal`, `rio` im venv `agrarchecker_env/bin`, `b2` v4.7),
> Bucket `agrarchecker` auf Backblaze, ~330 GB frei. Pro Jahr fallen ~30–40 GB
> Zwischendateien an.

---

## 0. Architektur in einem Absatz

Pro Jahr liegen **zwei PMTiles** auf Backblaze
(`https://f003.backblazeb2.com/file/agrarchecker/`), die das Frontend per URL streamt:

| Datei | Zweck | Zoom | Quelle |
|---|---|---|---|
| `CTM_GER_{YEAR}_seg_v201_10-11.pmtiles` | Vektor (Felder, Detail) | 10–11 | Thünen-Vektor **v201** (GPKG/FGB) |
| `CTM_GER_{YEAR}_rgba_til10.pmtiles` | Raster (Übersicht) | 5–10 | Thünen-Raster **v202** (COG) |

Felder im Vektor: `ctm_majority` (CTM-Code), `id`, `crop_type` (EN), `area_ha`.
Klassen/Farben (24 Stück) sind im Frontend zentral in
[`js/cropTypes.js`](../js/cropTypes.js).

**Versions-Konsistenz:** Das Projekt mischt bewusst **Raster v202 + Vektor v201**
(Vektor liegt nur als v201 vor). Für jedes neue Jahr dieselbe Kombination nehmen,
damit der Zeitreihenvergleich stimmt. (2024-Sonderfall: nicht die neue v3xx-Linie
nehmen — siehe Abschnitt 5.)

---

## 1. Vor dem Tiling verifizieren (Hauptrisiken)

```bash
YEAR=2023
cd preprocessing
```

1. **Vektor-Schema** des heruntergeladenen GeoPackage prüfen — Layername, CRS,
   Feldnamen müssen passen:
   ```bash
   ogrinfo -so <download.gpkg>
   # erwartet: CRS EPSG:3035, Felder ctm_majority, id, crop_type, area_ha
   ```
   Weichen Feldnamen ab → in Schritt 3 per `-sql`/`-select` umbenennen.

2. **Klassenliste** des Jahres (`.clr`/`.sld` vom Zenodo-Record) gegen die 24
   bestehenden Klassen abgleichen
   ([CTM_GER_LegendDE_rst_v201.clr](../preprocessing/raster/CTM_GER_LegendDE_rst_v201.clr)).
   Taucht ein **neuer CTM-Code** auf, an **drei** Stellen ergänzen:
   - [`js/cropTypes.js`](../js/cropTypes.js) (Frontend: Karte + Legende + Popup)
   - [`.clr`](../preprocessing/raster/CTM_GER_LegendDE_rst_v201.clr)
   - die `colormap` in [`to_rgba_raster_streaming_fast_tdqm.py`](../preprocessing/raster/to_rgba_raster_streaming_fast_tdqm.py)

   > *Optional sauberer:* diese Farb-Definition aus einer gemeinsamen JSON
   > generieren, statt sie 3× zu pflegen.

---

## 2. Raster-Pipeline (Übersicht, Zoom 5–10)

Quelle = Raster-COG **v202** des Jahres (Zenodo). Befehle aus
[rio_tiles_terminal.txt](../preprocessing/raster/rio_tiles_terminal.txt):

```bash
cd preprocessing/raster
RIO=../../agrarchecker_env/bin/rio   # rio liegt im venv

# 1. COG nach Web-Mercator. ACHTUNG: -r near (Klassen-Raster!), nicht bilinear —
#    bilinear mischt Klassencodes und erzeugt transparente Säume an Feldrändern.
gdalwarp -t_srs EPSG:3857 -r near -co COMPRESS=LZW \
  CTM_GER_${YEAR}_rst_v202_COG.tif CTM_GER_${YEAR}_webmerc.tif

# 2. Intern kacheln (beschleunigt den RGBA-Schritt)
gdal_translate -co TILED=YES -co COMPRESS=LZW \
  CTM_GER_${YEAR}_webmerc.tif CTM_GER_${YEAR}_webmerc_tiled.tif

# 3. Klassencodes → RGBA (Farben aus dem Skript)
python to_rgba_raster_streaming_fast_tdqm.py \
  --input CTM_GER_${YEAR}_webmerc_tiled.tif \
  --output CTM_GER_${YEAR}_rgba.tif

# 4. PMTiles (WEBP, Zoom 5–10)
$RIO pmtiles --format WEBP --zoom-levels 5..10 -j 4 \
  --output CTM_GER_${YEAR}_rgba_til10.pmtiles \
  CTM_GER_${YEAR}_rgba.tif
```

---

## 3. Vektor-Pipeline (Detail, Zoom 10–11)

Quelle = Vektor **v201** des Jahres (GeoPackage, 2023 ~9 GB). Muster:
[prepare_vector.ipynb](../preprocessing/prepare_vector.ipynb).

```bash
cd preprocessing

# 1. Reprojektion EPSG:3035 → EPSG:4326 nach FlatGeobuf
#    (Felder ggf. mit -select ...,neu AS alt umbenennen, falls Schema abweicht)
ogr2ogr -f FlatGeobuf \
  CTM_GER_${YEAR}_seg_v201_4326.fgb \
  <download.gpkg> \
  -s_srs EPSG:3035 -t_srs EPSG:4326

# 2. Tiling nach PMTiles (Zoom 10–11)
tippecanoe \
  -o CTM_GER_${YEAR}_seg_v201_10-11.pmtiles \
  --minimum-zoom=10 --maximum-zoom=11 \
  --drop-rate=0 --drop-densest-as-needed \
  --no-feature-limit --no-tile-size-limit \
  --maximum-tile-bytes=1000000 \
  --force -l poly \
  CTM_GER_${YEAR}_seg_v201_4326.fgb
```

---

## 4. Upload (Backblaze, b2 v4)

```bash
b2 file upload agrarchecker \
  CTM_GER_${YEAR}_seg_v201_10-11.pmtiles CTM_GER_${YEAR}_seg_v201_10-11.pmtiles
b2 file upload agrarchecker \
  CTM_GER_${YEAR}_rgba_til10.pmtiles      CTM_GER_${YEAR}_rgba_til10.pmtiles

# Smoke-Test (206 = ok)
curl -s -o /dev/null -w "%{http_code}\n" -r 0-0 \
  "https://f003.backblazeb2.com/file/agrarchecker/CTM_GER_${YEAR}_seg_v201_10-11.pmtiles"
```

---

## 5. Frontend aktivieren

Die Jahresliste steht aktuell **mehrfach** verstreut:
[addSources.js](../js/mapdata/addSources.js), [addLayers.js](../js/mapdata/addLayers.js),
[popupHandlers.js](../js/ui/popupHandlers.js), [main.js](../main.js) (Slider-Init),
[index.html](../index.html) (`#agrar-layer-slider max=…` + Ticks).

**Empfehlung:** einmal „year-driven" machen — eine `YEARS`-Konstante
(z. B. `js/config/years.js`), aus der Sources, Layer, Slider und Popups abgeleitet
werden. Danach ist ein neues Jahr **eine Zeile** (plus die 2 hochgeladenen Dateien).
Bei der Gelegenheit den Default-Slider auf das **neueste** Jahr setzen.

Bis dahin: in allen fünf Stellen das neue Jahr ergänzen und `max`/Ticks im Slider
erweitern.

**2024-Sonderfall:** Es gibt v202 (S1+S2+Landsat) *und* eine neue v3xx-Linie
(nur S2+Landsat). Für Konsistenz mit 2017–2023 **v202** nehmen.

---

## 6. Checkliste pro Jahr

- [ ] Zenodo-Records geladen (Raster-COG v202, Vektor-GPKG v201)
- [ ] Vektor-Schema verifiziert (CRS 3035, Felder korrekt)
- [ ] Klassenliste == 24 bekannte Klassen (sonst an 3 Stellen ergänzt)
- [ ] Raster-PMTiles erzeugt (`_rgba_til10`)
- [ ] Vektor-PMTiles erzeugt (`_seg_v201_10-11`)
- [ ] Beide nach Backblaze hochgeladen + Smoke-Test 206
- [ ] Frontend: Jahr in `YEARS` (bzw. alle 5 Stellen) ergänzt
- [ ] Lokal getestet (`http://localhost:8000`)
