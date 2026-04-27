/* =============================================================
   METHODOLOGIES - interactive comparison hub
   - Click pills to add/remove methodologies on the chart
   - Toggle between radar (overlay compare) and bar (single deep dive)
   - Live detail cards: best for / pros / cons
   ============================================================= */
(function () {
  'use strict';

  // ----------------------- Data -------------------------------
  const METHODS = {
    agile: {
      name: 'Agile',
      tagline: 'A mindset, not a method. Deliver in small increments, learn, repeat.',
      color: '#ec4899',
      tags: ['Flexible', 'Iterative'],
      // Score 1-10 across the dimensions on the chart
      scores: {
        Flexibility: 10,
        Predictability: 4,
        'SME friendly': 7,
        'Speed to start': 8,
        'Team size fit': 7,
        'Stakeholder load': 7
      },
      best: [
        'Software and digital products',
        'Marketing campaigns with feedback loops',
        'Projects where requirements will change',
        'Creative and brand work'
      ],
      pros: [
        'Adapts quickly when reality changes',
        'Working output every couple of weeks',
        'Engaged customer or client built in'
      ],
      cons: [
        'Hard to predict total cost upfront',
        'Needs engaged stakeholders, not "throw it over the wall"',
        'Teams can drift without clear goals'
      ]
    },
    waterfall: {
      name: 'Waterfall',
      tagline: 'Finish one phase fully before starting the next. Sequential and predictable.',
      color: '#3b82f6',
      tags: ['Sequential', 'Predictable'],
      scores: {
        Flexibility: 2,
        Predictability: 10,
        'SME friendly': 5,
        'Speed to start': 5,
        'Team size fit': 6,
        'Stakeholder load': 4
      },
      best: [
        'Construction and physical builds',
        'Highly regulated work (health, legal)',
        'Fixed scope client work',
        'Teams that need absolute clarity'
      ],
      pros: [
        'Forces upfront discipline',
        'Easy to estimate cost and time',
        'Clear handover between phases'
      ],
      cons: [
        'Customer sees nothing until the end',
        'Changes mid project are expensive',
        'Risks pile up if testing is left to the end'
      ]
    },
    scrum: {
      name: 'Scrum',
      tagline: 'Agile with rules. Sprints, three roles, four ceremonies.',
      color: '#8b5cf6',
      tags: ['Agile framework', 'Sprints'],
      scores: {
        Flexibility: 7,
        Predictability: 6,
        'SME friendly': 5,
        'Speed to start': 5,
        'Team size fit': 7,
        'Stakeholder load': 8
      },
      best: [
        'Small product or software teams (5 to 9)',
        'Teams that can dedicate time to ceremonies',
        'High uncertainty work',
        'Cross functional groups'
      ],
      pros: [
        'Regular feedback through sprint reviews',
        'Retrospectives improve the team itself',
        'Roles make ownership obvious'
      ],
      cons: [
        'Overkill for a 2 to 3 person team',
        'Ceremonies become ritual without the why',
        'Roles can feel heavy in a small business'
      ]
    },
    kanban: {
      name: 'Kanban',
      tagline: 'Make work visible. Limit work in progress. Keep things flowing.',
      color: '#10b981',
      tags: ['Visual', 'Continuous flow'],
      scores: {
        Flexibility: 9,
        Predictability: 5,
        'SME friendly': 10,
        'Speed to start': 10,
        'Team size fit': 9,
        'Stakeholder load': 4
      },
      best: [
        'Continuous work (support, content, ops)',
        'Solo operators and tiny teams',
        'Distributed and remote teams',
        'Charities juggling many small tasks'
      ],
      pros: [
        'You can start in 10 minutes with sticky notes',
        'WIP limits force you to finish things',
        'Visible board, no guessing'
      ],
      cons: [
        'Less useful for hard deadline projects',
        'Without WIP limits it is just a to do list',
        'Harder to forecast distant milestones'
      ]
    },
    hybrid: {
      name: 'Hybrid',
      tagline: 'Waterfall plan, Agile or Kanban execution. Most real Irish SMEs end up here.',
      color: '#f59e0b',
      tags: ['Pragmatic', 'Most popular'],
      scores: {
        Flexibility: 8,
        Predictability: 8,
        'SME friendly': 9,
        'Speed to start': 7,
        'Team size fit': 9,
        'Stakeholder load': 6
      },
      best: [
        'Client projects with fixed budgets',
        'Grant funded charity programmes',
        'Marketing + product launch combos',
        'Any team with mixed project types'
      ],
      pros: [
        'Predictable plan, flexible delivery',
        'Up 57.5% adoption since 2020',
        'Matches how most teams actually work'
      ],
      cons: [
        'Needs a clear owner or it drifts',
        'Document the chosen approach for new hires',
        'Two ways of working can confuse newcomers'
      ]
    }
  };

  const DIMENSIONS = ['Flexibility', 'Predictability', 'SME friendly', 'Speed to start', 'Team size fit', 'Stakeholder load'];

  // State
  const state = {
    selected: new Set(['agile', 'kanban', 'waterfall']), // sensible default
    view: 'radar', // 'radar' or 'bars'
    chart: null,
    focus: 'kanban'
  };

  // ----------------------- DOM helpers ------------------------
  const $ = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));

  function hexA(hex, a) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }

  // ----------------------- Render pills -----------------------
  function renderPills() {
    const wrap = $('#methodPills');
    if (!wrap) return;
    wrap.innerHTML = '';
    Object.entries(METHODS).forEach(([key, m]) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'method-pill' + (state.selected.has(key) ? ' active' : '');
      btn.style.setProperty('--m-color', m.color);
      btn.dataset.key = key;
      btn.innerHTML = `${m.name} <span class="pill-toggle">${state.selected.has(key) ? 'on' : 'off'}</span>`;
      btn.addEventListener('click', () => togglePill(key));
      wrap.appendChild(btn);
    });
  }

  function togglePill(key) {
    if (state.selected.has(key)) {
      if (state.selected.size <= 1) return; // keep at least 1
      state.selected.delete(key);
      if (state.focus === key) state.focus = [...state.selected][0];
    } else {
      state.selected.add(key);
      state.focus = key;
    }
    renderPills();
    renderChart();
    renderDetail();
  }

  // ----------------------- Render chart -----------------------
  function buildRadarConfig() {
    const datasets = [...state.selected].map(key => {
      const m = METHODS[key];
      return {
        label: m.name,
        data: DIMENSIONS.map(d => m.scores[d]),
        backgroundColor: hexA(m.color, key === state.focus ? 0.28 : 0.12),
        borderColor: m.color,
        borderWidth: key === state.focus ? 3 : 2,
        pointBackgroundColor: m.color,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: key === state.focus ? 5 : 3,
        pointHoverRadius: 8
      };
    });
    return {
      type: 'radar',
      data: { labels: DIMENSIONS, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 700 },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#475569',
              font: { family: 'Inter', size: 12, weight: '600' },
              padding: 14,
              usePointStyle: true,
              pointStyle: 'circle'
            },
            onClick: (e, legendItem) => {
              // Find by label
              const key = Object.keys(METHODS).find(k => METHODS[k].name === legendItem.text);
              if (key) {
                state.focus = key;
                renderChart();
                renderDetail();
              }
            }
          },
          tooltip: {
            backgroundColor: '#1e293b',
            titleColor: '#fff',
            bodyColor: '#fce7f3',
            borderColor: '#ec4899',
            borderWidth: 1,
            cornerRadius: 8,
            padding: 12,
            callbacks: {
              label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.r}/10`
            }
          }
        },
        scales: {
          r: {
            min: 0, max: 10,
            ticks: { display: false, stepSize: 2 },
            grid: { color: 'rgba(236, 72, 153, 0.12)' },
            angleLines: { color: 'rgba(236, 72, 153, 0.18)' },
            pointLabels: { color: '#1e293b', font: { family: 'Inter', size: 11.5, weight: '600' } }
          }
        },
        onClick: (evt, els) => {
          if (els && els.length) {
            const ds = els[0].datasetIndex;
            const key = [...state.selected][ds];
            if (key) {
              state.focus = key;
              renderChart();
              renderDetail();
            }
          }
        }
      }
    };
  }

  function renderChart() {
    if (state.view === 'radar') {
      renderRadar();
    } else {
      renderBars();
    }
  }

  function renderRadar() {
    const canvas = $('#compareCanvas');
    const barsWrap = $('#compareBars');
    if (canvas) canvas.parentElement.style.display = '';
    if (barsWrap) barsWrap.style.display = 'none';
    if (!canvas || typeof Chart === 'undefined') return;

    if (state.chart) state.chart.destroy();
    state.chart = new Chart(canvas.getContext('2d'), buildRadarConfig());
  }

  function renderBars() {
    const canvas = $('#compareCanvas');
    const barsWrap = $('#compareBars');
    if (canvas) canvas.parentElement.style.display = 'none';
    if (!barsWrap) return;
    if (state.chart) { state.chart.destroy(); state.chart = null; }
    barsWrap.style.display = '';
    barsWrap.innerHTML = '';

    const m = METHODS[state.focus];
    if (!m) return;

    DIMENSIONS.forEach(dim => {
      const value = m.scores[dim];
      const row = document.createElement('div');
      row.className = 'compare-bar-row';
      row.innerHTML = `
        <div class="compare-bar-label">${dim}</div>
        <div class="compare-bar-track">
          <div class="compare-bar-fill" style="width:0%; --m-color:${m.color}; background:${m.color}"></div>
        </div>
        <div class="compare-bar-num">${value}/10</div>
      `;
      barsWrap.appendChild(row);
      // Animate fill on next paint
      requestAnimationFrame(() => {
        row.querySelector('.compare-bar-fill').style.width = (value * 10) + '%';
      });
    });
  }

  // ----------------------- Detail cards -----------------------
  function renderDetail() {
    const m = METHODS[state.focus];
    if (!m) return;

    const cur = $('#compareCurrent');
    if (cur) {
      cur.innerHTML = `
        <div class="compare-current-name">
          <span class="compare-current-dot" style="background:${m.color}"></span>
          <div>
            <strong>${m.name}</strong>
            <span>${m.tagline}</span>
          </div>
        </div>
        <div class="compare-current-tags">
          ${m.tags.map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
      `;
    }

    const detail = $('#compareDetail');
    if (detail) {
      detail.style.setProperty('--m-color', m.color);
      detail.innerHTML = `
        <div class="compare-card best" style="--m-color:${m.color}">
          <h5><i class="fa-solid fa-bullseye"></i> Best for</h5>
          <ul>${m.best.map(b => `<li>${b}</li>`).join('')}</ul>
        </div>
        <div class="compare-card pros" style="--m-color:${m.color}">
          <h5><i class="fa-solid fa-thumbs-up"></i> Strengths</h5>
          <ul>${m.pros.map(p => `<li>${p}</li>`).join('')}</ul>
        </div>
        <div class="compare-card cons" style="--m-color:${m.color}">
          <h5><i class="fa-solid fa-circle-exclamation"></i> Watch out for</h5>
          <ul>${m.cons.map(c => `<li>${c}</li>`).join('')}</ul>
        </div>
      `;
    }
  }

  // ----------------------- View toggle ------------------------
  function initViewToggle() {
    $$('#compareToggle button').forEach(btn => {
      btn.addEventListener('click', () => {
        $$('#compareToggle button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.view = btn.dataset.view;
        renderChart();
      });
    });
  }

  // ----------------------- Boot -------------------------------
  function boot() {
    if (typeof Chart !== 'undefined') {
      Chart.defaults.font.family = "'Inter', sans-serif";
      Chart.defaults.color = '#475569';
    }
    renderPills();
    renderChart();
    renderDetail();
    initViewToggle();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
