/* =============================================================
   FUNDAMENTALS PAGE - charts, phase pills, decision game
   ============================================================= */
(function () {
  'use strict';

  /* -----------------------------------------------------------
     1. Chart.js: lazy-init charts only when scrolled into view
     ----------------------------------------------------------- */
  const chartConfigs = {
    timeBar: () => ({
      type: 'bar',
      data: {
        labels: ['Initiation', 'Planning', 'Execution', 'Monitoring', 'Closing'],
        datasets: [{
          label: 'Typical % of project effort',
          data: [5, 25, 55, 10, 5],
          backgroundColor: ['#fbbf24', '#ec4899', '#3b82f6', '#10b981', '#8b5cf6'],
          borderRadius: 10,
          borderSkipped: false,
          hoverOffset: 8
        }]
      },
      options: chartBaseOpts({ yMax: 60, ySuffix: '%' })
    }),

    pmVsOps: () => ({
      type: 'radar',
      data: {
        labels: ['Has end date', 'Fixed scope', 'Cross-team', 'Repeatable', 'Tracks budget', 'Has deliverable'],
        datasets: [
          {
            label: 'Project',
            data: [10, 8, 9, 3, 9, 10],
            backgroundColor: 'rgba(236, 72, 153, 0.18)',
            borderColor: '#ec4899',
            borderWidth: 2,
            pointBackgroundColor: '#ec4899'
          },
          {
            label: 'Operations',
            data: [1, 4, 5, 10, 6, 4],
            backgroundColor: 'rgba(59, 130, 246, 0.15)',
            borderColor: '#3b82f6',
            borderWidth: 2,
            pointBackgroundColor: '#3b82f6'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { color: '#475569', font: { family: 'Inter', size: 12 } } },
          tooltip: tooltipStyle()
        },
        scales: {
          r: {
            min: 0, max: 10,
            ticks: { display: false, stepSize: 2 },
            grid: { color: 'rgba(236, 72, 153, 0.12)' },
            angleLines: { color: 'rgba(236, 72, 153, 0.18)' },
            pointLabels: { color: '#1e293b', font: { family: 'Inter', size: 11.5, weight: '600' } }
          }
        }
      }
    }),

    growth: () => ({
      type: 'line',
      data: {
        labels: ['2020', '2021', '2022', '2023', '2024', '2025', '2026'],
        datasets: [
          {
            label: 'Hybrid PM adoption (% of teams)',
            data: [38, 44, 51, 56, 60, 62, 64],
            borderColor: '#ec4899',
            backgroundColor: 'rgba(236, 72, 153, 0.12)',
            fill: true,
            tension: 0.35,
            pointRadius: 5,
            pointBackgroundColor: '#ec4899',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointHoverRadius: 8
          },
          {
            label: 'Pure Waterfall (% of teams)',
            data: [44, 38, 32, 26, 22, 19, 16],
            borderColor: '#94a3b8',
            backgroundColor: 'rgba(148, 163, 184, 0.08)',
            borderDash: [6, 4],
            fill: true,
            tension: 0.3,
            pointRadius: 4,
            pointBackgroundColor: '#94a3b8',
            pointBorderColor: '#fff',
            pointBorderWidth: 2
          }
        ]
      },
      options: chartBaseOpts({ yMax: 75, ySuffix: '%', legend: 'bottom' })
    }),

    timeLost: () => ({
      type: 'doughnut',
      data: {
        labels: ['Actual productive work', 'Lost to scattered tools / chasing status'],
        datasets: [{
          data: [26.3, 13.7],
          backgroundColor: ['#ec4899', '#fce7f3'],
          borderWidth: 0,
          hoverOffset: 14
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '68%',
        plugins: {
          legend: { position: 'bottom', labels: { color: '#475569', font: { family: 'Inter', size: 12 }, padding: 14 } },
          tooltip: tooltipStyle({ suffix: ' hrs/wk' })
        }
      }
    }),

    skillsRadar: () => ({
      type: 'radar',
      data: {
        labels: ['Communication', 'Leadership', 'Time mgmt', 'Critical thinking', 'Adaptability', 'Risk mgmt', 'Negotiation'],
        datasets: [{
          label: 'Time spent each week',
          data: [9, 7, 8, 6, 7, 6, 5],
          backgroundColor: 'rgba(236, 72, 153, 0.2)',
          borderColor: '#ec4899',
          borderWidth: 2,
          pointBackgroundColor: '#ec4899',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: tooltipStyle()
        },
        scales: {
          r: {
            min: 0, max: 10,
            ticks: { display: false, stepSize: 2 },
            grid: { color: 'rgba(236, 72, 153, 0.12)' },
            angleLines: { color: 'rgba(236, 72, 153, 0.18)' },
            pointLabels: { color: '#1e293b', font: { family: 'Inter', size: 12, weight: '600' } }
          }
        }
      }
    })
  };

  function tooltipStyle(extra) {
    extra = extra || {};
    return {
      backgroundColor: '#1e293b',
      titleColor: '#fff',
      bodyColor: '#fce7f3',
      borderColor: '#ec4899',
      borderWidth: 1,
      cornerRadius: 8,
      padding: 12,
      titleFont: { family: 'Inter', size: 12, weight: '700' },
      bodyFont: { family: 'Inter', size: 12 },
      callbacks: extra.suffix
        ? { label: ctx => ' ' + ctx.parsed + (extra.suffix || '') }
        : undefined
    };
  }

  function chartBaseOpts(opts) {
    opts = opts || {};
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: opts.legend
          ? { position: opts.legend, labels: { color: '#475569', font: { family: 'Inter', size: 12 } } }
          : { display: false },
        tooltip: tooltipStyle({ suffix: opts.ySuffix || '' })
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#475569', font: { family: 'Inter', size: 12 } }
        },
        y: {
          beginAtZero: true,
          max: opts.yMax,
          grid: { color: 'rgba(148, 163, 184, 0.15)' },
          ticks: {
            color: '#94a3b8',
            font: { family: 'Inter', size: 11 },
            callback: v => v + (opts.ySuffix || '')
          }
        }
      }
    };
  }

  // Lazy initialise each chart when its container scrolls into view
  function initCharts() {
    if (typeof Chart === 'undefined') return;
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.color = '#475569';

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const canvas = entry.target;
        const key = canvas.dataset.chart;
        if (key && chartConfigs[key] && !canvas._chartInstance) {
          try {
            canvas._chartInstance = new Chart(canvas.getContext('2d'), chartConfigs[key]());
          } catch (e) { console.warn('chart init failed for', key, e); }
        }
        obs.unobserve(canvas);
      });
    }, { threshold: 0.2 });

    document.querySelectorAll('canvas[data-chart]').forEach(c => observer.observe(c));
  }

  /* -----------------------------------------------------------
     2. Phase pill toggle (click to expand the detail panel)
     ----------------------------------------------------------- */
  function initPhasePills() {
    const pills = document.querySelectorAll('.phase-pill');
    const panels = document.querySelectorAll('.phase-detail-panel');

    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        const target = pill.dataset.target;
        const isOpen = pill.classList.contains('is-open');

        pills.forEach(p => p.classList.remove('is-open'));
        panels.forEach(p => p.classList.remove('is-open'));

        if (!isOpen) {
          pill.classList.add('is-open');
          const panel = document.getElementById(target);
          if (panel) {
            panel.classList.add('is-open');
            // gentle scroll into view
            setTimeout(() => panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 80);
          }
        }
      });
    });

    // Auto-open first phase
    if (pills.length) pills[0].click();
  }

  /* -----------------------------------------------------------
     3. Decision Game: "Save the Galway Café Project"
     ----------------------------------------------------------- */
  const SCENARIOS = [
    {
      step: 1,
      eyebrow: 'Initiation phase',
      title: 'Maeve owns a café in Galway. She wants you to add a weekend brunch menu before December.',
      body: 'You\'ve got the green light from her, a rough idea, and a tight deadline. What\'s the very first thing you do?',
      choices: [
        {
          letter: 'A',
          text: 'Jump straight into ordering ingredients and printing menus. Speed wins.',
          impact: { time: -10, budget: -25, morale: -5 },
          verdict: 'bad',
          lesson: 'Skipping initiation is the most expensive shortcut in project management. You\'ve just committed cash to a plan nobody has agreed on. Maeve will change her mind in week 2 and you\'ll throw most of it away.'
        },
        {
          letter: 'B',
          text: 'Write a one page project charter: problem, scope, budget range, top 3 risks. Get Maeve to sign it.',
          impact: { time: 10, budget: 15, morale: 15 },
          verdict: 'good',
          lesson: 'This is the cheapest 30 minutes you\'ll ever spend. The charter forces Maeve to commit to outcomes, gives you a reference document for every later argument, and surfaces the biggest risks before any money is spent.'
        },
        {
          letter: 'C',
          text: 'Schedule a series of stakeholder workshops over the next 3 weeks to gather requirements.',
          impact: { time: -25, budget: -10, morale: -10 },
          verdict: 'ok',
          lesson: 'Right instinct, wrong scale. For a 3 month café project you don\'t need 3 weeks of workshops. A one page charter and a 90 minute kickoff is enough. Save the heavy process for the £10m construction job.'
        }
      ]
    },
    {
      step: 2,
      eyebrow: 'Planning phase',
      title: 'You\'ve got the charter signed. Maeve gives you €4,000 and 10 weeks. Now what?',
      body: 'A real plan has 5 ingredients: a work breakdown, a schedule, a resource list, a comms plan, and a risk register. You have one Tuesday afternoon to do this.',
      choices: [
        {
          letter: 'A',
          text: 'Skip the risk register. Risks are theoretical. Focus on the work breakdown and schedule.',
          impact: { time: -20, budget: -30, morale: -10 },
          verdict: 'bad',
          lesson: 'In week 6, your sous chef quits. In week 8, your supplier increases prices 15%. Both were predictable. Both were on the risk register you didn\'t write. Risk planning is the highest ROI 30 minutes in any project.'
        },
        {
          letter: 'B',
          text: 'Write all 5 in one Tuesday afternoon. Rough is fine — you\'ll iterate weekly.',
          impact: { time: 15, budget: 10, morale: 10 },
          verdict: 'good',
          lesson: 'Done is better than perfect. A rough work breakdown, a one page schedule with milestones, a risk register with 8 lines, a comms plan that says "Friday update email", and a list of 4 people. 3 hours of work. Iterate as you learn.'
        },
        {
          letter: 'C',
          text: 'Hire a project consultant to write a proper 40 page plan. Do it once, do it right.',
          impact: { time: -30, budget: -50, morale: -5 },
          verdict: 'bad',
          lesson: 'You just spent half your budget and a third of your timeline on documentation Maeve will never read. PRINCE2 rigour is for £50m programmes, not a brunch menu. Match the process to the project size.'
        }
      ]
    },
    {
      step: 3,
      eyebrow: 'Execution phase',
      title: 'Week 5. The new POS system you ordered is delayed by 3 weeks. Launch is in 5.',
      body: 'This is exactly the moment everyone hopes never comes. What now?',
      choices: [
        {
          letter: 'A',
          text: 'Tell nobody yet. You\'ll sort it. Maeve has enough to worry about.',
          impact: { time: -25, budget: -20, morale: -25 },
          verdict: 'bad',
          lesson: 'Hiding bad news is the #1 way project leads lose trust. Maeve finds out in week 7 from the supplier directly, and now she\'s lost confidence in you. Communicate problems early, with options, not after they\'ve become crises.'
        },
        {
          letter: 'B',
          text: 'Email Maeve same day with the problem AND 3 options: switch supplier, delay launch 2 weeks, or use her old POS for soft launch.',
          impact: { time: 10, budget: 5, morale: 20 },
          verdict: 'good',
          lesson: 'Textbook PM communication. Bad news, presented with a pre thought solution set, in writing. Maeve picks option C in 10 minutes. Trust intact, delay minimised, you look in control.'
        },
        {
          letter: 'C',
          text: 'Call the supplier and shout at them until they fix it.',
          impact: { time: -5, budget: 0, morale: -10 },
          verdict: 'ok',
          lesson: 'Sometimes shouting works. Mostly it doesn\'t and you burn a relationship you may need again. Negotiation > confrontation. Try "what would it take to get this in 7 days" before you escalate.'
        }
      ]
    },
    {
      step: 4,
      eyebrow: 'Closing phase',
      title: 'You launched. The brunch is selling well. Maeve is happy. You are exhausted.',
      body: 'Most teams skip closing. Their next project starts on the wrong foot. What do you do?',
      choices: [
        {
          letter: 'A',
          text: 'Move on. You\'ve already got two new projects starting. Closing is admin, not value.',
          impact: { time: 0, budget: -5, morale: -10 },
          verdict: 'bad',
          lesson: 'The next project repeats every mistake this one made. The supplier never gets paid the final 10%. The new menu printer keeps charging Maeve monthly because nobody cancelled the contract. Closing is the highest leverage 30 minutes left.'
        },
        {
          letter: 'B',
          text: 'Run a 30 min Keep / Stop / Start / Try retro with Maeve and the team. Write a one page lessons learned. Cancel all leftover supplier accounts.',
          impact: { time: 5, budget: 15, morale: 20 },
          verdict: 'good',
          lesson: 'You\'ve closed the loop. The next project starts faster because you wrote the lessons down. Maeve cancels €180/month in stale subscriptions. The team feels the work was respected. This is what separates a real project from a hero effort.'
        },
        {
          letter: 'C',
          text: 'Send a thank you email to the team. That\'s a closing.',
          impact: { time: 0, budget: 0, morale: 5 },
          verdict: 'ok',
          lesson: 'A thank you is a nice touch but it\'s not closing. The lessons aren\'t captured, the accounts aren\'t closed, and the formal handover to operations hasn\'t happened. Half points. Add the retro and the admin.'
        }
      ]
    }
  ];

  const dgState = {
    step: 0,
    health: { time: 100, budget: 100, morale: 100 },
    score: 0
  };

  function dgEls() {
    return {
      stepEl:   document.getElementById('dgStep'),
      timeBar:  document.getElementById('dgTimeBar'),
      timeNum:  document.getElementById('dgTimeNum'),
      budBar:   document.getElementById('dgBudgetBar'),
      budNum:   document.getElementById('dgBudgetNum'),
      morBar:   document.getElementById('dgMoraleBar'),
      morNum:   document.getElementById('dgMoraleNum'),
      eyebrow:  document.getElementById('dgEyebrow'),
      title:    document.getElementById('dgTitle'),
      body:     document.getElementById('dgBody'),
      choices:  document.getElementById('dgChoices'),
      feedback: document.getElementById('dgFeedback'),
      end:      document.getElementById('dgEnd'),
      endTitle: document.getElementById('dgEndTitle'),
      endBody:  document.getElementById('dgEndBody'),
      endEmoji: document.getElementById('dgEndEmoji')
    };
  }

  function clamp(n) { return Math.max(0, Math.min(100, n)); }
  function healthClass(n) {
    if (n >= 70) return 'health-good';
    if (n >= 40) return 'health-medium';
    return 'health-bad';
  }

  function renderStats() {
    const e = dgEls();
    const set = (bar, num, val) => {
      if (!bar || !num) return;
      bar.style.width = val + '%';
      bar.classList.remove('health-good', 'health-medium', 'health-bad');
      bar.classList.add(healthClass(val));
      num.textContent = Math.round(val);
    };
    set(e.timeBar, e.timeNum, dgState.health.time);
    set(e.budBar,  e.budNum,  dgState.health.budget);
    set(e.morBar,  e.morNum,  dgState.health.morale);
  }

  function renderScenario() {
    const e = dgEls();
    const sc = SCENARIOS[dgState.step];
    if (!sc) { renderEnding(); return; }

    if (e.stepEl) e.stepEl.textContent = `Step ${sc.step} of ${SCENARIOS.length}`;
    if (e.eyebrow) e.eyebrow.textContent = sc.eyebrow;
    if (e.title) e.title.textContent = sc.title;
    if (e.body) e.body.textContent = sc.body;

    if (e.choices) {
      e.choices.innerHTML = '';
      sc.choices.forEach((c, i) => {
        const btn = document.createElement('button');
        btn.className = 'dg-choice';
        btn.type = 'button';
        btn.dataset.idx = i;
        btn.innerHTML = `
          <span class="dg-letter">${c.letter}</span>
          <span class="dg-text">${c.text}</span>
        `;
        btn.addEventListener('click', () => onChoice(i));
        e.choices.appendChild(btn);
      });
    }

    if (e.feedback) {
      e.feedback.classList.remove('show', 'good', 'ok', 'bad');
      e.feedback.innerHTML = '';
    }
  }

  function onChoice(idx) {
    const e = dgEls();
    const sc = SCENARIOS[dgState.step];
    const choice = sc.choices[idx];

    // Disable all choices, mark picked
    [...e.choices.children].forEach((btn, i) => {
      btn.disabled = true;
      if (i === idx) btn.classList.add('is-picked');
    });

    // Apply impact
    dgState.health.time   = clamp(dgState.health.time   + choice.impact.time);
    dgState.health.budget = clamp(dgState.health.budget + choice.impact.budget);
    dgState.health.morale = clamp(dgState.health.morale + choice.impact.morale);
    dgState.score += choice.verdict === 'good' ? 25 : choice.verdict === 'ok' ? 10 : 0;
    renderStats();

    // Show feedback
    e.feedback.classList.add('show', choice.verdict);
    const verdictLabel = choice.verdict === 'good' ? '✓ Solid call.' :
                        choice.verdict === 'ok'   ? '~ Half right.' :
                                                    '✗ That hurt.';
    e.feedback.innerHTML = `
      <strong>${verdictLabel}</strong>
      ${choice.lesson}
      <div class="dg-next">
        <button class="btn btn-primary" id="dgNextBtn" type="button">
          ${dgState.step + 1 < SCENARIOS.length ? 'Next decision' : 'See your result'}
          <i class="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    `;
    document.getElementById('dgNextBtn').addEventListener('click', nextStep);
  }

  function nextStep() {
    dgState.step++;
    if (dgState.step < SCENARIOS.length) {
      renderScenario();
      const e = dgEls();
      if (e.title) e.title.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      renderEnding();
    }
  }

  function renderEnding() {
    const e = dgEls();
    document.querySelector('.dg-scenario').style.display = 'none';
    document.querySelector('.dg-choices').style.display = 'none';
    e.feedback.classList.remove('show');
    e.end.classList.add('show');

    const totalHealth = (dgState.health.time + dgState.health.budget + dgState.health.morale) / 3;
    let emoji, title, body;
    if (totalHealth >= 80 && dgState.score >= 80) {
      emoji = '🏆'; title = 'You\'re a natural project manager.';
      body = `Score: ${dgState.score}/100. You shipped on time, on budget, with the team intact, and you closed properly. The fundamentals stuck. Now go do this with your real projects.`;
    } else if (totalHealth >= 55) {
      emoji = '🤝'; title = 'You delivered, just.';
      body = `Score: ${dgState.score}/100. You got there but with bruises. Re read the planning section above and try the game again to see what changes if you avoid the shortcuts next time.`;
    } else {
      emoji = '🚒'; title = 'Project rescue territory.';
      body = `Score: ${dgState.score}/100. You over committed without a plan, hid problems, and skipped closing. Read the 5 phases section above, then try this game again. The lessons compound fast.`;
    }
    if (e.endEmoji) e.endEmoji.textContent = emoji;
    if (e.endTitle) e.endTitle.textContent = title;
    if (e.endBody)  e.endBody.textContent = body;
  }

  function resetGame() {
    dgState.step = 0;
    dgState.health = { time: 100, budget: 100, morale: 100 };
    dgState.score = 0;
    document.querySelector('.dg-scenario').style.display = '';
    document.querySelector('.dg-choices').style.display = '';
    const e = dgEls();
    if (e.end) e.end.classList.remove('show');
    renderStats();
    renderScenario();
  }

  function initGame() {
    if (!document.getElementById('dgChoices')) return;
    renderStats();
    renderScenario();
    const resetBtn = document.getElementById('dgReset');
    if (resetBtn) resetBtn.addEventListener('click', resetGame);
  }

  /* -----------------------------------------------------------
     Boot
     ----------------------------------------------------------- */
  function boot() {
    initCharts();
    initPhasePills();
    initGame();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
