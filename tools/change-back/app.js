/* tools/change-back — Calcular la vuelta.
   Actividad numérica (6 casos): pagas con X, la compra vale Y, hay que
   escribir la vuelta (X − Y). El keypad, el display, el botón
   "Comprobar", el Socratic 2-intentos y la recompensa de práctica los
   gestiona el runtime compartido (assets/js/activity-runtime.js) bajo
   sceneMode: 'keypad'. */
(function () {
  'use strict';

  /* checkAnswer: ¿el valor tecleado es la vuelta correcta? */
  function checkAnswer(value, current) {
    return value === (current.paidCents - current.costCents);
  }

  /* explainAnswer: lo que se muestra cuando el usuario falla dos veces.
     Muestra el cálculo con el resultado correcto. */
  function explainAnswer(current) {
    var diff = current.paidCents - current.costCents;
    return App.i18n.t('pistaExplica') + ' ' +
      App.i18n.t('core.challenge.paid') + ' ' + App.money.format(current.paidCents) + ' − ' +
      App.i18n.t('core.challenge.purchase') + ' ' + App.money.format(current.costCents) + ' = ' +
      App.money.format(diff);
  }

  App.activity.run({
    slug: 'change-back',
    rewardCents: DATA.rewardCents,
    sceneMode: 'keypad',
    checkAnswer: checkAnswer,
    explainAnswer: explainAnswer,
    casos: DATA.casos
  });
})();
