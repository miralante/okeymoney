/* ==========================================================================
   Okeymoney — Activity runtime (shared core for tools/<slug>/)
   Exposes window.App.activity.run(opts), a generic Socratic loop used by
   every practice activity. Activities only need to provide:
     - DATA.casos             — array of { id, scene: <html>, opciones: [...]
                                  or { paidCents, costCents, agenteName } for
                                  sceneMode 'keypad' }
     - a strings.<locale>.js   with the keys the runtime asks for
     - a DOM with #escena, #opciones, #pista, #feedback, #practiceTokens,
       #btnReiniciar (and #wizAmount/#wizPreview for 'keypad' mode)

   On completion, credits the practice wallet via App.wallet and marks
   the activity done (idempotent: second run does not double-credit).
   See doc/en/technical.md §10 for the contract.

   sceneMode values:
     'html' (default) — caso.opciones is [labelKey, labelKey, labelKey],
                        correctaIndex is 0..2. Pintado en #opciones.
     'money-token'    — caso.cents is a number; pinta un token en #escena.
                        opciones as in 'html'.
     'keypad'         — caso.paidCents/costCents define una resta. El
                        runtime pinta un keypad numérico dentro de
                        #opciones + display grande + botón "Comprobar".
                        La corrección la decide opts.checkAnswer(value,
                        current) — devuelve true/false. La 2ª pista y la
                        revelación de la respuesta correcta las decide
                        opts.explainAnswer(current) — devuelve string.
   ========================================================================== */
