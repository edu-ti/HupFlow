// Reversa Docs Header Navigation Sync
document.addEventListener("DOMContentLoaded", function () {
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const navContainer = document.querySelector(".reversa-doc-nav");

  if (navContainer && window.RV_DATA && Array.isArray(window.RV_DATA.nav)) {
    // If nav items are not yet rendered, render them dynamically
    if (!navContainer.children.length) {
      navContainer.innerHTML = window.RV_DATA.nav
        .map(item => `<a href="${item.href}" data-page-id="${item.id}" class="${currentPath === item.href ? 'active' : ''}">${item.label}</a>`)
        .join("");
    } else {
      // Highlight current link
      const links = navContainer.querySelectorAll("a");
      links.forEach(link => {
        const href = link.getAttribute("href");
        if (href === currentPath || (currentPath === "" && href === "index.html")) {
          link.classList.add("active");
          link.setAttribute("aria-current", "page");
        } else {
          link.classList.remove("active");
          link.removeAttribute("aria-current");
        }
      });
    }
  }

  // Inject mini-seal if container exists
  const miniSealTarget = document.getElementById("reversa-mini-seal-slot");
  if (miniSealTarget && window.RV_DATA && window.RV_DATA.sealMiniSvg) {
    miniSealTarget.innerHTML = window.RV_DATA.sealMiniSvg;
  }
});
