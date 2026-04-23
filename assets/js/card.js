/**
 * Swiper: sec07 major treatment slider
 * AOS: https://michalsnik.github.io/aos/
 */
function applySec05AosAttributes() {
  var bars = document.querySelectorAll(".sec05-container .system-bar");
  for (var i = 0; i < bars.length; i++) {
    bars[i].setAttribute("data-aos", "zoom-in");
    bars[i].setAttribute("data-aos-duration", "650");
    bars[i].setAttribute("data-aos-delay", String(80 + i * 80));
  }
}

function aosFallback() {
  document.documentElement.classList.add("aos-fallback");
}

function safeAosRefresh() {
  try {
    if (typeof AOS !== "undefined" && AOS.refresh) {
      AOS.refresh();
    }
  } catch (e) {}
}

function setupHamburgerMenu() {
  var hamburger = document.querySelector(".hambergur");
  var gnb = document.querySelector(".gnb");

  if (!hamburger || !gnb) {
    return;
  }

  function closeMenu() {
    gnb.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
  }

  hamburger.setAttribute("aria-expanded", "false");

  hamburger.addEventListener("click", function (e) {
    e.stopPropagation();
    var isOpen = gnb.classList.toggle("open");
    hamburger.setAttribute("aria-expanded", String(isOpen));
  });

  document.addEventListener("click", function (e) {
    if (!gnb.classList.contains("open")) {
      return;
    }
    if (hamburger.contains(e.target) || gnb.contains(e.target)) {
      return;
    }
    closeMenu();
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 768) {
      closeMenu();
    }
  });

  var navLinks = gnb.querySelectorAll("a");
  for (var i = 0; i < navLinks.length; i++) {
    navLinks[i].addEventListener("click", closeMenu);
  }
}

try {
  var sec07Swiper = new Swiper(".sec07__slider", {
    slidesPerView: 3,
    spaceBetween: 24,
    loop: true,
    speed: 700,
    watchOverflow: true,
    pagination: {
      el: ".sec07__pagination",
      clickable: true,
    },
    breakpoints: {
      0: {
        slidesPerView: 1,
        spaceBetween: 12,
      },
      769: {
        slidesPerView: 3,
        spaceBetween: 24,
      },
    },
  });
} catch (e) {
  console.warn("sec07 Swiper init:", e);
}

try {
  var medicalSwiper = new Swiper(".medical-swiper", {
    loop: true,
    navigation: {
      nextEl: ".medical-next",
      prevEl: ".medical-prev",
    },
    breakpoints: {
      1280: {
        slidesPerView: 4,
        spaceBetween: 24,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 16,
      },
      0: {
        slidesPerView: 1,
        spaceBetween: 12,
      },
    },
  });
} catch (e) {
  console.warn("medical Swiper init:", e);
}

try {
  applySec05AosAttributes();
} catch (e) {
  console.warn("sec05 AOS attrs:", e);
}

try {
  setupHamburgerMenu();
} catch (e) {
  console.warn("hamburger menu:", e);
}

if (typeof AOS === "undefined") {
  aosFallback();
} else {
  try {
    AOS.init({
      duration: 750,
      easing: "ease-out-cubic",
      once: true,
      offset: 120,
      anchorPlacement: "top-bottom",
    });

    window.addEventListener("load", safeAosRefresh);
    requestAnimationFrame(safeAosRefresh);
    setTimeout(safeAosRefresh, 100);
    setTimeout(safeAosRefresh, 400);
    setTimeout(safeAosRefresh, 1000);
  } catch (e) {
    console.warn("AOS.init:", e);
    aosFallback();
  }
}
