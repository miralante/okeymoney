/* ==========================================================================
   tools/concepts-money/app.js
   Activity: "Cuenta tu dinero" — recognise coins and banknotes, count a
   group of pieces, make equivalent values, and work out change. Ordered
   cases, 3 options each, no timer, two-step Socratic help, +12 tokens on
   completion. Uses the
   shared runtime at assets/js/activity-runtime.js. The case catalog
   lives in data.js and is locale-driven.
   ========================================================================== */
(function () {
  'use strict';

  function presentationValues() {
    var locale = App.i18n.locale();
    var seen = {};
    return App.money.CATALOG.filter(function (entry) {
      return entry.currencies.indexOf(locale) !== -1;
    }).map(function (entry) {
      return entry.cents;
    }).filter(function (cents) {
      if (seen[cents]) return false;
      seen[cents] = true;
      return true;
    });
  }

  function describeDenomination(cents, count) {
    var info = App.money.info(cents);
    var isBanknote = info && /^money-n/.test(info.css);
    var unitKey = isBanknote
      ? (count === 1 ? 'banknote' : 'banknotes')
      : (count === 1 ? 'coin' : 'coins');
    return count + ' ' + App.i18n.t(unitKey) + ' ' +
      App.i18n.t(isBanknote ? 'banknoteOfValue' : 'coinOfValue') + ' ' +
      App.money.spoken(cents);
  }

  function describePieces(pieceValues) {
    var groups = [];
    pieceValues.forEach(function (cents) {
      var group = groups.filter(function (item) { return item.cents === cents; })[0];
      if (group) {
        group.count += 1;
      } else {
        groups.push({ cents: cents, count: 1 });
      }
    });
    return groups.map(function (group) {
      return describeDenomination(group.cents, group.count);
    }).join(' + ');
  }

  App.activity.run({
    slug: 'concepts-money',
    rewardCents: DATA.rewardCents,
    sceneMode: 'money-token',
    shuffleCases: false,
    moneyPresentation: presentationValues(),
    presentationLabelKey: 'didacticPresentationLabel',
    casos: DATA.casos,
    formatOption: function (value) {
      if (typeof value === 'number') return App.money.format(value);
      if (value && value.pieces) return describePieces(value.pieces);
      return '';
    }
  });
})();
