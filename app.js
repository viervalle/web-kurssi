
document.addEventListener("DOMContentLoaded", () => {

  // YLÄVALIKKO

  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector("#site-navigation");

  if (menuButton && navigation) {

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

    // Suljetaan valikko linkkiä painettaessa.
    navigation.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        closeMenu();
      });
    });

    // Suljetaan valikko Escape-näppäimellä.
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    // Suljetaan valikko, kun klikataan sen ulkopuolelle.
    document.addEventListener("click", event => {
      if (
        !menuButton.contains(event.target) &&
        !navigation.contains(event.target)
      ) {
        closeMenu();
      }
    });

    // Merkitään nykyinen sivu aktiiviseksi.
    const currentPage =
      window.location.pathname.split("/").pop() || "index.html";

    navigation.querySelectorAll("a").forEach(link => {
      const linkPage = link.getAttribute("href").split("#")[0];

      if (linkPage === currentPage) {
        link.setAttribute("aria-current", "page");
      }
    });
  }


  // ALATUNNISTEEN VUOSILUKU

  document.querySelectorAll("[data-year]").forEach(element => {
    element.textContent = new Date().getFullYear();
  });


  // YLÄVALIKON TYYLIT

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


  // KURSSIEN HAKU JA SUODATUS

  const search = document.querySelector("#kurssi-haku");
  const filter = document.querySelector("#kurssi-suodatus");
  const courseStatus = document.querySelector("#kurssi-tila");
  const groups = [
    ...document.querySelectorAll(".course-group")
  ];

  if (search && filter && courseStatus && groups.length) {

    // Palautetaan aikaisempi hakusana.
    try {
      search.value =
        localStorage.getItem("ajokaista-kurssihaku") || "";
    } catch (error) {
      search.value = "";
    }

    const updateCourses = () => {

      const term = search.value
        .trim()
        .toLocaleLowerCase("fi");

      const type = filter.value;

      let shown = 0;

      groups.forEach(group => {

        const matchesText = group.textContent
          .toLocaleLowerCase("fi")
          .includes(term);

        const matchesType =
          type === "kaikki" ||
          group.id === `${type}-kurssi`;

        const visible = matchesText && matchesType;

        group.hidden = !visible;

        if (visible) {
          shown++;
        }
      });

      courseStatus.textContent = shown
        ? `Näytetään ${shown} / ${groups.length} kurssia.`
        : "Hakua vastaavia kursseja ei löytynyt.";

      // Tallennetaan hakusana selaimeen.
      localStorage.setItem("hakusana", "B-ajokortti")
      
      search.addEventListener("input", () => {
        localStorage.setItem(
          "ajokaista-kurssihaku",
          search.value
        );
      } catch (error) {
        // Sivusto toimii myös ilman localStoragea.
      }
      search.value = localStorage.getItem("ajokaista-kurssihaku") || "";
    };

    search.addEventListener("input", updateCourses);
    filter.addEventListener("change", updateCourses);

    updateCourses();
  }


  // LOMAKKEEN TARKISTUS

  const form = document.querySelector("#lomake-form");
  const status = document.querySelector("#lomake-tila");

  if (form) {

    // Käytetään omia virheilmoituksia.
    form.noValidate = true;

    // Luodaan jokaiselle kentälle virheilmoitus.
    form.querySelectorAll("input, select, textarea")
      .forEach((field, index) => {

        const errorId = `kentta-virhe-${index}`;

        const error = document.createElement("span");

        error.className = "field-error";
        error.id = errorId;
        error.setAttribute("aria-live", "polite");

        const container =
          field.closest(".field") || field.parentElement;

        if (container) {
          container.appendChild(error);
        }

        field.dataset.errorId = errorId;
      });


    // Tarkistetaan lomake lähetyspainiketta painettaessa.
    form.addEventListener("submit", event => {

      event.preventDefault();

      let firstInvalid = null;

      form.querySelectorAll("input, select, textarea")
        .forEach(field => {

          const error = document.getElementById(
            field.dataset.errorId
          );

          if (!error) {
            return;
          }

          let message = "";

          // Tarkistetaan pakolliset kentät.
          if (field.required && !field.value.trim()) {

            message = "Tämä tieto tarvitaan.";

          } else if (
            field.type === "email" &&
            field.value &&
            !field.validity.valid
          ) {

            message = "Tarkista sähköpostiosoite.";
          }

          error.textContent = message;

          field.classList.toggle(
            "invalid",
            Boolean(message)
          );

          if (message) {

            field.setAttribute("aria-invalid", "true");

            const descriptions = (
              field.getAttribute("aria-describedby") || ""
            )
              .split(/\s+/)
              .filter(Boolean);

            if (!descriptions.includes(field.dataset.errorId)) {
              descriptions.push(field.dataset.errorId);
            }

            field.setAttribute(
              "aria-describedby",
              descriptions.join(" ")
            );

            if (!firstInvalid) {
              firstInvalid = field;
            }

          } else {

            field.removeAttribute("aria-invalid");

            const descriptions = (
              field.getAttribute("aria-describedby") || ""
            )
              .split(/\s+/)
              .filter(id => id && id !== field.dataset.errorId);

            if (descriptions.length) {
              field.setAttribute(
                "aria-describedby",
                descriptions.join(" ")
              );
            } else {
              field.removeAttribute("aria-describedby");
            }
          }
        });


      // Siirretään kohdistus ensimmäiseen virheelliseen kenttään.
      if (firstInvalid) {

        if (status) {
          status.textContent = "Tarkista merkityt kentät.";
        }

        firstInvalid.focus();

      } else {

        if (status) {
          status.textContent =
            "Pyyntö on valmis tarkistettavaksi. Sivusto ei lähetä pyyntöä automaattisesti.";
        }
      }
    });
  }

});
