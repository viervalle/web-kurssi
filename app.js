
document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");

  // Rakennetaan sivuston navigaatio JavaScriptillä.
  if (header) {
    const menuButton = header.querySelector(".menu-toggle");

    if (menuButton) {
      // Luodaan oikeat hamburger-valikon palkit.
      menuButton.type = "button";
      menuButton.setAttribute("aria-label", "Avaa valikko");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-controls", "site-navigation");
      menuButton.replaceChildren();

      for (let i = 0; i < 3; i += 1) {
        const bar = document.createElement("span");
        bar.className = "menu-toggle__bar";
        bar.setAttribute("aria-hidden", "true");
        menuButton.appendChild(bar);
      }

      let navigation = header.querySelector("#site-navigation");

      if (!navigation) {
        navigation = document.createElement("nav");
        navigation.id = "site-navigation";
        navigation.className = "site-nav";
        navigation.setAttribute("aria-label", "Päävalikko");

        const links = [
          { href: "index.html", text: "Etusivu" },
          { href: "listing.html", text: "Kurssit" },
          { href: "about.html", text: "Ajokaistasta" },
          { href: "contact.html", text: "Yhteystiedot" }
        ];

        links.forEach(({ href, text }) => {
          const link = document.createElement("a");
          link.href = href;
          link.textContent = text;
          navigation.appendChild(link);
        });

        header.appendChild(navigation);
      }

      // Merkitään nykyinen sivu aktiiviseksi.
      const currentPage =
        window.location.pathname.split("/").pop() || "index.html";

      navigation.querySelectorAll("a").forEach((link) => {
        const linkPage = link.getAttribute("href").split("#")[0];

        if (linkPage === currentPage) {
          link.setAttribute("aria-current", "page");
        }
      });

      const closeMenu = () => {
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Avaa valikko");
        navigation.classList.remove("is-open");
      };

      menuButton.addEventListener("click", () => {
        const isOpen =
          menuButton.getAttribute("aria-expanded") === "true";

        menuButton.setAttribute("aria-expanded", String(!isOpen));
        menuButton.setAttribute(
          "aria-label",
          isOpen ? "Avaa valikko" : "Sulje valikko"
        );

        navigation.classList.toggle("is-open", !isOpen);
      });

      navigation.addEventListener("click", (event) => {
        if (event.target.closest("a")) {
          closeMenu();
        }
      });

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          closeMenu();
        }
      });

      document.addEventListener("click", (event) => {
        if (!header.contains(event.target)) {
          closeMenu();
        }
      });
    }
  }

  // Päivitetään alatunnisteen vuosiluku automaattisesti.
  document.querySelectorAll("[data-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  // Navigaation tyylit ja mobiilivalikko.
  if (!document.querySelector("#ajokaista-navigation-styles")) {
    const style = document.createElement("style");

    style.id = "ajokaista-navigation-styles";

    style.textContent = `
      .site-header {
        position: relative;
      }

      .site-nav {
        display: flex;
        align-items: center;
        gap: 24px;
        margin-left: auto;
      }

      .site-nav a {
        color: #f5efe0;
        text-decoration: none;
        font-weight: 700;
        font-size: .9rem;
        transition: color .2s ease;
      }

      .site-nav a:hover,
      .site-nav a[aria-current="page"] {
        color: #f2b544;
      }

      .menu-toggle {
        display: none;
      }

      @media (max-width: 760px) {
        .site-header {
          flex-wrap: wrap;
        }

        .menu-toggle {
          display: flex;
          margin-left: auto;
          cursor: pointer;
        }

        .site-nav {
          display: none;
          width: 100%;
          margin: 8px 0 0;
          padding: 14px 0 4px;
          flex-direction: column;
          align-items: flex-start;
          gap: 14px;
          border-top: 1px solid rgba(245,239,224,.22);
        }

        .site-nav.is-open {
          display: flex;
        }
      }
    `;

    document.head.appendChild(style);
  }
});
