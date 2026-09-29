/* ==========================================================================
   Okeymoney — Activity runtime (shared core for tools/<slug>/)
   Exposes window.App.activity.run(opts), a generic Socratic loop used by
   every practice activity. Activities only need to provide:
     - DATA.cases            — array of { id, sceneHtml: <html>,
                                 options: [...]
                                 or { paidCents, costCents, agentName } for
                                 sceneMode 'keypad' }
     - a strings.<locale>.js  with the keys the runtime asks for
     - a DOM with #scene, #options, #hint, #feedback, #practiceTokens,
       #btnRestart (and #wizAmount/#wizPreview for 'keypad' mode)

   Before the cases, it shows a short didactic explanation and example. The
   person then starts the cases as a separate understanding check. On
   completion, credits the practice wallet via App.wallet and marks
   the activity done (idempotent: second run does not double-credit).
   See doc/en/technical.md §10 for the contract.

   sceneMode values:
     'html' (default) — case.options is [labelKey, labelKey, labelKey],
                        correctIndex is 0..2. Rendered in #options.
     'money-token'    — case.cents is a number; renders a token in #scene.
                        options as in 'html'.
     'money-bundle'   — case.pieces is an array of denominations; renders
                        several pieces for a counting question.
     'money-equivalent' — case.targetCents is the value to match; options
                        can describe alternative groups of pieces.
     'money-change'   — case.paidCents and case.costCents show a payment and
                        a price; options contain possible change amounts.
     'keypad'         — case.paidCents/costCents define a subtraction. The
                        runtime renders a numeric keypad inside #options,
                        a large display, and a "Check" button.
                        Correction is decided by opts.checkAnswer(value,
                        current) — returns true/false. The 2nd hint and
                        correct-answer reveal are decided by
                        opts.explainAnswer(current) — returns string.
   ========================================================================== */
