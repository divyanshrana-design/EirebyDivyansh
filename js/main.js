/* PM Éire — main.js
   Handles: nav, scroll progress, reveal animations, stat counters,
   chat typing demo, subscribe form, and MICRO-INTERACTIONS:
   button ripples, magnetic buttons, card tilt, cursor glow.
*/

(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Mobile nav ----------
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      navToggle.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', open);
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('active');
      });
    });
  }

  // ---------- Header scroll state + scroll progress ----------
  const header = document.getElementById('siteHeader');
  const progress = document.getElementById('scrollProgress');
  function onScroll() {
    const y = window.scrollY;
    if (header) header.classList.toggle('scrolled', y > 10);
    if (progress) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const pct = h > 0 ? (y / h) * 100 : 0;
      progress.style.width = pct + '%';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------- Reveal on scroll (JS fallback; CSS view-timeline handles modern browsers) ----------
  const revealEls = document.querySelectorAll('.reveal');
  document.querySelectorAll('.why-grid, .paths-grid, .media-grid, .phases-timeline').forEach(group => {
    [...group.querySelectorAll('.reveal')].forEach((el, i) => {
      el.style.setProperty('--i', i);
    });
  });

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');

          if (entry.target.classList.contains('hero-stats')) {
            entry.target.querySelectorAll('.stat-num').forEach(animateCount);
          }
          if (entry.target.classList.contains('ai-teaser-demo')) {
            runChatDemo();
          }

          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  // ---------- Stat counter ----------
  function animateCount(el) {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const isDecimal = !Number.isInteger(target);
    const duration = 1600;
    const start = performance.now();
    function tick(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const val = target * eased;
      el.textContent = (isDecimal ? val.toFixed(1) : Math.round(val)) + suffix;
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = (isDecimal ? target.toFixed(1) : target) + suffix;
    }
    requestAnimationFrame(tick);
  }

  // ---------- Chat typing demo ----------
  let chatStarted = false;
  function runChatDemo() {
    if (chatStarted) return;
    chatStarted = true;
    const msgs = document.querySelectorAll('#chatBody .chat-ai');
    let delay = 400;
    msgs.forEach((msg) => {
      const text = msg.dataset.typing || '';
      msg.textContent = '';
      setTimeout(() => typeText(msg, text), delay);
      delay += text.length * 22 + 600;
    });
  }
  function typeText(el, text) {
    let i = 0;
    (function step() {
      if (i <= text.length) {
        el.textContent = text.slice(0, i);
        i++;
        setTimeout(step, 22);
      }
    })();
  }

  // ---------- Subscribe form ----------
  const subForm = document.getElementById('subscribeForm');
  if (subForm) {
    subForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('subEmail').value.trim();
      const msg = document.getElementById('subMsg');
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!ok) {
        msg.textContent = 'Please enter a valid email address.';
        msg.style.color = '#be185d';
        return;
      }
      msg.textContent = '🎉 Thanks! Check your inbox to confirm.';
      msg.style.color = '#be185d';
      subForm.querySelector('input').value = '';
    });
  }

  /* =========================================================
     MICRO-INTERACTIONS
     ========================================================= */

  if (reduceMotion) return;

  // ---------- Button ripple effect ----------
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('pointerdown', (e) => {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left) + 'px';
      ripple.style.top = (e.clientY - rect.top) + 'px';
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 750);
    });
  });

  // ---------- Magnetic buttons (primary CTAs) ----------
  document.querySelectorAll('.btn-primary, .hero-cta .btn, .cta-form .btn').forEach(btn => {
    btn.classList.add('magnetic');
    const strength = 18;
    btn.addEventListener('pointermove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x / rect.width * strength}px, ${y / rect.height * strength}px)`;
    });
    btn.addEventListener('pointerleave', () => {
      btn.style.transform = '';
    });
  });

  // ---------- 3D tilt for cards ----------
  const tiltSelectors = '.why-card, .path-card, .media-card, .ai-tool-card, .tool-card, .week-card, .safety-card, .why-now-card';
  document.querySelectorAll(tiltSelectors).forEach(card => {
    const maxTilt = 6; // degrees
    card.style.transformStyle = 'preserve-3d';
    card.style.willChange = 'transform';

    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rx = (0.5 - y) * maxTilt;
      const ry = (x - 0.5) * maxTilt;
      card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
    });
    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });

  // ---------- Cursor glow that follows the pointer ----------
  const cursor = document.getElementById('cursorGlow');
  if (cursor && window.matchMedia('(hover: hover)').matches) {
    let targetX = 0, targetY = 0, currentX = 0, currentY = 0;
    let rafRunning = false;

    document.addEventListener('pointermove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      cursor.classList.add('active');
      if (!rafRunning) {
        rafRunning = true;
        requestAnimationFrame(animateCursor);
      }
    });
    document.addEventListener('pointerleave', () => cursor.classList.remove('active'));
    function animateCursor() {
      currentX += (targetX - currentX) * 0.15;
      currentY += (targetY - currentY) * 0.15;
      cursor.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`;
      if (Math.abs(targetX - currentX) > 0.5 || Math.abs(targetY - currentY) > 0.5) {
        requestAnimationFrame(animateCursor);
      } else {
        rafRunning = false;
      }
    }

    // Scale cursor on hoverable elements
    document.querySelectorAll('a, button, .finder-option, .picker-choice, .filter-btn, .chapter').forEach(el => {
      el.addEventListener('pointerenter', () => {
        cursor.style.width = '180px';
        cursor.style.height = '180px';
      });
      el.addEventListener('pointerleave', () => {
        cursor.style.width = '500px';
        cursor.style.height = '500px';
      });
    });
  }

  // ---------- Smooth anchor scroll ----------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

})();
