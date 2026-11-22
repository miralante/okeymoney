/* ============================================================
   Okeymoney — Erase the person's data (hidden route).
   Restores the text size and the language to their defaults.
   Balance, movements, goals, commitments and practice tokens are kept.
   Two-step confirmation: the first tap asks to confirm, the second
   one resets. The label reverts after 5 seconds without a second tap.
   ============================================================ */
(function () {
  'use strict';

  var $ = App.utils.$;

  function confirmTwice(btn, normalKey, confirmKey, onConfirm) {
    var confirming = false;
    var timeoutId = null;
    btn.textContent = App.i18n.t(normalKey);
    btn.addEventListener('click', function () {
      if (!confirming) {
        confirming = true;
        btn.textContent = App.i18n.t(confirmKey);
        timeoutId = setTimeout(function () {
          confirming = false;
          btn.textContent = App.i18n.t(normalKey);
        }, 5000);
        return;
      }
      clearTimeout(timeoutId);
      confirming = false;
      btn.textContent = App.i18n.t(normalKey);
      onConfirm();
    });
  }

  function resetPersonalData() {
    App.storage.remove('prefs');
    App.storage.remove('locale');
    App.storage.set('prefs', { textSize: 'normal', sounds: true });
    App.i18n.setLocale('es');
    var f = $('#feedbackPersona');
    if (f) {
      f.textContent = App.i18n.t('personal.done');
      f.className = 'feedback acierto';
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    App.i18n.apply();
    confirmTwice($('#btnBorrarPersona'), 'personal.button', 'personal.confirm', resetPersonalData);
  });
})();
