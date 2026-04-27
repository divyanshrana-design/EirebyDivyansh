/* PM Éire — Interactive Kanban Game
   Drag and drop real project tasks into the five phases of project management.
   Teaches by doing: each correct placement reveals a short lesson.
*/

(function () {
  'use strict';

  const board   = document.getElementById('kbBoard');
  const pool    = document.getElementById('kbPoolCards');
  const toast   = document.getElementById('kbToast');
  const winEl   = document.getElementById('kbWin');
  const resetBtn= document.getElementById('gameReset');
  const winReset= document.getElementById('kbWinReset');

  if (!board || !pool) return;

  const gameBar    = document.getElementById('gameBar');
  const gameDone   = document.getElementById('gameDone');
  const gameTotal  = document.getElementById('gameTotal');
  const gameScore  = document.getElementById('gameScore');
  const gameStreak = document.getElementById('gameStreak');
  const winScore   = document.getElementById('kbWinScore');
  const winStreak  = document.getElementById('kbWinStreak');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Galway Christmas Fundraiser — 10 real tasks, each with the correct phase + a lesson.
  const TASKS = [
    { id: 't1',  text: "Agree the fundraising goal (€15,000)",           phase: "initiation",  lesson: "Initiation is where you decide the goal. Without a clear target, nothing else makes sense." },
    { id: 't2',  text: "Get sign-off from the charity board",             phase: "initiation",  lesson: "Stakeholder sign-off belongs in initiation. If the board says no, you've saved weeks of planning." },
    { id: 't3',  text: "Build the detailed project timeline in a Gantt",  phase: "planning",    lesson: "The timeline is a planning artifact. You build it before execution, not during." },
    { id: 't4',  text: "Book the venue in Eyre Square",                   phase: "planning",    lesson: "Resource booking is planning. Execution is delivering against the plan you made here." },
    { id: 't5',  text: "Draft the risk register (weather, permits, staff)",phase: "planning",    lesson: "Risk registers live in planning. Identifying risks early is cheaper than managing surprises later." },
    { id: 't6',  text: "Run the actual fundraising event",                 phase: "execution",   lesson: "Execution = doing the work. This is the moment all your planning pays off." },
    { id: 't7',  text: "Post daily updates to Instagram",                  phase: "execution",   lesson: "Ongoing delivery activities are execution. Keep the team and public informed as you go." },
    { id: 't8',  text: "Check weekly donations vs. target",                phase: "monitoring",  lesson: "Monitoring is comparing actual progress to your plan. Adjust early if you're off track." },
    { id: 't9',  text: "Issue thank-you receipts to all donors",           phase: "closing",     lesson: "Formal wrap-up activities belong in closing. Don't leave supporters hanging." },
    { id: 't10', text: "Hold the team retrospective",                      phase: "closing",     lesson: "Lessons learned sessions are a closing activity. Next year's project starts here." }
  ];

  const PHASE_NAMES = {
    initiation: "Initiation",
    planning:   "Planning",
    execution:  "Execution",
    monitoring: "Monitor",
    closing:    "Closing"
  };

  let state = {
    placed: 0,
    score: 0,
    streak: 0,
    bestStreak: 0,
    total: TASKS.length
  };

  let toastTimer = null;
  let draggingCard = null;

  // -------- Helpers --------
  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function showToast(msg, variant) {
    if (!toast) return;
    toast.textContent = msg;
    toast.className = 'kb-toast show ' + (variant || '');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  function updateStats() {
    if (gameDone)   gameDone.textContent   = state.placed;
    if (gameTotal)  gameTotal.textContent  = state.total;
    if (gameScore)  gameScore.textContent  = state.score;
    if (gameStreak) gameStreak.textContent = state.streak;
    if (gameBar) {
      const pct = (state.placed / state.total) * 100;
      gameBar.style.width = pct + '%';
    }
  }

  function popEl(el) {
    if (!el || reduceMotion) return;
    el.classList.remove('pop');
    // restart animation
    void el.offsetWidth;
    el.classList.add('pop');
  }

  function updateColCount(phase) {
    const col = board.querySelector(`.kb-column[data-phase="${phase}"]`);
    if (!col) return;
    const count = col.querySelectorAll('.kb-dropzone .kb-card').length;
    const countEl = col.querySelector('.kb-col-count');
    if (countEl) {
      countEl.textContent = count;
      countEl.setAttribute('data-count', count);
    }
  }

  // -------- Build task pool --------
  function buildPool() {
    pool.innerHTML = '';
    const shuffled = shuffle(TASKS);
    shuffled.forEach(task => {
      const card = document.createElement('div');
      card.className = 'kb-card';
      card.draggable = true;
      card.dataset.id = task.id;
      card.dataset.phase = task.phase;

      const label = document.createElement('span');
      label.className = 'kb-card-text';
      label.textContent = task.text;
      card.appendChild(label);

      // Mobile fallback: tap-to-place chips
      const actions = document.createElement('div');
      actions.className = 'kb-card-actions';
      Object.keys(PHASE_NAMES).forEach(phase => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'kb-card-chip';
        chip.textContent = PHASE_NAMES[phase];
        chip.addEventListener('click', (e) => {
          e.stopPropagation();
          placeCard(card, phase);
        });
        actions.appendChild(chip);
      });
      card.appendChild(actions);

      attachDragHandlers(card);
      pool.appendChild(card);
    });
  }

  // -------- Drag handlers --------
  function attachDragHandlers(card) {
    card.addEventListener('dragstart', (e) => {
      draggingCard = card;
      card.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      try { e.dataTransfer.setData('text/plain', card.dataset.id); } catch (_) {}
    });

    card.addEventListener('dragend', () => {
      card.classList.remove('dragging');
      draggingCard = null;
      board.querySelectorAll('.kb-column.drag-over').forEach(c => c.classList.remove('drag-over'));
    });
  }

  board.querySelectorAll('.kb-column').forEach(col => {
    const phase = col.dataset.phase;

    col.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      col.classList.add('drag-over');
    });

    col.addEventListener('dragleave', (e) => {
      // Only remove when actually leaving the column
      if (!col.contains(e.relatedTarget)) {
        col.classList.remove('drag-over');
      }
    });

    col.addEventListener('drop', (e) => {
      e.preventDefault();
      col.classList.remove('drag-over');
      if (!draggingCard) return;
      placeCard(draggingCard, phase);
    });
  });

  // -------- Place a card --------
  function placeCard(card, chosenPhase) {
    if (!card || card.parentElement !== pool) return; // already placed
    const correctPhase = card.dataset.phase;
    const task = TASKS.find(t => t.id === card.dataset.id);
    const correct = correctPhase === chosenPhase;

    const targetCol = board.querySelector(`.kb-column[data-phase="${correct ? correctPhase : chosenPhase}"]`);

    if (correct) {
      // Move card into the correct dropzone
      const zone = targetCol.querySelector('.kb-dropzone');
      zone.appendChild(card);
      card.draggable = false;
      card.classList.add('placed');
      card.classList.remove('dragging');

      state.placed++;
      state.streak++;
      state.bestStreak = Math.max(state.bestStreak, state.streak);
      // Points: 10 base + streak bonus
      const points = 10 + Math.max(0, state.streak - 1) * 2;
      state.score += points;

      popEl(gameScore && gameScore.parentElement);
      if (state.streak > 1) popEl(gameStreak && gameStreak.parentElement);

      if (!reduceMotion) {
        targetCol.classList.remove('correct');
        void targetCol.offsetWidth;
        targetCol.classList.add('correct');
      }

      updateColCount(correctPhase);
      updateStats();

      showToast(`✓ Correct! ${task.lesson}`, 'correct');

      if (state.placed === state.total) {
        setTimeout(showWin, 700);
      }
    } else {
      // Wrong — shake the chosen column and break the streak
      if (targetCol && !reduceMotion) {
        targetCol.classList.remove('shake');
        void targetCol.offsetWidth;
        targetCol.classList.add('shake');
      }
      state.streak = 0;
      updateStats();
      showToast(`Not quite. That task belongs in ${PHASE_NAMES[correctPhase]}. Try again.`, 'wrong');
    }
  }

  // -------- Win screen --------
  function showWin() {
    if (!winEl) return;
    if (winScore)  winScore.textContent  = state.score;
    if (winStreak) winStreak.textContent = state.bestStreak;
    winEl.classList.add('show');
    fireConfetti();
  }

  function hideWin() {
    if (winEl) winEl.classList.remove('show');
  }

  // -------- Confetti --------
  function fireConfetti() {
    if (reduceMotion) return;
    const colors = ['#ec4899', '#ff6fa9', '#ffa3c7', '#be185d', '#f59e0b', '#10b981'];
    const count = 80;
    for (let i = 0; i < count; i++) {
      const piece = document.createElement('span');
      piece.className = 'kb-confetti';
      piece.style.left = Math.random() * 100 + 'vw';
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDuration = (2.4 + Math.random() * 1.8) + 's';
      piece.style.animationDelay = (Math.random() * 0.5) + 's';
      piece.style.transform = `rotate(${Math.random() * 360}deg)`;
      document.body.appendChild(piece);
      setTimeout(() => piece.remove(), 5000);
    }
  }

  // -------- Reset --------
  function resetGame() {
    // Clear dropzones
    board.querySelectorAll('.kb-dropzone').forEach(z => { z.innerHTML = ''; });
    board.querySelectorAll('.kb-col-count').forEach(c => { c.textContent = '0'; c.setAttribute('data-count', '0'); });

    state = { placed: 0, score: 0, streak: 0, bestStreak: 0, total: TASKS.length };
    updateStats();
    hideWin();
    buildPool();
  }

  if (resetBtn) resetBtn.addEventListener('click', resetGame);
  if (winReset) winReset.addEventListener('click', resetGame);

  // -------- Init --------
  buildPool();
  updateStats();

})();
