/* ==========================================
   PORTFOLIO SCRIPT — VANILLA JS
   ========================================== */

// ── Custom Cursor ──────────────────────────
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');

if (cursor && cursorFollower) {
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    cursorFollower.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    cursorFollower.style.opacity = '1';
  });
}

// ── Nav Scroll ─────────────────────────────
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });
}

// ── Mobile Menu ────────────────────────────
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
const mobLinks = document.querySelectorAll('.mob-link');

if (navToggle && mobileMenu) {
  navToggle.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    navToggle.classList.toggle('active', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  mobLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      navToggle.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

// ── Carousel ───────────────────────────────
(function initCarousel() {
  const track = document.getElementById('carouselTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dots = document.querySelectorAll('.dot-item');
  const counter = document.getElementById('currentSlide');

  if (!track) return;

  const cards = track.querySelectorAll('.project-card');
  const totalCards = cards.length;
  let current = 0;
  let isDragging = false, startX = 0, diffX = 0;

  function getVisibleCount() {
    return window.innerWidth <= 768 ? 1 : 2;
  }

  function getCardWidth() {
    const visible = getVisibleCount();
    const gap = 24;
    const containerWidth = track.parentElement.clientWidth;
    return (containerWidth - gap * (visible - 1)) / visible + gap;
  }

  function updateCarousel(index) {
    current = Math.max(0, Math.min(index, totalCards - getVisibleCount()));
    const offset = current * getCardWidth();
    track.style.transform = `translateX(-${offset}px)`;

    dots.forEach((d, i) => d.classList.toggle('active', i === current));
    if (counter) counter.textContent = String(current + 1).padStart(2, '0');
  }

  if (prevBtn) prevBtn.addEventListener('click', () => updateCarousel(current - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => updateCarousel(current + 1));

  dots.forEach((d) => {
    d.addEventListener('click', () => updateCarousel(parseInt(d.dataset.dot)));
  });

  // Touch/drag swipe
  track.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    track.style.transition = 'none';
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    diffX = e.clientX - startX;
  });

  document.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    track.style.transition = '';
    if (Math.abs(diffX) > 60) {
      updateCarousel(diffX < 0 ? current + 1 : current - 1);
    } else {
      updateCarousel(current);
    }
    diffX = 0;
  });

  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    track.style.transition = 'none';
  });

  track.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - startX;
    track.style.transition = '';
    if (Math.abs(dx) > 50) {
      updateCarousel(dx < 0 ? current + 1 : current - 1);
    } else {
      updateCarousel(current);
    }
  });

  window.addEventListener('resize', () => updateCarousel(0));
  updateCarousel(0);
})();

// ── Scroll Reveal ──────────────────────────
function initScrollReveal() {
  const targets = document.querySelectorAll(
    '.about-grid, .why-card, .project-card, .contact-grid, .footer-top, ' +
    '.stat, .skill-item, .contact-link, .detail-screen'
  );

  targets.forEach((el, i) => {
    el.classList.add('reveal');
    const delay = (i % 4) * 0.1;
    el.classList.add(`reveal-delay-${(i % 5) + 1}`);
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ── Counter Animation ──────────────────────
function initCounters() {
  const counters = document.querySelectorAll('.stat-num');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count);
      const duration = 1800;
      const start = performance.now();

      function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(ease * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
      }

      requestAnimationFrame(step);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

// ── Contact Form ───────────────────────────
function initContactForm() {
  const form = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');
  const submitBtn = document.getElementById('submitBtn');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = submitBtn;
    btn.disabled = true;
    btn.querySelector('span').textContent = 'Sending...';

    // Simulate async send
    setTimeout(() => {
      form.reset();
      btn.disabled = false;
      btn.querySelector('span').textContent = 'Send Message';
      if (successMsg) {
        successMsg.classList.add('show');
        setTimeout(() => successMsg.classList.remove('show'), 5000);
      }
    }, 1800);
  });

  // Input focus effects
  const inputs = form.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement.classList.add('focused');
    });
    input.addEventListener('blur', () => {
      input.parentElement.classList.remove('focused');
    });
  });
}

// ── Smooth Nav Links ───────────────────────
function initSmoothNav() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    });
  });
}

// ── Active Nav Highlight ───────────────────
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.style.color = link.getAttribute('href') === `#${id}`
            ? 'var(--white)' : '';
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
}

// ── Subtle Parallax on Hero ────────────────
function initHeroParallax() {
  const heroBg = document.querySelector('.hero-bg-grid');
  const heroNum = document.querySelector('.hero-number');

  if (!heroBg) return;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight) {
      heroBg.style.transform = `translateY(${y * 0.3}px)`;
      if (heroNum) heroNum.style.transform = `translateY(${-50 + y * 0.05}%) translateY(${y * 0.15}px)`;
    }
  });
}

// ── Init ───────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initCounters();
  initContactForm();
  initSmoothNav();
  initActiveNav();
  initHeroParallax();
});