(function () {
  'use strict';

  window.App = window.App || {};

  var MAX_CENTS = 9999999; /* mismo techo que el wizard raíz */

  function $(selector, root) { return (root || document).querySelector(selector); }
  function $$(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  /**
   * @param {object} opts
   * @param {string} opts.slug          Activity id (used for wallet + status)
   * @param {number} opts.rewardCents   Tokens credited on first completion
   * @param {Array}  opts.casos         Array of case objects (see header)
   * @param {string} [opts.sceneMode]   'html' (default) | 'money-token' | 'keypad'
   * @param {function} [opts.checkAnswer]  (value, current) => boolean — para keypad
   * @param {function} [opts.explainAnswer] (current) => string   — para keypad
   */
  function run(opts) {
    var cases = [];
    var currentIndex = 0;
    var attemptsOnCurrent = 0;
    var totalAttempts = 0;
    var resolved = false;

    function refreshWalletChip() {
      /* Indicador de tokens de práctica (esquina superior derecha de
         la cabecera del tool). El saldo se redondea hacia abajo:
         1 token = 100 céntimos = 1 € de práctica. Pintamos solo el
         número entero; el emoji 🪙 lo añade el CSS via ::before en
         .tool-header .practice-tokens. */
      var tokens = $('#practiceTokens');
      if (tokens) {
        var n = Math.floor(App.wallet.balance() / 100);
        tokens.textContent = String(n);
        tokens.setAttribute('aria-label', n + ' ' + App.i18n.t('core.practice.tokensSuffix'));
      }
    }

    function shuffle(arr) {
      var a = arr.slice();
      for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
      }
      return a;
    }

    /* ---- Keypad helpers (sceneMode: 'keypad') ----
       Renderizan display + preview + keypad + submit dentro de #opciones.
       Mantienen un valor entero en cents, igual que el wizard raíz. */
    function paintKeypad(value) {
      var amountEl = $('#wizAmount');
      var previewEl = $('#wizPreview');
      var submitBtn = $('#wizSubmit');
      if (amountEl) amountEl.textContent = App.money.format(value);
      if (previewEl && App.money.breakdown) {
        App.money.paintTokens(previewEl, App.money.breakdown(value));
      }
      if (submitBtn) submitBtn.disabled = value <= 0;
    }

    function renderKeypad(onSubmit) {
      var opciones = $('#opciones');
      opciones.innerHTML = '';
      /* Si el HTML de la actividad ya trae #wizAmount / #wizPreview /
         #wizSubmit fuera de #opciones (caso heredado de change-back v1),
         los reusamos en sitio; si no, los creamos dentro de #opciones. */
      var haveAmount = !!$('#wizAmount');
      var havePreview = !!$('#wizPreview');
      var haveSubmit = !!$('#wizSubmit');
      if (!haveAmount) {
        var amountEl = document.createElement('div');
        amountEl.id = 'wizAmount';
        amountEl.className = 'amount-display';
        amountEl.setAttribute('aria-live', 'polite');
        opciones.appendChild(amountEl);
      }
      if (!havePreview) {
        var previewEl = document.createElement('div');
        previewEl.id = 'wizPreview';
        previewEl.className = 'money-table';
        previewEl.setAttribute('aria-hidden', 'true');
        opciones.appendChild(previewEl);
      }

      var keypadEl = document.createElement('div');
      keypadEl.className = 'keypad';
      opciones.appendChild(keypadEl);

      var submitEl;
      if (!haveSubmit) {
        submitEl = document.createElement('button');
        submitEl.type = 'button';
        submitEl.id = 'wizSubmit';
        submitEl.className = 'btn';
        submitEl.textContent = App.i18n.t('core.keypad.check');
        submitEl.disabled = true;
        opciones.appendChild(submitEl);
      } else {
        submitEl = $('#wizSubmit');
      }

      var value = 0;
      var keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0', '⌦'];
      keys.forEach(function (k) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'keypad-key';
        btn.textContent = k;
        if (k === '⌫') btn.setAttribute('aria-label', App.i18n.t('core.keypad.deleteDigit'));
        if (k === '⌦') btn.setAttribute('aria-label', App.i18n.t('core.keypad.clear'));
        btn.addEventListener('click', function () {
          if (k === '⌫') value = Math.floor(value / 10);
          else if (k === '⌦') value = 0;
          else {
            var n = value * 10 + Number(k);
            if (n <= MAX_CENTS) value = n;
          }
          paintKeypad(value);
        });
        keypadEl.appendChild(btn);
      });

      paintKeypad(0);
      submitEl.addEventListener('click', function () {
        if (submitEl.disabled) return;
        onSubmit(value);
      });
    }

    function renderCurrentCase() {
      var current = cases[currentIndex];
      var escena = $('#escena');
      var opciones = $('#opciones');
      var pista = $('#pista');
      var feedback = $('#feedback');
      pista.hidden = true;
      pista.textContent = '';
      feedback.textContent = '';
      feedback.className = 'feedback';
      escena.innerHTML = '';
      opciones.innerHTML = '';
      var submitEl = $('#wizSubmit');
      if (submitEl) submitEl.disabled = true;

      /* Cada caso puede sobreescribir el sceneMode global con su propio
         current.sceneMode (ej.: my-shopping-day mezcla money-token con
         opciones HTML en una sola actividad). */
      var sceneMode = current.sceneMode || opts.sceneMode || 'html';

      var instruction = $('#instruccion');
      if (instruction) {
        if (sceneMode === 'keypad') {
          instruction.textContent = App.i18n.t('instruccion');
        } else if (current.instruccionKey) {
          instruction.textContent = App.i18n.t(current.instruccionKey);
        }
      }

      if (sceneMode === 'money-token' && typeof current.cents === 'number') {
        var token = App.money.createToken(current.cents);
        token.classList.add('token-grande');
        escena.appendChild(token);
      } else if (sceneMode === 'keypad') {
        /* La "escena" para keypad: pintamos la pregunta (pagas con X, la
           compra vale Y) y el monedero visual de cada cantidad. Si la
           actividad provee current.sceneHtml, lo respetamos; si no,
           montamos la escena a partir de paidCents/costCents. */
        if (current.sceneHtml) {
          escena.innerHTML = current.sceneHtml;
        } else {
          escena.innerHTML = '';
          var lbl1 = document.createElement('span');
          lbl1.textContent = App.i18n.t('core.challenge.paid') + ' ';
          var pay = document.createElement('span');
          pay.className = 'money-token note token-grande';
          pay.textContent = App.money.format(current.paidCents);
          pay.setAttribute('role', 'img');
          pay.setAttribute('aria-label', App.money.spoken(current.paidCents));
          var lbl2 = document.createElement('span');
          lbl2.textContent = ' · ' + App.i18n.t('core.challenge.purchase') + ' ';
          var compra = document.createElement('span');
          compra.className = 'money-token note token-grande';
          compra.textContent = App.money.format(current.costCents);
          compra.setAttribute('role', 'img');
          compra.setAttribute('aria-label', App.money.spoken(current.costCents));
          escena.appendChild(lbl1); escena.appendChild(pay);
          escena.appendChild(lbl2); escena.appendChild(compra);
        }
        renderKeypad(function (value) { onKeypadAnswer(value, current); });
        attemptsOnCurrent = 0;
        return;
      } else if (current.sceneHtml) {
        escena.innerHTML = current.sceneHtml;
      } else if (current.promptKey) {
        var prompt = document.createElement('p');
        prompt.className = 'instruccion-interna';
        prompt.textContent = App.i18n.t(current.promptKey);
        escena.appendChild(prompt);
      }

      var optionIndices = [];
      for (var oi = 0; oi < current.opciones.length; oi += 1) {
        optionIndices.push(oi);
      }
      var order = shuffle(optionIndices);
      order.forEach(function (i) {
        var optIdx = i;
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'opcion-btn';
        var label = current.opciones[optIdx];
        btn.textContent = typeof label === 'string' ? App.i18n.t(label) : label;
        btn.setAttribute('data-idx', String(optIdx));
        btn.addEventListener('click', function () { onAnswer(btn, optIdx, current); });
        opciones.appendChild(btn);
      });

      attemptsOnCurrent = 0;
    }

    function onAnswer(btn, chosenIdx, current) {
      var pista = $('#pista');
      var feedback = $('#feedback');
      var allBtns = $$('#opciones .opcion-btn');

      if (chosenIdx === current.correctaIndex) {
        btn.classList.add('correcta');
        allBtns.forEach(function (b) { b.disabled = true; });
        feedback.textContent = App.i18n.t('core.understood') + ' ✓';
        feedback.className = 'feedback success';
        App.feedback.success();
        setTimeout(function () {
          currentIndex += 1;
          if (currentIndex >= cases.length) {
            finishActivity();
          } else {
            renderCurrentCase();
          }
        }, 700);
        return;
      }

      attemptsOnCurrent += 1;
      totalAttempts += 1;
      btn.classList.add('animo');
      App.feedback.encourage();
      feedback.textContent = App.i18n.t('fallo');
      feedback.className = 'feedback encourage';

      if (attemptsOnCurrent >= 2) {
        allBtns.forEach(function (b) {
          b.disabled = true;
          if (Number(b.getAttribute('data-idx')) === current.correctaIndex) {
            b.classList.add('correcta');
          }
        });
        pista.hidden = false;
        pista.textContent = App.i18n.t(current.explicacionKey || current.pistaKey || 'pistaSigue');
        setTimeout(function () {
          currentIndex += 1;
          if (currentIndex >= cases.length) {
            finishActivity();
          } else {
            renderCurrentCase();
          }
        }, 1800);
      } else {
        pista.hidden = false;
        pista.textContent = App.i18n.t(current.pistaKey || 'pistaSigue');
      }
    }

    /* Socratic loop para sceneMode: 'keypad'. Mismo ritmo que onAnswer:
       acierto → 700 ms y avanza; 1er fallo → pista; 2º fallo → explicación
       con la respuesta correcta visible y avanza. */
    function onKeypadAnswer(value, current) {
      var pista = $('#pista');
      var feedback = $('#feedback');
      var submitBtn = $('#wizSubmit');
      if (submitBtn) submitBtn.disabled = true;

      var ok = typeof opts.checkAnswer === 'function'
        ? !!opts.checkAnswer(value, current)
        : false;

      if (ok) {
        feedback.textContent = App.i18n.t('core.understood') + ' ✓';
        feedback.className = 'feedback success';
        App.feedback.success();
        setTimeout(function () {
          currentIndex += 1;
          if (currentIndex >= cases.length) {
            finishActivity();
          } else {
            renderCurrentCase();
          }
        }, 700);
        return;
      }

      attemptsOnCurrent += 1;
      totalAttempts += 1;
      App.feedback.encourage();
      feedback.textContent = App.i18n.t('fallo');
      feedback.className = 'feedback encourage';

      if (attemptsOnCurrent >= 2) {
        pista.hidden = false;
        pista.textContent = typeof opts.explainAnswer === 'function'
          ? opts.explainAnswer(current)
          : (App.i18n.t('core.challenge.hint') || '');
        setTimeout(function () {
          currentIndex += 1;
          if (currentIndex >= cases.length) {
            finishActivity();
          } else {
            renderCurrentCase();
          }
        }, 1800);
      } else {
        pista.hidden = false;
        pista.textContent = App.i18n.t('core.challenge.hintSubtract') || App.i18n.t('core.challenge.hint') || '';
      }
    }

    function finishActivity() {
      resolved = true;
      var escena = $('#escena');
      var opciones = $('#opciones');
      var pista = $('#pista');
      var feedback = $('#feedback');
      var btnReiniciar = $('#btnReiniciar');
      escena.innerHTML = '';
      opciones.innerHTML = '';
      pista.hidden = true;
      feedback.textContent = '';
      feedback.className = 'feedback';
      /* Si la actividad es de keypad, también vaciamos display/preview y
         reseteamos el submit-button para que no quede habilitado. */
      var amountEl = $('#wizAmount');
      if (amountEl) amountEl.textContent = '';
      var previewEl = $('#wizPreview');
      if (previewEl) previewEl.innerHTML = '';
      var submitEl = $('#wizSubmit');
      if (submitEl) {
        submitEl.disabled = true;
        submitEl.style.display = 'none';
      }

      var already = App.wallet.activityStatus(opts.slug);
      if (!already || !already.done) {
        App.wallet.credit(opts.rewardCents, 'activity:' + opts.slug);
        App.wallet.markActivityDone(opts.slug, totalAttempts);
        feedback.textContent = App.i18n.t('completado') + ' +' +
          App.money.formatPractice(opts.rewardCents);
        feedback.className = 'feedback success';
        App.feedback.celebrate(App.i18n.t('completado'));
      } else {
        feedback.textContent = App.i18n.t('yaCompletada');
        feedback.className = 'feedback';
      }
      refreshWalletChip();
      btnReiniciar.hidden = false;
    }

    function init() {
      cases = shuffle(opts.casos.slice());
      currentIndex = 0;
      attemptsOnCurrent = 0;
      totalAttempts = 0;
      resolved = false;

      var btnReiniciar = $('#btnReiniciar');
      if (btnReiniciar) {
        btnReiniciar.addEventListener('click', function () {
          cases = shuffle(opts.casos.slice());
          currentIndex = 0;
          attemptsOnCurrent = 0;
          totalAttempts = 0;
          btnReiniciar.hidden = true;
          /* Si terminamos en modo keypad, el submit quedó hidden por
             finishActivity(); lo recuperamos para el nuevo round. */
          var submitEl = $('#wizSubmit');
          if (submitEl) submitEl.style.display = '';
          renderCurrentCase();
        });
      }

      refreshWalletChip();
      App.i18n.apply();
      renderCurrentCase();
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  }

  window.App.activity = { run: run };
})();
