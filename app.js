/* ==========================================================================
   Okeymoney — App logic
   Single-page app: one long home scroll (Mi dinero → Mis metas → catálogo
   de actividades), sharing one ledger in localStorage, plus a full-screen
   step-by-step wizard reused by every flow that asks for an amount
   (register an expense, set how much money you have, set a goal's price,
   add money to a goal). FAB flotante lanza "Apuntar un gasto".
   Requires assets/js (App.utils, App.i18n, App.storage, App.feedback,
   App.money) and data.js.
   ========================================================================== */
(function () {
  'use strict';

  var $ = App.utils.$;
  var $$ = App.utils.$$;
  var SLUG = 'data';
  var MAX_CENTS = 9999999; /* 99 999,99 € — generous ceiling for the keypad */

  /* ---------- State (shared ledger) ---------- */
  var state = App.storage.get(SLUG);
  state.version = 1;
  if (typeof state.initialBalanceCents !== 'number') state.initialBalanceCents = 0;
  if (!Array.isArray(state.movements)) state.movements = [];
  if (!Array.isArray(state.goals)) state.goals = [];

  function save() { App.storage.set(SLUG, state); }

  /** Net effect of every movement on the balance (income - expense - saving). */
  function movementsNet() {
    var net = 0;
    state.movements.forEach(function (m) {
      if (m.type === 'income') net += m.amountCents;
      else if (m.type === 'expense') net -= m.amountCents;
      else if (m.type === 'saving') net -= m.amountCents;
    });
    return net;
  }

  function balanceCents() {
    return state.initialBalanceCents + movementsNet();
  }

  /** Sets the CURRENT balance to `cents`, adjusting the starting point so
      past movements stay untouched (recounting money, not rewriting history). */
  function setBalanceTo(cents) {
    state.initialBalanceCents = cents - movementsNet();
    save();
  }

  function categoryById(id) {
    return DATA.categories.filter(function (c) { return c.id === id; })[0];
  }

  function goalById(id) {
    return state.goals.filter(function (g) { return g.id === id; })[0];
  }

  /* ---------- Navigation ----------
     Sin pestañas (Fase 3): el home es un único scroll. El único "salto"
     real es ocultar el home para mostrar el wizard a pantalla completa. */
  var wizard = null; /* { type, step, ...fields } while a wizard is open */

  function openWizard(w) {
    wizard = w;
    /* El home queda en el DOM pero "detrás" del wizard. Cuando el wizard
       se cierra, simplemente lo ocultamos y el home ya está renderizado. */
    $('#screen-wizard').classList.remove('hidden');
    document.body.classList.add('wizard-open');
    renderWizard();
  }

  function closeWizard() {
    wizard = null;
    $('#screen-wizard').classList.add('hidden');
    document.body.classList.remove('wizard-open');
    renderHome();
  }

  /* ---------- Home (single long scroll, estilo Routime) ----------
     Cabecera tipo catálogo (idioma + marca + saludo),
     barra de anclas a módulos temáticos, y debajo dos tarjetas
     grandes (Mi dinero · Mis metas) más la sección de catálogo.
     El monedero de práctica (🔑) NO aparece como tarjeta propia:
     su saldo se ve en el contador 🪙 de la cabecera de cada tool
     tool. Las anclas las genera el JS desde DATA.learnThemes. */
  function renderHome() {
    /* Cabecera: solo el saludo. El saldo de práctica (App.wallet)
       ya no se muestra aquí — el indicador vive en la cabecera de
       cada tool (esquina superior derecha), que es donde el usuario
       lo ve crecer al completar actividades. */
    var saludo = $('#saludo');
    if (saludo) saludo.textContent = App.i18n.t('home.saludo');

    /* Anclas a cada módulo temático (Conceptos · Vida cotidiana ·
       Seguridad). El catálogo pintará las tarjetas reales; las
       anclas son solo un índice de salto. */
    renderModuleAnchors();

    /* Tarjeta Mi dinero — el saldo real, grande y centrado. */
    var balEl = $('#balanceValue');
    if (balEl) balEl.textContent = App.money.format(balanceCents());

    /* Tarjeta Mis metas — resumen: si no hay metas, mostramos el
       empty + CTA; si hay, mostramos la primera meta con su
       progreso y un pequeño sufijo "+N más". */
    renderMetasResumen();

    /* Catálogo de actividades (módulos temáticos con tarjetas
       picto + nombre + detalle). Lo pinta el runtime compartido. */
    renderActivityThemes($('#homeActivities'));
  }

  /* Pinta la barra de anclas (#mod-concepts / #mod-daily / #mod-safety)
     desde DATA.learnThemes. Cada ancla lleva el accent del módulo para
     que el bordeado se vea del color del tema al que apunta. */
  function renderModuleAnchors() {
    var wrap = $('#anclasModulo');
    if (!wrap) return;
    wrap.innerHTML = '';
    DATA.learnThemes.forEach(function (theme) {
      var a = document.createElement('a');
      a.href = '#mod-' + theme.id;
      a.className = 'ancla-modulo';
      a.style.setProperty('--acento', getComputedStyle(document.documentElement).getPropertyValue('--' + theme.accent).trim());
      var label = App.i18n.t('learn.themes.' + theme.id);
      a.textContent = label;
      a.setAttribute('aria-label', App.i18n.t('home.anchorAria').replace('{theme}', label));
      wrap.appendChild(a);
    });
  }

  /* Tarjeta "Mis metas": un resumen compacto. Cuando NO hay metas,
     muestra el mensaje empty + CTA "+ Nueva meta". Cuando hay,
     muestra la primera meta con su porcentaje y el sufijo "+N más"
     si hay más. */
  function renderMetasResumen() {
    var detalle = $('#metasResumen');
    var cta = $('#metasCta');
    if (!detalle || !cta) return;
    if (!state.goals.length) {
      detalle.textContent = App.i18n.t('goals.empty');
      cta.textContent = App.i18n.t('goals.newButton');
      return;
    }
    var g = state.goals[0];
    var pct = g.targetCents > 0 ? Math.min(100, Math.round((g.savedCents / g.targetCents) * 100)) : 0;
    var extra = state.goals.length > 1
      ? ' ' + App.i18n.t('home.moreGoals').replace('{n}', String(state.goals.length - 1))
      : '';
    detalle.textContent =
      g.icon + ' ' + App.utils.escapeHtml(g.name) + ' — ' +
      App.i18n.t('goals.progressText')
        .replace('{saved}', App.money.format(g.savedCents))
        .replace('{target}', App.money.format(g.targetCents)) +
      ' (' + pct + '%)' + extra;
    cta.textContent = '+ ' + App.i18n.t('goals.addButton').replace('+ ', '');
  }

  /* Click en la tarjeta "Mi dinero" → abre el wizard para fijar el
     saldo. La tarjeta sigue siendo un <a> para tener semántica de
     enlace, pero navegamos a wizard en lugar de a otra página. */
  var tarjetaSaldo = $('#tarjetaSaldo');
  if (tarjetaSaldo) {
    tarjetaSaldo.addEventListener('click', function (e) {
      e.preventDefault();
      openWizard({ type: 'setBalance', step: 1, amountCents: Math.max(balanceCents(), 0) });
    });
  }

  /* Click en la tarjeta "Mis metas" → si no hay metas, abre el
     wizard de nueva meta; si hay, abre el wizard de añadir dinero
     a la primera meta (atajo rápido). */
  var tarjetaMetas = $('#tarjetaMetas');
  if (tarjetaMetas) {
    tarjetaMetas.addEventListener('click', function (e) {
      e.preventDefault();
      if (!state.goals.length) {
        openWizard({ type: 'goalNew', step: 1, name: '', icon: DATA.goalIcons[0], targetCents: 0 });
      } else {
        openWizard({ type: 'goalAdd', step: 1, goalId: state.goals[0].id, amountCents: 0 });
      }
    });
  }

  $('#btnNewExpense').addEventListener('click', function () {
    openWizard({ type: 'expense', step: 1, categoryId: null, amountCents: 0 });
  });

  function renderGoals() {
    /* Deprecated en Fase 3: la pantalla Mis metas ya no existe como
       pestaña. La tarjeta grande del home (#tarjetaMetas) la pinta
       renderMetasResumen(). Esta función se conserva vacía por si
       alguien la llama por error desde código viejo; no hace nada. */
    var list = $('#goalList');
    if (!list) return;
    list.innerHTML = '';
    state.goals.forEach(function (g) {
      var pct = g.targetCents > 0 ? Math.min(100, Math.round((g.savedCents / g.targetCents) * 100)) : 0;
      var card = document.createElement('div');
      card.className = 'goal-card' + (g.achieved ? ' achieved' : '');
      card.innerHTML =
        '<span class="icon" aria-hidden="true">' + g.icon + '</span>' +
        '<strong>' + App.utils.escapeHtml(g.name) + '</strong>' +
        '<div class="progress-bar"><div class="progress-fill" style="width:' + pct + '%"></div>' +
        '<span class="progress-text">' + pct + '%</span></div>' +
        '<span>' + App.i18n.t('goals.progressText')
          .replace('{saved}', App.money.format(g.savedCents))
          .replace('{target}', App.money.format(g.targetCents)) + '</span>';
      if (g.achieved) {
        var badge = document.createElement('p');
        badge.textContent = App.i18n.t('goals.achievedBadge');
        card.appendChild(badge);
      } else {
        var addBtn = document.createElement('button');
        addBtn.type = 'button';
        addBtn.className = 'btn btn-secondary';
        addBtn.textContent = App.i18n.t('goals.addButton');
        addBtn.addEventListener('click', function () {
          openWizard({ type: 'goalAdd', step: 1, goalId: g.id, amountCents: 0 });
        });
        card.appendChild(addBtn);
      }
      list.appendChild(card);
    });
    var empty = $('#goalEmpty');
    if (empty) empty.classList.toggle('hidden', state.goals.length > 0);
  }

  /* Deprecated en Fase 3: el botón "+ Nueva meta" ya solo vive en la
     tarjeta compacta del home (#btnNewGoalHome). Conservamos el binding
     por compatibilidad con herramientas externas que aún lo busquen. */
  var btnNewGoal = $('#btnNewGoal');
  if (btnNewGoal) {
    btnNewGoal.addEventListener('click', function () {
      openWizard({ type: 'goalNew', step: 1, name: '', icon: DATA.goalIcons[0], targetCents: 0 });
    });
  }

  /* "+ Nueva meta" dentro de la tarjeta Mis metas del home abre el
     wizard nuevo de meta. */
  var btnNewGoalHome = $('#btnNewGoalHome');
  if (btnNewGoalHome) {
    btnNewGoalHome.addEventListener('click', function () {
      openWizard({ type: 'goalNew', step: 1, name: '', icon: DATA.goalIcons[0], targetCents: 0 });
    });
  }

  /* ---------- Learn (activity catalogue, grouped by theme) ----------
     Estilo Routime: cada actividad es una .tarjeta con .picto +
     .nombre + .detalle + .tarjeta__estado opcional. Las tarjetas se
     pintan dentro de una .grid-tarjetas dentro de un .modulo (sección
     temática con su propio accent). */
  function activityCard(a) {
    var card = document.createElement('a');
    card.className = 'tarjeta tarjeta--activity';
    if (!a.available) card.classList.add('is-locked');
    var status = App.wallet.activityStatus(a.slug);
    if (status && status.done) card.classList.add('is-done');
    card.href = a.available ? a.href : '#';
    card.setAttribute('aria-disabled', a.available ? 'false' : 'true');
    card.setAttribute('aria-label',
      App.i18n.t('learn.activityTitle.' + a.slug) + ' — ' +
      App.i18n.t('learn.activityDesc.' + a.slug));
    var stateGlyph = status && status.done ? '✓' : (a.available ? '▶' : '🔒');
    card.innerHTML =
      '<span class="picto" aria-hidden="true">' + a.icon + '</span>' +
      '<span class="nombre" data-i18n="learn.activityTitle.' + a.slug + '">' +
        App.i18n.t('learn.activityTitle.' + a.slug) +
      '</span>' +
      '<span class="detalle" data-i18n="learn.activityDesc.' + a.slug + '">' +
        App.i18n.t('learn.activityDesc.' + a.slug) +
      '</span>' +
      '<span class="tarjeta__estado" aria-hidden="true">' + stateGlyph + '</span>';
    return card;
  }

  /* Pinta los tres módulos temáticos (DATA.learnThemes, orden
     pedagógico fijo) en `wrap`. Cada módulo es una <section class="modulo
     modulo--catalogo"> con su propio accent (color del tema). Las
     tarjetas viven en una .grid-tarjetas dentro del módulo.
     PRODUCT-DESIGN.md §3.3 / §9 Phase 2. Within a theme, activities are
     already ordered easiest to hardest (DATA.activities). */
  function renderActivityThemes(wrap) {
    if (!wrap) return;
    wrap.innerHTML = '';
    DATA.learnThemes.forEach(function (theme) {
      var activities = DATA.activities.filter(function (a) { return a.theme === theme.id; });
      if (!activities.length) return;
      var section = document.createElement('section');
      section.className = 'modulo modulo--catalogo';
      section.id = 'mod-' + theme.id;
      var rootStyle = getComputedStyle(document.documentElement);
      section.style.setProperty('--acento', rootStyle.getPropertyValue('--' + theme.accent).trim());
      section.style.setProperty('--acento-suave', rootStyle.getPropertyValue('--' + theme.accent + '-suave').trim());
      var heading = document.createElement('h2');
      heading.textContent = App.i18n.t('learn.themes.' + theme.id);
      section.appendChild(heading);
      var grid = document.createElement('div');
      grid.className = 'grid-tarjetas';
      activities.forEach(function (a) { grid.appendChild(activityCard(a)); });
      section.appendChild(grid);
      wrap.appendChild(section);
    });
  }

  function renderLearn() {
    /* Deprecated en Fase 3: la pestaña Aprender se ha integrado al home
       como bloque <section id="aprende">#homeActivities. No queda nada
       que pintar aquí, pero conservamos la función vacía por si código
       viejo (tests, tools externos) la sigue invocando. */
  }

  /* ---------- Wizard: shared chrome (back/close + step dots) ---------- */
  function wizardChrome(totalSteps, step, onBack) {
    var dots = '';
    for (var i = 1; i <= totalSteps; i++) {
      dots += '<span class="dot ' + (i < step ? 'done' : i === step ? 'active' : '') + '"></span>';
    }
    var backButton = onBack
      ? '<button type="button" class="back-link" id="wizBack">' + App.i18n.t('core.back') + '</button>'
      : '<span></span>';
    return (
      '<div class="wizard-header">' + backButton +
      '<button type="button" class="back-link" id="wizClose" aria-label="' + App.i18n.t('wizard.closeAria') + '">✕</button>' +
      '</div>' +
      (totalSteps > 1 ? '<div class="step-dots">' + dots + '</div>' : '')
    );
  }

  function wireChrome(onBack) {
    $('#wizClose').addEventListener('click', closeWizard);
    if (onBack) $('#wizBack').addEventListener('click', onBack);
  }

  /* ---------- Wizard: reusable amount step (keypad + coin preview) ----------
     Used by: register an expense (step 2), set how much money you have,
     set a goal's price, and add money to a goal. This is the "component"
     every amount-entry flow in the app is built from. */
  function renderAmountStep(opts) {
    var value = opts.initial || 0;
    var totalSteps = opts.totalSteps || 1;

    $('#screen-wizard').innerHTML =
      wizardChrome(totalSteps, opts.step, opts.onBack) +
      '<h2>' + App.i18n.t(opts.titleKey) + '</h2>' +
      '<p>' + App.i18n.t(opts.instructionKey) + '</p>' +
      '<div class="amount-display" id="wizAmount" aria-live="polite"></div>' +
      '<div class="money-table" id="wizPreview" aria-hidden="true"></div>' +
      '<div class="keypad" id="wizKeypad"></div>' +
      '<button type="button" class="btn" id="wizNext">' + App.i18n.t(opts.confirmKey || 'core.next') + '</button>';

    wireChrome(opts.onBack);

    function paint() {
      $('#wizAmount').textContent = App.money.format(value);
      App.money.paintTokens($('#wizPreview'), App.money.breakdown(value));
      var canContinue = opts.allowZero ? true : value > 0;
      $('#wizNext').disabled = !canContinue;
    }

    var keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0', '⌦'];
    var keypad = $('#wizKeypad');
    keys.forEach(function (k) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'keypad-key';
      btn.textContent = k;
      if (k === '⌫') btn.setAttribute('aria-label', App.i18n.t('keypad.deleteDigit'));
      if (k === '⌦') btn.setAttribute('aria-label', App.i18n.t('keypad.clear'));
      btn.addEventListener('click', function () {
        if (k === '⌫') {
          value = Math.floor(value / 10);
        } else if (k === '⌦') {
          value = 0;
        } else {
          var next = value * 10 + Number(k);
          if (next <= MAX_CENTS) value = next;
        }
        paint();
      });
      keypad.appendChild(btn);
    });

    paint();
    $('#wizNext').addEventListener('click', function () { opts.onConfirm(value); });
  }

  /* ---------- Wizard: register an expense (3 steps: category, amount, confirm) ---------- */
  function renderExpenseStep1() {
    var html =
      wizardChrome(3, 1, null) +
      '<h2 data-i18n="expense.categoryTitle">' + App.i18n.t('expense.categoryTitle') + '</h2>' +
      '<p>' + App.i18n.t('expense.categoryInstruction') + '</p>' +
      '<div class="option-grid" id="categoryGrid"></div>';
    $('#screen-wizard').innerHTML = html;
    wireChrome(null);

    var grid = $('#categoryGrid');
    DATA.categories.forEach(function (c) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-option';
      btn.innerHTML = '<span class="icon" aria-hidden="true">' + c.icon + '</span><span>' + App.i18n.t('categories.' + c.id) + '</span>';
      btn.addEventListener('click', function () {
        wizard.categoryId = c.id;
        wizard.step = 2;
        renderExpenseStep2();
      });
      grid.appendChild(btn);
    });
  }

  function renderExpenseStep2() {
    renderAmountStep({
      titleKey: 'expense.amountTitle',
      instructionKey: 'expense.amountInstruction',
      initial: wizard.amountCents,
      totalSteps: 3,
      step: 2,
      allowZero: false,
      onBack: function () { wizard.step = 1; renderExpenseStep1(); },
      onConfirm: function (cents) {
        wizard.amountCents = cents;
        wizard.step = 3;
        renderExpenseStep3();
      }
    });
  }

  function renderExpenseStep3() {
    var category = categoryById(wizard.categoryId);
    $('#screen-wizard').innerHTML =
      wizardChrome(3, 3, function () { wizard.step = 2; renderExpenseStep2(); }) +
      '<h2>' + App.i18n.t('expense.confirmTitle') + '</h2>' +
      '<p>' + App.i18n.t('expense.confirmInstruction') + '</p>' +
      '<div class="card center">' +
      '<span style="font-size:48px" aria-hidden="true">' + category.icon + '</span>' +
      '<p><strong>' + App.i18n.t('categories.' + category.id) + '</strong></p>' +
      '<p style="font-size:32px;font-weight:800">' + App.money.format(wizard.amountCents) + '</p>' +
      '</div>' +
      '<button type="button" class="btn" id="wizSave">' + App.i18n.t('expense.saveButton') + '</button>';
    wireChrome(function () { wizard.step = 2; renderExpenseStep2(); });

    $('#wizSave').addEventListener('click', function () {
      state.movements.push({
        id: App.utils.uid(),
        type: 'expense',
        categoryId: wizard.categoryId,
        amountCents: wizard.amountCents,
        date: App.utils.today()
      });
      save();
      var message = App.i18n.t('expense.savedMessage');
      App.feedback.celebrate(message, function () { closeWizard(); });
    });
  }

  /* ---------- Wizard: set how much money I have (1 step) ---------- */
  function renderSetBalance() {
    renderAmountStep({
      titleKey: 'home.setBalanceTitle',
      instructionKey: 'home.setBalanceInstruction',
      initial: wizard.amountCents,
      totalSteps: 1,
      step: 1,
      allowZero: true,
      confirmKey: 'core.save',
      onBack: null,
      onConfirm: function (cents) {
        setBalanceTo(cents);
        App.feedback.celebrate(App.i18n.t('expense.savedMessage'), function () { closeWizard(); });
      }
    });
  }

  /* ---------- Wizard: new goal (2 steps: icon+name, then target price) ---------- */
  function renderGoalStep1() {
    $('#screen-wizard').innerHTML =
      wizardChrome(2, 1, null) +
      '<h2>' + App.i18n.t('goals.newTitle') + '</h2>' +
      '<p>' + App.i18n.t('goals.newInstruction') + '</p>' +
      '<div class="option-grid" id="iconGrid"></div>' +
      '<label class="sr-only" for="goalName">' + App.i18n.t('goals.nameAria') + '</label>' +
      '<input type="text" id="goalName" class="amount-display" style="font-size:var(--text-base);text-align:left" maxlength="30" autocomplete="off" placeholder="' + App.utils.escapeHtml(App.i18n.t('goals.namePlaceholder')) + '" value="' + App.utils.escapeHtml(wizard.name) + '">' +
      '<button type="button" class="btn" id="wizNext" disabled>' + App.i18n.t('core.next') + '</button>';
    wireChrome(null);

    var grid = $('#iconGrid');
    DATA.goalIcons.forEach(function (icon) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-option';
      btn.setAttribute('aria-pressed', String(icon === wizard.icon));
      btn.innerHTML = '<span class="icon" aria-hidden="true">' + icon + '</span>';
      btn.addEventListener('click', function () {
        wizard.icon = icon;
        $$('#iconGrid .btn-option').forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
        btn.setAttribute('aria-pressed', 'true');
      });
      grid.appendChild(btn);
    });

    var input = $('#goalName');
    var next = $('#wizNext');
    function checkReady() { next.disabled = input.value.trim().length === 0; }
    input.addEventListener('input', function () { wizard.name = input.value; checkReady(); });
    checkReady();

    next.addEventListener('click', function () {
      wizard.step = 2;
      renderGoalStep2();
    });
  }

  function renderGoalStep2() {
    renderAmountStep({
      titleKey: 'goals.targetTitle',
      instructionKey: 'goals.targetInstruction',
      initial: wizard.targetCents,
      totalSteps: 2,
      step: 2,
      allowZero: false,
      onBack: function () { wizard.step = 1; renderGoalStep1(); },
      onConfirm: function (cents) {
        state.goals.push({
          id: App.utils.uid(),
          name: wizard.name.trim(),
          icon: wizard.icon,
          targetCents: cents,
          savedCents: 0,
          createdDate: App.utils.today(),
          achieved: false
        });
        save();
        App.feedback.celebrate(App.i18n.t('goals.savedMessage'), function () { closeWizard(); });
      }
    });
  }

  /* ---------- Wizard: add money to a goal (1 step) ---------- */
  function renderGoalAdd() {
    renderAmountStep({
      titleKey: 'goals.addTitle',
      instructionKey: 'goals.addInstruction',
      initial: wizard.amountCents,
      totalSteps: 1,
      step: 1,
      allowZero: false,
      onBack: null,
      onConfirm: function (cents) {
        var goal = goalById(wizard.goalId);
        state.movements.push({
          id: App.utils.uid(),
          type: 'saving',
          goalId: goal.id,
          amountCents: cents,
          date: App.utils.today()
        });
        goal.savedCents += cents;
        if (goal.savedCents >= goal.targetCents) goal.achieved = true;
        save();
        App.feedback.celebrate(App.i18n.t('goals.addedMessage'), function () { closeWizard(); });
      }
    });
  }

  /* ---------- Wizard dispatcher ---------- */
  function renderWizard() {
    if (wizard.type === 'expense') {
      if (wizard.step === 1) renderExpenseStep1();
      else if (wizard.step === 2) renderExpenseStep2();
      else renderExpenseStep3();
    } else if (wizard.type === 'setBalance') {
      renderSetBalance();
    } else if (wizard.type === 'goalNew') {
      if (wizard.step === 1) renderGoalStep1();
      else renderGoalStep2();
    } else if (wizard.type === 'goalAdd') {
      renderGoalAdd();
    }
  }

  /* ---------- Language selector ----------
     Built from App.i18n.SUPPORTED so adding a locale (see doc/I18N.md §5)
     only requires extending SUPPORTED + LABEL + FLAG in i18n.js and
     creating the new strings.<locale>.js — no HTML edit. */
  function renderLanguageSelector() {
    var row = $('#langRow');
    if (!row) return;
    var active = App.i18n.locale();
    row.innerHTML = '';
    App.i18n.SUPPORTED.forEach(function (loc) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-audio';
      btn.id = 'btnLang' + loc.toUpperCase();
      btn.setAttribute('data-locale', loc);
      btn.setAttribute('aria-pressed', String(active === loc));
      btn.setAttribute('aria-label', App.i18n.LABEL[loc] || loc);
      btn.textContent = (App.i18n.FLAG[loc] || '') + ' ' + (App.i18n.LABEL[loc] || loc);
      btn.addEventListener('click', function () { App.i18n.setLocale(loc); });
      row.appendChild(btn);
    });
  }
  renderLanguageSelector();

  /* ---------- Boot ---------- */
  App.i18n.apply();
  renderHome();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(function () {});
  }
})();
