/* ==========================================================================
   Okeymoney — Achievements catalog, unlock logic and badge grid
   Exposes window.App.achievements.list / .unlocked() / .achieve(id) /
   .sync() / .render(container).

   Unlocked achievements are stored as { id: timestamp } under the
   'okeymoney:achievements' key (via App.storage), so the full reset in
   /config/ (App.storage.clearAll) wipes them together with the rest.

   Every achievement is derived from data the app already saves:
   - 'activity:<slug>' completion records (App.wallet.markActivityDone),
   - the shared ledger 'okeymoney:data' (movements[] and goals[]).
   sync() re-reads that data and unlocks whatever is already earned, so
   people who used the app before achievements existed get credit the
   next time they open the home, an activity or the "About the app"
   page. It never reads or stores mistakes, attempts or time taken
   (see legal/: none of that is ever saved).

   Texts come from App.i18n (keys achievement<Name>, achievement<Name>Desc,
   achievementLocked, achievementUnlockedAt), registered only by the
   "About the app" page (about-app/), the one place render() is used.
   ========================================================================== */
(function () {
  'use strict';

  window.App = window.App || {};

  var KEY = 'achievements';
  var FEW_ACTIVITIES = 5;
  var STREAK_DAYS = 3;

  var LIST = [
    { id: 'firstActivity',  icon: '⭐', key: 'achievementFirstActivity' },
    { id: 'fiveActivities', icon: '🌟', key: 'achievementFiveActivities' },
    { id: 'streak3',        icon: '🔥', key: 'achievementStreak3' },
    { id: 'allActivities',  icon: '🎓', key: 'achievementAllActivities' },
    { id: 'firstRecord',    icon: '🧾', key: 'achievementFirstRecord' },
    { id: 'goalReached',    icon: '🏆', key: 'achievementGoalReached' }
  ];

  /** Unlocked achievements as { id: timestamp }. */
  function unlocked() {
    var data = App.storage.get(KEY);
    return (data && typeof data === 'object' && !Array.isArray(data)) ? data : {};
  }

  /** Unlocks one achievement. Idempotent: keeps the first unlock date.
      Returns true only when it was newly unlocked. */
  function achieve(id) {
    var known = LIST.some(function (a) { return a.id === id; });
    if (!known) return false;
    var done = unlocked();
    if (done[id]) return false;
    done[id] = Date.now();
    App.storage.set(KEY, done);
    return true;
  }

  /* Slugs of every finished activity, read from the saved
     'activity:<slug>' records. */
  function completedActivities() {
    var snapshot = App.storage.dump ? App.storage.dump() : {};
    var out = [];
    Object.keys(snapshot).forEach(function (k) {
      if (k.indexOf('activity:') !== 0) return;
      var rec = snapshot[k];
      if (rec && typeof rec === 'object' && rec.done) {
        out.push({ slug: k.slice('activity:'.length), date: rec.completedAt });
      }
    });
    return out;
  }

  /* The home catalogue (root data.js) when the page loaded it. Tool
     pages ship their own unrelated DATA, so check the shape. */
  function catalogSlugs() {
    var data = window.DATA;
    if (!data || !Array.isArray(data.activities)) return null;
    return data.activities
      .filter(function (a) { return a && a.available && a.slug; })
      .map(function (a) { return a.slug; });
  }

  /* true if `dates` ('YYYY-MM-DD') contain `n` consecutive calendar days. */
  function hasStreak(dates, n) {
    var days = {};
    dates.forEach(function (d) {
      if (typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)) days[d] = true;
    });
    return Object.keys(days).some(function (d) {
      var parts = d.split('-');
      var start = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      for (var i = 1; i < n; i++) {
        var next = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
        var key = next.getFullYear() + '-' +
          String(next.getMonth() + 1).padStart(2, '0') + '-' +
          String(next.getDate()).padStart(2, '0');
        if (!days[key]) return false;
      }
      return true;
    });
  }

  /** Unlocks every achievement already earned by the saved data.
      Safe to call often (on load and after each progress event).
      Returns the ids unlocked by this call. */
  function sync() {
    var newly = [];
    function unlock(id) { if (achieve(id)) newly.push(id); }

    var activities = completedActivities();
    if (activities.length >= 1) unlock('firstActivity');
    if (activities.length >= FEW_ACTIVITIES) unlock('fiveActivities');

    var catalog = catalogSlugs();
    if (catalog && catalog.length) {
      var doneSlugs = {};
      activities.forEach(function (a) { doneSlugs[a.slug] = true; });
      if (catalog.every(function (slug) { return doneSlugs[slug]; })) unlock('allActivities');
    }

    var ledger = App.storage.get('data');
    var movements = Array.isArray(ledger.movements) ? ledger.movements : [];
    var goals = Array.isArray(ledger.goals) ? ledger.goals : [];
    if (movements.some(function (m) { return m && (m.type === 'expense' || m.type === 'income'); })) {
      unlock('firstRecord');
    }
    if (goals.some(function (g) {
      return g && (g.achieved || (g.targetCents > 0 && g.savedCents >= g.targetCents));
    })) {
      unlock('goalReached');
    }

    var dates = activities.map(function (a) { return a.date; })
      .concat(movements.map(function (m) { return m && m.date; }));
    if (hasStreak(dates, STREAK_DAYS)) unlock('streak3');

    return newly;
  }

  /** Draws one badge per achievement inside `container`. */
  function render(container) {
    if (!container) return;
    var t = App.i18n.t;
    var done = unlocked();
    container.innerHTML = '';
    LIST.forEach(function (a) {
      var isUnlocked = !!done[a.id];
      var dateStr = isUnlocked ? new Date(done[a.id]).toLocaleDateString(App.i18n.lang()) : null;
      var item = document.createElement('li');
      item.className = 'achievement-badge' + (isUnlocked ? ' unlocked' : ' locked');
      item.innerHTML =
        '<span class="achievement-badge-icon" aria-hidden="true">' + (isUnlocked ? a.icon : '🔒') + '</span>' +
        '<span class="achievement-badge-name">' + App.utils.escapeHtml(t(a.key)) + '</span>' +
        '<span class="achievement-badge-desc">' + App.utils.escapeHtml(t(a.key + 'Desc')) + '</span>' +
        '<span class="achievement-badge-status">' +
          App.utils.escapeHtml(isUnlocked ? t('achievementUnlockedAt').replace('{date}', dateStr) : t('achievementLocked')) +
        '</span>';
      container.appendChild(item);
    });
  }

  window.App.achievements = {
    list: LIST,
    unlocked: unlocked,
    achieve: achieve,
    sync: sync,
    render: render
  };
})();
