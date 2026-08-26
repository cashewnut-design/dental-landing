/**
 * i18n.js
 * 헤더의 언어 드롭다운(KOR / ENG / JPN)을 제어하고,
 * data-i18n / data-i18n-attr 속성이 붙은 요소의 텍스트를 교체합니다.
 * 실제 문구 데이터는 assets/js/i18n-data.js 의 window.I18N_DATA 를 사용합니다.
 */
(function () {
  var STORAGE_KEY = "site-lang";
  var SUPPORTED = ["ko", "en", "ja"];
  var DEFAULT_LANG = "ko";
  var LABELS = { ko: "KOR", en: "ENG", ja: "JPN" };

  function getSavedLang() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved && SUPPORTED.indexOf(saved) !== -1) {
        return saved;
      }
    } catch (e) {}
    return DEFAULT_LANG;
  }

  function saveLang(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {}
  }

  function lookup(dict, key) {
    if (!dict) return null;
    var parts = key.split(".");
    var cur = dict;
    for (var i = 0; i < parts.length; i++) {
      if (cur == null) return null;
      cur = cur[parts[i]];
    }
    return typeof cur === "string" ? cur : null;
  }

  function applyLanguage(lang) {
    if (SUPPORTED.indexOf(lang) === -1) {
      lang = DEFAULT_LANG;
    }

    var data = window.I18N_DATA || {};
    var dict = data[lang] || data[DEFAULT_LANG];
    if (!dict) {
      return;
    }

    document.documentElement.setAttribute("lang", lang);

    // 텍스트 (innerHTML: <br>, <a> 등 서식이 포함된 값을 그대로 반영)
    var textNodes = document.querySelectorAll("[data-i18n]");
    for (var i = 0; i < textNodes.length; i++) {
      var key = textNodes[i].getAttribute("data-i18n");
      var value = lookup(dict, key);
      if (value != null) {
        textNodes[i].innerHTML = value;
      }
    }

    // 속성 (alt, placeholder, aria-label 등)
    // 형식: data-i18n-attr="attr:key" 또는 "attr1:key1|attr2:key2"
    var attrNodes = document.querySelectorAll("[data-i18n-attr]");
    for (var j = 0; j < attrNodes.length; j++) {
      var spec = attrNodes[j].getAttribute("data-i18n-attr");
      var pairs = spec.split("|");
      for (var k = 0; k < pairs.length; k++) {
        var pair = pairs[k].split(":");
        var attrName = pair[0];
        var attrKey = pair[1];
        if (!attrName || !attrKey) continue;
        var attrValue = lookup(dict, attrKey);
        if (attrValue != null) {
          attrNodes[j].setAttribute(attrName, attrValue);
        }
      }
    }

    // <title>
    var titleValue = lookup(dict, "meta.title");
    if (titleValue) {
      document.title = titleValue;
    }

    // 드롭다운 UI 상태 갱신
    var options = document.querySelectorAll(".lang-select__option");
    for (var m = 0; m < options.length; m++) {
      var isActive = options[m].getAttribute("data-lang") === lang;
      options[m].classList.toggle("is-active", isActive);
      options[m].setAttribute("aria-selected", String(isActive));
    }
    var triggerLabel = document.querySelector(".lang-select__trigger-label");
    if (triggerLabel) {
      triggerLabel.textContent = LABELS[lang] || LABELS[DEFAULT_LANG];
    }

    saveLang(lang);

    // 언어별 텍스트 길이 차이로 섹션 높이가 바뀔 수 있으므로 AOS 위치 재계산
    try {
      if (typeof AOS !== "undefined" && AOS.refresh) {
        AOS.refresh();
      }
    } catch (e) {}
  }

  function setupLangSwitcher() {
    var root = document.querySelector(".lang-select");
    if (!root) {
      return;
    }
    var trigger = root.querySelector(".lang-select__trigger");
    var menu = root.querySelector(".lang-select__menu");
    if (!trigger || !menu) {
      return;
    }

    function closeMenu() {
      root.classList.remove("is-open");
      trigger.setAttribute("aria-expanded", "false");
    }

    function toggleMenu() {
      var isOpen = root.classList.toggle("is-open");
      trigger.setAttribute("aria-expanded", String(isOpen));
    }

    trigger.setAttribute("aria-expanded", "false");
    trigger.addEventListener("click", function (e) {
      e.stopPropagation();
      toggleMenu();
    });

    document.addEventListener("click", function (e) {
      if (!root.classList.contains("is-open")) {
        return;
      }
      if (root.contains(e.target)) {
        return;
      }
      closeMenu();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        closeMenu();
      }
    });

    var options = root.querySelectorAll(".lang-select__option");
    for (var i = 0; i < options.length; i++) {
      options[i].addEventListener("click", function (e) {
        e.stopPropagation();
        var lang = this.getAttribute("data-lang");
        if (lang) {
          applyLanguage(lang);
        }
        closeMenu();
      });
    }
  }

  window.applyLanguage = applyLanguage;

  setupLangSwitcher();
  applyLanguage(getSavedLang());
})();
