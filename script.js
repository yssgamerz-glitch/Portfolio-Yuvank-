(function () {
  var THEME_KEY = "profile-theme";
  var html = document.documentElement;
  var themeToggle = document.getElementById("theme-toggle");
  var searchInput = document.getElementById("project-search");
  var techFilter = document.getElementById("project-tech-filter");
  var projectItems = document.querySelectorAll("#project-list > li");
  var emptyMessage = document.getElementById("project-empty");

  function preferredTheme() {
    var saved = localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark") {
      return saved;
    }
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  }

  function applyTheme(theme) {
    html.setAttribute("data-theme", theme);
    if (themeToggle) {
      var isDark = theme === "dark";
      themeToggle.setAttribute("aria-pressed", String(isDark));
      themeToggle.textContent = isDark ? "Light mode" : "Dark mode";
    }
  }

  function filterProjects() {
    var query = (searchInput && searchInput.value ? searchInput.value : "")
      .trim()
      .toLowerCase();
    var selectedTech = techFilter ? techFilter.value : "all";
    var visibleCount = 0;

    projectItems.forEach(function (item) {
      var name = (item.getAttribute("data-name") || "").toLowerCase();
      var techs = (item.getAttribute("data-tech") || "")
        .toLowerCase()
        .split(",")
        .map(function (part) {
          return part.trim();
        })
        .filter(Boolean);
      var title = (item.querySelector("a") && item.querySelector("a").textContent) || "";
      var description = Array.prototype.map
        .call(item.querySelectorAll("p"), function (p) {
          return p.textContent;
        })
        .join(" ")
        .toLowerCase();

      var matchesQuery =
        !query ||
        name.indexOf(query) !== -1 ||
        techs.some(function (tech) {
          return tech.indexOf(query) !== -1;
        }) ||
        title.toLowerCase().indexOf(query) !== -1 ||
        description.indexOf(query) !== -1;

      var matchesTech = selectedTech === "all" || techs.indexOf(selectedTech) !== -1;

      var show = matchesQuery && matchesTech;
      item.hidden = !show;
      if (show) {
        visibleCount += 1;
      }
    });

    if (emptyMessage) {
      emptyMessage.hidden = visibleCount !== 0;
    }
  }

  applyTheme(preferredTheme());

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var next = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
      localStorage.setItem(THEME_KEY, next);
      applyTheme(next);
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", filterProjects);
  }

  if (techFilter) {
    techFilter.addEventListener("change", filterProjects);
  }
})();
