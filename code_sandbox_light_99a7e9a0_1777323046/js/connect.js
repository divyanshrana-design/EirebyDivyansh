/* Connect page — local time, contact form, choice chips */

(function () {
  'use strict';

  // ---------- Live local time (Dublin / Ireland) ----------
  const timeEl = document.getElementById('localTime');
  function updateTime() {
    if (!timeEl) return;
    const now = new Date();
    // Format as Irish local time
    const opts = { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Europe/Dublin' };
    timeEl.textContent = new Intl.DateTimeFormat('en-IE', opts).format(now);
  }
  updateTime();
  setInterval(updateTime, 30000);

  // ---------- Topic choice chips ----------
  const topicInput = document.getElementById('cTopic');
  document.querySelectorAll('.chip-choices .choice-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.chip-choices .choice-chip').forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      if (topicInput) topicInput.value = chip.dataset.val;
    });
  });

  // ---------- Character count ----------
  const msg = document.getElementById('cMsg');
  const counter = document.getElementById('charCount');
  if (msg && counter) {
    msg.addEventListener('input', () => {
      if (msg.value.length > 600) msg.value = msg.value.slice(0, 600);
      counter.textContent = msg.value.length;
      counter.style.color = msg.value.length > 540 ? 'var(--pink-600)' : 'var(--ink-300)';
    });
  }

  // ---------- Form submit (live email via FormSubmit.co) ----------
  // Sends form data straight to ranadivyansh33@gmail.com.
  // FormSubmit is a free, no-auth, CORS-enabled email relay. On the very first
  // submission, Divyansh will get a one-off activation email he must click —
  // after that every message arrives directly in his inbox.
  const EMAIL_ENDPOINT = 'https://formsubmit.co/ajax/ranadivyansh33@gmail.com';

  const form = document.getElementById('contactForm');
  const submitBtn = form ? form.querySelector('.btn-submit') : null;
  const formMsg = document.getElementById('formMsg');

  const TOPIC_LABELS = {
    rescue: 'Project rescue',
    ai: 'AI rollout',
    fractional: 'Fractional PM',
    workshop: 'Workshop / talk',
    other: 'Something else'
  };

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      formMsg.classList.remove('error');
      formMsg.textContent = '';

      const name = document.getElementById('cName').value.trim();
      const email = document.getElementById('cEmail').value.trim();
      const organisation = document.getElementById('cOrg').value.trim();
      const topic = document.getElementById('cTopic').value;
      const message = document.getElementById('cMsg').value.trim();
      const consent = document.getElementById('cConsent').checked;

      // Client side validation
      if (!name) return showError('Please add your name.');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showError('Please enter a valid email address.');
      if (!topic) return showError('Please pick what you need help with.');
      if (message.length < 10) return showError('Please tell me a little more (at least 10 characters).');
      if (!consent) return showError('Please tick the consent box so I can reply.');

      // Start loading state
      submitBtn.classList.remove('success');
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      // Build payload. FormSubmit has a few special fields prefixed with _
      const topicLabel = TOPIC_LABELS[topic] || topic;
      const payload = {
        name,
        email,
        organisation: organisation || '(not provided)',
        topic: topicLabel,
        message,
        consent_given: consent ? 'Yes' : 'No',
        _subject: `PM Éire enquiry — ${topicLabel} — ${name}`,
        _replyto: email,
        _template: 'table',
        _captcha: 'false'
      };

      try {
        const res = await fetch(EMAIL_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error('Network response was not ok (' + res.status + ')');
        const data = await res.json().catch(() => ({}));
        if (data && data.success === 'false') {
          throw new Error(data.message || 'Submission failed');
        }

        // Success UI
        submitBtn.classList.remove('loading');
        submitBtn.classList.add('success');
        formMsg.textContent = "Thanks — your message is on its way. I'll reply within one working day.";
        form.reset();
        document.querySelectorAll('.choice-chip').forEach(c => c.classList.remove('selected'));
        if (counter) counter.textContent = '0';

        setTimeout(() => {
          submitBtn.classList.remove('success');
          submitBtn.disabled = false;
        }, 4000);
      } catch (err) {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        showError("Sorry, something went wrong sending that. Please email me directly at ranadivyansh33@gmail.com.");
        // Log once for debugging in dev tools; no PII beyond what the user typed.
        console.warn('Contact form submit failed:', err);
      }
    });
  }

  function showError(text) {
    formMsg.textContent = text;
    formMsg.classList.add('error');
  }

})();
