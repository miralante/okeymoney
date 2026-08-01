/* ==========================================================================
   Okeymoney — Shared visual money (euros drawn with CSS)
   Exposes window.App.money: the coin/banknote catalog and the format/
   breakdown helpers used by the amount step (registering an expense,
   setting a goal, adding savings). CSS classes (.money-token, .coin,
   .note, .money-c5 … .money-n50, .money-table) live in
   assets/css/components.css.
   Amounts are ALWAYS in cents (integers): avoids floating-point errors.
   Load after feedback.js, before strings.<locale>.js.
   ========================================================================== */
(function () {
  'use strict';

  window.App = window.App || {};

  App.i18n.register({
    money: {
      euro: 'euro',
      euros: 'euros',
      cents: 'céntimos',
      and: 'y'
    }
  }, 'es');
  App.i18n.register({
    money: {
      euro: 'euro',
      euros: 'euros',
      cents: 'cents',
      and: 'and'
    }
  }, 'en');

  /* Catalog: one entry per denomination (no 1 and 2 cent coins — cognitive
     load; amounts are handled in multiples of 5, like real-world rounding). */
  var CATALOG = [
    { cents: 5, kind: 'coin', css: 'money-c5' },
    { cents: 10, kind: 'coin', css: 'money-c10' },
    { cents: 20, kind: 'coin', css: 'money-c20' },
    { cents: 50, kind: 'coin', css: 'money-c50' },
    { cents: 100, kind: 'coin', css: 'money-c1' },
    { cents: 200, kind: 'coin', css: 'money-c2' },
    { cents: 500, kind: 'note', css: 'money-n5' },
    { cents: 1000, kind: 'note', css: 'money-n10' },
    { cents: 2000, kind: 'note', css: 'money-n20' },
    { cents: 5000, kind: 'note', css: 'money-n50' }
  ];

  function info(cents) {
    return CATALOG.filter(function (d) { return d.cents === cents; })[0];
  }

  /** Short label printed ON the token: "2 €" or "50" (cents alone). */
  function label(cents) {
    if (cents >= 100) return (cents / 100) + ' €';
    return String(cents);
  }

  /** "1,50 €" — amount with the active language's decimal separator. */
  function format(cents) {
    var sep = App.i18n.locale() === 'en' ? '.' : ',';
    return (cents / 100).toFixed(2).replace('.', sep) + ' €';
  }

  /** "2 euros y 50 céntimos" — for speech and explanations. */
  function spoken(cents) {
    var e = Math.floor(cents / 100);
    var c = cents % 100;
    var eurosText = e === 1 ? '1 ' + App.i18n.t('money.euro') : e + ' ' + App.i18n.t('money.euros');
    var centsText = c + ' ' + App.i18n.t('money.cents');
    if (e && c) return eurosText + ' ' + App.i18n.t('money.and') + ' ' + centsText;
    if (e) return eurosText;
    return centsText;
  }

  /** Creates a decorative visual token (coin or banknote). */
  function createToken(cents) {
    var d = info(cents);
    var el = document.createElement('span');
    el.className = 'money-token ' + d.kind + ' ' + d.css;
    el.textContent = label(cents);
    el.setAttribute('role', 'img');
    el.setAttribute('aria-label', spoken(cents));
    return el;
  }

  /** Breaks an amount into tokens, largest to smallest (greedy). */
  function breakdown(cents) {
    var pieces = [];
    var remaining = cents;
    CATALOG.slice().sort(function (a, b) { return b.cents - a.cents; }).forEach(function (d) {
      while (remaining >= d.cents) {
        pieces.push(d.cents);
        remaining -= d.cents;
      }
    });
    return pieces;
  }

  /** Renders decorative tokens inside a container (clears it first). */
  function paintTokens(container, pieces) {
    container.innerHTML = '';
    (pieces || []).forEach(function (cents) {
      container.appendChild(createToken(cents));
    });
  }

  window.App.money = {
    CATALOG: CATALOG,
    info: info,
    label: label,
    format: format,
    spoken: spoken,
    createToken: createToken,
    breakdown: breakdown,
    paintTokens: paintTokens
  };
})();
