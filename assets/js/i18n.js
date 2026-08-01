/* ==========================================================================
   Okeymoney — Internationalization (i18n)
   Exposes window.App.i18n. Load AFTER utils.js and BEFORE tts.js/feedback.js.
   Standard order: utils.js -> i18n.js -> tts.js -> storage.js -> feedback.js
   -> money.js -> strings.<locale>.js -> data.js -> app.js.

   Active language: localStorage 'okeymoney:locale' if supported; otherwise
   detected from navigator.language ('es' prefix -> 'es', anything else -> 'en'
   falls back to 'es', the source of truth).

   Each strings.<locale>.js calls App.i18n.register({key: 'text', ...}, 'es'|'en').
   ========================================================================== */
(function () {
  'use strict';

  window.App = window.App || {};

  var LOCALE_KEY = 'okeymoney:locale';
  var SUPPORTED = ['es', 'en'];
  var DEFAULT_LOCALE = 'es';

  var DICT = {
    es: {
      core: {
        back: '← Volver',
        close: 'Cerrar',
        next: 'Siguiente →',
        save: 'Guardar',
        cancel: 'Cancelar',
        understood: 'Entendido',
        listen: '🔊 Escuchar',
        listenInstructions: 'Escuchar las instrucciones',
        loading: 'Cargando…',
        dataProtection: 'Protección de datos'
      },
      feedback: {
        success: ['¡Muy bien!', '¡Genial!', '¡Lo has conseguido!', '¡Estupendo!'],
        encourage: ['Casi. ¡Inténtalo otra vez!', 'No pasa nada. ¡Otra vez!']
      }
    },
    en: {
      core: {
        back: '← Back',
        close: 'Close',
        next: 'Next →',
        save: 'Save',
        cancel: 'Cancel',
        understood: 'Got it',
        listen: '🔊 Listen',
        listenInstructions: 'Listen to the instructions',
        loading: 'Loading…',
        dataProtection: 'Data protection'
      },
      feedback: {
        success: ['Well done!', 'Great!', 'You got it!', 'Fantastic!'],
        encourage: ['Almost. Try again!', "That's okay. Try again!"]
      }
    }
  };

  function detect() {
    try {
      var langs = navigator.languages && navigator.languages.length
        ? navigator.languages
        : [navigator.language || ''];
      for (var i = 0; i < langs.length; i++) {
        var prefix = (langs[i] || '').slice(0, 2).toLowerCase();
        if (SUPPORTED.indexOf(prefix) !== -1) return prefix;
      }
    } catch (e) { /* ignore */ }
    return DEFAULT_LOCALE;
  }

  function locale() {
    try {
      var saved = localStorage.getItem(LOCALE_KEY);
      if (saved && SUPPORTED.indexOf(saved) !== -1) return saved;
    } catch (e) { /* ignore */ }
    return detect();
  }

  function setLocale(loc) {
    if (SUPPORTED.indexOf(loc) === -1) return;
    try {
      localStorage.setItem(LOCALE_KEY, loc);
    } catch (e) { /* ignore */ }
    location.reload();
  }

  function lang() {
    return locale() === 'en' ? 'en-US' : 'es-ES';
  }

  /** Merges one language's texts into the internal dictionary.
      App.i18n.register({title: 'Mi dinero', ...}, 'es'); */
  function register(dict, loc) {
    if (SUPPORTED.indexOf(loc) === -1 || !dict || typeof dict !== 'object') return;
    DICT[loc] = DICT[loc] || {};
    for (var key in dict) {
      if (Object.prototype.hasOwnProperty.call(dict, key)) {
        DICT[loc][key] = dict[key];
      }
    }
  }

  function lookup(dictForLocale, key) {
    var parts = key.split('.');
    var current = dictForLocale;
    for (var i = 0; i < parts.length; i++) {
      if (current == null) return undefined;
      current = current[parts[i]];
    }
    return current;
  }

  function t(key) {
    var loc = locale();
    var value = lookup(DICT[loc], key);
    if (value === undefined && loc !== DEFAULT_LOCALE) {
      value = lookup(DICT[DEFAULT_LOCALE], key);
    }
    if (value === undefined) return key;
    if (Array.isArray(value)) return value.join(', ');
    return value;
  }

  function pick(key) {
    var loc = locale();
    var value = lookup(DICT[loc], key);
    if (!Array.isArray(value) && loc !== DEFAULT_LOCALE) {
      value = lookup(DICT[DEFAULT_LOCALE], key);
    }
    if (!Array.isArray(value) || !value.length) return '';
    return value[Math.floor(Math.random() * value.length)];
  }

  function apply(root) {
    root = root || document;
    var nodes = root.querySelectorAll('[data-i18n]');
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].textContent = t(nodes[i].getAttribute('data-i18n'));
    }
    var ariaNodes = root.querySelectorAll('[data-i18n-aria]');
    for (var j = 0; j < ariaNodes.length; j++) {
      ariaNodes[j].setAttribute('aria-label', t(ariaNodes[j].getAttribute('data-i18n-aria')));
    }
    var titleKey = document.documentElement.getAttribute('data-i18n-title');
    if (titleKey) {
      document.title = t(titleKey) + ' | Okeymoney';
    }
  }

  function init() {
    document.documentElement.lang = locale();
    apply(document);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.App.i18n = {
    SUPPORTED: SUPPORTED,
    DEFAULT_LOCALE: DEFAULT_LOCALE,
    locale: locale,
    setLocale: setLocale,
    lang: lang,
    register: register,
    t: t,
    pick: pick,
    apply: apply
  };
})();
