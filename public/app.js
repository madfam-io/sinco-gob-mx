(function () {
  "use strict";

  const state = {
    currentView: "tree",
    allNodes: [],
    rootNode: null,
    pageSize: 25,
    tablePage: 1,
    cardsPage: 1,
    d3: {
      svg: null,
      g: null,
      treeLayout: null,
      zoom: null,
      nodeId: 0,
    },
  };

  const DOM = {
    loader: document.getElementById("loader"),
    treeView: document.getElementById("treeView"),
    tableView: document.getElementById("tableView"),
    cardsView: document.getElementById("cardsView"),
    treeSvg: d3.select("#treeSvg"),
    tableBody: document.getElementById("tableBody"),
    cardsContainer: document.getElementById("cardsView"),
    searchInput: document.getElementById("searchInput"),
    tooltip: document.getElementById("tooltip"),
    viewToggle: document.querySelector(".view-toggle"),
    statTotalOccupations: document.getElementById("stat-total-occupations"),
    statDivisions: document.getElementById("stat-divisions"),
    statTotalEmployees: document.getElementById("stat-total-employees"),
    statAvgSalary: document.getElementById("stat-avg-salary"),
    tablePrev: document.getElementById("tablePrev"),
    tableNext: document.getElementById("tableNext"),
    tablePage: document.getElementById("tablePage"),
    cardsPrev: document.getElementById("cardsPrev"),
    cardsNext: document.getElementById("cardsNext"),
    cardsPage: document.getElementById("cardsPage"),
    cardsPager: document.getElementById("cardsPager"),
  };

  async function init() {
    DOM.loader.classList.remove("hidden");
    try {
      const response = await fetch("sincoData.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const sincoData = await response.json();
      setupD3(sincoData);
      processData();
      updateStatsFromData(sincoData);
      populateCards();
      setupEventListeners();
    } catch (error) {
      console.error("Failed to load and initialize SINCO data:", error);
      DOM.loader.innerHTML = `<p style=\"color:white;\">Error al cargar los datos. Por favor, intente de nuevo más tarde.</p>`;
    } finally {
      setTimeout(() => {
        DOM.loader.style.opacity = "0";
        setTimeout(() => DOM.loader.classList.add("hidden"), 300);
      }, 500);
    }
  }

  function setupD3(sincoData) {
    const container = DOM.treeView;
    const width = container.clientWidth;
    const height = container.clientHeight;

    state.d3.svg = DOM.treeSvg
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`);

    state.d3.g = state.d3.svg.append("g").attr("transform", "translate(80,0)");
    state.d3.treeLayout = d3.tree().size([height, width - 200]);
    state.rootNode = d3.hierarchy(sincoData, (d) => d.children);
    state.rootNode.x0 = height / 2;
    state.rootNode.y0 = 0;

    state.rootNode.children.forEach(collapse);
    updateTree(state.rootNode);
    setupZoom();
  }

  function setupEventListeners() {
    DOM.searchInput.addEventListener("input", debounce(handleSearch, 300));
    DOM.viewToggle.addEventListener("click", handleViewSwitch);
    DOM.viewToggle.addEventListener("keydown", handleTabsKeydown);
    window.addEventListener("resize", debounce(handleResize, 250));
    if (DOM.tablePrev) DOM.tablePrev.addEventListener("click", () => changeTablePage(-1));
    if (DOM.tableNext) DOM.tableNext.addEventListener("click", () => changeTablePage(1));
    if (DOM.cardsPrev) DOM.cardsPrev.addEventListener("click", () => changeCardsPage(-1));
    if (DOM.cardsNext) DOM.cardsNext.addEventListener("click", () => changeCardsPage(1));
    DOM.tableView.addEventListener("click", (e) => {
      const row = e.target.closest("tr[data-code]");
      if (row) {
        switchViewAndHighlight(row.dataset.code);
      }
    });
    DOM.cardsContainer.addEventListener("click", (e) => {
      const card = e.target.closest(".division-card[data-code]");
      if (card) {
        switchViewAndHighlight(card.dataset.code);
      }
    });
    const expandBtn = document.getElementById("btn-expand-all");
    const collapseBtn = document.getElementById("btn-collapse-all");
    if (expandBtn) expandBtn.addEventListener("click", expandAll);
    if (collapseBtn) collapseBtn.addEventListener("click", collapseAll);

    const toggleStats = document.getElementById("btn-toggle-stats");
    if (toggleStats) toggleStats.addEventListener("click", () => {
      const stats = document.getElementById("statsBar");
      const hidden = stats.classList.toggle("hidden");
      toggleStats.setAttribute("aria-expanded", String(!hidden));
      toggleStats.textContent = hidden ? "Mostrar métricas" : "Ocultar métricas";
    });
  }

  function processData() {
    state.allNodes = state.rootNode.descendants();
  }

  function updateStatsFromData(sincoData) {
    const root = d3.hierarchy(sincoData, (d) => d.children);
    const leaves = root.leaves();
    const totalEmployees = d3.sum(leaves, (d) => d.data.employees || 0);
    const weightedSalarySum = d3.sum(
      leaves,
      (d) => (d.data.avgSalary || 0) * (d.data.employees || 0)
    );

    DOM.statTotalOccupations.textContent = leaves.length.toLocaleString();
    DOM.statDivisions.textContent = (root.children ? root.children.length : 0).toString();
    DOM.statTotalEmployees.textContent = totalEmployees.toLocaleString();
    DOM.statAvgSalary.textContent = `$${(
      totalEmployees > 0 ? Math.round(weightedSalarySum / totalEmployees) : 0
    ).toLocaleString()} MXN`;
  }

  function getOccupationLevel(code) {
    const levels = {
      1: "División",
      2: "Grupo Principal",
      3: "Subgrupo",
      4: "Grupo Unitario",
    };
    return levels[String(code).length] || "Ocupación";
  }

  function getSalaryClass(salary) {
    if (!salary) {
      return "salary-low";
    }
    if (salary >= 20000) {
      return "salary-high";
    }
    if (salary >= 10000) {
      return "salary-medium";
    }
    return "salary-low";
  }

  function debounce(func, delay) {
    let timeout;
    return function (...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), delay);
    };
  }

  function setupZoom() {
    state.d3.zoom = d3
      .zoom()
      .scaleExtent([0.1, 3])
      .on("zoom", (event) => state.d3.g.attr("transform", event.transform));
    state.d3.svg.call(state.d3.zoom);
  }

  function collapse(d) {
    if (d.children) {
      d._children = d.children;
      d._children.forEach(collapse);
      d.children = null;
    }
  }

  function expand(d) {
    if (d._children) {
      d.children = d._children;
      d._children = null;
    }
    if (d.children) d.children.forEach(expand);
  }

  function expandAll() {
    expand(state.rootNode);
    updateTree(state.rootNode);
  }

  function collapseAll() {
    state.rootNode.children.forEach(collapse);
    updateTree(state.rootNode);
  }

  function updateTree(source) {
    const duration = 500;
    const treeData = state.d3.treeLayout(state.rootNode);
    const nodes = treeData.descendants();
    const links = treeData.links();

    nodes.forEach((d) => {
      d.y = d.depth * 220;
    });

    const node = state.d3.g
      .selectAll("g.node")
      .data(nodes, (d) => d.id || (d.id = ++state.d3.nodeId));

    const nodeEnter = node
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", `translate(${source.y0},${source.x0})`)
      .attr("tabindex", 0)
      .attr("role", "treeitem")
      .on("click", handleNodeClick)
      .on("keydown", handleNodeKeydown)
      .on("mouseover", handleMouseOver)
      .on("mousemove", handleMouseMove)
      .on("mouseout", handleMouseOut);

    nodeEnter.append("circle").attr("r", 1e-6);

    nodeEnter
      .append("text")
      .attr("dy", "0.31em")
      .attr("x", (d) => (d._children ? -12 : 12))
      .attr("text-anchor", (d) => (d._children ? "end" : "start"))
      .text((d) => {
        const name = d.data.name.split(":").pop().trim();
        return name.length > 25 ? name.substring(0, 25) + "..." : name;
      })
      .clone(true)
      .lower()
      .attr("stroke-linejoin", "round")
      .attr("stroke-width", 3)
      .attr("stroke", "var(--bg-primary)");

    const nodeUpdate = nodeEnter.merge(node);
    nodeUpdate
      .transition()
      .duration(duration)
      .attr("transform", (d) => `translate(${d.y},${d.x})`);
    nodeUpdate
      .select("circle")
      .attr("r", 8)
      .style("fill", (d) => (d._children ? "var(--accent-primary)" : "var(--bg-tertiary)"));

    const nodeExit = node
      .exit()
      .transition()
      .duration(duration)
      .attr("transform", `translate(${source.y},${source.x})`)
      .remove();
    nodeExit.select("circle").attr("r", 1e-6);
    nodeExit.select("text").style("fill-opacity", 1e-6);

    const link = state.d3.g.selectAll("path.link").data(links, (d) => d.target.id);
    const linkEnter = link
      .enter()
      .insert("path", "g")
      .attr("class", "link")
      .attr(
        "d",
        d3
          .linkHorizontal()
          .x(() => source.y0)
          .y(() => source.x0)
      );
    linkEnter
      .merge(link)
      .transition()
      .duration(duration)
      .attr(
        "d",
        d3
          .linkHorizontal()
          .x((d) => d.y)
          .y((d) => d.x)
      );
    link
      .exit()
      .transition()
      .duration(duration)
      .attr(
        "d",
        d3
          .linkHorizontal()
          .x(() => source.y)
          .y(() => source.x)
      )
      .remove();

    nodes.forEach((d) => {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }

  function paginate(array, page, pageSize) {
    const start = (page - 1) * pageSize;
    return array.slice(start, start + pageSize);
  }

  function changeTablePage(delta) {
    state.tablePage = Math.max(1, state.tablePage + delta);
    renderTablePage();
  }

  function renderTablePage(nodes) {
    const data = (nodes || state.allNodes).filter((n) => n.depth > 0);
    const totalPages = Math.max(1, Math.ceil(data.length / state.pageSize));
    if (state.tablePage > totalPages) state.tablePage = totalPages;
    const pageItems = paginate(data, state.tablePage, state.pageSize);
    DOM.tablePage.textContent = `${state.tablePage}/${totalPages}`;
    populateTable(pageItems);
  }

  function populateTable(nodesToRender) {
    const nodes = nodesToRender || state.allNodes;
    const fragment = document.createDocumentFragment();

    nodes.forEach((node) => {
      if (node.depth === 0) return;
      const item = node.data;
      const row = document.createElement("tr");
      row.dataset.code = item.code;
      row.innerHTML = `
              <td>${item.code}</td>
              <td title="${node
                .ancestors()
                .map((d) => d.data.name)
                .reverse()
                .join(" > ")}">${item.name}</td>
              <td>${node.parent ? node.parent.data.name.split(":").pop().trim() : "N/A"}</td>
              <td><span class="salary-badge ${getSalaryClass(item.avgSalary)}">${
                item.avgSalary?.toLocaleString() || "N/A"
              } MXN</span></td>
              <td>${item.formality || "N/A"}%</td>
              <td>${item.employees?.toLocaleString() || "N/A"}</td>
          `;
      fragment.appendChild(row);
    });
    DOM.tableBody.innerHTML = "";
    DOM.tableBody.appendChild(fragment);
  }

  function changeCardsPage(delta) {
    state.cardsPage = Math.max(1, state.cardsPage + delta);
    renderCardsPage();
  }

  function renderCardsPage(divisionsInput) {
    const divisionsAll = divisionsInput && divisionsInput.length ? divisionsInput : (state.rootNode && state.rootNode.children ? state.rootNode.children : []);
    const totalPages = Math.max(1, Math.ceil(divisionsAll.length / state.pageSize));
    if (state.cardsPage > totalPages) state.cardsPage = totalPages;
    const pageItems = paginate(divisionsAll, state.cardsPage, state.pageSize);
    DOM.cardsPage.textContent = `${state.cardsPage}/${totalPages}`;
    DOM.cardsPager.classList.toggle("hidden", totalPages <= 1);
    populateCards(pageItems);
  }

  function populateCards(divisionsToRender) {
    const divisions = divisionsToRender && divisionsToRender.length ? divisionsToRender : (state.rootNode && state.rootNode.children ? state.rootNode.children : []);
    const fragment = document.createDocumentFragment();

    if (!divisions.length) {
      DOM.cardsContainer.innerHTML = "";
      return;
    }

    divisions.forEach((division) => {
      const card = document.createElement("div");
      card.className = "division-card";
      card.dataset.code = division.data.code;

      const leafNodes = division.descendants().filter((d) => !d.children && !d._children);
      const totalEmployees = d3.sum(leafNodes, (d) => d.data.employees || 0);

      card.innerHTML = `
              <div class="division-header">
                  <div class="division-title">${division.data.name}</div>
                  <div class="occupation-count">${leafNodes.length} ocupaciones</div>
              </div>
              <p><strong>Salario Promedio:</strong> ${
                division.data.avgSalary?.toLocaleString() || "N/A"
              } MXN</p>
              <p><strong>Total Empleados:</strong> ${totalEmployees.toLocaleString()}</p>
              <p><strong>Formalidad Promedio:</strong> ${division.data.formality || "N/A"}%</p>
          `;
      fragment.appendChild(card);
    });
    DOM.cardsContainer.innerHTML = "";
    DOM.cardsContainer.appendChild(fragment);
  }

  function setActiveTab(btn) {
    DOM.viewToggle.querySelectorAll('[role="tab"]').forEach((el) => {
      el.classList.remove("active");
      el.setAttribute("aria-selected", "false");
      el.setAttribute("tabindex", "-1");
    });
    btn.classList.add("active");
    btn.setAttribute("aria-selected", "true");
    btn.setAttribute("tabindex", "0");
    btn.focus();
  }

  function handleViewSwitch(e) {
    const button = e.target.closest(".view-btn");
    if (!button || button.classList.contains("active")) return;

    state.currentView = button.dataset.view;
    setActiveTab(button);

    [DOM.treeView, DOM.tableView, DOM.cardsView].forEach((view) => view.classList.add("hidden"));
    document.getElementById(`${state.currentView}View`).classList.remove("hidden");

    if (state.currentView === "table") {
      renderTablePage();
    }
    if (state.currentView === "cards") {
      renderCardsPage();
    }

    handleSearch();
  }

  function handleNodeClick(event, d) {
    toggleNode(d);
  }

  function handleNodeKeydown(event, d) {
    switch (event.key) {
      case "Enter":
      case " ":
        event.preventDefault();
        toggleNode(d);
        break;
      case "ArrowRight":
        if (d._children) { toggleNode(d); }
        break;
      case "ArrowLeft":
        if (d.children) { toggleNode(d); }
        break;
      default:
        break;
    }
  }

  function toggleNode(d) {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
    updateTree(d);
  }

  function handleTabsKeydown(e) {
    const tabs = Array.from(DOM.viewToggle.querySelectorAll('[role="tab"]'));
    const currentIndex = tabs.findIndex((t) => t.getAttribute("aria-selected") === "true");
    if (currentIndex < 0) return;
    let nextIndex = currentIndex;
    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        nextIndex = (currentIndex + 1) % tabs.length;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = tabs.length - 1;
        break;
      default:
        return;
    }
    e.preventDefault();
    tabs[nextIndex].click();
  }

  function handleSearch() {
    const searchTerm = DOM.searchInput.value.toLowerCase().trim();
    d3.selectAll(".node.search-highlight").classed("search-highlight", false);

    if (state.currentView === "tree") {
      if (!searchTerm) return;
      const matchingNodes = state.allNodes.filter(
        (node) =>
          node.data.name.toLowerCase().includes(searchTerm) ||
          node.data.code.toLowerCase().includes(searchTerm)
      );
      if (matchingNodes.length > 0) {
        expandPathToNode(matchingNodes[0]);
        centerNode(matchingNodes[0]);
        matchingNodes.forEach((node) => {
          d3.selectAll("g.node")
            .filter((d) => d.id === node.id)
            .classed("search-highlight", true);
        });
      }
    } else {
      const results = state.allNodes.filter(
        (node) =>
          node.depth > 0 &&
          (node.data.name.toLowerCase().includes(searchTerm) ||
            node.data.code.toLowerCase().includes(searchTerm) ||
            String(node.data.avgSalary).includes(searchTerm))
      );
      if (state.currentView === "table") {
        state.tablePage = 1;
        renderTablePage(results);
      } else if (state.currentView === "cards") {
        const divisionCodes = new Set(results.map((n) => n.ancestors()[1]?.data.code).filter(Boolean));
        const divisionNodes = state.rootNode.children.filter((d) => divisionCodes.has(d.data.code));
        state.cardsPage = 1;
        renderCardsPage(divisionNodes);
      }
    }
  }

  function switchViewAndHighlight(code) {
    const node = state.allNodes.find((n) => n.data.code === code);
    if (!node) return;

    if (state.currentView !== "tree") {
      document.querySelector(`.view-btn[data-view="tree"]`).click();
    }

    setTimeout(() => {
      expandPathToNode(node);
      centerNode(node);
      d3.selectAll(".node.search-highlight").classed("search-highlight", false);
      d3.selectAll("g.node").filter((d) => d.id === node.id).classed("search-highlight", true);
    }, 100);
  }

  function expandPathToNode(node) {
    node.ancestors().forEach((ancestor) => {
      if (ancestor._children) {
        ancestor.children = ancestor._children;
        ancestor._children = null;
      }
    });
    updateTree(node);
  }

  function centerNode(node) {
    const { width, height } = DOM.treeView.getBoundingClientRect();
    const transform = d3.zoomIdentity
      .translate(width / 2, height / 2)
      .scale(1.2)
      .translate(-node.y, -node.x);

    state.d3.svg.transition().duration(750).call(state.d3.zoom.transform, transform);
  }

  function handleResize() {
    if (state.currentView !== "tree") return;
    const { width, height } = DOM.treeView.getBoundingClientRect();
    state.d3.svg.attr("width", width).attr("height", height).attr("viewBox", `0 0 ${width} ${height}`);
    state.d3.treeLayout.size([height, width - 200]);
    updateTree(state.rootNode);
  }

  function handleMouseOver(event, d) {
    DOM.tooltip.style.opacity = 1;
    DOM.tooltip.setAttribute("aria-hidden", "false");
    DOM.tooltip.innerHTML = `
          <h3>${d.data.name}</h3>
          <p><strong>Código:</strong> ${d.data.code}</p>
          <p><strong>Nivel:</strong> ${getOccupationLevel(d.data.code)}</p>
          <p><strong>Salario Promedio:</strong> ${d.data.avgSalary?.toLocaleString() || "N/A"} MXN</p>
          <p><strong>Formalidad:</strong> ${d.data.formality || "N/A"}%</p>
          <p><strong>Empleados:</strong> ${d.data.employees?.toLocaleString() || "N/A"}</p>
      `;
    d3.select(event.currentTarget).classed("highlight", true);
  }

  function handleMouseMove(event) {
    DOM.tooltip.style.left = `${event.clientX + 15}px`;
    DOM.tooltip.style.top = `${event.clientY + 15}px`;
  }

  function handleMouseOut(event) {
    DOM.tooltip.style.opacity = 0;
    DOM.tooltip.setAttribute("aria-hidden", "true");
    d3.select(event.currentTarget).classed("highlight", false);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
