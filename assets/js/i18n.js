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
  /* BCP47 mapping for speechSynthesis voices. Add a new entry for each
     locale in SUPPORTED. Falls back to DEFAULT_LOCALE if a language
     isn't listed. */
  var BCP47 = { es: 'es-ES', en: 'en-US' };

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
        dataProtection: 'Protección de datos',
        otraAppLinkHint: 'Se abre en otra aplicación, en una pestaña nueva.',
        apptonomiaNombre: 'Apptonomia',
        calculiaNombre: 'Calculia',
        sinonimiaNombre: 'Sinonimia',
        teclatlonNombre: 'Teclatlon',
        /* Shared keypad + change-back vocabulary used by every
           sceneMode: keypad activity (driven by activity-runtime.js). */
        keypad: {
          deleteDigit: 'Borrar el último dígito',
          clear: 'Borrar todo',
          check: 'Comprobar'
        },
        challenge: {
          paid: 'Pagas con',
          purchase: 'La compra vale',
          hint: 'Piénsalo con calma.',
          hintSubtract: 'Resta: lo que pagas menos lo que vale la compra.'
        },
        practice: {
          tokensSuffix: 'monedas de práctica'
        }
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
        dataProtection: 'Data protection',
        otraAppLinkHint: 'Opens another app, in a new tab.',
        apptonomiaNombre: 'Apptonomia',
        calculiaNombre: 'Calculia',
        sinonimiaNombre: 'Sinonimia',
        teclatlonNombre: 'Teclatlon',
        keypad: {
          deleteDigit: 'Delete last digit',
          clear: 'Clear',
          check: 'Check'
        },
        challenge: {
          paid: 'You pay with',
          purchase: 'The purchase costs',
          hint: 'Think calmly.',
          hintSubtract: 'Subtract: what you pay minus what the purchase costs.'
        },
        practice: {
          tokensSuffix: 'practice tokens'
        }
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
    return BCP47[locale()] || BCP47[DEFAULT_LOCALE];
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
    if (typeof key !== 'string') return undefined;
    var parts = key.split('.');
    var current = dictForLocale;
    for (var i = 0; i < parts.length; i++) {
      if (current == null) return undefined;
      current = current[parts[i]];
    }
    return current;
  }

  function t(key) {
    if (typeof key !== 'string') return '';
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
    if (typeof key !== 'string') return '';
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
    /* data-i18n-meta="key" on a <meta> element: write the resolved
       translation into the meta's `content` attribute. Lets us
       localize <meta name="description"> and similar without changing
       the static default markup (which still reads in Spanish if
       i18n.js fails to load). */
    var metaNodes = root.querySelectorAll('[data-i18n-meta]');
    for (var k = 0; k < metaNodes.length; k++) {
      metaNodes[k].setAttribute('content', t(metaNodes[k].getAttribute('data-i18n-meta')));
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

  /* ---- language selector metadata (drives the index.html button list) ----
     LABEL is the visible text on the language button, FLAG is the emoji
     shown before it. Add a new entry per locale in SUPPORTED. */
  var LABEL = { es: 'Español', en: 'English' };
  var FLAG = { es: '🇪🇸', en: '🇬🇧' };

  /* Expose for the language selector (rendered by index.html /
     app.js). Read-only at runtime; extend these maps when adding a
     supported language. */
  window.App.i18n.LABEL = LABEL;
  window.App.i18n.FLAG = FLAG;
})();
