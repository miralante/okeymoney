/* ==========================================================================
   Okeymoney — App logic
   Single-page app: one long home scroll (didactic units → action guide)
   sharing one ledger in localStorage, plus a full-screen
   step-by-step wizard reused by every flow that asks for an amount
   (register an expense, set how much money you have, set a goal's price,
   add money to a goal). Expense entry lives in the simulation block.
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
  if (!Array.isArray(state.commitments)) state.commitments = [];
  if (!state.cycle || typeof state.cycle !== 'object') state.cycle = { budgeted: false };
  if (typeof state.cycle.budgeted !== 'boolean') state.cycle.budgeted = false;
  if (!state.cycle.lastPlan || typeof state.cycle.lastPlan !== 'object') state.cycle.lastPlan = null;

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

  function categoryClassificationLabel(category) {
    if (!category || !category.classification) return '';
    return App.i18n.t('categories.classification.' + category.classification);
  }

  function goalById(id) {
    return state.goals.filter(function (g) { return g.id === id; })[0];
  }

  /* ---------- Navigation ----------
     Sin pestañas (Fase 3): el home es un único scroll. El único "salto"
     real es ocultar el home para mostrar el wizard a pantalla completa. */
  var wizard = null; /* { type, step, ...fields } while a wizard is open */
  var openLessonId = lessonFromHash(); /* selected topic in the home catalogue */

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

  /* ---------- Home (single long scroll, estilo Apptonomia) ----------
     The presentation has three clear parts: everyday situations, actions
     with money, and practical ideas for caring for it. */
  function renderHome() {
    var saludo = $('#saludo');
    if (saludo) saludo.textContent = App.i18n.t('home.saludo');

    renderModuleAnchors();
    renderNextStep();
    renderDidacticLessons($('#didacticLessons'));
    renderFinancialCycle();
    renderSimulationCatalog();

    var balEl = $('#simulationBalanceValue');
    if (balEl) balEl.textContent = App.money.format(balanceCents());
    renderMetasResumen();
    renderMovementSummary();
    renderCommitments();
    renderInsights();
    renderFinancialStatement();
    renderFinancialControl();
  }

  function hasMovementType(type) {
    return state.movements.some(function (movement) { return movement.type === type; });
  }

  function renderFinancialCycle() {
    var wrap = $('#financialCycle');
    if (!wrap) return;
    var stages = [
      { id: 'budget', icon: '📋', done: state.cycle.budgeted },
      { id: 'income', icon: '🫴', done: hasMovementType('income') },
      { id: 'saving', icon: '🪙', done: hasMovementType('saving') },
      { id: 'spending', icon: '🧾', done: hasMovementType('expense') }
    ];
    wrap.innerHTML = '<div class="financial-cycle__header"><h3>' + App.i18n.t('home.cycleTitle') + '</h3><p>' + App.i18n.t('home.cycleIntro') + '</p></div>' +
      '<div class="financial-cycle__steps"></div>';
    var steps = wrap.querySelector('.financial-cycle__steps');
    stages.forEach(function (stage) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'financial-cycle__step' + (stage.done ? ' is-done' : '');
      button.setAttribute('aria-label', App.i18n.t('home.cycle.' + stage.id + 'Action'));
      button.innerHTML = '<span class="financial-cycle__icon" aria-hidden="true">' + stage.icon + '</span>' +
        '<strong>' + App.i18n.t('home.cycle.' + stage.id + 'Title') + '</strong>' +
        '<small>' + App.i18n.t('home.cycle.' + stage.id + 'Detail') + '</small>' +
        (stage.done ? '<span class="financial-cycle__done" aria-label="' + App.i18n.t('home.cycleDone') + '">✓</span>' : '');
      button.addEventListener('click', function () {
        if (stage.id === 'budget') openWizard({ type: 'planBudget', step: 1, budgetCents: 0, selectedItem: null });
        else if (stage.id === 'income') openWizard({ type: 'income', step: 1, sourceId: null, amountCents: 0 });
        else if (stage.id === 'saving') {
          if (!state.goals.length) openWizard({ type: 'goalNew', step: 1, name: '', icon: DATA.goalIcons[0], targetCents: 0 });
          else openWizard({ type: 'goalAdd', step: 1, goalId: state.goals[0].id, amountCents: 0 });
        } else openExpenseWizard();
      });
      steps.appendChild(button);
    });
  }

  function renderMovementSummary() {
    var wrap = $('#movementSummary');
    if (!wrap) return;
    wrap.innerHTML = '<h3>' + App.i18n.t('home.movementsTitle') + '</h3>';
    if (!state.movements.length) {
      wrap.innerHTML += '<p class="movement-summary__empty">' + App.i18n.t('home.movementsEmpty') + '</p>';
      return;
    }
    var list = document.createElement('ul');
    list.className = 'movement-summary__list';
    state.movements.slice(-5).reverse().forEach(function (m) {
      var li = document.createElement('li');
      var amount = m.type === 'income' ? m.amountCents : -m.amountCents;
      var label = m.type === 'income'
        ? App.i18n.t('income.sources.' + (m.sourceId || 'allowance'))
        : (m.type === 'saving' ? App.i18n.t('goals.title') : App.i18n.t('categories.' + (m.categoryId || 'other')));
      li.innerHTML = '<span><strong>' + App.utils.escapeHtml(label) + '</strong><small>' + (m.date || '') + '</small></span>' +
        '<b class="movement-summary__amount ' + (amount >= 0 ? 'is-in' : 'is-out') + '">' +
        (amount >= 0 ? '+' : '') + App.money.format(amount) + '</b>';
      list.appendChild(li);
    });
    wrap.appendChild(list);
  }

  function renderCommitments() {
    var wrap = $('#commitmentsSummary');
    if (!wrap) return;
    wrap.innerHTML = '<h3>' + App.i18n.t('commitments.title') + '</h3>';
    if (!state.commitments.length) {
      wrap.innerHTML += '<p class="movement-summary__empty">' + App.i18n.t('commitments.empty') + '</p>';
      return;
    }
    var list = document.createElement('ul');
    list.className = 'commitments-list';
    var today = App.utils.today();
    state.commitments.slice().sort(function (a, b) {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.localeCompare(b.dueDate);
    }).forEach(function (item) {
      var li = document.createElement('li');
      var due = item.dueDate
        ? (item.dueDate < today
          ? '<small class="commitment-overdue">' + App.i18n.t('commitments.overdue') + '</small>'
          : '<small>' + App.i18n.t('commitments.dueDate').replace('{date}', App.utils.escapeHtml(item.dueDate)) + '</small>')
        : '';
      li.innerHTML = '<span><strong>' + App.utils.escapeHtml(item.name) + '</strong>' + due + '</span>' +
        '<b>' + App.money.format(item.amountCents) + '</b>';
      list.appendChild(li);
    });
    wrap.appendChild(list);
  }

  function renderInsights() {
    var wrap = $('#insightsSummary');
    if (!wrap) return;
    var income = 0;
    var expenses = 0;
    var saving = 0;
    var byCategory = {};
    state.movements.forEach(function (movement) {
      if (movement.type === 'income') income += movement.amountCents;
      else if (movement.type === 'saving') saving += movement.amountCents;
      else if (movement.type === 'expense') {
        expenses += movement.amountCents;
        byCategory[movement.categoryId || 'other'] = (byCategory[movement.categoryId || 'other'] || 0) + movement.amountCents;
      }
    });
    wrap.innerHTML = '<h3>' + App.i18n.t('home.insightsTitle') + '</h3>';
    if (!state.movements.length) {
      wrap.innerHTML += '<p class="movement-summary__empty">' + App.i18n.t('home.insightsEmpty') + '</p>';
      return;
    }
    var topCategory = Object.keys(byCategory).sort(function (a, b) { return byCategory[b] - byCategory[a]; })[0];
    var summary = App.i18n.t('home.insightsSummary')
      .replace('{income}', App.money.format(income))
      .replace('{expenses}', App.money.format(expenses))
      .replace('{saving}', App.money.format(saving));
    wrap.innerHTML += '<p>' + summary + '</p>';
    if (topCategory) {
      wrap.innerHTML += '<p class="insights-top">' + App.i18n.t('home.insightsTopCategory')
        .replace('{category}', App.utils.escapeHtml(App.i18n.t('categories.' + topCategory)))
        .replace('{amount}', App.money.format(byCategory[topCategory])) + '</p>';
    }
    if (state.commitments.length) {
      var planned = state.commitments.reduce(function (total, item) { return total + (item.amountCents || 0); }, 0);
      wrap.innerHTML += '<p class="insights-top">' + App.i18n.t('home.insightsCommitments')
        .replace('{amount}', App.money.format(planned)) + '</p>';
    }
  }

  /* Simple personal balance sheet. Planned payments are shown as
     "expected liabilities", never as bank debt or an automatic charge. */
  function renderFinancialStatement() {
    var wrap = $('#financialStatement');
    if (!wrap) return;
    var income = 0;
    var expenses = 0;
    var saving = 0;
    state.movements.forEach(function (movement) {
      if (movement.type === 'income') income += movement.amountCents;
      else if (movement.type === 'expense') expenses += movement.amountCents;
      else if (movement.type === 'saving') saving += movement.amountCents;
    });
    var balance = balanceCents();
    var cash = Math.max(balance, 0);
    var deficit = Math.max(-balance, 0);
    var assets = cash + saving;
    var liabilities = state.commitments.reduce(function (total, item) { return total + (item.amountCents || 0); }, 0);
    var position = assets - liabilities - deficit;
    wrap.innerHTML = '<h3>' + App.i18n.t('home.statementTitle') + '</h3>' +
      '<p class="financial-statement__note">' + App.i18n.t('home.statementNote') + '</p>' +
      '<div class="statement-grid">' +
        '<div><strong>' + App.i18n.t('home.statementAssets') + '</strong><b>' + App.money.format(assets) + '</b><small>' + App.i18n.t('home.statementAssetsDetail') + '</small></div>' +
        '<div><strong>' + App.i18n.t('home.statementLiabilities') + '</strong><b>' + App.money.format(liabilities) + '</b><small>' + App.i18n.t('home.statementLiabilitiesDetail') + '</small></div>' +
        '<div><strong>' + App.i18n.t('home.statementIncome') + '</strong><b>' + App.money.format(income) + '</b><small>' + App.i18n.t('home.statementRecordedDetail') + '</small></div>' +
        '<div><strong>' + App.i18n.t('home.statementExpenses') + '</strong><b>' + App.money.format(expenses) + '</b><small>' + App.i18n.t('home.statementRecordedDetail') + '</small></div>' +
      '</div>' +
      '<p class="statement-position"><strong>' + App.i18n.t('home.statementPosition') + '</strong> ' + App.money.format(position) + '</p>' +
      (deficit ? '<p class="money-warning" role="status">' + App.i18n.t('home.statementDeficit') + '</p>' : '');
  }

  /* Control is the action layer over the accounting record: what is
     available now, what is committed, and how the last planned purchase
     compared with its budget. */
  function renderFinancialControl() {
    var wrap = $('#financialControl');
    if (!wrap) return;
    var balance = balanceCents();
    var committed = state.commitments.reduce(function (total, item) { return total + (item.amountCents || 0); }, 0);
    var afterCommitments = balance - committed;
    var plan = state.cycle.lastPlan;
    var html = '<h3>' + App.i18n.t('home.controlTitle') + '</h3>' +
      '<p class="financial-statement__note">' + App.i18n.t('home.controlNote') + '</p>' +
      '<div class="statement-grid">' +
        '<div><strong>' + App.i18n.t('home.controlBalance') + '</strong><b>' + App.money.format(balance) + '</b></div>' +
        '<div><strong>' + App.i18n.t('home.controlCommitted') + '</strong><b>' + App.money.format(committed) + '</b></div>' +
        '<div><strong>' + App.i18n.t('home.controlAvailable') + '</strong><b>' + App.money.format(afterCommitments) + '</b></div>' +
      '</div>';
    if (plan) {
      var difference = plan.budgetCents - plan.priceCents;
      html += '<p class="statement-position"><strong>' + App.i18n.t('home.controlLastPlan') + '</strong> ' +
        App.i18n.t('home.controlPlanDetail')
          .replace('{budget}', App.money.format(plan.budgetCents))
          .replace('{price}', App.money.format(plan.priceCents))
          .replace('{difference}', App.money.format(difference)) + '</p>';
    }
    if (afterCommitments < 0) {
      html += '<p class="money-warning" role="status">' + App.i18n.t('home.controlWarning') + '</p>';
    }
    html += '<button type="button" class="btn btn--secundario" id="controlPlanButton">' + App.i18n.t('home.controlAction') + '</button>';
    wrap.innerHTML = html;
    $('#controlPlanButton').addEventListener('click', function () {
      openWizard({ type: 'planBudget', step: 1, budgetCents: 0, selectedItem: null });
    });
  }

  /* Offers one concrete, context-aware action. The suggestion follows the
     user's real ledger state, but never blocks any other part of the app. */
  function renderNextStep() {
    var detail = $('#nextStepDetail');
    var action = $('#nextStepAction');
    if (!detail || !action) return;
    var mode;
    if (!state.movements.length && balanceCents() <= 0) mode = 'balance';
    else if (!state.cycle.budgeted) mode = 'budget';
    else if (!hasMovementType('income')) mode = 'income';
    else if (!state.goals.length || !hasMovementType('saving')) mode = 'saving';
    else mode = 'expense';
    detail.textContent = App.i18n.t('home.nextStep.' + mode + 'Detail');
    action.textContent = App.i18n.t('home.nextStep.' + mode + 'Action');
    action.dataset.nextAction = mode;
  }

  /* Pinta la barra de anclas a las tres partes de la home. */
  function renderModuleAnchors() {
    var wrap = $('#anclasModulo');
    if (!wrap) return;
    wrap.innerHTML = '';
    DATA.blocks.forEach(function (block) {
      var a = document.createElement('a');
      a.href = '#' + block.anchor;
      a.className = 'ancla-modulo';
      a.style.setProperty('--acento', getComputedStyle(document.documentElement).getPropertyValue('--' + block.accent).trim());
      var label = App.i18n.t('blocks.' + block.id + '.title');
      a.textContent = label;
      a.setAttribute('aria-label', App.i18n.t('home.anchorNavAria') + ': ' + label);
      wrap.appendChild(a);
    });
  }

  function lessonFromHash() {
    var id = window.location.hash.replace(/^#unidad-/, '');
    return lessonById(id) ? id : null;
  }

  function focusLesson(element) {
    if (!element) return;
    element.setAttribute('tabindex', '-1');
    element.focus({ preventScroll: true });
    element.scrollIntoView({ behavior: App.utils.reducedMotion() ? 'auto' : 'smooth', block: 'start' });
  }

  function lessonById(id) {
    return DATA.learningPath.filter(function (lesson) { return lesson.id === id; })[0];
  }

  function learningIndexById(id) {
    return DATA.learningPath.filter(function (row) { return row.id === id; })[0];
  }

  function activitiesForUnit(unit) {
    return unit ? DATA.activities.filter(function (activity) {
      return activity.unitId === unit.id && activity.available;
    }) : [];
  }

  function simulationById(id) {
    return DATA.simulations.filter(function (simulation) { return simulation.id === id; })[0];
  }

  function openSimulation(id) {
    var simulation = simulationById(id);
    if (!simulation) return;
    if (simulation.action === 'balance') {
      openWizard({ type: 'setBalance', step: 1, amountCents: Math.max(balanceCents(), 0) });
    } else if (simulation.action === 'goals') {
      if (!state.goals.length) openWizard({ type: 'goalNew', step: 1, name: '', icon: DATA.goalIcons[0], targetCents: 0 });
      else openWizard({ type: 'goalAdd', step: 1, goalId: state.goals[0].id, amountCents: 0 });
    } else if (simulation.action === 'income') {
      openWizard({ type: 'income', step: 1, sourceId: null, amountCents: 0 });
    } else if (simulation.action === 'expense') {
      openExpenseWizard();
    } else if (simulation.action === 'plan') {
      openWizard({ type: 'planBudget', step: 1, budgetCents: 0, selectedItem: null });
    } else if (simulation.action === 'purchase') {
      openWizard({ type: 'purchaseLifecycle', scenarioIndex: 0, stage: 0 });
    } else if (simulation.action === 'commitment') {
      openWizard({ type: 'commitment', step: 1, name: '', dueDate: '', amountCents: 0 });
    } else if (simulation.action === 'change') {
      openWizard({ type: 'changeSimulation', index: 0 });
    } else {
      openWizard({ type: simulation.action + 'Simulation', index: 0 });
    }
  }

  function renderSimulationCatalog() {
    var wrap = $('#simulationCatalog');
    if (!wrap) return;
    var groupKeys = ['organise', 'buy', 'check'];
    wrap.innerHTML = '';
    groupKeys.forEach(function (groupKey, groupIndex) {
      var group = DATA.simulations.filter(function (simulation) { return simulation.group === groupKey; });
      if (!group.length) return;
      var heading = document.createElement('p');
      heading.className = 'simulation-grid__group-title';
      heading.textContent = App.i18n.t('blocks.simulation.groups.' + groupKey);
      if (groupIndex === 0) heading.classList.add('simulation-grid__group-title--first');
      wrap.appendChild(heading);
      group.forEach(function (simulation) {
        var card = document.createElement('button');
        card.type = 'button';
        card.id = 'simulation-card-' + simulation.id;
        card.className = 'tarjeta simulation-card simulation-card--action' + (simulation.advanced ? ' simulation-card--advanced' : '') +
          (simulation.variant === 'money' ? ' tarjeta--money' : '') + (simulation.variant === 'goals' ? ' tarjeta--goals' : '');
        card.dataset.simulationId = simulation.id;
        card.style.setProperty('--acento', 'var(--' + simulation.accent + ')');
        card.style.setProperty('--acento-suave', 'var(--' + simulation.accent + '-suave)');
        var detail = App.i18n.t(simulation.detailKey);
        var extra = '';
        if (simulation.variant === 'money') {
          extra = '<span class="tarjeta__nombre" id="simulationBalanceValue">' + App.money.format(balanceCents()) + '</span>' +
            '<span class="tarjeta__estado" aria-hidden="true" id="recentesResumen"></span>';
        } else if (simulation.variant === 'goals') {
          extra = '<span class="tarjeta__estado" id="simulationGoalsCta"></span>';
        }
        card.innerHTML = '<span class="picto" aria-hidden="true">' + simulation.icon + '</span>' +
          '<span class="tarjeta__etiqueta">' + App.utils.escapeHtml(App.i18n.t(simulation.titleKey)) + '</span>' +
          extra +
          '<span class="tarjeta__detalle"' + (simulation.variant === 'goals' ? ' id="simulationGoalsSummary"' : '') + '>' + App.utils.escapeHtml(detail) + '</span>';
        wrap.appendChild(card);
      });
    });
  }

  function lessonTestLinks(lessonId) {
    var lessonIndex = learningIndexById(lessonId);
    var tests = activitiesForUnit(lessonIndex);
    var links = tests.map(function (activity) {
      var title = App.i18n.t('learn.activityTitle.' + activity.slug);
      var label = App.i18n.t('blocks.path.activityLink').replace('{title}', title);
      var status = App.wallet.activityStatus(activity.slug);
      var stateGlyph = status && status.done ? '✓ ' : '';
      return '<a class="learning-unit__test-link" href="' + App.utils.escapeHtml(activity.href) + '">' +
        (stateGlyph ? '<span aria-hidden="true">' + stateGlyph + '</span>' : '') + App.utils.escapeHtml(label) + '</a>';
    }).join('');
    return '<div class="learning-unit__test-links">' + links + '</div>';
  }

  function renderLessonDetail(detail, lesson) {
    var title = App.i18n.t('blocks.path.units.' + lesson.id + '.title');
    var body = App.i18n.t('blocks.path.units.' + lesson.id + '.body');
    var testLinks = lessonTestLinks(lesson.id);
    detail.classList.remove('hidden');
    detail.innerHTML =
      '<button type="button" class="back-link lesson-detail__back" id="lessonDetailBack">' +
        App.i18n.t('blocks.didactic.detailBack') + '</button>' +
      '<div class="lesson-detail__header">' +
        '<span class="picto" aria-hidden="true">' + lesson.icon + '</span>' +
        '<h3 id="lessonDetailTitle">' + App.utils.escapeHtml(title) + '</h3>' +
        '<p class="lesson-detail__body">' + App.utils.escapeHtml(body) + '</p>' +
      '</div>' +
      '<div class="lesson-detail__practice">' +
        '<p class="learning-unit__phase">' + App.i18n.t('blocks.path.practicePhase') + '</p>' +
        (testLinks || '') +
      '</div>';
    detail.setAttribute('aria-labelledby', 'lessonDetailTitle');
    detail.querySelector('#lessonDetailBack').addEventListener('click', function () {
      openLessonId = null;
      history.replaceState(null, '', '#bloque-didactico');
      renderDidacticLessons($('#didacticLessons'));
      var card = $('#unidad-' + lesson.id);
      if (card) { card.focus({ preventScroll: true }); card.scrollIntoView({ block: 'nearest' }); }
    });
  }

  /* The home is a short path: each unit opens its idea and the small
     activities that practise it. Advanced simulations stay in the actions
     part of the home and are not mixed into this learning decision. */
  function renderDidacticLessons(wrap) {
    if (!wrap) return;
    var detail = $('#lessonDetail');
    if (openLessonId) {
      var selected = lessonById(openLessonId);
      if (!selected || !detail) {
        openLessonId = null;
      } else {
        wrap.classList.add('hidden');
        renderLessonDetail(detail, selected);
        return;
      }
    }
    wrap.classList.remove('hidden');
    if (detail) {
      detail.classList.add('hidden');
      detail.innerHTML = '';
      detail.removeAttribute('aria-labelledby');
    }
    wrap.innerHTML = '';
    DATA.learningPath.forEach(function (lesson) {
      var unit = learningIndexById(lesson.id) || lesson;
      var activities = activitiesForUnit(unit);
      var completed = activities.filter(function (activity) {
        var status = App.wallet.activityStatus(activity.slug);
        return status && status.done;
      }).length;
      var card = document.createElement('button');
      var title = App.i18n.t('blocks.path.units.' + lesson.id + '.title');
      card.type = 'button';
      card.className = 'tarjeta topic-card';
      card.id = 'unidad-' + lesson.id;
      card.setAttribute('aria-labelledby', 'unidad-' + lesson.id + '-title');
      card.innerHTML =
        '<span class="picto" aria-hidden="true">' + lesson.icon + '</span>' +
        '<span class="topic-card__title" id="unidad-' + lesson.id + '-title">' + App.utils.escapeHtml(title) + '</span>' +
        '<span class="topic-card__detail">' + App.utils.escapeHtml(App.i18n.t('blocks.path.units.' + lesson.id + '.detail')) + '</span>' +
        '<span class="topic-card__progress">' + App.utils.escapeHtml(App.i18n.t('blocks.didactic.activityProgress').replace('{done}', String(completed)).replace('{total}', String(activities.length))) + '</span>' +
        '<span class="topic-card__action">' + App.i18n.t('blocks.didactic.openLink') + ' →</span>';
      card.addEventListener('click', function () {
        openLessonId = lesson.id;
        history.pushState(null, '', '#unidad-' + lesson.id);
        renderDidacticLessons(wrap);
        focusLesson($('#lessonDetailTitle'));
      });
      wrap.appendChild(card);
    });
  }

  /* Tarjeta "Mis metas": un resumen compacto. Cuando NO hay metas,
     muestra el mensaje empty + CTA "+ Nueva meta". Cuando hay,
     muestra la primera meta con su porcentaje y el sufijo "+N más"
     si hay más. */
  function renderMetasResumen() {
    var detalle = $('#simulationGoalsSummary');
    var cta = $('#simulationGoalsCta');
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

  function openExpenseWizard(prefill) {
    var hasPrefill = prefill && prefill.categoryId;
    openWizard({
      type: 'expense',
      step: hasPrefill ? 2 : 1,
      categoryId: hasPrefill ? prefill.categoryId : null,
      amountCents: hasPrefill ? prefill.amountCents : 0
    });
  }

  var simulationCatalog = $('#simulationCatalog');
  if (simulationCatalog) simulationCatalog.addEventListener('click', function (event) {
    var card = event.target.closest('[data-simulation-id]');
    if (card) openSimulation(card.getAttribute('data-simulation-id'));
  });
  var settingsButton = $('#btnSettings');
  if (settingsButton) settingsButton.addEventListener('click', function () {
    openWizard({ type: 'settings' });
  });
  var nextStepAction = $('#nextStepAction');
  if (nextStepAction) {
    nextStepAction.addEventListener('click', function () {
      var mode = nextStepAction.dataset.nextAction;
      if (mode === 'balance') {
        openWizard({ type: 'setBalance', step: 1, amountCents: Math.max(balanceCents(), 0) });
      } else if (mode === 'budget') {
        openWizard({ type: 'planBudget', step: 1, budgetCents: 0, selectedItem: null });
      } else if (mode === 'income') {
        openWizard({ type: 'income', step: 1, sourceId: null, amountCents: 0 });
      } else if (mode === 'saving') {
        if (!state.goals.length) openWizard({ type: 'goalNew', step: 1, name: '', icon: DATA.goalIcons[0], targetCents: 0 });
        else openWizard({ type: 'goalAdd', step: 1, goalId: state.goals[0].id, amountCents: 0 });
      } else if (mode === 'goal') {
        openWizard({ type: 'goalNew', step: 1, name: '', icon: DATA.goalIcons[0], targetCents: 0 });
      } else {
        openExpenseWizard();
      }
    });
  }

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

  function renderLearn() {
    /* Deprecated: la pestaña Aprender se ha integrado al home
       como parte #bloque-didactico. No queda nada
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
      (opts.contextHtml || '') +
      '<div class="amount-display" id="wizAmount" aria-live="polite"></div>' +
      '<div class="money-table" id="wizPreview" aria-hidden="true"></div>' +
      '<div class="keypad" id="wizKeypad"></div>' +
      (opts.showFeedback ? '<div class="feedback" id="wizSimFeedback" aria-live="polite"></div>' : '') +
      '<button type="button" class="btn" id="wizNext">' + App.i18n.t(opts.confirmKey || 'core.next') + '</button>';

    wireChrome(opts.onBack);

    function paint() {
      $('#wizAmount').textContent = App.money.format(value);
      App.money.paintTokens($('#wizPreview'), App.money.breakdown(value));
      var withinMax = typeof opts.maxCents !== 'number' || value <= opts.maxCents;
      var canContinue = (opts.allowZero ? true : value > 0) && withinMax;
      $('#wizNext').disabled = !canContinue;
      if (opts.maxCents !== undefined && $('#wizSimFeedback')) {
        if (!withinMax) {
          $('#wizSimFeedback').textContent = App.i18n.t(opts.maxHintKey || 'goals.overBalance');
          $('#wizSimFeedback').className = 'feedback encourage';
        } else {
          $('#wizSimFeedback').textContent = '';
          $('#wizSimFeedback').className = 'feedback';
        }
      }
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
    $('#wizNext').addEventListener('click', function () {
      if (typeof opts.validate === 'function' && !opts.validate(value)) {
        if (opts.invalidKey && $('#wizSimFeedback')) {
          $('#wizSimFeedback').textContent = App.i18n.t(opts.invalidKey);
          $('#wizSimFeedback').className = 'feedback encourage';
        }
        if (typeof opts.onInvalid === 'function') opts.onInvalid(value);
        return;
      }
      opts.onConfirm(value);
    });
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
      btn.innerHTML = '<span class="icon" aria-hidden="true">' + c.icon + '</span><span>' + App.i18n.t('categories.' + c.id) + '</span><small class="option-classification">' + App.utils.escapeHtml(categoryClassificationLabel(c)) + '</small>';
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
    var remainingCents = balanceCents() - wizard.amountCents;
    var afterCopy = App.i18n.t('expense.afterExpense').replace('{balance}', App.money.format(remainingCents));
    var warning = remainingCents < 0
      ? '<p class="money-warning" role="status">' + App.i18n.t('expense.overBalance') + '</p>'
      : '';
    $('#screen-wizard').innerHTML =
      wizardChrome(3, 3, function () { wizard.step = 2; renderExpenseStep2(); }) +
      '<h2>' + App.i18n.t('expense.confirmTitle') + '</h2>' +
      '<p>' + App.i18n.t('expense.confirmInstruction') + '</p>' +
      '<div class="card center">' +
      '<span style="font-size:48px" aria-hidden="true">' + category.icon + '</span>' +
      '<p><strong>' + App.i18n.t('categories.' + category.id) + '</strong></p>' +
      '<p class="expense-classification">' + App.utils.escapeHtml(categoryClassificationLabel(category)) + '</p>' +
      '<p style="font-size:32px;font-weight:800">' + App.money.format(wizard.amountCents) + '</p>' +
      '<p class="money-after">' + afterCopy + '</p>' +
      warning +
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
      var message = App.i18n.t('expense.savedWithBalance').replace('{balance}', App.money.format(balanceCents()));
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
        App.feedback.celebrate(
          App.i18n.t('expense.balanceSavedWithValue').replace('{balance}', App.money.format(balanceCents())),
          function () { closeWizard(); }
        );
      }
    });
  }

  /* ---------- Wizard: receive money (source + amount) ---------- */
  function renderIncomeStep1() {
    $('#screen-wizard').innerHTML =
      wizardChrome(2, 1, null) +
      '<h2>' + App.i18n.t('income.title') + '</h2>' +
      '<p>' + App.i18n.t('income.instruction') + '</p>' +
      '<div class="option-grid" id="incomeSourceGrid"></div>';
    wireChrome(null);
    var grid = $('#incomeSourceGrid');
    DATA.incomeSources.forEach(function (source) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-option';
      btn.innerHTML = '<span class="icon" aria-hidden="true">' + source.icon + '</span><span>' +
        App.i18n.t('income.sources.' + source.id) + '</span>';
      btn.addEventListener('click', function () {
        wizard.sourceId = source.id;
        wizard.step = 2;
        renderIncomeStep2();
      });
      grid.appendChild(btn);
    });
  }

  function renderIncomeStep2() {
    renderAmountStep({
      titleKey: 'income.amountTitle',
      instructionKey: 'income.amountInstruction',
      initial: wizard.amountCents,
      totalSteps: 2,
      step: 2,
      allowZero: false,
      onBack: function () { wizard.step = 1; renderIncomeStep1(); },
      onConfirm: function (cents) {
        state.movements.push({
          id: App.utils.uid(),
          type: 'income',
          sourceId: wizard.sourceId,
          amountCents: cents,
          date: App.utils.today()
        });
        save();
        App.feedback.celebrate(
          App.i18n.t('income.savedWithBalance').replace('{balance}', App.money.format(balanceCents())),
          function () { closeWizard(); }
        );
      }
    });
  }

  /* ---------- Wizard: planned payment (name + amount, no ledger write) ---------- */
  function renderCommitmentStep1() {
    $('#screen-wizard').innerHTML =
      wizardChrome(2, 1, null) +
      '<h2>' + App.i18n.t('commitments.nameTitle') + '</h2>' +
      '<p>' + App.i18n.t('commitments.nameInstruction') + '</p>' +
      '<label class="sr-only" for="commitmentName">' + App.i18n.t('commitments.nameAria') + '</label>' +
      '<input type="text" id="commitmentName" class="amount-display" style="font-size:var(--text-base);text-align:left" maxlength="40" autocomplete="off" placeholder="' + App.utils.escapeHtml(App.i18n.t('commitments.namePlaceholder')) + '" value="' + App.utils.escapeHtml(wizard.name) + '">' +
      '<label class="settings-file" for="commitmentDueDate"><span>' + App.i18n.t('commitments.dueDateLabel') + '</span><input type="date" id="commitmentDueDate" class="commitment-date" aria-label="' + App.utils.escapeHtml(App.i18n.t('commitments.dueDateAria')) + '" value="' + App.utils.escapeHtml(wizard.dueDate || '') + '"></label>' +
      '<button type="button" class="btn" id="wizNext" disabled>' + App.i18n.t('core.next') + '</button>';
    wireChrome(null);
    var input = $('#commitmentName');
    var dateInput = $('#commitmentDueDate');
    var next = $('#wizNext');
    function checkReady() { next.disabled = input.value.trim().length === 0; }
    input.addEventListener('input', function () { wizard.name = input.value; checkReady(); });
    dateInput.addEventListener('change', function () { wizard.dueDate = dateInput.value; });
    checkReady();
    next.addEventListener('click', function () { wizard.step = 2; renderCommitmentStep2(); });
  }

  function renderCommitmentStep2() {
    renderAmountStep({
      titleKey: 'commitments.amountTitle',
      instructionKey: 'commitments.amountInstruction',
      initial: wizard.amountCents,
      totalSteps: 2,
      step: 2,
      allowZero: false,
      onBack: function () { wizard.step = 1; renderCommitmentStep1(); },
      onConfirm: function (cents) {
        state.commitments.push({ id: App.utils.uid(), name: wizard.name.trim(), amountCents: cents, dueDate: wizard.dueDate || '', createdDate: App.utils.today() });
        save();
        App.feedback.celebrate(App.i18n.t('commitments.savedMessage'), function () { closeWizard(); });
      }
    });
  }

  function continueSimulation(total, render, zone) {
    var activeWizard = wizard;
    var buttons = Array.prototype.slice.call($('#screen-wizard').querySelectorAll('button'));
    buttons.forEach(function (button) {
      if (button.closest('.keypad') || button.id === 'wizNext') button.disabled = true;
    });
    App.feedback.lockUntilAck([], zone, function () {
      if (wizard !== activeWizard) return;
      if (wizard.index + 1 >= total) closeWizard();
      else { wizard.index += 1; render(); }
    });
  }

  /* ---------- Euro simulation: check change (no Tokens, no ledger write) ---------- */
  function renderChangeSimulation() {
    var scenario = DATA.changeScenarios[wizard.index];
    var expected = scenario.paidCents - scenario.costCents;
    renderAmountStep({
      titleKey: 'blocks.simulation.changeTitle',
      instructionKey: 'blocks.simulation.changeQuestion',
      initial: 0,
      totalSteps: DATA.changeScenarios.length,
      step: wizard.index + 1,
      allowZero: false,
      showFeedback: true,
      invalidKey: 'blocks.simulation.changeHint',
      contextHtml: '<div class="card simulation-scene center"><p>' +
        App.i18n.t('blocks.simulation.changeScenarios.' + scenario.id) + '</p>' +
        '<p class="simulation-scene__amounts"><strong>' + App.money.format(scenario.paidCents) +
        '</strong> <span aria-hidden="true">→</span> <strong>' + App.money.format(scenario.costCents) + '</strong></p></div>',
      onInvalid: function () { App.feedback.encourage(); },
      onBack: null,
      validate: function (cents) { return cents === expected; },
      onConfirm: function () {
        App.feedback.success();
        if ($('#wizSimFeedback')) {
          $('#wizSimFeedback').textContent = App.i18n.t('blocks.simulation.simulationCorrect');
          $('#wizSimFeedback').className = 'feedback success';
        }
        continueSimulation(DATA.changeScenarios.length, function () { renderChangeSimulation(); }, $('#wizSimFeedback'));
      }
    });
  }

  /* ---------- Asset simulation: straight-line depreciation (no ledger write) ---------- */
  function renderDepreciationSimulation() {
    var scenario = DATA.depreciationScenarios[wizard.index];
    var depreciableCents = scenario.priceCents - scenario.residualCents;
    var depreciationCents = Math.round(depreciableCents * scenario.elapsedMonths / scenario.lifeMonths);
    var expected = scenario.priceCents - depreciationCents;
    var scene = App.i18n.t('blocks.simulation.depreciationScenarios.' + scenario.id + 'Scene')
      .replace('{price}', App.money.format(scenario.priceCents))
      .replace('{life}', String(scenario.lifeMonths))
      .replace('{elapsed}', String(scenario.elapsedMonths))
      .replace('{residual}', App.money.format(scenario.residualCents));
    renderAmountStep({
      titleKey: 'blocks.simulation.depreciationTitle',
      instructionKey: 'blocks.simulation.depreciationQuestion',
      initial: 0,
      totalSteps: DATA.depreciationScenarios.length,
      step: wizard.index + 1,
      allowZero: false,
      showFeedback: true,
      invalidKey: 'blocks.simulation.depreciationHint',
      contextHtml: '<div class="card simulation-scene center"><p>' + scene + '</p>' +
        '<p class="simulation-scene__amounts"><strong>' + App.money.format(scenario.priceCents) +
        '</strong> <span aria-hidden="true">→</span> <strong>' + App.money.format(scenario.residualCents) + '</strong></p>' +
        '<p class="simulation-scene__formula">' + App.i18n.t('blocks.simulation.depreciationFormula') + '</p></div>',
      onInvalid: function () { App.feedback.encourage(); },
      onBack: null,
      validate: function (cents) { return cents === expected; },
      onConfirm: function () {
        App.feedback.success();
        if ($('#wizSimFeedback')) {
          $('#wizSimFeedback').textContent = App.i18n.t('blocks.simulation.simulationCorrect');
          $('#wizSimFeedback').className = 'feedback success';
        }
        continueSimulation(DATA.depreciationScenarios.length, function () { renderDepreciationSimulation(); }, $('#wizSimFeedback'));
      }
    });
  }

  /* ---------- Investment simulation: calculate a hypothetical return ---------- */
  function renderReturnSimulation() {
    var scenario = DATA.returnScenarios[wizard.index];
    var gain = Math.round(scenario.principalCents * scenario.rateBps / 10000);
    var rate = String(scenario.rateBps / 100);
    var scene = App.i18n.t('blocks.simulation.returnScenarios.' + scenario.id + 'Scene')
      .replace('{principal}', App.money.format(scenario.principalCents))
      .replace('{rate}', rate);
    renderAmountStep({
      titleKey: 'blocks.simulation.returnTitle',
      instructionKey: 'blocks.simulation.returnQuestion',
      initial: 0,
      totalSteps: DATA.returnScenarios.length,
      step: wizard.index + 1,
      allowZero: false,
      showFeedback: true,
      invalidKey: 'blocks.simulation.returnHint',
      contextHtml: '<div class="card simulation-scene center"><p>' + scene + '</p>' +
        '<p class="simulation-scene__amounts"><strong>' + App.money.format(scenario.principalCents) +
        '</strong> <span aria-hidden="true">→</span> <strong>' + rate + '%</strong></p>' +
        '<p class="simulation-scene__formula">' + App.i18n.t('blocks.simulation.returnFormula') + '</p></div>',
      onInvalid: function () { App.feedback.encourage(); },
      onBack: null,
      validate: function (cents) { return cents === gain; },
      onConfirm: function () {
        App.feedback.success();
        if ($('#wizSimFeedback')) {
          $('#wizSimFeedback').textContent = App.i18n.t('blocks.simulation.simulationCorrect');
          $('#wizSimFeedback').className = 'feedback success';
        }
        continueSimulation(DATA.returnScenarios.length, function () { renderReturnSimulation(); }, $('#wizSimFeedback'));
      }
    });
  }

  /* ---------- Euro simulation: safe payment decisions (no Tokens) ---------- */
  function renderSafetySimulation() {
    var scenario = DATA.safetyScenarios[wizard.index];
    var total = DATA.safetyScenarios.length;
    var html = wizardChrome(total, wizard.index + 1, null) +
      '<h2>' + App.i18n.t('blocks.simulation.safetyTitle') + '</h2>' +
      '<p>' + App.i18n.t('blocks.simulation.safetyQuestion') + '</p>' +
      '<div class="card simulation-scene center"><p>' +
        App.i18n.t('blocks.simulation.safetyScenarios.' + scenario.id + 'Scene') + '</p></div>' +
      '<div class="option-grid" id="simulationSafetyOptions"></div>' +
      '<div class="feedback" id="simulationSafetyFeedback" aria-live="polite"></div>';
    $('#screen-wizard').innerHTML = html;
    wireChrome(null);

    var grid = $('#simulationSafetyOptions');
    var feedback = $('#simulationSafetyFeedback');
    scenario.options.forEach(function (key, index) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-option';
      btn.textContent = App.i18n.t(key);
      btn.addEventListener('click', function () {
        if (index !== scenario.safeIndex) {
          feedback.textContent = App.i18n.t('blocks.simulation.safetyHint');
          feedback.className = 'feedback encourage';
          App.feedback.encourage();
          return;
        }
        Array.prototype.forEach.call(grid.querySelectorAll('button'), function (item) { item.disabled = true; });
        feedback.textContent = App.i18n.t('blocks.simulation.simulationCorrect');
        feedback.className = 'feedback success';
        App.feedback.success();
        continueSimulation(total, function () { renderSafetySimulation(); }, feedback);
      });
      grid.appendChild(btn);
    });
  }

  /* ---------- Everyday autonomy simulations (no Tokens, no ledger write) ---------- */
  function renderChoiceSimulation(groupId) {
    var scenarios = DATA.autonomyScenarios[groupId] ||
      (groupId === 'obsolescence' ? DATA.obsolescenceScenarios :
        (groupId === 'risk' ? DATA.riskScenarios :
          (groupId === 'investment' ? DATA.investmentScenarios :
            (groupId === 'bankProducts' ? DATA.bankProductsScenarios : DATA.housingScenarios))));
    var scenario = scenarios[wizard.index];
    var total = scenarios.length;
    var baseKey = 'blocks.simulation.' + groupId;
    var html = wizardChrome(total, wizard.index + 1, null) +
      '<h2>' + App.i18n.t(baseKey + 'Title') + '</h2>' +
      '<p>' + App.i18n.t(baseKey + 'Question') + '</p>' +
      '<div class="card simulation-scene center"><p>' +
        App.i18n.t(baseKey + 'Scenarios.' + scenario.id + 'Scene') + '</p></div>' +
      '<div class="option-grid" id="simulationChoiceOptions"></div>' +
      '<div class="feedback" id="simulationChoiceFeedback" aria-live="polite"></div>';
    $('#screen-wizard').innerHTML = html;
    wireChrome(null);

    var grid = $('#simulationChoiceOptions');
    var feedback = $('#simulationChoiceFeedback');
    scenario.options.forEach(function (key, index) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-option';
      btn.textContent = App.i18n.t(key);
      btn.addEventListener('click', function () {
        if (index !== scenario.safeIndex) {
          feedback.textContent = App.i18n.t(baseKey + 'Hint');
          feedback.className = 'feedback encourage';
          App.feedback.encourage();
          return;
        }
        Array.prototype.forEach.call(grid.querySelectorAll('button'), function (item) { item.disabled = true; });
        feedback.textContent = App.i18n.t('blocks.simulation.simulationCorrect');
        feedback.className = 'feedback success';
        App.feedback.success();
        continueSimulation(total, function () { renderChoiceSimulation(groupId); }, feedback);
      });
      grid.appendChild(btn);
    });
  }

  /* ---------- Purchase documents: order → delivery note → invoice → payment ---------- */
  function renderPurchaseLifecycle() {
    var scenario = DATA.purchaseLifecycleScenarios[wizard.scenarioIndex || 0];
    var stage = wizard.stage || 0;
    var stageIds = ['order', 'delivery', 'invoice', 'payment'];
    var stageId = stageIds[stage];
    var baseKey = 'blocks.simulation.purchase';
    var remaining = balanceCents() - scenario.priceCents;
    var timeline = stageIds.map(function (id, index) {
      return '<span class="purchase-timeline__item ' + (index < stage ? 'is-done ' : '') + (index === stage ? 'is-current' : '') + '">' +
        App.i18n.t(baseKey + 'Stages.' + id + 'Title') + '</span>';
    }).join('');
    var html = wizardChrome(4, stage + 1, stage > 0 ? function () {
      wizard.stage -= 1;
      renderPurchaseLifecycle();
    } : null) +
      '<h2>' + App.i18n.t(baseKey + 'Title') + '</h2>' +
      '<p>' + App.i18n.t(baseKey + 'Intro') + '</p>' +
      '<div class="purchase-timeline" aria-label="' + App.utils.escapeHtml(App.i18n.t(baseKey + 'Title')) + '">' + timeline + '</div>' +
      '<div class="card simulation-scene center"><p><strong>' +
        App.i18n.t(baseKey + 'Scenarios.' + scenario.id) + '</strong></p>' +
        '<p>' + App.i18n.t(baseKey + 'Stages.' + stageId + 'Detail') + '</p></div>';
    if (stage < 3) {
      html += '<button type="button" class="btn" id="purchaseNext">' + App.i18n.t(baseKey + 'Next') + '</button>';
    } else {
      html += '<div class="card center"><p class="money-after">' +
        App.i18n.t(baseKey + 'After').replace('{balance}', App.money.format(remaining)) + '</p>' +
        (remaining < 0 ? '<p class="money-warning" role="status">' + App.i18n.t(baseKey + 'OverBalance') + '</p>' : '') +
        '</div>' +
        '<button type="button" class="btn" id="purchasePay">' +
        App.i18n.t(baseKey + 'Pay').replace('{amount}', App.money.format(scenario.priceCents)) + '</button>';
    }
    $('#screen-wizard').innerHTML = html;
    wireChrome(stage > 0 ? function () {
      wizard.stage -= 1;
      renderPurchaseLifecycle();
    } : null);
    if (stage < 3) {
      $('#purchaseNext').addEventListener('click', function () {
        wizard.stage += 1;
        renderPurchaseLifecycle();
      });
    } else {
      $('#purchasePay').addEventListener('click', function () {
        $('#purchasePay').disabled = true;
        state.movements.push({
          id: App.utils.uid(),
          type: 'expense',
          categoryId: scenario.categoryId,
          amountCents: scenario.priceCents,
          date: App.utils.today(),
          documentCycle: 'order-delivery-invoice-payment'
        });
        save();
        App.feedback.celebrate(App.i18n.t(baseKey + 'Paid'), function () { closeWizard(); });
      });
    }
  }

  /* ---------- Local settings, backup and recovery ---------- */
  function renderSettings() {
    var prefs = App.storage.get('prefs');
    var currentSize = prefs && prefs.textSize ? prefs.textSize : 'normal';
    $('#screen-wizard').innerHTML =
      wizardChrome(1, 1, null) +
      '<h2>' + App.i18n.t('settings.title') + '</h2>' +
      '<p>' + App.i18n.t('settings.intro') + '</p>' +
      '<div class="settings-group"><h3>' + App.i18n.t('settings.textSizeTitle') + '</h3>' +
      '<p>' + App.i18n.t('settings.textSizeInstruction') + '</p>' +
      '<div class="option-grid" id="textSizeOptions">' +
        '<button type="button" class="btn-option" data-size="normal">' + App.i18n.t('settings.textSizeNormal') + '</button>' +
        '<button type="button" class="btn-option" data-size="large">' + App.i18n.t('settings.textSizeLarge') + '</button>' +
        '<button type="button" class="btn-option" data-size="extraLarge">' + App.i18n.t('settings.textSizeExtraLarge') + '</button>' +
      '</div></div>' +
      '<div class="settings-group"><h3>' + App.i18n.t('settings.backupTitle') + '</h3>' +
      '<p>' + App.i18n.t('settings.backupInstruction') + '</p>' +
      '<button type="button" class="btn" id="btnExportData">' + App.i18n.t('settings.exportButton') + '</button>' +
      '<label class="settings-file"><span>' + App.i18n.t('settings.importLabel') + '</span><input type="file" id="dataImport" accept="application/json,.json"></label>' +
      '<div class="feedback" id="settingsFeedback" aria-live="polite"></div></div>' +
      '<div class="settings-group settings-group--danger"><h3>' + App.i18n.t('settings.resetTitle') + '</h3>' +
      '<p>' + App.i18n.t('settings.resetInstruction') + '</p>' +
      '<button type="button" class="btn btn--secundario" id="btnResetData">' + App.i18n.t('settings.resetButton') + '</button></div>';
    wireChrome(null);

    var sizeButtons = $('#textSizeOptions').querySelectorAll('[data-size]');
    Array.prototype.forEach.call(sizeButtons, function (button) {
      var active = button.getAttribute('data-size') === currentSize;
      button.setAttribute('aria-pressed', String(active));
      button.addEventListener('click', function () {
        var size = button.getAttribute('data-size');
        var nextPrefs = App.storage.get('prefs');
        nextPrefs.textSize = size;
        App.storage.set('prefs', nextPrefs);
        var scale = size === 'extraLarge' ? 1.3 : (size === 'large' ? 1.15 : 1);
        document.documentElement.style.setProperty('--text-scale', scale);
        Array.prototype.forEach.call(sizeButtons, function (item) {
          item.setAttribute('aria-pressed', String(item === button));
        });
      });
    });

    $('#btnExportData').addEventListener('click', function () {
      var payload = JSON.stringify({ format: 'okeymoney-backup', version: 1, exportedAt: App.utils.today(), storage: App.storage.dump() }, null, 2);
      var feedback = $('#settingsFeedback');
      if (typeof Blob === 'undefined' || !window.URL || !URL.createObjectURL) {
        feedback.textContent = App.i18n.t('settings.exportUnavailable');
        feedback.className = 'feedback encourage';
        return;
      }
      var url = URL.createObjectURL(new Blob([payload], { type: 'application/json' }));
      var link = document.createElement('a');
      link.href = url;
      link.download = 'okeymoney-backup-' + App.utils.today() + '.json';
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 0);
      feedback.textContent = App.i18n.t('settings.exportedMessage');
      feedback.className = 'feedback success';
    });

    $('#dataImport').addEventListener('change', function (event) {
      var file = event.target.files && event.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function () {
        var feedback = $('#settingsFeedback');
        try {
          var payload = JSON.parse(reader.result);
          if (!payload || payload.format !== 'okeymoney-backup' || !payload.storage || typeof payload.storage !== 'object') throw new Error('invalid');
          if (!window.confirm(App.i18n.t('settings.importConfirm'))) return;
          if (!App.storage.restore(payload.storage)) throw new Error('restore');
          window.location.reload();
        } catch (e) {
          feedback.textContent = App.i18n.t('settings.importError');
          feedback.className = 'feedback encourage';
        }
      };
      reader.readAsText(file);
    });

    $('#btnResetData').addEventListener('click', function () {
      if (!window.confirm(App.i18n.t('settings.resetConfirm'))) return;
      App.storage.clearAll();
      window.location.reload();
    });
  }

  /* ---------- Euro simulation: plan a purchase before recording it ---------- */
  function renderPlanBudget() {
    renderAmountStep({
      titleKey: 'blocks.simulation.planBudgetTitle',
      instructionKey: 'blocks.simulation.planBudgetInstruction',
      initial: wizard.budgetCents,
      totalSteps: 2,
      step: 1,
      allowZero: false,
      contextHtml: '<div class="card simulation-scene center"><p>' +
        App.i18n.t('home.balanceLabel') + ': <strong>' + App.money.format(balanceCents()) + '</strong></p></div>',
      onBack: null,
      onConfirm: function (cents) {
        wizard.budgetCents = cents;
        state.cycle.budgeted = true;
        save();
        wizard.step = 2;
        renderPlanChoose();
      }
    });
  }

  function renderPlanChoose() {
    var html = wizardChrome(2, 2, function () { wizard.step = 1; renderPlanBudget(); }) +
      '<h2>' + App.i18n.t('blocks.simulation.planChoiceTitle') + '</h2>' +
      '<p>' + App.i18n.t('blocks.simulation.planChoiceInstruction') + '</p>' +
      '<div class="card simulation-scene center"><p>' + App.i18n.t('home.balanceLabel') +
      ': <strong>' + App.money.format(wizard.budgetCents) + '</strong></p></div>' +
      '<div class="option-grid plan-item-grid" id="planItemGrid"></div>' +
      '<div id="planResult" aria-live="polite"></div>';
    $('#screen-wizard').innerHTML = html;
    wireChrome(function () { wizard.step = 1; renderPlanBudget(); });

    var grid = $('#planItemGrid');
    var result = $('#planResult');
    DATA.planItems.forEach(function (item) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-option';
      var itemCategory = categoryById(item.categoryId);
      var itemClassification = categoryClassificationLabel(itemCategory);
      btn.innerHTML = '<span class="icon" aria-hidden="true">' + item.icon + '</span><span>' +
        App.i18n.t('blocks.simulation.planItems.' + item.id) + '</span>' +
        (itemClassification ? '<small class="option-classification">' + App.utils.escapeHtml(itemClassification) + '</small>' : '');
      btn.addEventListener('click', function () {
        wizard.selectedItem = item;
        state.cycle.lastPlan = {
          budgetCents: wizard.budgetCents,
          itemId: item.id,
          priceCents: item.priceCents,
          date: App.utils.today()
        };
        save();
        var remaining = wizard.budgetCents - item.priceCents;
        var actualRemaining = balanceCents() - item.priceCents;
        var overBudget = remaining < 0;
        var overBalance = actualRemaining < 0;
        var over = overBudget || overBalance;
        var planMessage = overBudget
          ? App.i18n.t('blocks.simulation.planOverBudget')
          : (overBalance
            ? App.i18n.t('blocks.simulation.planOverBalance')
            : App.i18n.t('blocks.simulation.planRemaining').replace('{balance}', App.money.format(remaining)));
        result.innerHTML = '<p class="' + (over ? 'money-warning' : 'money-after') + '">' +
          planMessage +
          '</p>' +
          '<button type="button" class="btn" id="planRecord">' + App.i18n.t('blocks.simulation.planRecord') + '</button>';
        $('#planRecord').addEventListener('click', function () {
          openExpenseWizard({ categoryId: item.categoryId, amountCents: item.priceCents });
        });
      });
      grid.appendChild(btn);
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
    DATA.goalIcons.slice(0, 6).forEach(function (icon, index) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-option';
      btn.setAttribute('aria-label', App.i18n.t('goals.iconLabel').replace('{n}', String(index + 1)));
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
        App.feedback.celebrate(
          App.i18n.t('goals.savedWithBalance').replace('{balance}', App.money.format(balanceCents())),
          function () { closeWizard(); }
        );
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
      showFeedback: true,
      maxCents: Math.max(balanceCents(), 0),
      maxHintKey: 'goals.overBalance',
      contextHtml: '<div class="card simulation-scene center"><p>' +
        App.i18n.t('goals.availableBalance').replace('{balance}', App.money.format(Math.max(balanceCents(), 0))) + '</p></div>',
      onBack: null,
      validate: function (cents) { return cents <= Math.max(balanceCents(), 0); },
      invalidKey: 'goals.overBalance',
      onInvalid: function () { App.feedback.encourage(); },
      onConfirm: function (cents) {
        var goal = goalById(wizard.goalId);
        if (!goal || cents > Math.max(balanceCents(), 0)) return;
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
        App.feedback.celebrate(
          App.i18n.t('goals.addedWithBalance').replace('{balance}', App.money.format(balanceCents())),
          function () { closeWizard(); }
        );
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
    } else if (wizard.type === 'changeSimulation') {
      renderChangeSimulation();
    } else if (wizard.type === 'depreciationSimulation') {
      renderDepreciationSimulation();
    } else if (wizard.type === 'returnSimulation') {
      renderReturnSimulation();
    } else if (wizard.type === 'safetySimulation') {
      renderSafetySimulation();
    } else if (wizard.type === 'rightsSimulation') {
      renderChoiceSimulation('rights');
    } else if (wizard.type === 'communicationSimulation') {
      renderChoiceSimulation('communication');
    } else if (wizard.type === 'emergencySimulation') {
      renderChoiceSimulation('emergency');
    } else if (wizard.type === 'obsolescenceSimulation') {
      renderChoiceSimulation('obsolescence');
    } else if (wizard.type === 'riskSimulation') {
      renderChoiceSimulation('risk');
    } else if (wizard.type === 'investmentSimulation') {
      renderChoiceSimulation('investment');
    } else if (wizard.type === 'bankProductsSimulation') {
      renderChoiceSimulation('bankProducts');
    } else if (wizard.type === 'housingSimulation') {
      renderChoiceSimulation('housing');
    } else if (wizard.type === 'settings') {
      renderSettings();
    } else if (wizard.type === 'purchaseLifecycle') {
      renderPurchaseLifecycle();
    } else if (wizard.type === 'planBudget') {
      if (wizard.step === 1) renderPlanBudget();
      else renderPlanChoose();
    } else if (wizard.type === 'income') {
      if (wizard.step === 1) renderIncomeStep1();
      else renderIncomeStep2();
    } else if (wizard.type === 'commitment') {
      if (wizard.step === 1) renderCommitmentStep1();
      else renderCommitmentStep2();
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
      btn.className = 'btn-idioma';
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
  if (openLessonId) focusLesson($('#lessonDetailTitle'));
  window.addEventListener('hashchange', function () {
    openLessonId = lessonFromHash();
    renderDidacticLessons($('#didacticLessons'));
    if (openLessonId) focusLesson($('#lessonDetailTitle'));
  });
  window.addEventListener('pageshow', function (event) {
    if (event.persisted) renderHome();
  });

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js?build=72', { updateViaCache: 'none' }).catch(function () {});
  }
})();
