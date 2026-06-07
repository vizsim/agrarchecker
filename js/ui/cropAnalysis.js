// cropAnalysis.js — Live-Analyse des sichtbaren Kartenausschnitts.
//
// Summiert die Fläche (area_ha) je Kulturart über die aktuell gerenderten Felder
// des aktiven Jahres, dedupliziert nach Feld-id (Felder können über mehrere
// Vektorkacheln verteilt sein), respektiert den aktiven Kulturart-Filter und
// zeigt das Ergebnis als Donut-Chart (Chart.js) + Rangliste im rechten Panel.
//
// Einschränkungen (bewusst): nur ab Zoom 10 (darunter zeigt die Karte das
// Raster, Vektorfelder sind nicht abfragbar) und immer nur für den sichtbaren
// Ausschnitt. Ein Feld, das nur teilweise im Bild liegt, zählt mit seiner
// vollen Fläche.

import { CROPS } from "../cropTypes.js";

const labelByCode = Object.fromEntries(CROPS.map((c) => [c.code, c.label]));
const colorByCode = Object.fromEntries(CROPS.map((c) => [c.code, c.color]));

export function setupCropAnalysis(map, years) {
  const section = document.querySelector('.legend-section[data-section="analyse"]');
  const summaryEl = document.getElementById("analysis-summary");
  const listEl = document.getElementById("analysis-list");
  const hintEl = document.getElementById("analysis-hint");
  const canvas = document.getElementById("analysis-chart");
  const chartWrap = canvas ? canvas.closest(".analysis-chart-wrap") : null;
  if (!section || !canvas) return;

  let chart = null;
  let lastTotal = 0;

  const activeYear = () => document.getElementById("agrar-layer-slider")?.value ?? years[0];
  const isOpen = () => !section.classList.contains("collapsed");

  const showHint = (msg) => {
    hintEl.textContent = msg;
    hintEl.style.display = "block";
    if (chartWrap) chartWrap.style.display = "none";
    listEl.innerHTML = "";
    summaryEl.textContent = "";
  };

  // Flächen je CTM-Code über die sichtbaren, gefilterten Felder summieren
  const aggregate = () => {
    const layerId = `agrar_vector_${activeYear()}`;
    if (!map.getLayer(layerId)) return null;

    const features = map.queryRenderedFeatures({ layers: [layerId] });
    const seen = new Set();
    const areaByCode = new Map();
    let total = 0;
    let count = 0;

    for (const f of features) {
      const p = f.properties || {};
      const id = p.id;
      if (id != null) {
        if (seen.has(id)) continue; // Kachel-Duplikate desselben Feldes überspringen
        seen.add(id);
      }
      const code = p.ctm_majority;
      const area = Number(p.area_ha) || 0;
      areaByCode.set(code, (areaByCode.get(code) || 0) + area);
      total += area;
      count += 1;
    }
    return { areaByCode, total, count };
  };

  const update = () => {
    if (!isOpen()) return;
    if (map.getZoom() < 10) {
      showHint("Für die Analyse weiter reinzoomen (ab Zoom 10).");
      return;
    }
    if (!window.Chart) {
      showHint("Chart-Bibliothek nicht geladen.");
      return;
    }

    const agg = aggregate();
    if (!agg || agg.count === 0) {
      showHint("Keine Felder im sichtbaren Ausschnitt.");
      return;
    }

    hintEl.style.display = "none";
    if (chartWrap) chartWrap.style.display = "block";
    lastTotal = agg.total;

    const entries = [...agg.areaByCode.entries()]
      .map(([code, area]) => ({
        area,
        label: labelByCode[code] ?? `Code ${code}`,
        color: colorByCode[code] ?? "#cccccc",
      }))
      .sort((a, b) => b.area - a.area);

    summaryEl.innerHTML =
      `<strong>${fmtHa(agg.total)} ha</strong> · ${agg.count.toLocaleString("de-DE")} Felder · Jahr ${activeYear()}`;

    const data = {
      labels: entries.map((e) => e.label),
      datasets: [{
        data: entries.map((e) => e.area),
        backgroundColor: entries.map((e) => e.color),
        borderColor: "#ffffff",
        borderWidth: 0.5,
      }],
    };

    if (chart) {
      chart.data = data;
      chart.update();
    } else {
      chart = new window.Chart(canvas, {
        type: "doughnut",
        data,
        options: {
          responsive: true,
          maintainAspectRatio: true,
          cutout: "58%",
          animation: { duration: 200 },
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => `${ctx.label}: ${fmtHa(ctx.parsed)} ha (${pct(ctx.parsed, lastTotal)})`,
              },
            },
          },
        },
      });
    }

    listEl.innerHTML = entries
      .map((e) => `
        <div class="analysis-row">
          <span class="crop-swatch" style="background:${e.color}"></span>
          <span class="analysis-row-label">${e.label}</span>
          <span class="analysis-row-val">${fmtHa(e.area)} ha</span>
          <span class="analysis-row-pct">${pct(e.area, agg.total)}</span>
        </div>`)
      .join("");
  };

  // Map "idle" deckt Pan/Zoom, Filter- und Jahreswechsel ab (jeweils Re-Render)
  let timer;
  map.on("idle", () => {
    clearTimeout(timer);
    timer = setTimeout(update, 150);
  });

  // Direkt nach dem Aufklappen der Sektion aktualisieren
  const title = section.querySelector(".legend-section-title");
  if (title) title.addEventListener("click", () => setTimeout(update, 0));
}

function fmtHa(n) {
  return Math.round(n).toLocaleString("de-DE");
}

function pct(part, total) {
  return total ? `${(100 * part / total).toFixed(1).replace(".", ",")} %` : "–";
}
