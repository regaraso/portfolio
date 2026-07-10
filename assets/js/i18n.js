// i18n: ?lang= + localStorage. RU inline (no fetch), EN fetched from locales/en.json.
(function () {
  var q = new URLSearchParams(location.search);
  var paramLang = q.get('lang');
  var lang;

  if (paramLang === 'en' || paramLang === 'ru') {
    lang = paramLang;
    try { localStorage.setItem('lang', lang); } catch (e) {}
  } else {
    try { lang = localStorage.getItem('lang'); } catch (e) {}
    if (lang !== 'en') lang = 'ru';
  }

  document.documentElement.lang = lang;

  function wireSwitcher() {
    document.querySelectorAll('[data-lang-switch]').forEach(function (box) {
      box.querySelectorAll('[data-lang]').forEach(function (el) {
        var to = el.getAttribute('data-lang');
        el.classList.toggle('is-active', to === lang);
        var url = new URL(location.href);
        url.searchParams.set('lang', to);
        el.setAttribute('href', url.toString());
      });
    });
  }

  function apply(dict) {
    function get(k) {
      return k.split('.').reduce(function (o, p) { return o == null ? o : o[p]; }, dict);
    }
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var v = get(el.getAttribute('data-i18n'));
      if (v != null) el.textContent = v;
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var v = get(el.getAttribute('data-i18n-html'));
      if (v != null) el.innerHTML = v;
    });
    document.querySelectorAll('*').forEach(function (el) {
      for (var i = 0; i < el.attributes.length; i++) {
        var at = el.attributes[i];
        if (at.name.startsWith('data-i18n-') && at.name !== 'data-i18n-html') {
          var attr = at.name.slice('data-i18n-'.length);
          var v = get(at.value);
          if (v != null) el.setAttribute(attr, v);
        }
      }
    });
  }

  wireSwitcher();
  if (lang === 'ru') return;

  var scriptEl = document.querySelector('script[src*="i18n.js"]');
  var base = scriptEl ? scriptEl.src.replace(/assets\/js\/i18n\.js.*$/, '') : '';
  fetch(base + 'assets/locales/en.json')
    .then(function (r) { return r.json(); })
    .then(function (dict) { apply(dict); wireSwitcher(); })
    .catch(function () {});
})();
