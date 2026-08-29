/* ==========================================================================
   tools/concepts-money/app.js
   Activity: "Cuenta tu dinero sin dudas" — recognise a coin or banknote
   so the learner can add it to a balance and check a payment. 8 cases per
   locale, 3 options each, no timer, two-step Socratic help, +12 tokens on
   completion. Uses the
   shared runtime at assets/js/activity-runtime.js. The case catalog
   lives in data.js and is locale-driven.
   ========================================================================== */
(function () {
  'use strict';

  App.activity.run({
    slug: 'concepts-money',
    rewardCents: DATA.rewardCents,
    sceneMode: 'money-token',
    casos: DATA.casos,
    formatOption: function (cents) {
      return App.money.format(cents);
    }
  });
})();
