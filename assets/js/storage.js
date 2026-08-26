/* ==========================================================================
   Okeymoney — localStorage persistence
   Exposes window.App.storage.get(key) / .set(key, data) / .remove(key) /
   .clearAll(). Internal prefix: 'okeymoney:'. No personal data, no accounts.
   Always fault-tolerant (private browsing mode can throw exceptions).
   ========================================================================== */
(function () {
  'use strict';

  window.App = window.App || {};

  var PREFIX = 'okeymoney:';

  /* Applies right away the text-size preference saved in prefs (rule:
     only once in the shared core, never per screen — storage.js loads
     before anything is painted). --text-scale defaults to 1 (tokens.css),
     so anyone who hasn't touched the preference sees no change. */
  (function applyTextSize() {
    try {
      var raw = localStorage.getItem(PREFIX + 'prefs');
      var prefs = raw ? JSON.parse(raw) : {};
      var SCALE = { normal: 1, large: 1.15, extraLarge: 1.3 };
      var scale = SCALE[prefs.textSize] || 1;
      document.documentElement.style.setProperty('--text-scale', scale);
    } catch (e) { /* silent: keeps the default size */ }
  })();

  /**
   * Reads a saved value.
   * @param {string} key - e.g. 'data', 'prefs', 'locale'
   * @returns {object} saved value, or {} if there is none / on error
   */
  function get(key) {
    try {
      var raw = localStorage.getItem(PREFIX + key);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  /**
   * Saves a value.
   * @param {string} key
   * @param {object} data - JSON-serializable value
   * @returns {boolean} true if it was saved
   */
  function set(key, data) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(data));
      return true;
    } catch (e) {
      return false;
    }
  }

  /** Deletes one saved key. */
  function remove(key) {
    try {
      localStorage.removeItem(PREFIX + key);
      return true;
    } catch (e) {
      return false;
    }
  }

  /** Deletes every 'okeymoney:*' key (full reset, used by /legal/ and settings). */
  function clearAll() {
    try {
      var toDelete = [];
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && k.indexOf(PREFIX) === 0) toDelete.push(k);
      }
      toDelete.forEach(function (k) { localStorage.removeItem(k); });
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Returns a portable snapshot of every Okeymoney key, without exposing
   * the localStorage prefix. Used by the local backup flow in the app.
   */
  function dump() {
    var snapshot = {};
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        if (key && key.indexOf(PREFIX) === 0) {
          var raw = localStorage.getItem(key);
          try {
            snapshot[key.slice(PREFIX.length)] = JSON.parse(raw);
          } catch (parseError) {
            /* locale is intentionally stored as a plain string by i18n.js. */
            snapshot[key.slice(PREFIX.length)] = raw;
          }
        }
      }
    } catch (e) { /* return the keys collected before a storage error */ }
    return snapshot;
  }

  /** Replaces local Okeymoney data from a previously validated snapshot. */
  function restore(snapshot) {
    if (!snapshot || typeof snapshot !== 'object' || Array.isArray(snapshot)) return false;
    try {
      clearAll();
      Object.keys(snapshot).forEach(function (key) {
        if (key === '__proto__' || key === 'constructor' || key === 'prototype') return;
        if (key === 'locale' && typeof snapshot[key] === 'string') {
          localStorage.setItem(PREFIX + key, snapshot[key]);
        } else {
          set(key, snapshot[key]);
        }
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  window.App.storage = {
    get: get,
    set: set,
    remove: remove,
    clearAll: clearAll,
    dump: dump,
    restore: restore
  };
})();
