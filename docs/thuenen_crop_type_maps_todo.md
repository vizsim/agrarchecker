# Thünen Crop Type Maps (Deutschland) – Datenintegration & TODO

Anbaukarten / landwirtschaftliche Nutzungsklassen für ganz Deutschland, jährlich
am Thünen-Institut aus Sentinel‑1, Sentinel‑2 und Landsat abgeleitet
(Methode: Blickensdörfer et al. 2022). Lizenz aller Datensätze: **CC BY 4.0**.

Stand der Recherche: Juni 2026 · Reihe aktuell verfügbar **2017–2024**.

---

## 1. Verfügbare Datensätze (Raster, COG/GeoTIFF)

Empfohlener konsistenter Stand = **Version v202** (gleiche Nachbearbeitung über alle Jahre),
abgeleitet aus **Sentinel‑1 + Sentinel‑2 + Landsat**.

- [ ] **2017–2021** (Sammelkarte, v202) — `10.5281/zenodo.10640528` → zenodo.org/records/10640528  *(dein Ausgangsdatensatz)*
- [ ] **2022** (v202) — `10.5281/zenodo.10645427` → zenodo.org/records/10645427
- [ ] **2023** (v202) — `10.5281/zenodo.15309479` → zenodo.org/records/15309479
- [ ] **2024** (v202) — `10.5281/zenodo.17122646` → zenodo.org/records/17122646

Frühere/alternative Versionen (nur falls für Vergleich gebraucht):
- v201-Stände: 2017–2021 = `10617623`, 2022 = `10628809`, 2024 = `16949898`
- 2023 (früherer Record, Version prüfen) = `15055561`

## 2. Verfügbare Datensätze (Vektor, Felder als GeoPackage/FlatGeobuf)

Vektor entsteht durch Verschneiden der Rasterkarte mit aus Satellitendaten
abgeleiteten Feldgrenzen (Waldner et al. 2021) + Mehrheitsentscheid je Feld.
Achtung: Vektor liegt aktuell als **v201** vor (nicht v202).

- [ ] **2022** (v201) — `10.5281/zenodo.10621629` → zenodo.org/records/10621629
- [ ] **2023** (v201) — `10.5281/zenodo.17135735` → zenodo.org/records/17135735  *(GeoPackage, ~9 GB)*
- [ ] Prüfen: gibt es eine Vektor-Sammelkarte 2017–2021 bzw. Vektor 2024?

## 3. Optionale Zusatzdaten

- [ ] **Grünland-Mahdereignisse 2023** (Sentinel‑2 + Landsat) — `10.5281/zenodo.16941138`
- [ ] Prüfen: Mahd-Daten für weitere Jahre

---

## 4. WICHTIG – methodische Verzweigung ab 2024

Für **2024** gibt es zusätzlich eine **neue Produktlinie v3xx**
(z. B. `10.5281/zenodo.17197830`), die **nur aus Sentinel‑2 + Landsat** abgeleitet ist
(**ohne Sentinel‑1**).

- [ ] Entscheiden, welche Linie ins Projekt kommt:
  - **v202** = klassische S1+S2+Landsat-Reihe → konsistent mit 2017–2023
  - **v3xx** = neue S2+Landsat-Methode → ggf. nicht direkt mit Vorjahren vergleichbar
- [ ] Wenn Zeitreihenvergleich 2017→2024 das Ziel ist: bei **v202** bleiben.

---

## 5. Integrations-TODOs

- [ ] **Versions-Konsistenz prüfen:** Für jahresübergreifende Vergleiche überall
      dieselbe Version (v202) verwenden. v201↔v202 unterscheiden sich u. a. in
      Nachbearbeitung, Klasse „permanent grassland" und „small woody features
      on other land".
- [ ] **Klassenlegende** je Jahr/Version laden und auf Übereinstimmung prüfen
      (`.clr` für Raster, `.sld` für Vektor; DE/EN verfügbar).
- [ ] **Accuracy-PDFs** je Jahr ablegen und klassenspezifische Genauigkeiten dokumentieren.
      Hinweis: Validierung erfolgte über IACS-Parzellen aus BB, NI, NRW; unterrepräsentierte
      Klassen (z. B. Hopfen, Reben) sind dort nur eingeschränkt bewertet.
- [ ] **Datenzugriff:** COGs/FlatGeobuf können per URL direkt in QGIS/R/Python gestreamt
      werden (nur ROI statt Full-Download). Für reproduzierbare Pipeline ggf. trotzdem
      lokal spiegeln (Raster ~760 MB/Jahr, Vektor bis ~9 GB/Jahr).
- [ ] **CRS / Kachelung** vereinheitlichen und dokumentieren.
- [ ] **Raster vs. Vektor** klären: Raster = pixelbasiert; Vektor = Felder (per
      majority voting aggregiert + vereinfacht). Für Flächenstatistik je nach Use-Case wählen.
- [ ] **Zitation & Lizenz** (CC BY 4.0) im Projekt hinterlegen, je Jahr/Version mit DOI.
- [ ] Optional: Thünen-Mailingliste abonnieren für Update-Benachrichtigungen
      (neue Jahre/Versionen erscheinen als verkettete Einzel-Records).

---

## 6. Offene Fragen / zu verifizieren

- [ ] Exakte Versionsnummer des 2023-Records `15055561`
- [ ] Existenz/DOI einer Vektor-Sammelkarte 2017–2021 und Vektor 2024
- [ ] Endgültige Entscheidung v202 vs. v3xx-Linie ab 2024
