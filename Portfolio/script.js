/*
  =========================================
  PREMIUM PORTFOLIO INTERACTION ENGINE (script.js)
  =========================================

  CUSTOMIZATION GUIDE:
  - Scroll-linked active classes and stats are automatically detected.
  - The dynamic counter script searches for '.stat-number' tags and counts up to the value defined in the 'data-target' attribute in HTML.
  - You can change the count duration by updating 'countDuration' in the counter settings.
*/

document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // 1. DYNAMIC HEADER SCROLL & BACKDROP EFFECT
  // ==========================================
  const navbar = document.querySelector('.navbar');
  const navScrollThreshold = 50; // Change this value to adjust when the navbar switches styles on scroll (in px)
  
  function handleNavbarScroll() {
    if (window.scrollY > navScrollThreshold) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  
  window.addEventListener('scroll', handleNavbarScroll);
  // Run once initially to check scroll state on load
  handleNavbarScroll();


  // ==========================================
  // 2. TOP HORIZONTAL SCROLL PROGRESS INDICATOR
  // ==========================================
  const progressIndicator = document.querySelector('.scroll-progress');
  
  function updateScrollProgress() {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      const scrollPercent = (window.scrollY / totalHeight) * 100;
      progressIndicator.style.width = `${scrollPercent}%`;
    }
  }
  
  window.addEventListener('scroll', updateScrollProgress);


  // ==========================================
  // 3. RESPONSIVE MOBILE NAVIGATION MENU
  // ==========================================
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  
  function toggleMobileMenu() {
    menuToggle.classList.toggle('active');
    mobileNav.classList.toggle('active');
    
    // Toggle scroll lock on the body so user doesn't scroll background when mobile menu is open
    document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
  }
  
  menuToggle.addEventListener('click', toggleMobileMenu);
  
  // Close menu when a link inside mobile nav is clicked
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileNav.classList.contains('active')) {
        toggleMobileMenu();
      }
    });
  });


  // ==========================================
  // 4. ACTIVE SECTION LINK HIGHLIGHT ON SCROLL
  // ==========================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  function highlightActiveSection() {
    const scrollPosition = window.scrollY + 200; // Offset to trigger before section reaches top
    
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
  
  window.addEventListener('scroll', highlightActiveSection);


  // ==========================================
  // 5. COUNTER STATS ANIMATION (TICK-UP SCROLL)
  // ==========================================
  const statNumbers = document.querySelectorAll('.stat-number');
  const countDuration = 2000; // Length of count animation in milliseconds (2 seconds)
  let countersAnimated = false; // Flag to prevent multiple triggering
  
  function animateCounters() {
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'), 10);
      const start = 0;
      let startTime = null;
      
      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / countDuration, 1);
        const currentCount = Math.floor(progress * (target - start) + start);
        
        stat.innerText = currentCount;
        
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          stat.innerText = target; // Ensure it ends precisely on target
        }
      }
      
      window.requestAnimationFrame(step);
    });
  }
  
  // Check if counter section is in viewport
  function checkCounterViewport() {
    const statsSection = document.querySelector('.stats-grid');
    if (!statsSection || countersAnimated) return;
    
    const sectionPosition = statsSection.getBoundingClientRect();
    const triggerHeight = window.innerHeight - 100; // Trigger slightly before it is fully in view
    
    if (sectionPosition.top < triggerHeight) {
      countersAnimated = true; // Mark as done
      animateCounters();
    }
  }
  
  window.addEventListener('scroll', checkCounterViewport);
  // Check once on load in case the user reloads while already scrolled down
  checkCounterViewport();


  // ==========================================
  // 6. CONTACT FORM INTERACTIVE SUCCESS STATE
  // ==========================================
  const contactForm = document.getElementById('portfolioContactForm');
  const formMessage = document.getElementById('formMessage');
  
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault(); // Stop page reload
      
      // Get button and load state
      const submitBtn = contactForm.querySelector('.submit-btn');
      const origBtnText = submitBtn.innerHTML;
      
      // Visual feedback loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending message...';
      
      // Mock Network/Server Latency (1.5 seconds)
      setTimeout(() => {
        // Reset form inputs
        contactForm.reset();
        
        // Show interactive notification
        formMessage.classList.add('success');
        formMessage.innerText = 'Thank you! Your message has been sent successfully. I will get back to you shortly.';
        
        // Restore submit button
        submitBtn.disabled = false;
        submitBtn.innerHTML = origBtnText;
        
        // Auto hide success banner after 6 seconds
        setTimeout(() => {
          formMessage.style.opacity = '0';
          setTimeout(() => {
            formMessage.classList.remove('success');
            formMessage.style.opacity = '1';
          }, 400);
        }, 6000);
        
      }, 1500);
    });
  }
  
  // ==========================================
  // 7. SMOOTH INTER-PAGE NAV TRANSITIONS
  // ==========================================
  // Automatically anchors navigation items with smooth scrolls
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        // Calculate offset for navbar height
        const navbarHeight = document.querySelector('.navbar').offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight + 10;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ==========================================
  // 8. INTERACTIVE CURSOR-FOLLOWING DOT GRID
  // ==========================================
  const canvas = document.getElementById('cursor-dots');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    
    let dots = [];
    const spacing = 30; // Grid cell spacing in pixels
    const dotBaseRadius = 1.2; // Small base dot size
    const dotMaxRadius = 2.5;  // Magnified dot size when hovered
    const influenceRadius = 120; // How close mouse must be to trigger sizing/glowing
    
    // Mouse coords & dynamic tracking
    let mouse = { x: -1000, y: -1000, active: false };
    let currentMouse = { x: -1000, y: -1000 };
    const lerpFactor = 0.08; // Smooth dampening delay
    
    // Dot properties
    function initDots() {
      dots = [];
      const width = canvas.width;
      const height = canvas.height;
      
      for (let x = spacing / 2; x < width; x += spacing) {
        for (let y = spacing / 2; y < height; y += spacing) {
          dots.push({
            origX: x,
            origY: y,
            x: x,
            y: y,
            radius: dotBaseRadius,
            opacity: 0.12
          });
        }
      }
    }
    
    function resizeCanvas() {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
      
      initDots();
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Mouse event handlers
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    });
    
    window.addEventListener('mouseleave', () => {
      mouse.active = false;
    });
    
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
        mouse.active = true;
      }
    });
    
    window.addEventListener('touchend', () => {
      mouse.active = false;
    });
    
    // Buttery-smooth animation tick loop
    function tick() {
      // Clear screen
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      
      // Interpolate mouse coordinates (Lerp) for smooth easing/fluid lag effect
      if (mouse.active) {
        if (currentMouse.x === -1000) {
          currentMouse.x = mouse.x;
          currentMouse.y = mouse.y;
        } else {
          currentMouse.x += (mouse.x - currentMouse.x) * lerpFactor;
          currentMouse.y += (mouse.y - currentMouse.y) * lerpFactor;
        }
      } else {
        // Slowly ease mouse away when it leaves screen
        currentMouse.x += (-1000 - currentMouse.x) * lerpFactor;
        currentMouse.y += (-1000 - currentMouse.y) * lerpFactor;
      }
      
      // Draw grid
      dots.forEach(dot => {
        const dx = currentMouse.x - dot.origX;
        const dy = currentMouse.y - dot.origY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        let targetRadius = dotBaseRadius;
        let targetOpacity = 0.08;
        let targetColor = 'rgba(255, 255, 255, '; // Default subtle white
        
        // Displacement variables (subtle magnetic pull)
        let targetX = dot.origX;
        let targetY = dot.origY;
        
        if (dist < influenceRadius) {
          const factor = 1 - dist / influenceRadius; // 0 to 1
          
          // Hover overrides
          targetRadius = dotBaseRadius + (dotMaxRadius - dotBaseRadius) * factor;
          targetOpacity = 0.08 + (0.85 - 0.08) * factor;
          
          // Interpolate to electric accent blue
          targetColor = `rgba(13, 99, 248, `;
          
          // Magnetic displacement effect (dots pull slightly toward cursor)
          const angle = Math.atan2(dy, dx);
          const pullIntensity = 4 * factor; // Pull up to 4px maximum
          targetX = dot.origX + Math.cos(angle) * pullIntensity;
          targetY = dot.origY + Math.sin(angle) * pullIntensity;
        }
        
        // Easing interpolation for dot positions and visual states
        dot.x += (targetX - dot.x) * 0.15;
        dot.y += (targetY - dot.y) * 0.15;
        dot.radius += (targetRadius - dot.radius) * 0.15;
        dot.opacity += (targetOpacity - dot.opacity) * 0.15;
        
        // Render dot
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${targetColor}${dot.opacity})`;
        ctx.fill();
      });
      
      window.requestAnimationFrame(tick);
    }
    
    // Launch loop
    window.requestAnimationFrame(tick);
  }

});
