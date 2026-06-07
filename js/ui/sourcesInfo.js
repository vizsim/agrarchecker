// sourcesInfo.js — Klick auf "Thünen-Institut" (oben im Panel) öffnet ein Popover
// mit den verlinkten Zenodo-Datensätzen. Quellen aus js/sources.js.

import { SOURCE_GROUPS, SOURCE_CITATION, SOURCE_LICENSE } from "../sources.js";

export function setupSourcesInfo() {
  const credit = document.getElementById("source-credit");
  if (!credit) return;

  const pop = document.createElement("div");
  pop.className = "sources-popover";
  pop.hidden = true;
  pop.innerHTML = renderPopover();
  document.body.appendChild(pop);

  const close = () => { pop.hidden = true; };
  const open = () => {
    const r = credit.getBoundingClientRect();
    pop.style.top = `${r.bottom + 6}px`;
    pop.style.right = `${Math.max(8, window.innerWidth - r.right)}px`;
    pop.hidden = false;
  };

  credit.addEventListener("click", (e) => {
    e.stopPropagation(); // nicht die Legende ein-/ausklappen
    if (pop.hidden) open(); else close();
  });

  document.addEventListener("click", (e) => {
    if (e.target !== credit && !pop.contains(e.target)) close();
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
}

function renderPopover() {
  const groups = SOURCE_GROUPS.map((group) => {
    const links = group.items
      .map(
        (it) => `
        <a href="https://doi.org/${it.doi}" target="_blank" rel="noopener noreferrer">
          <span>${it.label}</span>
          <span class="doi">${it.doi.replace("10.5281/zenodo.", "Zenodo ")}</span>
        </a>`
      )
      .join("");
    return `<div class="src-group-title">${group.title}</div>${links}`;
  }).join("");

  return `
    <h4>Datenquellen</h4>
    <div class="src-cite">${SOURCE_CITATION} Lizenz: ${SOURCE_LICENSE}.</div>
    ${groups}`;
}
