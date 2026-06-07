// cropAnalysis.js — Live-Analyse des sichtbaren Kartenausschnitts, mit zwei Tabs:
//
//   • "Ausschnitt"  → Donut: Fläche je Kulturart im sichtbaren Ausschnitt des
//                     AKTIVEN Jahres (queryRenderedFeatures, respektiert den
//                     Kulturart-Filter).
//   • "Zeitreihe"   → Stacked Bar: Fläche je Kulturart über ALLE Jahre. Da die
//                     nicht-aktiven Jahre auf der Karte ausgeblendet sind (Tiles
//                     nicht geladen), werden sie beim Öffnen des Tabs per
//                     fill-opacity:0 "still" eingeblendet und via
//                     querySourceFeatures ausgelesen. Beim Verlassen wird der
//                     Slider-Zustand wiederhergestellt. Einzelne Kulturarten
//                     lassen sich über die Legende bzw. Alle/Keine aus-/einblenden.
//
// Hover über eine Kulturart (in Donut-Liste oder Zeitreihen-Legende) hebt sie auf
// der Karte hervor (kräftig) und blendet die anderen ab — billig via
// setPaintProperty(fill-opacity, case-Expression), kein Nachladen.
//
// Beide rechnen nur ab Zoom 10 und nur bei offener Sektion. Felder, die über
// mehrere Vektorkacheln gehen, werden nach Feld-id dedupliziert.

import { CROPS } from "../cropTypes.js";
import { highlightCrop, isCropHighlightBusy } from "../map/cropHighlight.js";

const labelByCode = Object.fromEntries(CROPS.map((c) => [c.code, c.label]));
const colorByCode = Object.fromEntries(CROPS.map((c) => [c.code, c.color]));
const orderByCode = Object.fromEntries(CROPS.map((c, i) => [c.code, i]));

const BASE_OPACITY = 0.5;

