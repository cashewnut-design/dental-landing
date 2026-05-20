/**
 * sec11 카카오 지도 (정적 map.png 대체)
 */
(function () {
  var config = window.DENTAL_KAKAO_MAP || {};
  var mapEl = document.getElementById("clinic-map");

  if (!mapEl) {
    return;
  }

  function showFallback(message) {
    mapEl.classList.add("kakao-map--fallback");
    mapEl.innerHTML =
      '<p class="kakao-map__fallback-msg">' +
      message +
      "</p>";
  }

  if (!config.appKey) {
    showFallback(
      "카카오 지도 API 키가 필요합니다.<br>assets/js/kakao-map.config.js 파일의 appKey에 발급받은 키를 입력해 주세요."
    );
    return;
  }

  function initMap() {
    if (typeof kakao === "undefined" || !kakao.maps) {
      showFallback("카카오 지도 SDK를 불러오지 못했습니다.");
      return;
    }

    var lat = Number(config.lat);
    var lng = Number(config.lng);
    var level = Number(config.level) || 3;

    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      showFallback("지도 좌표 설정이 올바르지 않습니다.");
      return;
    }

    var center = new kakao.maps.LatLng(lat, lng);
    var map = new kakao.maps.Map(mapEl, {
      center: center,
      level: level,
    });

    var marker = new kakao.maps.Marker({
      position: center,
    });
    marker.setMap(map);

    function refreshMapLayout() {
      map.relayout();
      map.setCenter(center);
    }

    window.addEventListener("resize", refreshMapLayout);
    window.addEventListener("load", refreshMapLayout);
    /* AOS 등으로 섹션이 나타난 뒤 지도 크기 재계산 */
    setTimeout(refreshMapLayout, 400);
    setTimeout(refreshMapLayout, 1200);
  }

  function loadSdk() {
    if (window.kakao && window.kakao.maps) {
      kakao.maps.load(initMap);
      return;
    }

    var script = document.createElement("script");
    script.src =
      "//dapi.kakao.com/v2/maps/sdk.js?appkey=" +
      encodeURIComponent(config.appKey) +
      "&autoload=false";
    script.async = true;
    script.onload = function () {
      kakao.maps.load(initMap);
    };
    script.onerror = function () {
      showFallback("카카오 지도 SDK를 불러오지 못했습니다. API 키와 도메인 설정을 확인해 주세요.");
    };
    document.head.appendChild(script);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadSdk);
  } else {
    loadSdk();
  }
})();
