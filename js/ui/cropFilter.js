// cropFilter.js — gruppierter, interaktiver Kulturarten-Filter (Legende + Filter in einem).
//
// Rendert die Gruppen aus js/cropTypes.js in #crop-filter, verwaltet die
// Auswahl (pro Kulturart, pro Gruppe, alle/keine) und wendet den Filter auf
// alle agrar_vector_<year>-Layer an. Ersetzt das frühere Inline-#xy-Markup und
// setupAgrarVectorFiltering() aus main.js.

import { CROP_GROUPS, CROPS } from "../cropTypes.js";

export function setupCropFilter(map, availableYears) {
  const container = document.getElementById("crop-filter");
  if (!container) return;

  container.innerHTML = renderMarkup();

  const checkboxes = Array.from(container.querySelectorAll(".agrar-filter"));
  const counter = container.querySelector("#crop-filter-count");

  const applyFilter = () => {
    const selected = checkboxes.filter((cb) => cb.checked).map((cb) => parseInt(cb.value, 10));

    const filter = selected.length > 0
      ? ["in", "ctm_majority", ...selected]
      : ["==", "ctm_majority", -1]; // nichts ausgewählt → nichts anzeigen

    availableYears.forEach((year) => {
      const layerId = `agrar_vector_${year}`;
      if (map.getLayer(layerId)) map.setFilter(layerId, filter);
    });

    counter.textContent = `${selected.length}/${CROPS.length}`;
    syncGroupStates();
  };

  // Gruppen-Checkbox spiegelt den Zustand ihrer Items (checked / indeterminate)
  const syncGroupStates = () => {
    container.querySelectorAll(".crop-group").forEach((group) => {
      const items = Array.from(group.querySelectorAll(".agrar-filter"));
      const checked = items.filter((cb) => cb.checked).length;
      const groupCb = group.querySelector(".crop-group-toggle");
      groupCb.checked = checked === items.length;
      groupCb.indeterminate = checked > 0 && checked < items.length;
    });
  };

  // Einzelne Kulturart
  checkboxes.forEach((cb) => cb.addEventListener("change", applyFilter));

  // Gruppen-Checkbox: ganze Gruppe an/aus
  container.querySelectorAll(".crop-group-toggle").forEach((groupCb) => {
    groupCb.addEventListener("change", () => {
      const group = groupCb.closest(".crop-group");
      group.querySelectorAll(".agrar-filter").forEach((cb) => (cb.checked = groupCb.checked));
      applyFilter();
    });
  });

  // Gruppentitel: ein-/ausklappen
  container.querySelectorAll(".crop-group-title").forEach((title) => {
    title.addEventListener("click", () => {
      title.closest(".crop-group").classList.toggle("collapsed");
    });
  });

  // Alle / Keine
  container.querySelector("#crop-select-all").addEventListener("click", () => {
    checkboxes.forEach((cb) => (cb.checked = true));
    applyFilter();
  });
  container.querySelector("#crop-select-none").addEventListener("click", () => {
    checkboxes.forEach((cb) => (cb.checked = false));
    applyFilter();
  });

  applyFilter(); // initial
}

function renderMarkup() {
  const groups = CROP_GROUPS.map((group) => {
    const items = group.crops
      .map(
        (crop) => `
        <label class="crop-item">
          <input type="checkbox" class="agrar-filter" value="${crop.code}" checked />
          <span class="crop-swatch" style="background:${crop.color}"></span>
          <span class="crop-name">${crop.label}</span>
        </label>`
      )
      .join("");

    return `
      <div class="crop-group">
        <div class="crop-group-header">
          <span class="crop-group-title">
            <span class="crop-group-arrow"></span>${group.title}
          </span>
          <input type="checkbox" class="crop-group-toggle" title="Gruppe an/aus" checked />
        </div>
        <div class="crop-group-items">${items}</div>
      </div>`;
  }).join("");

  return `
    <div class="crop-filter-toolbar">
      <span class="crop-filter-count"><strong id="crop-filter-count">${CROPS.length}/${CROPS.length}</strong> Kulturarten</span>
      <div class="crop-filter-actions">
        <button type="button" id="crop-select-all">Alle</button>
        <button type="button" id="crop-select-none">Keine</button>
      </div>
    </div>
    <div class="crop-groups">${groups}</div>`;
}