export function setupCropAnalysis(map, years) {
  const section = document.querySelector('.legend-section[data-section="analyse"]');
  if (!section) return;

  const hintEl = document.getElementById("analysis-hint");
  // Ausschnitt
  const donutSummary = document.getElementById("analysis-summary");
  const donutList = document.getElementById("analysis-list");
  const donutCanvas = document.getElementById("analysis-chart");
  const donutWrap = donutCanvas ? donutCanvas.closest(".analysis-chart-wrap") : null;
  // Zeitreihe
  const tsSummary = document.getElementById("ts-summary");
  const tsLegend = document.getElementById("ts-legend");
  const tsCount = document.getElementById("ts-visible-count");
  const tsCanvas = document.getElementById("ts-chart");
  const tsWrap = tsCanvas ? tsCanvas.closest(".analysis-chart-wrap") : null;

  let donutChart = null;
  let donutTotal = 0;
  let tsChart = null;
  let activeTab = "ausschnitt";
  let probing = false;
  const hiddenCrops = new Set(); // Codes, die in der Zeitreihe ausgeblendet sind

  const sliderEl = () => document.getElementById("agrar-layer-slider");
  const activeYear = () => sliderEl()?.value ?? String(years[0]);
  const sectionOpen = () => !section.classList.contains("collapsed");

  // ── Probe-Lifecycle: alle Jahre für den Ausschnitt abfragbar machen ──
  const probe = () => {
    const y = activeYear();
    for (const year of years) {
      const id = `agrar_vector_${year}`;
      if (!map.getLayer(id)) continue;
      map.setLayoutProperty(id, "visibility", "visible");
      map.setPaintProperty(id, "fill-opacity", String(year) === String(y) ? BASE_OPACITY : 0);
    }
    probing = true;
  };

  const restore = () => {
    if (!probing) return;
    const y = activeYear();
    for (const year of years) {
      const id = `agrar_vector_${year}`;
      if (!map.getLayer(id)) continue;
      map.setLayoutProperty(id, "visibility", String(year) === String(y) ? "visible" : "none");
      map.setPaintProperty(id, "fill-opacity", BASE_OPACITY);
    }
    probing = false;
  };

  const showHint = (msg) => {
    hintEl.textContent = msg;
    hintEl.style.display = "block";
    if (activeTab === "ausschnitt") {
      if (donutWrap) donutWrap.style.display = "none";
      donutList.innerHTML = "";
      donutSummary.textContent = "";
    } else {
      if (tsWrap) tsWrap.style.display = "none";
      tsLegend.innerHTML = "";
      tsSummary.textContent = "";
      if (tsCount) tsCount.textContent = "–";
    }
  };

  // ── Aggregation ──
  const aggregateRendered = (layerId) => {
    const seen = new Set();
    const byCode = new Map();
    let total = 0;
    let count = 0;
    for (const f of map.queryRenderedFeatures({ layers: [layerId] })) {
      const p = f.properties || {};
      if (p.id != null) {
        if (seen.has(p.id)) continue;
        seen.add(p.id);
      }
      const area = Number(p.area_ha) || 0;
      byCode.set(p.ctm_majority, (byCode.get(p.ctm_majority) || 0) + area);
      total += area;
      count += 1;
    }
    return { byCode, total, count };
  };

  // querySourceFeatures ignoriert den Layer-Filter (Zeitreihe zeigt alle Kulturarten)
  const aggregateSource = (year) => {
    const sourceId = `agrar_vector_${year}`;
    if (!map.getSource(sourceId)) return new Map();
    const seen = new Set();
    const byCode = new Map();
    for (const f of map.querySourceFeatures(sourceId, { sourceLayer: "poly" })) {
      const p = f.properties || {};
      if (p.id != null) {
        if (seen.has(p.id)) continue;
        seen.add(p.id);
      }
      byCode.set(p.ctm_majority, (byCode.get(p.ctm_majority) || 0) + (Number(p.area_ha) || 0));
    }
    return byCode;
  };

  // ── Tab: Ausschnitt (Donut) ──
  const updateDonut = () => {
    if (map.getZoom() < 10) return showHint("Für die Analyse weiter reinzoomen (ab Zoom 10).");
    if (!window.Chart) return showHint("Chart-Bibliothek nicht geladen.");

    const agg = aggregateRendered(`agrar_vector_${activeYear()}`);
    if (agg.count === 0) return showHint("Keine Felder im sichtbaren Ausschnitt.");

    hintEl.style.display = "none";
    if (donutWrap) donutWrap.style.display = "block";
    donutTotal = agg.total;

    const entries = [...agg.byCode.entries()]
      .map(([code, area]) => ({ code, area, label: labelByCode[code] ?? `Code ${code}`, color: colorByCode[code] ?? "#cccccc" }))
      .sort((a, b) => b.area - a.area);

    donutSummary.innerHTML =
      `<strong>${fmtHa(agg.total)} ha</strong> · ${agg.count.toLocaleString("de-DE")} Felder · Jahr ${activeYear()}`;

    const data = {
      labels: entries.map((e) => e.label),
      datasets: [{ data: entries.map((e) => e.area), backgroundColor: entries.map((e) => e.color), borderColor: "#fff", borderWidth: 0.5 }],
    };
    if (donutChart) {
      donutChart.data = data;
      donutChart.update();
    } else {
      donutChart = new window.Chart(donutCanvas, {
        type: "doughnut",
        data,
        options: {
          responsive: true, maintainAspectRatio: true, cutout: "58%", animation: { duration: 200 },
          plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ${fmtHa(ctx.parsed)} ha (${pct(ctx.parsed, donutTotal)})` } },
          },
        },
      });
    }

    donutList.innerHTML = entries
      .map((e) => `
        <div class="analysis-row" data-code="${e.code}">
          <span class="crop-swatch" style="background:${e.color}"></span>
          <span class="analysis-row-label">${e.label}</span>
          <span class="analysis-row-val">${fmtHa(e.area)} ha</span>
          <span class="analysis-row-pct">${pct(e.area, agg.total)}</span>
        </div>`)
      .join("");

    attachHover(donutList.querySelectorAll(".analysis-row"));
  };

  // ── Tab: Zeitreihe (Stacked Bar über alle Jahre) ──
  const renderTsSummary = (datasets) => {
    const visibleTotal = datasets.reduce(
      (s, d) => s + (hiddenCrops.has(d._code) ? 0 : d.data.reduce((a, b) => a + b, 0)), 0);
    const avg = visibleTotal / years.length;
    tsSummary.innerHTML =
      `Ø <strong>${fmtHa(avg)} ha/Jahr</strong> · ${years[0]}–${years[years.length - 1]} · sichtbarer Ausschnitt`;
    if (tsCount) {
      const visible = datasets.filter((d) => !hiddenCrops.has(d._code)).length;
      tsCount.textContent = `${visible}/${datasets.length}`;
    }
  };

  const applyTsVisibility = () => {
    if (!tsChart) return;
    tsChart.data.datasets.forEach((d, i) => tsChart.setDatasetVisibility(i, !hiddenCrops.has(d._code)));
    tsChart.update();
    tsLegend.querySelectorAll(".ts-legend-item").forEach((item) => {
      item.classList.toggle("is-off", hiddenCrops.has(Number(item.dataset.code)));
    });
    renderTsSummary(tsChart.data.datasets);
  };

  const updateTimeSeries = () => {
    if (map.getZoom() < 10) return showHint("Für die Analyse weiter reinzoomen (ab Zoom 10).");
    if (!window.Chart) return showHint("Chart-Bibliothek nicht geladen.");

    const perYear = years.map((y) => aggregateSource(y));
    const codes = new Set();
    perYear.forEach((m) => m.forEach((area, code) => { if (area > 0) codes.add(code); }));
    if (codes.size === 0) return showHint("Keine Felder im sichtbaren Ausschnitt.");

    hintEl.style.display = "none";
    if (tsWrap) tsWrap.style.display = "block";

    const sortedCodes = [...codes].sort((a, b) => (orderByCode[a] ?? 999) - (orderByCode[b] ?? 999));
    const datasets = sortedCodes.map((code) => ({
      label: labelByCode[code] ?? `Code ${code}`,
      data: perYear.map((m) => Math.round(m.get(code) || 0)),
      backgroundColor: colorByCode[code] ?? "#cccccc",
      borderWidth: 0,
      hidden: hiddenCrops.has(code),
      _code: code,
    }));

    const data = { labels: years.map(String), datasets };
    if (tsChart) {
      tsChart.data = data;
      tsChart.update();
    } else {
      tsChart = new window.Chart(tsCanvas, {
        type: "bar",
        data,
        options: {
          responsive: true, maintainAspectRatio: false, animation: { duration: 200 },
          scales: {
            x: { stacked: true, grid: { display: false } },
            y: { stacked: true, ticks: { callback: (v) => fmtHa(v) }, grid: { color: "#eef1f4" } },
          },
          plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: (ctx) => `${ctx.dataset.label}: ${fmtHa(ctx.parsed.y)} ha` } },
          },
        },
      });
    }

    renderTsSummary(datasets);

    // Klickbare Legende: aus-/einblenden + Hover-Highlight auf der Karte
    tsLegend.innerHTML = datasets
      .map((d) => {
        const sum = d.data.reduce((a, b) => a + b, 0);
        return `
          <div class="crop-item ts-legend-item ${d.hidden ? "is-off" : ""}" data-code="${d._code}">
            <span class="crop-swatch" style="background:${d.backgroundColor}"></span>
            <span class="crop-name">${d.label}</span>
            <span class="analysis-row-val">${fmtHa(sum)} ha</span>
          </div>`;
      })
      .join("");

    tsLegend.querySelectorAll(".ts-legend-item").forEach((item) => {
      const code = Number(item.dataset.code);
      item.addEventListener("click", () => {
        if (hiddenCrops.has(code)) hiddenCrops.delete(code); else hiddenCrops.add(code);
        applyTsVisibility();
      });
    });
    attachHover(tsLegend.querySelectorAll(".ts-legend-item"));
  };

  // Hover-Handler an Listen-/Legenden-Zeilen hängen (geteiltes Highlight-Modul).
  const attachHover = (nodes) => {
    nodes.forEach((node) => {
      const code = Number(node.dataset.code);
      node.addEventListener("mouseenter", () => highlightCrop(map, code));
      node.addEventListener("mouseleave", () => highlightCrop(map, null));
    });
  };

  const updateActive = () => {
    if (!sectionOpen()) return;
    if (activeTab === "ausschnitt") updateDonut();
    else updateTimeSeries();
  };

  // ── Tab-Wechsel ──
  const setTab = (tab) => {
    if (tab === activeTab) return;
    highlightCrop(map, null);
    activeTab = tab;
    section.querySelectorAll(".analysis-tab").forEach((b) => b.classList.toggle("active", b.dataset.tab === tab));
    section.querySelectorAll(".analysis-pane").forEach((p) => { p.hidden = p.dataset.pane !== tab; });
    hintEl.style.display = "none";

    if (tab === "zeitreihe") probe();
    else restore();
    updateActive();
  };

  section.querySelectorAll(".analysis-tab").forEach((btn) => {
    btn.addEventListener("click", () => setTab(btn.dataset.tab));
  });

  // Alle / Keine (Zeitreihe)
  document.getElementById("ts-select-all")?.addEventListener("click", () => {
    hiddenCrops.clear();
    applyTsVisibility();
  });
  document.getElementById("ts-select-none")?.addEventListener("click", () => {
    tsChart?.data.datasets.forEach((d) => hiddenCrops.add(d._code));
    applyTsVisibility();
  });

  // ── Sektion auf-/zuklappen ──
  const title = section.querySelector(".legend-section-title");
  if (title) {
    title.addEventListener("click", () =>
      setTimeout(() => {
        highlightCrop(map, null);
        if (sectionOpen()) {
          if (activeTab === "zeitreihe") probe();
          updateActive();
        } else {
          restore();
        }
      }, 0)
    );
  }

  // ── Slider-Wechsel: Probe neu setzen ──
  const slider = sliderEl();
  if (slider) slider.addEventListener("input", () => { if (probing) probe(); });

  // ── Karte settled → aktiven Tab aktualisieren ──
  let timer;
  map.on("idle", () => {
    if (isCropHighlightBusy()) return; // Repaint kam vom Hover-Highlight → kein Neuaufbau
    clearTimeout(timer);
    timer = setTimeout(updateActive, 150);
  });
}

function fmtHa(n) {
  return Math.round(n).toLocaleString("de-DE");
}

function pct(part, total) {
  return total ? `${(100 * part / total).toFixed(1).replace(".", ",")} %` : "–";
}
