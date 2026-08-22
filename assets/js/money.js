/* ==========================================================================
   Okeymoney — Shared visual money (multi-currency, locale-driven)

   Real wallet amounts are formatted per the active locale's currency:
     - es → euros   (€)
     - en → US dollars ($)

   The Practice wallet keeps its fictitious "Tokens" currency, regardless
   of locale (the practice plane is intentionally separated from the real
   plane; see SPEC.md §3.6.b).

   All amounts are ALWAYS in cents (integers): avoids floating-point
   errors. The catalog below lists the denominations that exist in either
   currency; each currency exposes only the subset that makes sense for
   it (e.g. € does not include 25¢, $ does not include 2€ or 20€).

   CSS classes (.money-token, .coin, .note, .money-c5 … .money-n50,
   .money-c1us … .money-n100us) live in assets/css/components.css.
   Load after feedback.js, before strings.<locale>.js.
   ========================================================================== */
(function () {
  'use strict';

  window.App = window.App || {};

  App.i18n.register({
    money: {
      major: 'euro',
      majorPlural: 'euros',
      minor: 'céntimos',
      and: 'y',
      symbol: '€'
    },
    practice: {
      name: 'token',
      plural: 'tokens',
      sub: 'subtokens',
      symbol: '🪙'
    }
  }, 'es');
  App.i18n.register({
    money: {
      major: 'dollar',
      majorPlural: 'dollars',
      minor: 'cents',
      and: 'and',
      symbol: '$'
    },
    practice: {
      name: 'token',
      plural: 'tokens',
      sub: 'subtokens',
      symbol: '🪙'
    }
  }, 'en');

  var CATALOG = [
    { cents: 1,     css: 'money-c1us',  currencies: ['en'] },
    { cents: 5,     css: 'money-c5',    currencies: ['es', 'en'] },
    { cents: 10,    css: 'money-c10',   currencies: ['es', 'en'] },
    { cents: 20,    css: 'money-c20',   currencies: ['es'] },
    { cents: 25,    css: 'money-c25us', currencies: ['en'] },
    { cents: 50,    css: 'money-c50',   currencies: ['es', 'en'] },
    { cents: 100,   css: 'money-c1',    currencies: ['es'] },
    { cents: 100,   css: 'money-d1us',  currencies: ['en'] },
    { cents: 200,   css: 'money-c2',    currencies: ['es'] },
    { cents: 500,   css: 'money-n5',    currencies: ['es'] },
    { cents: 500,   css: 'money-n5us',  currencies: ['en'] },
    { cents: 1000,  css: 'money-n10',   currencies: ['es'] },
    { cents: 1000,  css: 'money-n10us', currencies: ['en'] },
    { cents: 2000,  css: 'money-n20',   currencies: ['es'] },
    { cents: 2000,  css: 'money-n20us', currencies: ['en'] },
    { cents: 5000,  css: 'money-n50',   currencies: ['es'] },
    { cents: 5000,  css: 'money-n50us', currencies: ['en'] },
    { cents: 10000, css: 'money-n100us', currencies: ['en'] }
  ];

  function info(cents, loc) {
    loc = loc || App.i18n.locale();
    var entries = CATALOG.filter(function (d) {
      return d.cents === cents && d.currencies.indexOf(loc) !== -1;
    });
    return entries[0];
  }

  function kindFromCss(css) {
    return /^money-n/.test(css) ? 'note' : 'coin';
  }

  function label(cents) {
    var sym = App.i18n.t('money.symbol') || '€';
    if (cents >= 100) return sym + ' ' + (cents / 100);
    return String(cents);
  }

  var DECIMAL_SEP = { es: ',', en: '.' };

  function format(cents) {
    var loc = App.i18n.locale();
    var sep = DECIMAL_SEP[loc] || DECIMAL_SEP[App.i18n.DEFAULT_LOCALE] || ',';
    var sym = App.i18n.t('money.symbol') || '€';
    var num = (cents / 100).toFixed(2).replace('.', sep);
    return num + ' ' + sym;
  }

  function formatPractice(cents) {
    var loc = App.i18n.locale();
    var sep = DECIMAL_SEP[loc] || DECIMAL_SEP[App.i18n.DEFAULT_LOCALE] || ',';
    var symbol = (App.i18n.t('practice.symbol') || '🪙') + ' ';
    return symbol + (cents / 100).toFixed(2).replace('.', sep);
  }

  function spokenPractice(cents) {
    var n = Math.floor(cents / 100);
    var c = cents % 100;
    var nameKey = n === 1 ? 'practice.name' : 'practice.plural';
    var nameText = n + ' ' + App.i18n.t(nameKey);
    if (n && c) return nameText + ' ' + App.i18n.t('money.and') + ' ' + c + ' ' + App.i18n.t('practice.sub');
    if (n) return nameText;
    return c + ' ' + App.i18n.t('practice.sub');
  }

  function spoken(cents) {
    var e = Math.floor(cents / 100);
    var c = cents % 100;
    var majorKey = e === 1 ? 'money.major' : 'money.majorPlural';
    var majorText = e + ' ' + App.i18n.t(majorKey);
    var minorText = c + ' ' + App.i18n.t('money.minor');
    if (e && c) return majorText + ' ' + App.i18n.t('money.and') + ' ' + minorText;
    if (e) return majorText;
    return minorText;
  }

  function createToken(cents) {
    var loc = App.i18n.locale();
    var d = info(cents, loc);
    if (!d) d = info(cents, 'es');
    var el = document.createElement('span');
    el.className = 'money-token ' + kindFromCss(d.css) + ' ' + d.css;
    el.textContent = label(cents);
    el.setAttribute('role', 'img');
    el.setAttribute('aria-label', spoken(cents));
    return el;
  }

  function breakdown(cents) {
    var loc = App.i18n.locale();
    var pool = CATALOG
      .filter(function (d) { return d.currencies.indexOf(loc) !== -1; })
      .slice()
      .sort(function (a, b) { return b.cents - a.cents; });
    var pieces = [];
    var remaining = cents;
    pool.forEach(function (d) {
      while (remaining >= d.cents) {
        pieces.push(d.cents);
        remaining -= d.cents;
      }
    });
    return pieces;
  }

  function paintTokens(container, pieces) {
    if (!container) return;
    container.innerHTML = '';
    (pieces || []).forEach(function (cents) {
      var token = createToken(cents);
      container.appendChild(token);
    });
  }

  window.App.money = {
    CATALOG: CATALOG,
    info: info,
    label: label,
    format: format,
    formatPractice: formatPractice,
    spokenPractice: spokenPractice,
    spoken: spoken,
    createToken: createToken,
    breakdown: breakdown,
    paintTokens: paintTokens
  };
})();