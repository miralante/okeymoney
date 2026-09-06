/* ============================================================
   Okeymoney — Settings (hidden route)
   View/reset what's saved in localStorage. Two actions:
   - "Reset the person's data": clears text-size + language
     preference only. Balance, movements, goals, commitments
     and practice tokens are kept.
   - "Reset the whole app": clears every key under the
     'okeymoney:' prefix (equivalent to opening the app for
     the first time).
   Two-step confirmation (same pattern as routime/settings
   and calculia/settings): one tap asks to confirm, the second
   deletes.
   ============================================================ */
(function () {
  'use strict';

  var $ = App.utils.$;

  var KEPT_KEYS = ['data', 'practiceWallet'];
  var PII_KEYS = ['prefs', 'locale'];

  function renderState() {
    var data = App.storage.get('data');
    var practice = App.storage.get('practiceWallet');
    var languageName = App.i18n.t(App.i18n.locale() === 'en' ? 'languageNameEn' : 'languageNameEs');

    var balanceCents = (typeof data.initialBalanceCents === 'number')
      ? data.initialBalanceCents
      : 0;
    var movementsCount = Array.isArray(data.movements) ? data.movements.length : 0;
    var goalsCount = Array.isArray(data.goals) ? data.goals.length : 0;
    var commitmentsCount = Array.isArray(data.commitments) ? data.commitments.length : 0;
    var tokens = (typeof practice.tokens === 'number') ? practice.tokens : 0;

    var balanceText = (App.money && typeof App.money.format === 'function')
      ? App.money.format(balanceCents)
      : (balanceCents / 100).toFixed(2) + ' €';

    var items = [
      App.i18n.t('currentLanguage').replace('{lang}', languageName),
      App.i18n.t('balanceCurrent').replace('{amount}', balanceText),
      App.i18n.t('movementsCount').replace('{n}', String(movementsCount)),
      App.i18n.t('goalsCount').replace('{n}', String(goalsCount)),
      App.i18n.t('commitmentsCount').replace('{n}', String(commitmentsCount)),
      App.i18n.t('practiceTokens').replace('{n}', String(tokens))
    ];

    var list = $('#listaEstado');
    if (!list) return;
    list.innerHTML = '';
    items.forEach(function (text) {
      var li = document.createElement('li');
      li.textContent = text;
      list.appendChild(li);
    });
  }

  /* Two-step confirmation on the same button.
     The label flips to "confirmReset..." until the second tap (5s
     timeout reverts it). The reset only runs on the second tap. */
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
    PII_KEYS.forEach(function (key) { App.storage.remove(key); });
    App.storage.set('prefs', { textSize: 'normal', sounds: true });
    App.i18n.setLocale('es');
    var f = $('#feedbackPersona');
    if (f) {
      f.textContent = App.i18n.t('feedbackResetPersonalDone');
      f.className = 'feedback acierto';
    }
    renderState();
  }

  function resetEverything() {
    if (App.storage.clearAll && typeof App.storage.clearAll === 'function') {
      App.storage.clearAll();
    } else {
      KEPT_KEYS.concat(PII_KEYS).forEach(function (key) { App.storage.remove(key); });
    }
    var f = $('#feedbackTodo');
    if (f) {
      f.textContent = App.i18n.t('feedbackResetAllDone');
      f.className = 'feedback acierto';
    }
    renderState();
  }

  function wireLanguageButtons() {
    var currentLocale = App.i18n.locale();
    App.utils.$$('.btn-idioma').forEach(function (btn) {
      var pressed = btn.dataset.locale === currentLocale;
      btn.setAttribute('aria-pressed', String(pressed));
      btn.addEventListener('click', function () {
        App.i18n.setLocale(btn.dataset.locale);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    wireLanguageButtons();
    renderState();
    App.i18n.apply();

    confirmTwice(
      $('#btnBorrarPersona'),
      'btnResetPersonal',
      'confirmResetPersonal',
      resetPersonalData
    );
    confirmTwice(
      $('#btnBorrarTodo'),
      'btnResetAll',
      'confirmResetAll',
      resetEverything
    );
  });
})();
