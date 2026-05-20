/**
 * Swiper: sec07 major treatment slider
 * AOS: https://michalsnik.github.io/aos/
 */
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

var medicalSwiper = null;

function syncSec04MedicalSwiperHeight() {
  var root = document.querySelector(".sec04-container");
  if (!root) {
    return;
  }
  var score = root.querySelector(".score");
  var swiperEl = root.querySelector(".medical-swiper");
  if (!score || !swiperEl) {
    return;
  }
  /* 모바일(세로 배치)에서는 좌측 블록 전체 높이를 그대로 쓰면 슬라이더가 과도하게 커짐 */
  if (window.matchMedia("(max-width: 768px)").matches) {
    swiperEl.style.minHeight = "";
    swiperEl.style.height = "";
  } else {
    var h = score.offsetHeight;
    swiperEl.style.minHeight = h + "px";
    swiperEl.style.height = h + "px";
  }
  if (medicalSwiper && medicalSwiper.update) {
    medicalSwiper.update();
  }
}

try {
  medicalSwiper = new Swiper(".medical-swiper", {
    loop: false,
    speed: 450,
    watchOverflow: false,
    autoHeight: false,
    slidesPerView: 1,
    spaceBetween: 12,
    navigation: {
      nextEl: ".medical-next",
      prevEl: ".medical-prev",
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
        spaceBetween: 16,
      },
      1024: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      1280: {
        slidesPerView: 2.15,
        spaceBetween: 24,
      },
    },
  });

  syncSec04MedicalSwiperHeight();
  window.addEventListener("load", syncSec04MedicalSwiperHeight);
  window.addEventListener("resize", function () {
    requestAnimationFrame(syncSec04MedicalSwiperHeight);
  });
  setTimeout(syncSec04MedicalSwiperHeight, 400);

  var scoreEl = document.querySelector(".sec04-container .score");
  if (scoreEl && typeof ResizeObserver !== "undefined") {
    var ro = new ResizeObserver(function () {
      syncSec04MedicalSwiperHeight();
    });
    ro.observe(scoreEl);
  }
} catch (e) {
  console.warn("medical Swiper init:", e);
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
