/* ==========================================================================
   Okeymoney — App logic
   Single-page app: three tabs (Mi dinero, Mis metas, Aprender) sharing one
   ledger in localStorage, plus a full-screen step-by-step wizard reused by
   every flow that asks for an amount (register an expense, set how much
   money you have, set a goal's price, add money to a goal).
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

  /* ---------- Navigation ---------- */
  var TABS = ['home', 'goals', 'learn'];
  var currentTab = 'home';
  var wizard = null; /* { type, step, ...fields } while a wizard is open */

  function showTab(tab) {
    currentTab = tab;
    wizard = null;
    TABS.forEach(function (t) {
      $('#screen-' + t).classList.toggle('hidden', t !== tab);
    });
    $('#screen-wizard').classList.add('hidden');
    $$('.tab-button').forEach(function (btn) {
      if (btn.getAttribute('data-tab') === tab) btn.setAttribute('aria-current', 'page');
      else btn.removeAttribute('aria-current');
    });
    if (tab === 'home') renderHome();
    if (tab === 'goals') renderGoals();
    if (tab === 'learn') renderLearn();
  }

  function openWizard(w) {
    wizard = w;
    TABS.forEach(function (t) { $('#screen-' + t).classList.add('hidden'); });
    $('#screen-wizard').classList.remove('hidden');
    renderWizard();
  }

  function closeWizard() {
    wizard = null;
    showTab(currentTab);
  }

  /* ---------- Home (Mi dinero) ---------- */
  function renderHome() {
    $('#balanceValue').textContent = App.money.format(balanceCents());
    App.money.paintTokens($('#moneyPreview'), App.money.breakdown(Math.max(balanceCents(), 0)));

    var recent = state.movements.slice(-5).reverse();
    var list = $('#recentList');
    list.innerHTML = '';
    recent.forEach(function (m) {
      var row = document.createElement('div');
      row.className = 'card row';
      var icon = m.type === 'expense' ? (categoryById(m.categoryId) || {}).icon || '🧩'
        : m.type === 'saving' ? '🐷' : '➕';
      var label = m.type === 'expense' ? App.i18n.t('categories.' + m.categoryId)
        : m.type === 'saving' ? App.utils.escapeHtml((goalById(m.goalId) || {}).name || '')
        : App.i18n.t('home.balanceLabel');
      var sign = m.type === 'income' ? '+' : '-';
      row.innerHTML =
        '<span class="icon" aria-hidden="true" style="font-size:28px">' + icon + '</span>' +
        '<span style="flex:1">' + label + '</span>' +
        '<strong>' + sign + App.money.format(m.amountCents) + '</strong>';
      list.appendChild(row);
    });
    $('#recentEmpty').classList.toggle('hidden', recent.length > 0);
  }

  $('#btnEditBalance').addEventListener('click', function () {
    openWizard({ type: 'setBalance', step: 1, amountCents: Math.max(balanceCents(), 0) });
  });

  $('#btnNewExpense').addEventListener('click', function () {
    openWizard({ type: 'expense', step: 1, categoryId: null, amountCents: 0 });
  });

  /* ---------- Goals (Mis metas / Mi hucha) ---------- */
  function renderGoals() {
    var list = $('#goalList');
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
    $('#goalEmpty').classList.toggle('hidden', state.goals.length > 0);
  }

  $('#btnNewGoal').addEventListener('click', function () {
    openWizard({ type: 'goalNew', step: 1, name: '', icon: DATA.goalIcons[0], targetCents: 0 });
  });

  /* ---------- Learn (Aprender) — placeholder for v1 ---------- */
  function renderLearn() {
    var ul = $('#learnTeaser');
    ul.innerHTML = '';
    DATA.learnTeaser.forEach(function (id) {
      var li = document.createElement('li');
      li.className = 'card';
      li.textContent = App.i18n.t('learn.teaser.' + id);
      ul.appendChild(li);
    });
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
      if (k === '⌫') btn.setAttribute('aria-label', App.i18n.locale() === 'en' ? 'Delete last digit' : 'Borrar');
      if (k === '⌦') btn.setAttribute('aria-label', App.i18n.locale() === 'en' ? 'Clear' : 'Borrar todo');
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

  /* ---------- Wizard: register an expense (3 steps) ---------- */
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
      App.feedback.celebrate(message, function () { showTab('home'); });
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
        App.feedback.celebrate(App.i18n.t('expense.savedMessage'), function () { showTab('home'); });
      }
    });
  }

  /* ---------- Wizard: new goal (2 steps: icon+name, then price) ---------- */
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
        App.feedback.celebrate(App.i18n.t('goals.savedMessage'), function () { showTab('goals'); });
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
        App.feedback.celebrate(App.i18n.t('goals.addedMessage'), function () { showTab('goals'); });
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

  /* ---------- Tab bar ---------- */
  $$('.tab-button').forEach(function (btn) {
    btn.addEventListener('click', function () { showTab(btn.getAttribute('data-tab')); });
  });

  /* ---------- Language selector ---------- */
  function paintLanguageSelector() {
    var active = App.i18n.locale();
    $('#btnLangEs').setAttribute('aria-pressed', String(active === 'es'));
    $('#btnLangEn').setAttribute('aria-pressed', String(active === 'en'));
  }
  $('#btnLangEs').addEventListener('click', function () { App.i18n.setLocale('es'); });
  $('#btnLangEn').addEventListener('click', function () { App.i18n.setLocale('en'); });
  paintLanguageSelector();

  /* ---------- Boot ---------- */
  App.i18n.apply();
  showTab('home');

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(function () {});
  }
})();