(function () {
  'use strict';

  window.App = window.App || {};

  var MAX_CENTS = 9999999; /* same ceiling as the root wizard */

  function $(selector, root) { return (root || document).querySelector(selector); }
  function $$(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  /**
   * @param {object} opts
   * @param {string} opts.slug          Activity id (used for wallet + status)
   * @param {number} opts.rewardCents   Tokens credited on first completion
   * @param {Array}  opts.cases         Array of case objects (see header)
   * @param {string} [opts.sceneMode]   'html' (default) | money modes | 'keypad'
   * @param {function} [opts.checkAnswer]  (value, current) => boolean — para keypad
   * @param {function} [opts.explainAnswer] (current) => string   — para keypad
   * @param {function} [opts.formatOption] (value, current) => string — etiqueta de opción
   * @param {boolean} [opts.shuffleCases]  false keeps the learning order
   * @param {Array} [opts.moneyPresentation] denominations shown before cases
   */
  function run(opts) {
    var cases = [];
    var currentIndex = 0;
    var attemptsOnCurrent = 0;
    var totalAttempts = 0;
    var resolved = false;
    var answerLocked = false;

    function focusScene() {
      var scene = $('#scene');
      if (scene) { scene.setAttribute('tabindex', '-1'); scene.focus(); }
    }

    function clearFeedback() {
      var pista = $('#hint');
      var feedback = $('#feedback');
      if (pista) {
        pista.hidden = true;
        pista.textContent = '';
      }
      if (feedback) {
        feedback.textContent = '';
        feedback.className = 'feedback';
      }
    }

    function renderDidactic() {
      var escena = $('#scene');
      var opciones = $('#options');
      var instruction = $('#instruction');
      var btnReiniciar = $('#btnRestart');
      if (!escena || !opciones) return;

      clearFeedback();
      var progress = $('#activityProgress');
      if (progress) progress.hidden = true;
      resolved = false;
      if (btnReiniciar) btnReiniciar.hidden = true;
      if (instruction) {
        instruction.textContent = '';
        instruction.hidden = true;
      }

      escena.innerHTML =
        '<div class="actividad-didactica">' +
          '<h2>' + App.utils.escapeHtml(App.i18n.t('didacticTitle')) + '</h2>' +
          '<p>' + App.utils.escapeHtml(App.i18n.t('didacticBody')) + '</p>' +
          '<p class="actividad-didactica__example"><strong>' +
            App.utils.escapeHtml(App.i18n.t('didacticExampleLabel')) +
            ':</strong> ' + App.utils.escapeHtml(App.i18n.t('didacticExample')) + '</p>' +
        '</div>';
      if (opts.moneyPresentation && opts.moneyPresentation.length) {
        var presentation = document.createElement('div');
        presentation.className = 'actividad-presentacion';
        var presentationTitle = document.createElement('p');
        presentationTitle.className = 'actividad-presentacion__title';
        presentationTitle.textContent = App.i18n.t(opts.presentationLabelKey || 'didacticTitle');
        presentation.appendChild(presentationTitle);
        var presentationList = document.createElement('div');
        presentationList.className = 'actividad-presentacion__list';
        opts.moneyPresentation.forEach(function (cents) {
          var item = document.createElement('div');
          item.className = 'actividad-presentacion__item';
          var token = App.money.createToken(cents);
          item.appendChild(token);
          var label = document.createElement('span');
          var info = App.money.info(cents);
          var isBanknote = info && /^money-n/.test(info.css);
          var unitKey = isBanknote ? 'banknote' : 'coin';
          label.textContent = '1 ' + App.i18n.t(unitKey) + ' ' +
            App.i18n.t(isBanknote ? 'banknoteOfValue' : 'coinOfValue') + ' ' +
            App.money.spoken(cents);
          item.appendChild(label);
          presentationList.appendChild(item);
        });
        presentation.appendChild(presentationList);
        escena.querySelector('.actividad-didactica').appendChild(presentation);
      }
      opciones.innerHTML =
        '<button type="button" class="btn actividad-didactica__start" id="btnStartActivity">' +
          App.utils.escapeHtml(App.i18n.t('didacticContinue')) +
        '</button>';
      $('#btnStartActivity').addEventListener('click', function () {
        renderCurrentCase();
        focusScene();
      });
    }

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
       Render display + preview + keypad + submit inside #options.
       Maintain an integer value in cents, same as the root wizard. */
    function paintKeypad(value) {
      var amountEl = $('#wizAmount');
      var previewEl = $('#wizPreview');
      var submitBtn = $('#wizSubmit');
      if (amountEl) amountEl.textContent = App.money.format(value);
      if (previewEl && App.money.breakdown) {
        App.money.paintTokens(previewEl, App.money.breakdown(value));
      }
      if (submitBtn) submitBtn.disabled = value < 0;
    }

    function renderKeypad(onSubmit) {
      var opciones = $('#options');
      opciones.innerHTML = '';
      /* If the activity HTML already provides #wizAmount / #wizPreview /
         #wizSubmit outside #options (legacy change-back v1 layout),
         reuse them in place; otherwise create them inside #options. */
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
      submitEl.onclick = function () {
        if (submitEl.disabled) return;
        onSubmit(value);
      };
    }

    function renderMoneyGroup(container, pieces, className) {
      var group = document.createElement('div');
      group.className = className || 'actividad-dinero';
      (pieces || []).forEach(function (cents) {
        var token = App.money.createToken(cents);
        token.classList.add('token-grande');
        group.appendChild(token);
      });
      container.appendChild(group);
    }

    function renderMoneyAmount(container, labelKey, cents) {
      var block = document.createElement('div');
      block.className = 'actividad-cambio__amount';
      var label = document.createElement('span');
      label.className = 'actividad-cambio__label';
      label.textContent = App.i18n.t(labelKey);
      block.appendChild(label);
      var token;
      if (App.money.info(cents)) {
        token = App.money.createToken(cents);
        token.classList.add('token-grande');
      } else {
        token = document.createElement('span');
        token.className = 'money-amount token-grande';
        token.textContent = App.money.format(cents);
        token.setAttribute('role', 'img');
        token.setAttribute('aria-label', App.money.spoken(cents));
      }
      block.appendChild(token);
      container.appendChild(block);
    }

    function renderCurrentCase() {
      answerLocked = false;
      var current = cases[currentIndex];
      var progress = $('#activityProgress');
      if (progress) {
        progress.hidden = false;
        var progressBar = progress.querySelector('progress');
        if (progressBar) {
          progressBar.max = cases.length;
          progressBar.value = currentIndex + 1;
          progressBar.setAttribute('aria-label', App.i18n.t('core.situationProgress')
            .replace('{current}', String(currentIndex + 1)).replace('{total}', String(cases.length)));
        }
      }
      var escena = $('#scene');
      var opciones = $('#options');
      clearFeedback();
      escena.innerHTML = '';
      opciones.innerHTML = '';
      var submitEl = $('#wizSubmit');
      if (submitEl) submitEl.disabled = true;

      /* Each case can override the global sceneMode with its own
         current.sceneMode (e.g.: my-shopping-day mixes money-token with
         HTML options in a single activity). */
      var sceneMode = current.sceneMode || opts.sceneMode || 'html';
      var sceneMarkup = current.sceneHtml || current.escenaHtml; /* backwards compat with pre-migration tools */

      var instruction = $('#instruction');
      if (instruction) {
        instruction.hidden = false;
        if (sceneMode === 'keypad') {
          instruction.textContent = App.i18n.t('instruccion');
        } else if (current.instructionKey) {
          instruction.textContent = App.i18n.t(current.instructionKey);
        } else {
          instruction.textContent = App.i18n.t('instruccion');
        }
      }

      if (sceneMode === 'money-token' && typeof current.cents === 'number') {
        var token = App.money.createToken(current.cents);
        token.classList.add('token-grande');
        escena.appendChild(token);
      } else if (sceneMode === 'money-bundle') {
        renderMoneyGroup(escena, current.pieces);
      } else if (sceneMode === 'money-equivalent') {
        var equivalentTarget = document.createElement('div');
        equivalentTarget.className = 'actividad-equivalente';
        var targetLabel = document.createElement('span');
        targetLabel.className = 'actividad-equivalente__label';
      targetLabel.textContent = App.i18n.t(current.targetLabelKey || 'didacticTitle');
        equivalentTarget.appendChild(targetLabel);
        var targetToken = App.money.createToken(current.targetCents);
        targetToken.classList.add('token-grande');
        equivalentTarget.appendChild(targetToken);
        escena.appendChild(equivalentTarget);
      } else if (sceneMode === 'money-change') {
        var changeScene = document.createElement('div');
        changeScene.className = 'actividad-cambio';
        renderMoneyAmount(changeScene, current.paidLabelKey || 'didacticTitle', current.paidCents);
        renderMoneyAmount(changeScene, current.priceLabelKey || 'didacticTitle', current.costCents);
        escena.appendChild(changeScene);
      } else if (sceneMode === 'keypad') {
        /* The "scene" for keypad: render the question (you paid X,
           the purchase costs Y) and the visual purse for each amount. If the
           activity provides sceneHtml or escenaHtml, we honour it; otherwise
           we build the scene from paidCents/costCents. */
        if (sceneMarkup) {
          escena.innerHTML = sceneMarkup;
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
      } else if (sceneMarkup) {
        escena.innerHTML = sceneMarkup;
      } else if (current.sceneKey) {
        var sceneText = document.createElement('p');
        sceneText.textContent = App.i18n.t(current.sceneKey);
        escena.appendChild(sceneText);
      } else if (current.promptKey) {
        var prompt = document.createElement('p');
        prompt.className = 'instruction-interna';
        prompt.textContent = App.i18n.t(current.promptKey);
        escena.appendChild(prompt);
      }

      if (current.agent && current.agentName) {
        var agent = document.createElement('p');
        agent.className = 'agent';
        agent.textContent = ({persona: '👤', empresa: '🏪', banco: '🏦'}[current.agent] || '👤') + ' ' + App.i18n.t(current.agentName);
        escena.appendChild(agent);
      }
      var optionIndices = [];
      for (var oi = 0; oi < current.options.length; oi += 1) {
        optionIndices.push(oi);
      }
      var order = shuffle(optionIndices);
      order.forEach(function (i) {
        var optIdx = i;
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'option-btn';
        var label = current.options[optIdx];
        if (typeof opts.formatOption === 'function') {
          btn.textContent = opts.formatOption(label, current);
        } else {
          btn.textContent = typeof label === 'string' ? App.i18n.t(label) : label;
        }
        btn.setAttribute('data-idx', String(optIdx));
        btn.addEventListener('click', function () { onAnswer(btn, optIdx, current); });
        opciones.appendChild(btn);
      });

      attemptsOnCurrent = 0;
    }

    function onAnswer(btn, chosenIdx, current) {
      if (answerLocked) return;
      var pista = $('#hint');
      var feedback = $('#feedback');
      var allBtns = $$('#options .option-btn');

      if (chosenIdx === current.correctIndex) {
        btn.classList.add('correct');
        if (current.explanationKey) { pista.hidden = false; pista.textContent = App.i18n.t(current.explanationKey); }
        allBtns.forEach(function (b) { b.disabled = true; });
        feedback.textContent = App.i18n.t('core.understood') + ' ✓';
        feedback.className = 'feedback success';
        App.feedback.success();
        offerContinue();
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
          if (Number(b.getAttribute('data-idx')) === current.correctIndex) {
            b.classList.add('correct');
          }
        });
        pista.hidden = false;
        pista.textContent = App.i18n.t(current.explanationKey || current.hintKey || 'pistaSigue');
        offerContinue();
      } else {
        pista.hidden = false;
        pista.textContent = App.i18n.t(current.hintKey || 'pistaSigue');
        App.feedback.lockUntilAck(allBtns, feedback);
      }
    }

    /* Socratic loop para sceneMode: 'keypad'. Mismo ritmo que onAnswer:
       acierto → 700 ms y avanza; 1er fallo → pista; 2º fallo → explicación
       con la response correcta visible y avanza. */
    function onKeypadAnswer(value, current) {
      if (answerLocked) return;
      var pista = $('#hint');
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
        offerContinue();
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
        offerContinue();
      } else {
        pista.hidden = false;
        pista.textContent = App.i18n.t('core.challenge.hintSubtract') || App.i18n.t('core.challenge.hint') || '';
        App.feedback.lockUntilAck($$('#options .keypad-key'), feedback, function () {
          if (submitBtn) submitBtn.disabled = false;
        });
      }
    }

    function offerContinue() {
      answerLocked = true;
      $$('#options button').forEach(function (b) { b.disabled = true; });
      var submit = $('#wizSubmit');
      if (submit) submit.disabled = true;
      var feedback = $('#feedback');
      App.feedback.lockUntilAck([], feedback, function () {
        currentIndex += 1;
        if (currentIndex >= cases.length) finishActivity();
        else {
          renderCurrentCase();
          focusScene();
        }
      });
    }

    function finishActivity() {
      resolved = true;
      var progress = $('#activityProgress');
      if (progress) progress.hidden = true;
      var escena = $('#scene');
      var opciones = $('#options');
      var pista = $('#hint');
      var feedback = $('#feedback');
      var btnReiniciar = $('#btnRestart');
      escena.innerHTML = '';
      opciones.innerHTML = '';
      var instruction = $('#instruction');
      if (instruction) instruction.hidden = true;
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
        App.wallet.markActivityDone(opts.slug);
        feedback.textContent = App.i18n.t('completado') + ' +' +
          App.money.formatPractice(opts.rewardCents);
        feedback.className = 'feedback success';
        App.feedback.celebrate(App.i18n.t('completado'));
      } else {
        feedback.textContent = App.i18n.t('yaCompletada');
        feedback.className = 'feedback';
      }
      refreshWalletChip();
      var transfer = document.createElement('p');
      transfer.textContent = App.i18n.t(opts.transferKey || 'target');
      escena.appendChild(transfer);
      var back = document.querySelector('.tool-header .back-link');
      if (back) {
        var returnLink = back.cloneNode(true);
        returnLink.className = 'btn';
        opciones.appendChild(returnLink);
      }
      btnReiniciar.hidden = false;
      focusScene();
    }

    function init() {
      cases = opts.shuffleCases === false ? (opts.cases || opts.casos || []).slice() : shuffle(opts.cases || opts.casos || []);
      currentIndex = 0;
      attemptsOnCurrent = 0;
      totalAttempts = 0;
      resolved = false;

      var btnReiniciar = $('#btnRestart');
      if (btnReiniciar) {
        btnReiniciar.addEventListener('click', function () {
          cases = opts.shuffleCases === false ? (opts.cases || opts.casos || []).slice() : shuffle(opts.cases || opts.casos || []);
          currentIndex = 0;
          attemptsOnCurrent = 0;
          totalAttempts = 0;
          btnReiniciar.hidden = true;
          /* If we ended in keypad mode, the submit was hidden by
             finishActivity(); recover it for the new round. */
          var submitEl = $('#wizSubmit');
          if (submitEl) submitEl.style.display = '';
          renderDidactic();
          $('#btnStartActivity').focus();
        });
      }

      var progress = document.createElement('div');
      progress.id = 'activityProgress';
      progress.className = 'actividad-progress';
      progress.hidden = true;
      progress.setAttribute('role', 'status');
      progress.innerHTML = '<progress max="1" value="0"></progress>';
      var scene = $('#scene');
      scene.parentNode.insertBefore(progress, scene);
      refreshWalletChip();
      App.i18n.apply();
      renderDidactic();
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  }

  window.App.activity = { run: run };
})();
