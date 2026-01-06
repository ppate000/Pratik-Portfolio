const tabs = Array.from(document.querySelectorAll(".tab"));
const panels = Array.from(document.querySelectorAll(".panel"));

function isIndex() {
  return panels.length > 0;
}

function setActive(targetId) {
  tabs.forEach((t) => {
    if (!t.dataset || !t.dataset.target) return;
    const isActive = t.dataset.target === targetId;
    t.classList.toggle("active", isActive);
    t.setAttribute("aria-selected", String(isActive));
  });

  panels.forEach((p) => {
    p.classList.toggle("active", p.id === targetId);
  });

  history.replaceState(null, "", `#${targetId}`);
}

if (isIndex()) {
  document.querySelectorAll("[data-jump]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const target = el.getAttribute("data-jump");
      setActive(target);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  tabs.forEach((tab) => {
    if (!tab.dataset || !tab.dataset.target) return;
    tab.addEventListener("click", () => {
      setActive(tab.dataset.target);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  const initial = (location.hash || "#about").replace("#", "");
  const exists = panels.some((p) => p.id === initial);
  setActive(exists ? initial : "about");
}

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());


