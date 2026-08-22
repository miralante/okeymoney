/* ==========================================================================
   tools/concepts-money/app.js
   Activity: "¿Qué es el dinero?" — identify a coin or banknote by
   tapping the matching amount. 8 cases per locale, 3 options each, no
   timer, two-step Socratic help, +12 tokens on completion. Uses the
   shared runtime at assets/js/activity-runtime.js. The case catalog
   lives in data.js and is locale-driven.
   ========================================================================== */
(function () {
  'use strict';

  App.activity.run({
    slug: 'concepts-money',
    rewardCents: DATA.rewardCents,
    sceneMode: 'money-token',
    casos: DATA.casos
  });
})();