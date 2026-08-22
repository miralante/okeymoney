/* ==========================================================================
   Okeymoney — Practice wallet
   Exposes window.App.wallet: a second ledger stored under
   'okeymoney:practiceWallet', independent from the real ledger in
   'okeymoney:data' (used by Mi dinero). All amounts are integer cents
   in the invented "token" currency (one eurocent = one subtoken).
   Activities credit tokens on completion; this module never debits the
   real wallet. See doc/en/technical.md §10.
   ========================================================================== */
(function () {
  'use strict';

  window.App = window.App || {};

  var KEY = 'practiceWallet';

  /* Single read of the saved state, with a defensive shape so any
     page that calls App.wallet before it has been seeded still gets
     a usable object instead of throwing. */
  function read() {
    var raw = App.storage.get(KEY);
    if (!raw || typeof raw !== 'object') {
      return { balanceCents: 0, history: [] };
    }
    if (typeof raw.balanceCents !== 'number') raw.balanceCents = 0;
    if (!Array.isArray(raw.history)) raw.history = [];
    return raw;
  }

  function write(state) {
    App.storage.set(KEY, state);
  }

  /**
   * Returns the current balance in cents. Safe to call before the
   * wallet has been initialised: returns 0.
   */
  function balance() {
    return read().balanceCents;
  }

  /**
   * Adds `cents` (positive or negative) to the practice balance and
   * records the reason in history. `reason` is one of:
   *   'activity:<slug>'     — credit on completing an activity
   *   'reset'               — explicit reset from settings (future)
   * Returns the new balance.
   */
  function credit(cents, reason) {
    if (typeof cents !== 'number' || !isFinite(cents)) return balance();
    var state = read();
    state.balanceCents += cents;
    state.history.push({
      deltaCents: cents,
      reason: reason || 'unknown',
      date: App.utils.today()
    });
    /* Keep history short: only the last 50 entries matter for UX. */
    if (state.history.length > 50) {
      state.history = state.history.slice(state.history.length - 50);
    }
    write(state);
    return state.balanceCents;
  }

  /** Resets the practice wallet to 0 and clears history. */
  function reset() {
    write({ balanceCents: 0, history: [] });
  }

  /**
   * Returns the completion record for one activity, or null if the
   * person has never finished it. Schema:
   *   { done: true, completedAt: 'YYYY-MM-DD', attempts: number }
   */
  function activityStatus(slug) {
    var raw = App.storage.get('activity:' + slug);
    if (!raw || typeof raw !== 'object') return null;
    return raw;
  }

  /** Marks one activity as completed (idempotent). */
  function markActivityDone(slug, attempts) {
    App.storage.set('activity:' + slug, {
      done: true,
      completedAt: App.utils.today(),
      attempts: typeof attempts === 'number' ? attempts : 1
    });
  }

  window.App.wallet = {
    balance: balance,
    credit: credit,
    reset: reset,
    activityStatus: activityStatus,
    markActivityDone: markActivityDone
  };
})();
