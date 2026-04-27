/* AI page — copy buttons, tool finder, prompt library */

(function () {
  'use strict';

  // ---------- Copy buttons (full prompts) ----------
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.copy;
      const el = document.getElementById(id);
      if (!el) return;
      const text = el.innerText;
      navigator.clipboard.writeText(text).then(() => {
        const original = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.innerHTML = original;
          btn.classList.remove('copied');
        }, 1800);
      });
    });
  });

  // ---------- Tool Finder ----------
  const answers = {};
  const totalSteps = 3;
  const stage = document.getElementById('finderStage');
  const bar = document.getElementById('finderBar');

  function goToStep(n) {
    document.querySelectorAll('.finder-step').forEach(s => s.classList.remove('active'));
    if (n === 'result') {
      document.querySelector('[data-step="result"]').classList.add('active');
      bar.style.width = '100%';
      renderResult();
    } else {
      document.querySelector(`[data-step="${n}"]`).classList.add('active');
      bar.style.width = (n / totalSteps * 100) + '%';
    }
  }

  document.querySelectorAll('.finder-option').forEach(btn => {
    btn.addEventListener('click', () => {
      const q = btn.dataset.q, v = btn.dataset.val;
      answers[q] = v;
      const currentStep = parseInt(btn.closest('.finder-step').dataset.step, 10);
      if (currentStep < totalSteps) goToStep(currentStep + 1);
      else goToStep('result');
    });
  });

  const restart = document.getElementById('finderRestart');
  if (restart) {
    restart.addEventListener('click', () => {
      for (const k in answers) delete answers[k];
      goToStep(1);
    });
  }

  function renderResult() {
    const title = document.getElementById('finderResultTitle');
    const body = document.getElementById('finderResultBody');

    let primary, stack, priceNote, bullets;

    // Base recommendation on stack
    if (answers.stack === 'microsoft') {
      stack = 'Microsoft 365 Copilot';
      priceNote = '€28/user/month (but huge time savings if you already use Teams/Outlook/Excel)';
    } else if (answers.stack === 'google') {
      stack = 'Google Workspace + Gemini';
      priceNote = 'Free tier available; paid Gemini Business ~€21/user/month';
    } else {
      stack = 'ChatGPT (free tier)';
      priceNote = 'Free, upgrade to ChatGPT Plus (€20/month) when ready';
    }

    // Primary chat tool by budget
    if (answers.budget === 'free') {
      primary = 'Start 100% free with ChatGPT, Claude or Gemini web app';
    } else if (answers.budget === 'low') {
      primary = 'Pick ONE paid tier: ChatGPT Plus or Claude Pro (~€20/month)';
    } else {
      primary = 'Full rollout: paid ChatGPT/Claude + an integrated tool like ' + stack;
    }

    // Org-specific bullets
    if (answers.type === 'charity') {
      bullets = [
        '<strong>TechSoup Ireland</strong> — check for discounted/donated software first',
        '<strong>Claude</strong> is excellent for grant writing and long funder reports',
        'Create a "winning applications" reference library to feed the AI',
        'Write your AI policy before the first staff training — charities are held to a higher standard on data'
      ];
      title.textContent = 'A lean AI stack for your charity';
    } else if (answers.type === 'solo') {
      bullets = [
        'One paid chat tool (ChatGPT Plus or Claude Pro) is your highest-leverage €20',
        'Use <strong>Fathom</strong> (free) for meeting notes — get your time back immediately',
        '<strong>Canva AI</strong> for visuals, <strong>Buffer</strong> for scheduling — both have generous free tiers',
        'Set a weekly 15-minute "AI board advisor" session (Play #07) — game changer for solo operators'
      ];
      title.textContent = 'The solo-operator AI stack';
    } else {
      bullets = [
        'Start with the whole team on ' + stack,
        'Add <strong>Fathom</strong> or Copilot for automatic meeting minutes',
        'Pick <em>one</em> PM tool with AI built in (ClickUp, Notion, Zoho or monday) — not three',
        'Write a one-page AI policy, share 5 starter prompts in a Notion page, measure hours saved at 30/60/90 days'
      ];
      title.textContent = 'A practical AI stack for your small business';
    }

    body.innerHTML = `
      <p><strong>Your main AI:</strong> ${primary}</p>
      <p><strong>Best fit for your stack:</strong> ${stack} <br><small style="color:var(--ink-500)">${priceNote}</small></p>
      <ul>${bullets.map(b => `<li>${b}</li>`).join('')}</ul>
      <p style="color:var(--ink-500); font-size:.9rem">Not sure where to start? Work through the <a href="#playbook">7 plays above</a> — they're ordered by impact.</p>
    `;
  }

  // ---------- Prompt Library ----------
  const PROMPTS = [
    { cat: 'planning', title: 'Project charter in 60 seconds', desc: 'Turn a one-sentence goal into a full one-page charter.', text: 'Write a one-page project charter for: [goal]. Include objective, scope, out-of-scope, deliverables, success criteria, and top 3 risks. Plain language.' },
    { cat: 'planning', title: 'WBS (work breakdown structure)', desc: 'Break any project into tasks and sub-tasks.', text: 'Create a 3-level work breakdown structure for this project: [description]. Format as an indented list with estimated hours per leaf task.' },
    { cat: 'planning', title: 'Stakeholder map', desc: 'Who cares? Who decides? Who do we keep informed?', text: 'Map stakeholders for this project: [description]. Group them as Decide / Consult / Inform / Ignore. Suggest a comms cadence for each group.' },
    { cat: 'planning', title: 'Risk register', desc: 'Top 10 risks with mitigations, in a table.', text: 'Produce a risk register for [project]. Columns: Risk, Likelihood (L/M/H), Impact (L/M/H), Mitigation, Owner. Top 10.' },

    { cat: 'comms', title: 'Late-invoice chaser', desc: 'Warm but firm email that preserves the relationship.', text: 'Draft two versions of a late-invoice email — softer and firmer. Invoice: [details]. Tone: warm, Irish business voice. Under 120 words.' },
    { cat: 'comms', title: 'Decline a request kindly', desc: 'Saying no without burning bridges.', text: 'Help me decline [request] in an email. Warm, honest, short. Explain briefly why, leave the door open for future, suggest an alternative if possible.' },
    { cat: 'comms', title: 'Meeting recap email', desc: 'From transcript to clean recap in one click.', text: 'From this transcript, draft a 5-bullet recap email with decisions, owners, due dates. Close with "any corrections, reply by [date]". Transcript: """[paste]"""' },
    { cat: 'comms', title: 'Apology + recovery', desc: 'Something went wrong. Now what?', text: 'Write a customer apology for: [what happened]. Acknowledge, take responsibility, say what we are doing, offer [remedy]. No corporate-speak.' },
    { cat: 'comms', title: 'Update a funder on a delay', desc: 'Hard conversations, handled well.', text: 'Draft an update email to a funder about: [project] being [X weeks] delayed because [reason]. Professional, non-defensive, include a revised timeline and what we learned.' },

    { cat: 'sales', title: 'Sales proposal skeleton', desc: 'From brief to full proposal outline.', text: 'Client brief: [paste]. Produce a proposal outline: problem, our approach, deliverables, timeline, team, investment (range), case study angles to include.' },
    { cat: 'sales', title: 'Grant application first draft', desc: 'Match a funder\'s language and priorities.', text: 'Funder: [name + programme]. Their priorities: [paste]. About us: [paste]. Draft these sections matching their language: summary, need, activities, outcomes, budget justification. Flag evidence gaps.' },
    { cat: 'sales', title: 'Tender / RFT response', desc: 'Structured response that actually gets shortlisted.', text: 'RFT requirements: [paste]. Our capabilities: [paste]. Draft responses that directly map to their evaluation criteria. Use their exact wording where possible.' },
    { cat: 'sales', title: 'Sales follow-up sequence', desc: '3 emails, not annoying.', text: 'After a sales meeting with [client] about [their need], draft a 3-email follow-up sequence: day 1 (recap + next step), day 5 (add value — share a useful resource), day 14 (gentle re-engage).' },
    { cat: 'sales', title: 'Objection-handling cheat sheet', desc: 'Be ready for the 5 most common "no"s.', text: 'For a [product/service] priced at [€X], list the 8 most common buyer objections and a 2-sentence confident response to each. Irish SME context.' },

    { cat: 'ops', title: 'Messy-spreadsheet cleaner', desc: 'Paste a CSV, get clean insights.', text: 'I will paste data. (1) Tell me what you see. (2) Flag data-quality issues. (3) Give me 3 useful summaries. (4) Give me the Sheets/Excel formulas. Data: """[paste, remove names first]"""' },
    { cat: 'ops', title: 'SOP (standard operating procedure)', desc: 'Document the process once; train forever.', text: 'Document an SOP for [task]. Include: purpose, when to do it, who, tools needed, step-by-step (numbered), common mistakes, how to know it\'s done right.' },
    { cat: 'ops', title: 'Formula wizard', desc: 'Stop googling Excel formulas.', text: 'In Google Sheets / Excel, give me a formula that: [describe in plain English]. Explain each part so I can adapt it later.' },
    { cat: 'ops', title: 'Process improvement scan', desc: 'Find what\'s wasting time.', text: 'Here is how we do [process]: [describe each step]. Where is time being wasted? What could be automated? What could be removed entirely? Propose 3 improvements ranked by effort vs payoff.' },
    { cat: 'ops', title: 'Pricing sanity check', desc: 'Am I under-charging? Probably.', text: 'I charge [€X] for [service]. My costs are [breakdown]. My target margin is [%]. Stress-test my pricing. Suggest 3 alternative pricing models (hourly / tiered / value-based) with pros and cons.' },

    { cat: 'marketing', title: 'A month of social posts', desc: 'Schedule a month in 30 minutes.', text: 'Business: [name], [type] in [town]. Voice: [voice]. Audience: [audience]. Goal: [goal]. Give me 12 posts (Instagram + Facebook) over 4 weeks. For each: hook, caption, 5 hashtags, image idea. Irish voice, no Americanisms.' },
    { cat: 'marketing', title: 'Website hero copy', desc: 'First 5 seconds on your homepage.', text: 'For [business] that helps [audience] [do X]: write 5 different headline + subheadline options for the hero. Each 8–12 words + one sentence. Vary between benefit, outcome, and contrarian angles.' },
    { cat: 'marketing', title: 'Blog outline that ranks', desc: 'Start writing from a real structure.', text: 'Topic: [topic]. Audience: [who]. Primary keyword: [keyword]. Give me an SEO-aware blog outline: H1, meta description, 6–8 H2s with 2 bullet points each, suggested internal links.' },
    { cat: 'marketing', title: 'Email newsletter', desc: 'The weekly email, written for you.', text: 'Draft this week\'s newsletter for [audience]. Include: 1 personal/hook intro, 1 main piece of content, 1 recommendation, 1 CTA. Under 300 words. Warm, conversational.' },
    { cat: 'marketing', title: 'Launch announcement', desc: 'New product/service? Say it right.', text: 'We\'re launching [thing] on [date]. It helps [audience] by [benefit]. Draft: (1) LinkedIn post, (2) Instagram caption, (3) email to existing customers, (4) press release intro. Same message, different tones.' },

    { cat: 'people', title: 'Job description (hiring)', desc: 'Attract the right person, fast.', text: 'We\'re hiring a [role] at [business], [location]. Responsibilities: [list]. Must-have: [list]. Nice-to-have: [list]. Write a JD that is honest, specific, and warm. Include what\'s genuinely good about working here — no clichés.' },
    { cat: 'people', title: 'Interview question bank', desc: '10 questions that actually tell you something.', text: 'For hiring a [role], generate 10 interview questions: 3 about skills (with what "good" looks like), 3 behavioural, 2 about values, 2 about how they learn. Plus 3 red flags to watch for.' },
    { cat: 'people', title: 'Onboarding checklist', desc: 'First two weeks, done right.', text: 'First-two-weeks onboarding checklist for a new [role] at a small [type]. Split by week, by day. Include: access/tools, intros, first real task, first feedback conversation, learning resources.' },
    { cat: 'people', title: 'Feedback conversation prep', desc: 'The one you\'ve been avoiding.', text: 'I need to give [name] feedback about [issue] tomorrow. Help me prepare: (1) state the specific behaviour, (2) state its impact, (3) one question to understand their view, (4) what good looks like going forward. No fluff.' },
    { cat: 'people', title: 'Volunteer recruitment ad', desc: 'For charities — attract doers, not talkers.', text: 'We need [X] volunteers for [role/event] in [town]. Write a short ad that\'s honest about the time commitment and clear about the impact. Tone: warm, direct, no guilt-tripping.' }
  ];

  const CAT_LABELS = {
    planning: 'Planning',
    comms: 'Communication',
    sales: 'Sales & Funding',
    ops: 'Operations',
    marketing: 'Marketing',
    people: 'People'
  };

  const grid = document.getElementById('promptGrid');
  let currentFilter = 'all';

  function renderPrompts() {
    if (!grid) return;
    const list = currentFilter === 'all' ? PROMPTS : PROMPTS.filter(p => p.cat === currentFilter);
    grid.innerHTML = list.map((p, i) => `
      <article class="prompt-item">
        <span class="play-tag">${CAT_LABELS[p.cat]}</span>
        <h4>${p.title}</h4>
        <p>${p.desc}</p>
        <button class="mini-copy" data-text="${encodeURIComponent(p.text)}">
          <i class="fa-regular fa-copy"></i> Copy prompt
        </button>
      </article>
    `).join('');

    grid.querySelectorAll('.mini-copy').forEach(btn => {
      btn.addEventListener('click', () => {
        const text = decodeURIComponent(btn.dataset.text);
        navigator.clipboard.writeText(text).then(() => {
          const original = btn.innerHTML;
          btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
          btn.classList.add('copied');
          setTimeout(() => {
            btn.innerHTML = original;
            btn.classList.remove('copied');
          }, 1600);
        });
      });
    });
  }

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderPrompts();
    });
  });

  renderPrompts();

})();
