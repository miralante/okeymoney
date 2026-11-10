/* ==========================================================================
   Okeymoney — achievements catalogue ("logros").

   The policy is the suite's (apptonomia/doc/es/spec.md §2.6): milestones
   computed from saved progress, no streaks, no timers, no losses. A new one is
   announced once, neutrally, when the activity that earns it is finished. The
   mechanism lives in ./achievements-engine.js (identical in every app); this file
   holds Okeymoney's rules and texts.

   Storage: 'okeymoney:achievements' -> { <id>: <timestamp of first unlock> }
   (App.storage's reset in /config/ deletes the keys with the app prefix).

   Public API (window.App.achievements):
     list                    the catalogue
     unlocked()              { id: timestamp }
     sync()                  check every rule against the saved progress; saves the
                             new ones silently and returns their ids
     onActivityFinished()    sync() and announce the new ids in #achievement-notice

   Rules use only data the app already saves: 'activity:<slug>' records and the
   ledger 'data' (movements, goals). Mistakes and time are never read.
   ========================================================================== */
(function () {
  'use strict';

  window.App = window.App || {};

  App.i18n.register({
    achievementNew: 'Nuevo logro: {name}',
    achievementFirstActivity: 'Primera actividad',
    achievementFirstActivityDesc: 'Termina tu primera actividad.',
    achievementFiveActivities: 'Cinco actividades',
    achievementFiveActivitiesDesc: 'Termina cinco actividades.',
    achievementAllActivities: 'Todas las actividades',
    achievementAllActivitiesDesc: 'Termina todas las actividades del catálogo.',
    achievementFirstRecord: 'Primer registro',
    achievementFirstRecordDesc: 'Anota tu primer ingreso o gasto.',
    achievementGoalReached: 'Meta cumplida',
    achievementGoalReachedDesc: 'Alcanza una de tus metas de ahorro.'
  }, 'es');

  App.i18n.register({
    achievementNew: 'New achievement: {name}',
    achievementFirstActivity: 'First activity',
    achievementFirstActivityDesc: 'Finish your first activity.',
    achievementFiveActivities: 'Five activities',
    achievementFiveActivitiesDesc: 'Finish five activities.',
    achievementAllActivities: 'All activities',
    achievementAllActivitiesDesc: 'Finish every activity in the catalogue.',
    achievementFirstRecord: 'First record',
    achievementFirstRecordDesc: 'Record your first income or expense.',
    achievementGoalReached: 'Goal reached',
    achievementGoalReachedDesc: 'Reach one of your savings goals.'
  }, 'en');

  var CATALOG = [
    { id: 'firstActivity', icon: '⭐', nameKey: 'achievementFirstActivity', descKey: 'achievementFirstActivityDesc',
      test: function (p) { return p.activities >= 1; } },
    { id: 'fiveActivities', icon: '🌟', nameKey: 'achievementFiveActivities', descKey: 'achievementFiveActivitiesDesc',
      test: function (p) { return p.activities >= 5; } },
    { id: 'allActivities', icon: '🎓', nameKey: 'achievementAllActivities', descKey: 'achievementAllActivitiesDesc',
      test: function (p) { return p.allActivities === true; } },
    { id: 'firstRecord', icon: '🧾', nameKey: 'achievementFirstRecord', descKey: 'achievementFirstRecordDesc',
      test: function (p) { return p.records >= 1; } },
    { id: 'goalReached', icon: '🏆', nameKey: 'achievementGoalReached', descKey: 'achievementGoalReachedDesc',
      test: function (p) { return p.goalReached === true; } }
  ];

  var board = window.ApptonomiaAchievements.create({
    storageKey: 'okeymoney:achievements',
    catalog: CATALOG,
    t: function (key) { return App.i18n.t(key); }
  });

  /* The home catalogue (root data.js) when the page loaded it. Tool pages ship
     their own unrelated DATA, so check the shape. */
  function catalogSlugs() {
    var data = window.DATA;
    if (!data || !Array.isArray(data.activities)) return null;
    return data.activities
      .filter(function (a) { return a && a.available && a.slug; })
      .map(function (a) { return a.slug; });
  }

  /** Snapshot of the saved progress. */
  function snapshot() {
    var saved = App.storage.dump ? App.storage.dump() : {};
    var done = {};
    var activities = 0;
    Object.keys(saved).forEach(function (k) {
      if (k.indexOf('activity:') !== 0) return;
      var rec = saved[k];
      if (rec && typeof rec === 'object' && rec.done) {
        activities += 1;
        done[k.slice('activity:'.length)] = true;
      }
    });
    var ledger = App.storage.get('data') || {};
    var movements = Array.isArray(ledger.movements) ? ledger.movements : [];
    var goals = Array.isArray(ledger.goals) ? ledger.goals : [];
    var catalog = catalogSlugs();
    return {
      activities: activities,
      allActivities: !!(catalog && catalog.length && catalog.every(function (slug) { return done[slug]; })),
      records: movements.filter(function (m) { return m && (m.type === 'expense' || m.type === 'income'); }).length,
      goalReached: goals.some(function (g) {
        return g && (g.achieved || (g.targetCents > 0 && g.savedCents >= g.targetCents));
      })
    };
  }

  function sync() {
    return board.evaluate(snapshot());
  }

  /** Neutral notice. The element is created on first use. */
  function announce(ids) {
    if (!ids || !ids.length) return;
    var el = document.getElementById('achievement-notice');
    if (!el) {
      el = document.createElement('p');
      el.id = 'achievement-notice';
      el.className = 'achievement-notice';
      el.setAttribute('aria-live', 'polite');
      document.body.appendChild(el);
    }
    board.notify(el, ids);
  }

  window.App.achievements = {
    list: CATALOG,
    unlocked: board.unlocked,
    sync: sync,
    onActivityFinished: function () { announce(sync()); }
  };

  /* Retroactive credit from progress saved before this page loaded: silent. */
  try { sync(); } catch (err) { /* never block the page over a badge */ }
})();
