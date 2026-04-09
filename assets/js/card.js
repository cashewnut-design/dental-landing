/**
 * 주요 진료 — 풀뷰포트 카드 슬라이더 (Swiper)
 * jQuery 로드 후 실행
 */
    var swiper = new Swiper(".sec07__slider", {
      slidesPerView: 3,
      spaceBetween: 30,
      freeMode: true,
            loop: true,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    });