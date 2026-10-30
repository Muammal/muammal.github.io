/**
 * MONOCHROME GLASS + LIVING LIGHT — MOTION & INTERACTION ENGINE
 * 
 * Powered by GSAP & ScrollTrigger.
 * Features:
 * - Luminous typography and headline sweeps
 * - Living light atmospheric fields and floating geometric elements
 * - Interactive Project Image Lightbox (strictly click-activated, NEVER on scroll)
 * - Certificate lightbox viewer & cursor previews
 * - Desktop floating glass nav active indicator
 * - Dual-theme switcher (Dark/Light)
 * - Contact mail client integration
 * - Protected API & full-stack integration support
 */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  const docEl = document.documentElement;

  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  onReady(() => {
    // Ensure dark theme is enforced
    docEl.setAttribute('data-theme', 'dark');

    initMobileNav();
    initScrollProgress();
    initNavIndicator();
    initSpotlight();
    initLivingLight();
    initProjectLightbox();
    initCertificates();
    initContactForm();
    initSmoothScroll();
    initMagneticButtons();
    initDynamicContent();

    // GSAP Motion Architecture
    if (typeof gsap !== 'undefined' && !prefersReducedMotion) {
      if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
      }
      initMotionEngine();
    } else {
      initFallbackCounters();
    }
  });

  /* ==========================================================================
     DYNAMIC CONTENT HYDRATION (Full Backend CMS Integration)
     Fetches live updates from FastAPI backend.
     Falls back instantly to pre-rendered HTML if backend is offline.
     ========================================================================== */
  async function initDynamicContent() {
    try {
      const res = await fetch('/api/content');
      if (!res.ok) return;
      const data = await res.json();
      if (!data) return;

      // 1. Profile & Bio Hydration
      if (data.profile) {
        const p = data.profile;
        if (p.roles && p.roles.length) {
          const rolesEl = document.querySelector('.hero__roles');
          if (rolesEl) {
            rolesEl.innerHTML = p.roles.map(r => `<span>${r}</span>`).join('<span class="hero__roles-sep" aria-hidden="true"></span>');
          }
        }
        if (p.hero_desc) {
          const descEl = document.querySelector('.hero__description');
          if (descEl) descEl.textContent = p.hero_desc;
        }
        if (p.based_in || p.studying || p.focus) {
          const metaRows = document.querySelectorAll('.meta-list__row dd');
          if (metaRows[0] && p.based_in) metaRows[0].textContent = p.based_in;
          if (metaRows[1] && p.studying) metaRows[1].textContent = p.studying;
          if (metaRows[2] && p.focus) metaRows[2].textContent = p.focus;
        }
        if (p.about_body) {
          const aboutBodyP = document.querySelector('.about__body p');
          if (aboutBodyP) aboutBodyP.textContent = p.about_body;
        }
        if (p.avatar_url) {
          const portraitImg = document.querySelector('.hero__portrait');
          if (portraitImg) portraitImg.src = p.avatar_url;
        }
      }

      // 2. Experience Hydration
      if (data.experience && data.experience.length) {
        const timelineList = document.querySelector('.timeline__list');
        if (timelineList) {
          timelineList.innerHTML = data.experience.map((exp, idx) => `
            <li class="entry glass spotlight" data-card>
              <div class="entry__node" aria-hidden="true">
                <span class="entry__node-dot"></span>
                <span class="entry__node-index">0${idx + 1}</span>
              </div>
              <div class="entry__content">
                <div class="entry__text">
                  <div class="entry__header">
                    <span class="mono entry__time"><span class="badge-dot" aria-hidden="true"></span> ${exp.period}</span>
                  </div>
                  <h3 class="entry__role">${exp.role}</h3>
                  <p class="entry__org">${exp.company}</p>
                  <p class="entry__desc">${exp.description}</p>
                  ${exp.bullets && exp.bullets.length ? `
                    <ul class="entry__bullets" role="list">
                      ${exp.bullets.map(b => `<li>${b}</li>`).join('')}
                    </ul>
                  ` : ''}
                  ${exp.tags && exp.tags.length ? `
                    <ul class="tags" role="list" aria-label="Skills">
                      ${exp.tags.map(t => `<li class="tag">${t}</li>`).join('')}
                    </ul>
                  ` : ''}
                </div>
                ${exp.media_url ? `
                  <div class="entry__media">
                    <picture>
                      <source srcset="${exp.media_url}" type="image/webp">
                      <img src="${exp.media_url}" alt="${exp.company}" width="1280" height="720" loading="lazy" decoding="async">
                    </picture>
                  </div>
                ` : ''}
              </div>
            </li>
          `).join('');
        }
      }

      // 3. Capabilities / Services Hydration
      if (data.services && data.services.length) {
        const servicesGrid = document.querySelector('.services');
        if (servicesGrid) {
          servicesGrid.innerHTML = data.services.map((svc, idx) => `
            <article class="service glass spotlight" data-reveal>
              <span class="mono service__index">0${idx + 1}</span>
              <h3 class="service__title">${svc.title}</h3>
              <p class="service__desc">${svc.description}</p>
            </article>
          `).join('');
        }
      }

      // 4. Toolkit Hydration
      if (data.toolkit && data.toolkit.length) {
        const toolkitGroups = document.querySelector('.toolkit__groups');
        if (toolkitGroups) {
          toolkitGroups.innerHTML = data.toolkit.map(tk => `
            <div class="toolkit__group">
              <dt>${tk.category}</dt>
              <dd>
                <ul role="list">
                  ${(tk.items || []).map(it => `<li>${it}</li>`).join('')}
                </ul>
              </dd>
            </div>
          `).join('');
        }
      }

      // 5. Certifications Hydration
      if (data.certifications && data.certifications.length) {
        const certsList = document.querySelector('.certs');
        if (certsList) {
          certsList.innerHTML = data.certifications.map((c, idx) => `
            <li data-reveal>
              <button class="cert" type="button" data-full="${c.full_image_url}" data-fallback="${c.fallback_image_url || c.full_image_url}">
                <span class="mono cert__index">0${idx + 1}</span>
                <span class="cert__thumb" aria-hidden="true">
                  <img src="${c.full_image_url}" alt="" width="1100" height="630" loading="lazy" decoding="async">
                </span>
                <span class="cert__title">${c.title}</span>
                <span class="cert__org">${c.issuer}</span>
                <span class="cert__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M7 17L17 7M8 7h9v9" />
                  </svg>
                </span>
              </button>
            </li>
          `).join('');
          initCertificates();
        }
      }

      initSpotlight();
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
    } catch (err) {
      console.log('Dynamic content sync skipped (running in offline/static mode):', err);
    }
  }

  /* ==========================================================================
     MOBILE NAVIGATION
     ========================================================================== */
  function initMobileNav() {
    const toggle = document.querySelector('.menu-toggle');
    const menu = document.getElementById('mobileMenu');
    const links = document.querySelectorAll('.mobile-menu__link');
    if (!toggle || !menu) return;

    function openMenu() {
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close menu');
      menu.classList.add('is-open');
      docEl.classList.add('menu-open');
    }

    function closeMenu() {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
      menu.classList.remove('is-open');
      docEl.classList.remove('menu-open');
    }

    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.contains('is-open');
      if (isOpen) closeMenu();
      else openMenu();
    });

    links.forEach((link) => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) {
        closeMenu();
        toggle.focus();
      }
    });
  }

  /* ==========================================================================
     SCROLL PROGRESS & HEADER SCROLL STATE
     ========================================================================== */
  function initScrollProgress() {
    const header = document.querySelector('.site-header');
    const bar = document.querySelector('.scroll-progress__bar');

    function onScroll() {
      const scrollY = window.scrollY || window.pageYOffset;
      const docHeight = docEl.scrollHeight - window.innerHeight;

      if (header) {
        if (scrollY > 40) {
          header.classList.add('is-scrolled');
        } else {
          header.classList.remove('is-scrolled');
        }
      }

      if (bar) {
        const progress = docHeight > 0 ? Math.min(Math.max(scrollY / docHeight, 0), 1) : 0;
        bar.style.transform = `scaleX(${progress})`;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ==========================================================================
     DESKTOP FLOATING NAV ACTIVE INDICATOR
     ========================================================================== */
  function initNavIndicator() {
    const indicator = document.querySelector('.nav__indicator');
    const links = document.querySelectorAll('.nav__link');
    const navCenter = document.querySelector('.nav__center');
    const sections = Array.from(document.querySelectorAll('section[id]'));
    if (!indicator || !links.length || !navCenter) return;

    let activeLink = null;

    function moveIndicatorTo(link) {
      if (!link) {
        indicator.classList.remove('is-visible');
        return;
      }
      const navCenterRect = navCenter.getBoundingClientRect();
      const linkRect = link.getBoundingClientRect();
      const x = linkRect.left - navCenterRect.left;
      const w = linkRect.width;

      indicator.style.setProperty('--x', `${x}px`);
      indicator.style.setProperty('--w', `${w}px`);
      indicator.classList.add('is-visible');
    }

    function updateActiveByScroll() {
      const scrollPos = window.scrollY + window.innerHeight * 0.35;
      let currentSectionId = null;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.offsetTop <= scrollPos) {
          currentSectionId = section.getAttribute('id');
          break;
        }
      }

      if (!currentSectionId && window.scrollY < 200) {
        currentSectionId = 'home';
      }

      let matchedLink = null;
      links.forEach((l) => {
        const href = l.getAttribute('href');
        if (href === `#${currentSectionId}`) {
          l.classList.add('is-active');
          matchedLink = l;
        } else {
          l.classList.remove('is-active');
        }
      });

      if (matchedLink !== activeLink) {
        activeLink = matchedLink;
        moveIndicatorTo(activeLink);
      }
    }

    // Hover effect on navigation items
    links.forEach((l) => {
      l.addEventListener('mouseenter', () => moveIndicatorTo(l));
      l.addEventListener('focus', () => moveIndicatorTo(l));
    });

    navCenter.addEventListener('mouseleave', () => moveIndicatorTo(activeLink));

    window.addEventListener('scroll', updateActiveByScroll, { passive: true });
    window.addEventListener('resize', () => moveIndicatorTo(activeLink));
    updateActiveByScroll();
  }

  /* ==========================================================================
     SPOTLIGHT & CURSOR RESPONSIVE LIGHTING
     ========================================================================== */
  function initSpotlight() {
    if (isTouchDevice) return;

    const hero = document.querySelector('.hero');
    const spotlights = document.querySelectorAll('.spotlight');

    // Hero background ambient lighting
    if (hero) {
      const heroBg = hero.querySelector('.hero__bg');
      hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        if (heroBg) {
          heroBg.style.setProperty('--mx', `${x.toFixed(2)}%`);
          heroBg.style.setProperty('--my', `${y.toFixed(2)}%`);
        }
        hero.classList.add('is-pointer');
      });

      hero.addEventListener('mouseleave', () => {
        hero.classList.remove('is-pointer');
      });
    }

    // Card and panel spot highlights
    spotlights.forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        el.style.setProperty('--px', `${x}px`);
        el.style.setProperty('--py', `${y}px`);
      });
    });
  }

  /* ==========================================================================
     LIVING LIGHT ATMOSPHERIC ANIMATIONS (GSAP)
     ========================================================================== */
  function initLivingLight() {
    if (typeof gsap === 'undefined' || prefersReducedMotion) return;

    // Cyan and Violet organic drifting
    const cyanOrb = document.querySelector('.ambient__orb--cyan');
    if (cyanOrb) {
      gsap.to(cyanOrb, {
        x: 40,
        y: -35,
        scale: 1.12,
        duration: 16,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    }

    const violetOrb = document.querySelector('.ambient__orb--violet');
    if (violetOrb) {
      gsap.to(violetOrb, {
        x: -45,
        y: 30,
        scale: 1.08,
        duration: 19,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    }

    // Floating glass and geometric elements
    const floatGlass1 = document.querySelector('.float-glass--1');
    if (floatGlass1) {
      gsap.to(floatGlass1, {
        y: -25,
        x: 12,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      });
    }

    const floatGlass2 = document.querySelector('.float-glass--2');
    if (floatGlass2) {
      gsap.to(floatGlass2, {
        y: 20,
        x: -15,
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      });
    }

    const floatGeom1 = document.querySelector('.float-geom--1');
    if (floatGeom1) {
      gsap.to(floatGeom1, {
        rotation: 405,
        duration: 35,
        repeat: -1,
        ease: 'none'
      });
    }

    // Desktop cursor parallax on floating elements and hero badges
    if (!isTouchDevice) {
      const burstItems = document.querySelectorAll('.hero__burst-item');
      window.addEventListener('mousemove', (e) => {
        const normX = (e.clientX / window.innerWidth) - 0.5;
        const normY = (e.clientY / window.innerHeight) - 0.5;

        if (floatGlass1) {
          gsap.to(floatGlass1, { x: normX * 30, y: normY * 30, duration: 1.2, ease: 'power2.out', overwrite: 'auto' });
        }
        if (floatGlass2) {
          gsap.to(floatGlass2, { x: -normX * 25, y: -normY * 25, duration: 1.2, ease: 'power2.out', overwrite: 'auto' });
        }

        // Subtly shift burst badges in 3D parallax field without overriding orbital coordinates
        if (burstItems.length && !prefersReducedMotion) {
          burstItems.forEach((item, idx) => {
            const factor = (idx % 2 === 0 ? 1 : -1) * (10 + (idx * 3));
            gsap.to(item, {
              xPercent: -50 + (normX * factor * 0.4),
              yPercent: -50 + (normY * factor * 0.4),
              duration: 1.3,
              ease: 'power2.out',
              overwrite: 'auto'
            });
          });
        }
      }, { passive: true });
    }
  }

  /* ==========================================================================
     MAGNETIC BUTTONS (GSAP Elastic Tactile Feedback)
     ========================================================================== */
  function initMagneticButtons() {
    if (isTouchDevice || prefersReducedMotion) return;
    const magneticTargets = document.querySelectorAll('.hero__actions .btn, .btn--primary, .btn--glass');
    magneticTargets.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(btn, {
          x: x * 0.28,
          y: y * 0.28,
          duration: 0.35,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      }, { passive: true });

      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.75,
          ease: 'elastic.out(1.1, 0.4)',
          overwrite: 'auto'
        });
      });
    });
  }

  /* ==========================================================================
     INTERACTIVE PROJECT IMAGE LIGHTBOX
     STRICT RULE: Activated ONLY on user click/Enter, NEVER during scroll.
     ========================================================================== */
  function initProjectLightbox() {
    const dialog = document.getElementById('projectLightbox');
    if (!dialog) return;

    const dialogImg = document.getElementById('projectLightboxImg');
    const dialogTitle = document.getElementById('projectLightboxTitle');
    const dialogBadge = document.getElementById('projectLightboxBadge');
    const dialogDesc = document.getElementById('projectLightboxDesc');
    const dialogCounter = document.getElementById('projectLightboxCounter');
    const dialogLink = document.getElementById('projectLightboxLink');
    const closeBtn = document.getElementById('projectLightboxClose');
    const prevBtn = document.getElementById('projectLightboxPrev');
    const nextBtn = document.getElementById('projectLightboxNext');

    const triggers = Array.from(document.querySelectorAll('[data-lightbox="project"]'));
    if (!triggers.length) return;

    const gallery = triggers.map((btn) => ({
      trigger: btn,
      title: btn.getAttribute('data-title') || 'Project Showcase',
      badge: btn.getAttribute('data-badge') || 'Case Study',
      desc: btn.getAttribute('data-desc') || '',
      fullSrc: btn.getAttribute('data-full') || btn.querySelector('img')?.src || '',
      link: btn.getAttribute('data-link') || ''
    }));

    let currentIndex = 0;
    let lastActiveTrigger = null;

    function renderSlide(index) {
      if (index < 0 || index >= gallery.length) return;
      currentIndex = index;
      const item = gallery[currentIndex];

      dialogTitle.textContent = item.title;
      dialogBadge.textContent = item.badge;
      dialogDesc.textContent = item.desc;
      dialogCounter.textContent = `0${currentIndex + 1} / 0${gallery.length}`;
      dialogImg.src = item.fullSrc;
      dialogImg.alt = `${item.title} full resolution screenshot`;

      if (item.link) {
        dialogLink.href = item.link;
        dialogLink.style.display = 'inline-flex';
      } else {
        dialogLink.style.display = 'none';
      }
    }

    function openLightbox(index, triggerElement) {
      lastActiveTrigger = triggerElement || triggers[index];
      renderSlide(index);

      if (typeof dialog.showModal === 'function') {
        dialog.showModal();
      } else {
        dialog.setAttribute('open', '');
      }

      docEl.classList.add('menu-open');

      if (typeof gsap !== 'undefined' && !prefersReducedMotion) {
        gsap.fromTo(
          dialog.querySelector('.lightbox__panel'),
          { scale: 0.94, opacity: 0, y: 15 },
          { scale: 1, opacity: 1, y: 0, duration: 0.35, ease: 'power3.out' }
        );
      }
    }

    function closeLightbox() {
      if (typeof dialog.close === 'function') dialog.close();
      else dialog.removeAttribute('open');
      docEl.classList.remove('menu-open');
      if (lastActiveTrigger && typeof lastActiveTrigger.focus === 'function') {
        lastActiveTrigger.focus();
      }
    }

    // Attach click triggers (User interaction ONLY)
    triggers.forEach((btn, idx) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openLightbox(idx, btn);
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        const nextIdx = (currentIndex - 1 + gallery.length) % gallery.length;
        renderSlide(nextIdx);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const nextIdx = (currentIndex + 1) % gallery.length;
        renderSlide(nextIdx);
      });
    }

    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) closeLightbox();
    });

    dialog.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        const nextIdx = (currentIndex - 1 + gallery.length) % gallery.length;
        renderSlide(nextIdx);
      } else if (e.key === 'ArrowRight') {
        const nextIdx = (currentIndex + 1) % gallery.length;
        renderSlide(nextIdx);
      }
    });

    // Touch swipe gesture navigation for mobile screens
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;

    dialog.addEventListener('touchstart', (e) => {
      if (!e.changedTouches || !e.changedTouches[0]) return;
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    dialog.addEventListener('touchend', (e) => {
      if (!e.changedTouches || !e.changedTouches[0]) return;
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;
      if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX < 0) {
          const nextIdx = (currentIndex + 1) % gallery.length;
          renderSlide(nextIdx);
        } else {
          const nextIdx = (currentIndex - 1 + gallery.length) % gallery.length;
          renderSlide(nextIdx);
        }
      }
    }, { passive: true });
  }

  /* ==========================================================================
     CERTIFICATES & LIGHTBOX VIEWER
     STRICT RULE: Activated ONLY on user click/Enter, NEVER on hover.
     ========================================================================== */
  function initCertificates() {
    const certButtons = document.querySelectorAll('.cert');
    const dialog = document.getElementById('certDialog');
    if (!dialog || !certButtons.length) return;

    const dialogTitle = document.getElementById('certDialogTitle');
    const dialogOrg = dialog.querySelector('.lightbox__org');
    const dialogImg = dialog.querySelector('.lightbox__img');
    const closeBtn = dialog.querySelector('.lightbox__close');
    const panel = dialog.querySelector('.lightbox__panel');

    let lastActiveTrigger = null;

    function openDialog(btn) {
      lastActiveTrigger = btn;
      const fullSrc = btn.getAttribute('data-full') || btn.getAttribute('data-fallback') || '';
      const title = btn.querySelector('.cert__title')?.textContent || 'Certificate';
      const org = btn.querySelector('.cert__org')?.textContent || '';

      if (dialogTitle) dialogTitle.textContent = title;
      if (dialogOrg) dialogOrg.textContent = org;
      if (dialogImg) {
        dialogImg.src = fullSrc;
        dialogImg.alt = `${title} credential certificate issued by ${org}`;
      }

      if (typeof dialog.showModal === 'function') {
        dialog.showModal();
      } else {
        dialog.setAttribute('open', '');
      }
      docEl.classList.add('menu-open');

      if (typeof gsap !== 'undefined' && !prefersReducedMotion && panel) {
        gsap.fromTo(
          panel,
          { scale: 0.94, opacity: 0, y: 15 },
          { scale: 1, opacity: 1, y: 0, duration: 0.35, ease: 'power3.out' }
        );
      }
    }

    function closeDialog() {
      if (typeof dialog.close === 'function') dialog.close();
      else dialog.removeAttribute('open');
      docEl.classList.remove('menu-open');
      if (lastActiveTrigger && typeof lastActiveTrigger.focus === 'function') {
        lastActiveTrigger.focus();
      }
    }

    // Attach click triggers ONLY (Hover NEVER opens a preview or modal)
    certButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openDialog(btn);
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeDialog);

    dialog.addEventListener('click', (e) => {
      // Backdrop click closes dialog; clicks on panel are preserved
      if (e.target === dialog) closeDialog();
    });

    dialog.addEventListener('cancel', (e) => {
      e.preventDefault();
      closeDialog();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && dialog.hasAttribute('open')) {
        closeDialog();
      }
    });
  }

  /* ==========================================================================
     CONTACT FORM HANDLING
     ========================================================================== */
  function initContactForm() {
    const form = document.getElementById('portfolioContactForm');
    const msg = document.getElementById('formMessage');
    if (!form || !msg) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('clientName')?.value.trim();
      const email = document.getElementById('clientEmail')?.value.trim();
      const subject = document.getElementById('clientSubject')?.value.trim();
      const message = document.getElementById('clientMessage')?.value.trim();

      if (!name || !email || !message) {
        msg.textContent = 'Please complete all required fields.';
        msg.style.color = 'var(--fg)';
        return;
      }

      const recipient = 'Cas.dropmail@gmail.com';
      const mailtoSubject = encodeURIComponent(subject ? `[Portfolio] ${subject}` : `[Portfolio] Inquiry from ${name}`);
      const mailtoBody = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
      );

      msg.textContent = 'Launching your default email client...';
      msg.style.color = 'var(--fg)';

      window.location.href = `mailto:${recipient}?subject=${mailtoSubject}&body=${mailtoBody}`;

      setTimeout(() => {
        msg.textContent = 'Thank you! If your client did not open, reach out directly at cas.dropmail@gmail.com';
        form.reset();
      }, 2500);
    });
  }

  /* ==========================================================================
     SMOOTH SCROLLING WITH OFFSET
     ========================================================================== */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        const id = this.getAttribute('href');
        if (id === '#' || !id) return;
        const target = document.querySelector(id);
        if (!target) return;

        e.preventDefault();
        const headerOffset = 90;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      });
    });
  }

  /* ==========================================================================
     FALLBACK COUNTERS
     ========================================================================== */
  function initFallbackCounters() {
    const counterElements = document.querySelectorAll('[data-count]');
    counterElements.forEach((el) => {
      const target = el.getAttribute('data-count');
      if (target) el.textContent = target;
    });
  }

  /* ==========================================================================
     GSAP MOTION & ORCHESTRATION ENGINE (Inspired by gsap.com)
     ========================================================================== */
  function initMotionEngine() {
    const ctx = gsap.context(() => {
      // 1. Prepare word splitting for [data-words] and [data-gsap-scrub-text]
      document.querySelectorAll('[data-words]').forEach((el) => {
        const text = el.textContent.trim().replace(/\s+/g, ' ');
        const words = text.split(' ');
        el.textContent = '';
        words.forEach((word, i) => {
          const span = document.createElement('span');
          span.className = 'word';
          span.textContent = word + (i < words.length - 1 ? '\u00A0' : '');
          el.appendChild(span);
        });
      });

      // Tokenize [data-gsap-scrub-text] while preserving HTML highlight tags
      document.querySelectorAll('[data-gsap-scrub-text]').forEach((container) => {
        const nodes = Array.from(container.childNodes);
        const frag = document.createDocumentFragment();

        nodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            const words = node.textContent.split(/(\s+)/);
            words.forEach((chunk) => {
              if (/\S/.test(chunk)) {
                const span = document.createElement('span');
                span.className = 'scrub-word';
                span.textContent = chunk;
                frag.appendChild(span);
              } else if (chunk) {
                frag.appendChild(document.createTextNode(chunk));
              }
            });
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            const wrapper = document.createElement('span');
            wrapper.className = 'scrub-word scrub-word--highlight';
            wrapper.appendChild(node.cloneNode(true));
            frag.appendChild(wrapper);
          }
        });

        container.innerHTML = '';
        container.appendChild(frag);
      });

      // 2. HERO MASTER TIMELINE
      const heroTl = gsap.timeline({
        defaults: { ease: 'power3.out' }
      });

      heroTl
        .fromTo(
          '.site-header',
          { y: -20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.85, delay: 0.05 }
        )
        .fromTo(
          '[data-anim="intro"]',
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, stagger: 0.08 },
          '-=0.55'
        )
        .fromTo(
          '.hero__title .line__inner',
          { y: '105%', opacity: 0 },
          { y: '0%', opacity: 1, duration: 0.95, stagger: 0.12, ease: 'power3.out' },
          '-=0.6'
        )
        .fromTo(
          '.hero__flair--asterisk',
          { scale: 0, opacity: 0, rotation: -90 },
          { scale: 1, opacity: 1, rotation: 0, duration: 0.6, ease: 'back.out(1.8)' },
          '-=0.4'
        )
        .fromTo(
          '[data-anim="cta"]',
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 },
          '-=0.5'
        )
        .fromTo(
          '[data-anim="portrait"]',
          { opacity: 0 },
          { opacity: 1, duration: 0.8, ease: 'power2.out' },
          '-=0.75'
        );

      // Kinetic GSAP elements emerging outward from the drone frame / portrait (NO LIGHTINGS)
      const burstItems = gsap.utils.toArray('.hero__burst-item');
      if (burstItems.length) {
        const isMobile = window.innerWidth <= 860;
        const scaleFactor = isMobile ? 0.48 : 1.0;

        // Set initial burst origin at center of portrait silhouette
        gsap.set(burstItems, {
          xPercent: -50,
          yPercent: -50,
          x: 0,
          y: 0,
          scale: 0.1,
          opacity: 0,
          rotation: (i) => (i % 2 === 0 ? -12 : 12)
        });

        heroTl.to(
          burstItems,
          {
            x: (i, el) => (parseFloat(el.dataset.x) || 0) * scaleFactor,
            y: (i, el) => (parseFloat(el.dataset.y) || 0) * scaleFactor,
            scale: 1,
            opacity: 1,
            rotation: 0,
            duration: 0.85,
            stagger: 0.08,
            ease: 'back.out(1.8)',
            onComplete: () => {
              // Initiate subtle ambient floating drift only after burst entrance completes
              burstItems.forEach((item, idx) => {
                const dy = (idx % 2 === 0 ? 5 : -5);
                const drot = (idx % 2 === 0 ? 1.5 : -1.5);
                gsap.to(item, {
                  y: `+=${dy}`,
                  rotation: `+=${drot}`,
                  duration: 3.2 + (idx * 0.4),
                  repeat: -1,
                  yoyo: true,
                  ease: 'sine.inOut'
                });
              });
            }
          },
          '-=0.55'
        );
      }

      heroTl.fromTo(
        '[data-anim="meta"]',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.75 },
        '-=0.5'
      );

      // Continuous ambient rotation of kinetic flair
      const flairSvg = document.querySelector('.hero__flair--asterisk svg');
      if (flairSvg) {
        gsap.to(flairSvg, {
          rotation: 360,
          duration: 18,
          repeat: -1,
          ease: 'none'
        });
      }

      // 3. SCROLLTRIGGER INTERACTIONS
      if (typeof ScrollTrigger !== 'undefined') {

        // Scroll-linked scrub rotation on hero flair (inspired by gsap.com asterisk scrub)
        const heroElem = document.querySelector('.hero');
        const heroFlair = document.querySelector('.hero__flair--asterisk');
        if (heroElem && heroFlair) {
          gsap.to(heroFlair, {
            rotation: 240,
            ease: 'none',
            scrollTrigger: {
              trigger: heroElem,
              start: 'top top',
              end: 'bottom top',
              scrub: 1
            }
          });
        }

        // Parallax lift on hero burst elements during scroll (subtle kinetic depth)
        const heroBurst = document.querySelector('.hero__burst');
        if (heroElem && heroBurst) {
          gsap.to(heroBurst, {
            y: -50,
            ease: 'none',
            scrollTrigger: {
              trigger: heroElem,
              start: 'top top',
              end: 'bottom top',
              scrub: 1
            }
          });
        }

        // Generic [data-reveal] section elements
        const revealElements = document.querySelectorAll('[data-reveal]');
        revealElements.forEach((el) => {
          gsap.fromTo(
            el,
            { y: 30, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.85,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 88%',
                toggleActions: 'play none none none'
              }
            }
          );
        });

        // A. Section Subtitle Braces Entrance (gsap.com subtitle technique)
        document.querySelectorAll('[data-subtitle]').forEach((subtitle) => {
          const leftBrace = subtitle.querySelector('.subtitle__brace--left');
          const rightBrace = subtitle.querySelector('.subtitle__brace--right');
          const label = subtitle.querySelector('.eyebrow');

          const subTl = gsap.timeline({
            scrollTrigger: {
              trigger: subtitle,
              start: 'top 88%',
              toggleActions: 'play none none none'
            }
          });

          if (label) {
            subTl.fromTo(label, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' });
          }
          if (leftBrace) {
            subTl.fromTo(leftBrace, { opacity: 0, x: -28 }, { opacity: 0.9, x: 0, duration: 0.45, ease: 'power3.out' }, '-=0.45');
          }
          if (rightBrace) {
            subTl.fromTo(rightBrace, { opacity: 0, x: 28 }, { opacity: 0.9, x: 0, duration: 0.45, ease: 'power3.out' }, '<');
          }
        });

        // B. "Why GSAP" Section Style Scrubbed Text Illumination (gsap.com technique)
        document.querySelectorAll('[data-gsap-scrub-text]').forEach((el) => {
          const words = el.querySelectorAll('.scrub-word');
          if (words.length) {
            gsap.fromTo(
              words,
              { color: 'rgba(255, 255, 255, 0.35)', opacity: 0.38 },
              {
                color: '#FFFFFF',
                opacity: 1,
                stagger: 0.04,
                ease: 'none',
                scrollTrigger: {
                  trigger: el,
                  start: 'top 82%',
                  end: 'bottom 48%',
                  scrub: 1
                }
              }
            );
          }

          // Kinetic flairs and highlight word animations
          const cyanHighlight = el.querySelector('.home-intro__highlight--cyan');
          if (cyanHighlight) {
            gsap.to(cyanHighlight, {
              color: '#00F0FF',
              ease: 'power3.inOut',
              duration: 0.8,
              scrollTrigger: {
                trigger: el,
                start: 'top 75%',
                toggleActions: 'play none none none'
              }
            });
            const flair = el.querySelector('.home-intro__flair');
            if (flair) {
              gsap.fromTo(
                flair,
                { scale: 0, rotate: -180, y: 15 },
                {
                  scale: 1,
                  rotate: 0,
                  y: 0,
                  duration: 0.8,
                  ease: 'back.out(1.8)',
                  scrollTrigger: {
                    trigger: el,
                    start: 'top 75%',
                    toggleActions: 'play none none none'
                  }
                }
              );
            }
          }

          const emeraldHighlight = el.querySelector('.home-intro__highlight--emerald');
          if (emeraldHighlight) {
            gsap.fromTo(
              emeraldHighlight,
              { rotateX: 90, opacity: 0.3 },
              {
                rotateX: 0,
                opacity: 1,
                duration: 1.2,
                ease: 'power3.out',
                scrollTrigger: {
                  trigger: el,
                  start: 'top 72%',
                  toggleActions: 'play none none none'
                }
              }
            );
          }

          const purpleHighlight = el.querySelector('.home-intro__highlight--purple');
          if (purpleHighlight) {
            gsap.fromTo(
              purpleHighlight,
              { y: 35, scale: 0.85, opacity: 0.3 },
              {
                y: 0,
                scale: 1,
                opacity: 1,
                duration: 1.1,
                ease: 'elastic.out(1, 0.45)',
                scrollTrigger: {
                  trigger: el,
                  start: 'top 70%',
                  toggleActions: 'play none none none'
                }
              }
            );
          }
        });

        // Numerical stats counter tick-up
        const statNumbers = document.querySelectorAll('[data-count]');
        statNumbers.forEach((stat) => {
          const targetValue = parseInt(stat.getAttribute('data-count'), 10) || 0;
          const countObj = { val: 0 };

          gsap.to(countObj, {
            val: targetValue,
            duration: 1.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: stat,
              start: 'top 88%',
              toggleActions: 'play none none none'
            },
            onUpdate: () => {
              stat.textContent = Math.floor(countObj.val);
            },
            onComplete: () => {
              stat.textContent = targetValue;
            }
          });
        });

        // C. Section Headings & Display Titles Kinetic Text Reveal
        const sectionTitles = document.querySelectorAll('.display-2:not(.about__headline), .section-head__title');
        sectionTitles.forEach((heading) => {
          gsap.fromTo(
            heading,
            { y: 32, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.9,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: heading,
                start: 'top 85%',
                toggleActions: 'play none none none'
              }
            }
          );
        });

        // D. Category Section Scroll-In Animations
        // 1. Portfolio Category: Filters & Cards Staggered Scroll-In
        const filterContainer = document.querySelector('.project-filters');
        if (filterContainer) {
          const filterBtns = filterContainer.querySelectorAll('.filter-btn');
          gsap.fromTo(
            filterBtns,
            { opacity: 0, y: 15, scale: 0.9 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.5,
              stagger: 0.05,
              ease: 'back.out(1.5)',
              scrollTrigger: {
                trigger: filterContainer,
                start: 'top 88%',
                toggleActions: 'play none none none'
              }
            }
          );
        }

        const projectCards = document.querySelectorAll('.project[data-card]');
        projectCards.forEach((card, index) => {
          const tags = card.querySelectorAll('.tag');
          const cardTl = gsap.timeline({
            scrollTrigger: {
              trigger: card,
              start: 'top 86%',
              toggleActions: 'play none none none'
            }
          });
          cardTl.fromTo(
            card,
            { y: 52, opacity: 0, scale: 0.96 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.9,
              delay: (index % 2) * 0.1,
              ease: 'power3.out'
            }
          );
          if (tags.length) {
            cardTl.fromTo(
              tags,
              { scale: 0.8, opacity: 0 },
              { scale: 1, opacity: 1, duration: 0.4, stagger: 0.04, ease: 'back.out(1.6)' },
              '-=0.45'
            );
          }

          // Subtle cinematic media parallax scrub
          const mediaPic = card.querySelector('.project__media picture');
          if (mediaPic) {
            gsap.fromTo(
              mediaPic,
              { scale: 1.06, yPercent: -3 },
              {
                scale: 1.0,
                yPercent: 3,
                ease: 'none',
                scrollTrigger: {
                  trigger: card,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: 1.2
                }
              }
            );
          }
        });

        // 2. Experience Category: Meta Bar, Rail Scrub, and Milestone Cards
        const expMetaBar = document.querySelector('.experience__meta-bar');
        if (expMetaBar) {
          gsap.fromTo(
            expMetaBar,
            { y: 20, opacity: 0, scale: 0.95 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.65,
              ease: 'back.out(1.5)',
              scrollTrigger: {
                trigger: '.experience__head',
                start: 'top 82%',
                toggleActions: 'play none none none'
              }
            }
          );
        }

        const timelineRail = document.querySelector('.timeline');
        const timelineFill = document.querySelector('.timeline__fill');
        if (timelineRail && timelineFill) {
          gsap.fromTo(
            timelineFill,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: timelineRail,
                start: 'top 75%',
                end: 'bottom 82%',
                scrub: 0.5
              }
            }
          );
        }

        const entries = document.querySelectorAll('.entry');
        entries.forEach((entry) => {
          const node = entry.querySelector('.entry__node');
          const entryTags = entry.querySelectorAll('.tag');

          const entryTl = gsap.timeline({
            scrollTrigger: {
              trigger: entry,
              start: 'top 86%',
              toggleActions: 'play none none none'
            }
          });

          entryTl.fromTo(
            entry,
            { y: 46, opacity: 0, scale: 0.97 },
            { y: 0, opacity: 1, scale: 1, duration: 0.85, ease: 'power3.out' }
          );

          if (node) {
            entryTl.fromTo(
              node,
              { scale: 0, rotation: -90 },
              { scale: 1, rotation: 0, duration: 0.5, ease: 'back.out(2)' },
              '-=0.55'
            );
          }

          if (entryTags.length) {
            entryTl.fromTo(
              entryTags,
              { scale: 0.8, opacity: 0 },
              { scale: 1, opacity: 1, duration: 0.4, stagger: 0.04, ease: 'back.out(1.6)' },
              '-=0.4'
            );
          }

          // Active node glow when scrolled into focus
          ScrollTrigger.create({
            trigger: entry,
            start: 'top 65%',
            end: 'bottom 45%',
            onToggle: (self) => {
              entry.classList.toggle('is-active', self.isActive);
            }
          });
        });

        // 3. Capabilities Category: Service Cards, Kinetic Icons & Toolkit
        const serviceCards = document.querySelectorAll('.service');
        serviceCards.forEach((service, idx) => {
          const icon = service.querySelector('.service__icon');
          const sTl = gsap.timeline({
            scrollTrigger: {
              trigger: service,
              start: 'top 86%',
              toggleActions: 'play none none none'
            }
          });
          sTl.fromTo(
            service,
            { y: 45, opacity: 0, scale: 0.95 },
            { y: 0, opacity: 1, scale: 1, duration: 0.85, delay: (idx % 2) * 0.12, ease: 'power3.out' }
          );
          if (icon) {
            sTl.fromTo(icon, { rotate: -25, scale: 0.6, opacity: 0 }, { rotate: 0, scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.8)' }, '-=0.5');
          }
        });

        const toolkitItems = document.querySelectorAll('.toolkit__item');
        if (toolkitItems.length) {
          gsap.fromTo(
            toolkitItems,
            { y: 16, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.45,
              stagger: 0.03,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: '.toolkit',
                start: 'top 88%',
                toggleActions: 'play none none none'
              }
            }
          );
        }

        // 4. Certifications Category: Credential Cards
        const certList = document.querySelectorAll('.certs li');
        certList.forEach((item, idx) => {
          gsap.fromTo(
            item,
            { y: 35, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.75,
              delay: (idx % 4) * 0.08,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: item,
                start: 'top 88%',
                toggleActions: 'play none none none'
              }
            }
          );
        });

        // 5. Contact Category: Title Line Reveal & Glass Card
        const contactTitle = document.querySelector('.contact__title');
        if (contactTitle) {
          const contactLines = contactTitle.querySelectorAll('.line__inner');
          gsap.fromTo(
            contactLines,
            { y: '105%', opacity: 0 },
            {
              y: '0%',
              opacity: 1,
              duration: 0.95,
              stagger: 0.12,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: contactTitle,
                start: 'top 85%',
                toggleActions: 'play none none none'
              }
            }
          );
        }

        const contactCard = document.querySelector('.contact__card');
        if (contactCard) {
          gsap.fromTo(
            contactCard,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.85,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: contactCard,
                start: 'top 86%',
                toggleActions: 'play none none none'
              }
            }
          );
        }

        // 4. GSAP BACKGROUND SHAPES SCROLLTRIGGER & PARALLAX (gsap.com techniques)
        // Curves parallax sweeping across backgrounds
        document.querySelectorAll('.ambient-shape--curve').forEach((curve) => {
          const section = curve.closest('section') || curve.parentElement;
          gsap.to(curve, {
            y: -75,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2
            }
          });
        });

        // Extra scrubbed rotation on asterisks & windmills
        document.querySelectorAll('.ambient-shape--asterisk, .ambient-shape--windmill').forEach((spinEl) => {
          const section = spinEl.closest('section') || spinEl.parentElement;
          gsap.to(spinEl, {
            rotation: '+=180',
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1
            }
          });
        });

        // Diamonds subtle scrub elevation
        document.querySelectorAll('.ambient-shape--diamond').forEach((diamond) => {
          const section = diamond.closest('section') || diamond.parentElement;
          gsap.to(diamond, {
            y: -45,
            rotation: '+=45',
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.5
            }
          });
        });

        // Curly Braces dynamic entrance slide (framing sections like on gsap.com)
        document.querySelectorAll('.about__shape--brace-l, .contact__shape--brace, .experience__shape--brace').forEach((brace) => {
          const section = brace.closest('section');
          gsap.fromTo(brace,
            { x: -40, opacity: 0 },
            {
              x: 0,
              opacity: 0.35,
              duration: 1.1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 82%',
                toggleActions: 'play none none none'
              }
            }
          );
        });

        document.querySelectorAll('.about__shape--brace-r').forEach((brace) => {
          const section = brace.closest('section');
          gsap.fromTo(brace,
            { x: 40, opacity: 0 },
            {
              x: 0,
              opacity: 0.35,
              duration: 1.1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 82%',
                toggleActions: 'play none none none'
              }
            }
          );
        });
      }

      // Continuous Idle Animation for Background Ambient Shapes
      document.querySelectorAll('.ambient-shape--windmill').forEach((el) => {
        gsap.to(el, {
          rotation: 360,
          duration: 38,
          repeat: -1,
          ease: 'none'
        });
      });

      document.querySelectorAll('.ambient-shape--asterisk').forEach((el) => {
        gsap.to(el, {
          rotation: -360,
          duration: 30,
          repeat: -1,
          ease: 'none'
        });
      });

      document.querySelectorAll('.ambient-shape--diamond, .ambient-shape--timer, .ambient-shape--flower, .ambient-shape--cutout').forEach((el, i) => {
        gsap.to(el, {
          y: (i % 2 === 0 ? -16 : 16),
          x: (i % 3 === 0 ? 10 : -10),
          rotation: (i % 2 === 0 ? 12 : -12),
          duration: 7 + (i % 4) * 2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      });

      document.querySelectorAll('.ambient-shape--orbit').forEach((el, i) => {
        gsap.to(el, {
          scale: 1.06,
          rotation: (i % 2 === 0 ? 20 : -20),
          duration: 14 + i * 2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      });
    });

    // Clean up triggers on page unload
    window.addEventListener('unload', () => ctx.revert());
  }

})();
