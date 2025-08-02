(function () {
  const RESOURCES = { es: "/i18n/es.json", en: "/i18n/en.json" };
  const LS_KEY = "sinco-lang";
  async function load(lang) {
    const res = await fetch(RESOURCES[lang] || RESOURCES.es);
    return res.json();
  }
  function apply(t) {
    document.title = t["app.title"] || document.title;
    const titleEl = document.querySelector("#appTitle");
    if (titleEl) {
      titleEl.textContent = t["app.title"] || titleEl.textContent;
    }
    const heading = document.querySelector("#pageHeading");
    if (heading) {
      heading.textContent = t["app.title"] || heading.textContent;
    }
    const search = document.querySelector("#searchInput");
    if (search && t["search.placeholder"]) {
      search.setAttribute("placeholder", t["search.placeholder"]);
    }
    const labels = [
      [".stat-item:nth-child(1) .stat-label", "stats.totalOccupations"],
      [".stat-item:nth-child(2) .stat-label", "stats.divisions"],
      [".stat-item:nth-child(3) .stat-label", "stats.totalEmployees"],
      [".stat-item:nth-child(4) .stat-label", "stats.avgSalary"],
      ["#btn-tree", "views.tree"],
      ["#btn-table", "views.table"],
      ["#btn-cards", "views.cards"],
    ];
    labels.forEach(([sel, key]) => {
      const el = document.querySelector(sel);
      if (el && t[key]) el.textContent = t[key];
    });
  }
  async function init() {
    const select = document.getElementById("langSelect");
    const lang =
      select?.value || localStorage.getItem(LS_KEY) || (navigator.language || "es").slice(0, 2);
    const final = lang === "en" ? "en" : "es";
    if (select) select.value = final;
    const t = await load(final);
    apply(t);
    localStorage.setItem(LS_KEY, final);
    if (select) {
      select.addEventListener("change", async (e) => {
        const l = e.target.value;
        const tr = await load(l);
        apply(tr);
        localStorage.setItem(LS_KEY, l);
      });
    }
  }
  document.addEventListener("DOMContentLoaded", init);
})();
