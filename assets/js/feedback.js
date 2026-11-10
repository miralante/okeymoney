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
     turned off in config). */
  var audioCtx = null;

  function sharedSoundEnabled(kind) {
    try {
      var saved = JSON.parse(localStorage.getItem('miralante:sounds') || 'null');
      if (saved && typeof saved[kind] === 'boolean') return saved[kind];
    } catch (e) { /* ignore */ }
    return null;
  }

  function soundsEnabled(kind) {
    var shared = sharedSoundEnabled(kind);
    if (shared !== null) return shared;
    if (!window.App.storage) return kind !== 'error';
    var prefs = App.storage.get('prefs');
    return kind === 'error' ? prefs.sounds === true : prefs.sounds !== false;
  }

  function tone(frequency, duration, type, kind) {
    if (!soundsEnabled(kind || 'success')) return;
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
    tone(523.25, 0.15, 'sine', 'success');
    setTimeout(function () { tone(659.25, 0.2, 'sine', 'success'); }, 120);
  }

  function soundEncourage() {
    tone(180, 0.12, 'triangle', 'error');
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

  function understoodText() {
    return window.App.i18n ? App.i18n.t('core.understood') : 'Entendido';
  }

  window.App.feedback = {
    success: success,
    encourage: encourage,
  };
  /* Closing celebration hooks (the celebrate block below calls them). */
  function playCelebrationSound() { soundSuccess(); }
  /* No rest reminder in this app. */
  function restDue() { return false; }
  function restDone() {}

  /* suite:answer-round:begin
     Apptonomia answer round. ONE definition for every suite app.
     Canonical source: apptonomia/scripts/suite/answer-round.js. The block between
     the begin/end markers is copied byte-for-byte into assets/js/feedback.js of
     each app by apptonomia/scripts/sync-answer-round.js. Never edit a copy by hand.

     Rules (the same in every app):
       - Right answer: the chosen answer stays, the other answers are hidden, and
         the app says it is correct (markCorrect + the app's own success message).
       - Wrong answer: the answers are hidden while the socratic hint is shown;
         «Entendido» brings the answers back. The wrong answer stays disabled.
       - Mistakes are never punished and retries are unlimited. */

  /* The label of the acknowledgement button, in the active language. */
  function textoEntendido() {
    return window.App.i18n ? App.i18n.t('core.understood') : 'Entendido';
  }

  /* Keeps the reading pause in a stable place, before the option group.
     Activities wrap their options differently, so find the nearest ancestor
     that shares a parent with the zone and put the zone in front of it. */
  function colocarZonaAntesDeOpciones(buttons, zona) {
    var primero = buttons && buttons.length ? buttons[0] : null;
    if (!primero || !zona || !zona.parentNode) return;

    var grupoOpciones = primero;
    while (grupoOpciones.parentNode && grupoOpciones.parentNode !== zona.parentNode) {
      grupoOpciones = grupoOpciones.parentNode;
    }
    if (grupoOpciones.parentNode === zona.parentNode) {
      zona.parentNode.insertBefore(zona, grupoOpciones);
    }
  }

  /**
   * Pauses the round after a wrong answer. While the hint shows, the round's
   * answers are hidden. Buttons already disabled from an earlier wrong try in
   * this round stay disabled. Shows/reuses an «Entendido» button inside `zona`
   * and focuses it; tapping it shows the answers again, hides the hint and
   * re-enables the buttons this call locked.
   * @param {Element|Element[]|NodeList} buttons - answers of the current round
   * @param {Element} zona - wrap holding the hint (or explanation) text
   * @param {function} [alConfirmar] - called after the person taps «Entendido»
   */
  function lockUntilAck(buttons, zona, alConfirmar) {
    var opciones = buttons && typeof buttons.length === 'number' ? buttons : (buttons ? [buttons] : []);
    var pendientes = Array.prototype.filter.call(opciones, function (b) {
      return b && !b.disabled && b.getAttribute('aria-disabled') !== 'true';
    });
    /* `disabled` is enough for native buttons, but some activities use custom
       interactive elements whose click handlers can still run. Capture the
       events as well so no answer can be picked while the pause waits. */
    function bloquearEvento(event) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
    pendientes.forEach(function (b) {
      b.disabled = true;
      b.setAttribute('aria-disabled', 'true');
      b.classList.add('bloqueada');
      b.addEventListener('click', bloquearEvento, true);
      b.addEventListener('keydown', bloquearEvento, true);
    });
    if (!zona) return;
    colocarZonaAntesDeOpciones(opciones, zona);
    /* The answers are hidden while the hint shows, not only disabled. */
    var ocultas = Array.prototype.filter.call(opciones, function (b) {
      return b && !b.classList.contains('hidden');
    });
    ocultas.forEach(function (b) { b.classList.add('hidden'); });
    var boton = zona.querySelector('.btn-entendido');
    if (!boton) {
      boton = document.createElement('button');
      boton.type = 'button';
      boton.className = 'btn btn-entendido';
      zona.appendChild(boton);
    }
    boton.textContent = textoEntendido();
    boton.classList.remove('hidden');
    boton.onclick = function () {
      pendientes.forEach(function (b) {
        b.removeEventListener('click', bloquearEvento, true);
        b.removeEventListener('keydown', bloquearEvento, true);
        b.disabled = false;
        b.removeAttribute('aria-disabled');
        b.classList.remove('bloqueada');
      });
      ocultas.forEach(function (b) { b.classList.remove('hidden'); });
      boton.classList.add('hidden');
      zona.classList.add('hidden');
      if (alConfirmar) alConfirmar();
    };
    boton.focus();
  }

  /**
   * A right answer is final: the chosen answer stays as it is, the other answers
   * are hidden and none of them can be pressed. The caller marks the answer
   * and says it is correct.
   * @param {Element} control - the answer the person chose
   * @param {Element|Element[]|NodeList} buttons - all the answers of the round
   */
  function markCorrect(control, buttons) {
    var opciones = buttons && typeof buttons.length === 'number' ? buttons : (buttons ? [buttons] : []);
    Array.prototype.forEach.call(opciones, function (b) {
      if (!b || b === control) return;
      b.classList.add('hidden');
      b.disabled = true;
      b.setAttribute('aria-disabled', 'true');
    });
    if (control) {
      control.disabled = true;
      control.setAttribute('aria-disabled', 'true');
    }
  }

  window.App.feedback.lockUntilAck = lockUntilAck;
  window.App.feedback.markCorrect = markCorrect;
  /* suite:answer-round:end */

  /* suite:reward-screen:begin
     Apptonomia closing screen of an activity. ONE definition for every suite app.
     Canonical source: apptonomia/scripts/suite/reward-screen.js. The block between
     the begin/end markers is copied byte for byte into assets/js/feedback.js of each
     app by apptonomia/scripts/sync-answer-round.js. Never edit a copy by hand.

     The reward is the stars won, with a short summary. Nothing else is shown here
     (no money, no points, no ranking). */

  /**
   * Writes the closing reward into `container`, replacing what it held.
   * @param {Element} container - element that holds the summary of the round
   * @param {number} stars - stars the person has
   * @param {string} summary - the summary sentence of the round
   */
  function paintReward(container, stars, summary) {
    if (!container) return;
    container.textContent = '';
    var estrellas = document.createElement('span');
    estrellas.className = 'reward-stars';
    estrellas.textContent = '⭐ ' + stars;
    var texto = document.createElement('span');
    texto.className = 'reward-summary';
    texto.textContent = summary || '';
    container.appendChild(estrellas);
    container.appendChild(texto);
  }

  window.App.feedback.paintReward = paintReward;
  /* suite:reward-screen:end */

  /* suite:celebrate:begin
     Apptonomia closing celebration. ONE definition for every suite app.
     Canonical source: apptonomia/scripts/suite/celebrate.js. The block between the
     begin/end markers is copied byte for byte into assets/js/feedback.js of each app
     (and into the new-app template) by apptonomia/scripts/sync-answer-round.js.
     Never edit a copy by hand.

     Each app supplies three small hooks OUTSIDE this block, in the same file:
       playCelebrationSound()  plays the app's success sound
       restDue()               true when this celebration carries the rest reminder
                               (counts the rounds, or the minutes, as the app decides)
       restDone()              resets the rest reminder after it was shown
     The overlay, its text and its timing are the same everywhere. */

  /**
   * Shows the closing overlay with `message` until the reading time has passed,
   * then hides it and calls `after`. The time is fixed by the length of the
   * message, so a long closing message (name, transfer line, progress) can be read.
   * @param {string} message - the closing text
   * @param {function} [after] - called when the overlay hides
   * @returns {number} how long the overlay stays up, in ms
   */
  function celebrate(message, after) {
    if (restDue()) {
      var rest = window.App.i18n ? window.App.i18n.t('core.rest') : '';
      if (rest) message = message + ' ' + rest;
      restDone();
    }
    var layer = document.getElementById('app-celebration');
    if (!layer) {
      layer = document.createElement('div');
      layer.id = 'app-celebration';
      layer.className = 'celebration hidden';
      layer.setAttribute('role', 'status');
      layer.innerHTML = '<div class="emoji" aria-hidden="true">⭐</div><div class="message"></div>';
      document.body.appendChild(layer);
    }
    layer.querySelector('.message').textContent = message;
    layer.classList.remove('hidden');
    playCelebrationSound();

    var reduced = !!(window.App.utils && window.App.utils.reducedMotion());
    var duration = Math.min(10000, (reduced ? 2500 : 3000) + String(message).length * 60);
    setTimeout(function () {
      layer.classList.add('hidden');
      if (after) after();
    }, duration);
    return duration;
  }

  window.App.feedback.celebrate = celebrate;
  /* suite:celebrate:end */

})();
