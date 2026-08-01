/* ==========================================================================
   Okeymoney — Positive reinforcement and encouragement messages
   Exposes window.App.feedback.success(zone) / .encourage(zone) /
   .celebrate(message, [after]) / .lockUntilAck(buttons, zone, [onConfirm]).
   Mistakes are never punished; celebrations stay under 2 s. Messages
   follow the active language (App.i18n.pick). Requires utils.js and i18n.js.
   ========================================================================== */
(function () {
  'use strict';

  window.App = window.App || {};

  function random(key) {
    if (window.App.i18n) return window.App.i18n.pick(key);
    return '';
  }

  /* Soft sound with Web Audio (no audio files). Fails silently. Honors
     a 'sounds' preference (on by default: only muted if explicitly
     turned off in settings). */
  var audioCtx = null;

  function soundsEnabled() {
    if (!window.App.storage) return true;
    return App.storage.get('prefs').sounds !== false;
  }

  function tone(frequency, duration, type) {
    if (!soundsEnabled()) return;
    try {
      if (!audioCtx) {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        audioCtx = new AC();
      }
      var osc = audioCtx.createOscillator();
      var gain = audioCtx.createGain();
      osc.type = type || 'sine';
      osc.frequency.value = frequency;
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) { /* silent */ }
  }

  function soundSuccess() {
    tone(523.25, 0.15);
    setTimeout(function () { tone(659.25, 0.2); }, 120);
  }

  function soundEncourage() {
    tone(392, 0.2, 'sine');
  }

  /**
   * Positive reinforcement in a feedback zone (element with aria-live).
   * @param {Element} [zone]
   * @returns {string} the message used
   */
  function success(zone) {
    var msg = random('feedback.success');
    if (zone) {
      zone.textContent = '✅ ' + msg;
      zone.classList.remove('encourage');
      zone.classList.add('success');
    }
    soundSuccess();
    return msg;
  }

  /**
   * Encouragement message after a mistake. Never punitive.
   * @param {Element} [zone]
   * @returns {string} the message used
   */
  function encourage(zone) {
    var msg = random('feedback.encourage');
    if (zone) {
      zone.textContent = msg;
      zone.classList.remove('success');
      zone.classList.add('encourage');
    }
    soundEncourage();
    return msg;
  }

  /**
   * Brief fullscreen celebration (uses .celebration from components.css).
   * @param {string} message
   * @param {function} [after] - called when it hides
   */
  function celebrate(message, after) {
    var layer = document.getElementById('app-celebration');
    if (!layer) {
      layer = document.createElement('div');
      layer.id = 'app-celebration';
      layer.className = 'celebration hidden';
      layer.setAttribute('role', 'status');
      layer.innerHTML = '<div class="emoji">🎉</div><div class="message"></div>';
      document.body.appendChild(layer);
    }
    layer.querySelector('.message').textContent = message;
    layer.classList.remove('hidden');
    soundSuccess();

    var duration = (window.App.utils && window.App.utils.reducedMotion()) ? 1200 : 1800;
    setTimeout(function () {
      layer.classList.add('hidden');
      if (after) after();
    }, duration);
  }

  function understoodText() {
    return window.App.i18n ? App.i18n.t('core.understood') : 'Entendido';
  }

  /**
   * Locks every not-yet-tried option button after a wrong answer (a
   * reading pause, never a punishment). Shows/reuses an "Understood"
   * button inside `zone`, focuses it; tapping it re-enables the buttons
   * this call locked. Retries stay unlimited.
   * @param {Element[]|NodeList} buttons
   * @param {Element} zone
   * @param {function} [onConfirm]
   */
  function lockUntilAck(buttons, zone, onConfirm) {
    var pending = Array.prototype.filter.call(buttons || [], function (b) { return !b.disabled; });
    pending.forEach(function (b) {
      b.disabled = true;
      b.classList.add('locked');
    });
    if (!zone) return;
    var button = zone.querySelector('.btn-understood');
    if (!button) {
      button = document.createElement('button');
      button.type = 'button';
      button.className = 'btn btn-understood';
      zone.appendChild(button);
    }
    button.textContent = understoodText();
    button.classList.remove('hidden');
    button.onclick = function () {
      pending.forEach(function (b) {
        b.disabled = false;
        b.classList.remove('locked');
      });
      button.classList.add('hidden');
      if (onConfirm) onConfirm();
    };
    button.focus();
  }

  window.App.feedback = {
    success: success,
    encourage: encourage,
    celebrate: celebrate,
    lockUntilAck: lockUntilAck
  };
})();
