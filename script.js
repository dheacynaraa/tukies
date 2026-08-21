// === NAVIGATION & SMOOTH SCROLLING ===
const navLinks = document.querySelectorAll("#navMenu a");
const sections = document.querySelectorAll("main section");

// Function to set the active navigation link
const setActiveLink = (id) => {
  navLinks.forEach((item) => {
    const isActive = item.getAttribute("href") === `#${id}`;
    item.classList.toggle("active", isActive);
  });
};

// Smooth Programmatic Scroll: Langsung meluncur di milidetik pertama, pelan, anggun & lembut
let scrollAnimId = null;

const smoothScrollTo = (targetY, duration = 1050) => {
  if (scrollAnimId) {
    cancelAnimationFrame(scrollAnimId);
    scrollAnimId = null;
  }

  const startY = window.pageYOffset || document.documentElement.scrollTop;
  const distance = targetY - startY;
  if (Math.abs(distance) < 2) return;

  let startTime = null;

  // easeOutCubic: Kecepatan awal langsung aktif (0ms lag), meluncur pelan dan mendarat sangat lembut
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  const cleanupListeners = () => {
    window.removeEventListener('wheel', cancelOnUserInteraction);
    window.removeEventListener('touchmove', cancelOnUserInteraction);
  };

  const cancelOnUserInteraction = () => {
    if (scrollAnimId) {
      cancelAnimationFrame(scrollAnimId);
      scrollAnimId = null;
    }
    cleanupListeners();
  };

  window.addEventListener('wheel', cancelOnUserInteraction, { passive: true });
  window.addEventListener('touchmove', cancelOnUserInteraction, { passive: true });

  const step = (currentTime) => {
    if (!startTime) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const ease = easeOutCubic(progress);

    window.scrollTo(0, startY + distance * ease);

    if (timeElapsed < duration) {
      scrollAnimId = requestAnimationFrame(step);
    } else {
      scrollAnimId = null;
      cleanupListeners();
    }
  };

  scrollAnimId = requestAnimationFrame(step);
};

// Attach smooth scroll to all internal anchor links
const initSmoothScrollLinks = () => {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        event.preventDefault();

        if (targetId.startsWith("#")) {
          setActiveLink(targetId.replace("#", ""));
        }

        const navbar = document.querySelector(".navbar");
        const navHeight = navbar ? navbar.offsetHeight : 70;
        const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - (navHeight - 10);

        // Durasi 1050ms agar scrolling meluncur pelan, santai, dan anggun
        smoothScrollTo(Math.max(0, targetPosition), 1050);
      }
    });
  });
};

initSmoothScrollLinks();

// Update active link based on scroll position & bottom detection with rAF throttling
let isScrollThrottled = false;
const updateActiveOnScroll = () => {
  // Keep Ulasan active while the footer is visible
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 90) {
    const reviewSection = document.querySelector("#review");
    if (reviewSection) {
      setActiveLink(reviewSection.id);
      return;
    }
  }

  const scrollPosition = window.scrollY + window.innerHeight / 3;
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 120;
    const sectionHeight = section.offsetHeight;
    if (
      window.scrollY >= sectionTop &&
      window.scrollY < sectionTop + sectionHeight
    ) {
      setActiveLink(section.id);
    }
  });
};

window.addEventListener('scroll', () => {
  if (!isScrollThrottled) {
    window.requestAnimationFrame(() => {
      updateActiveOnScroll();
      isScrollThrottled = false;
    });
    isScrollThrottled = true;
  }
}, { passive: true });

window.addEventListener('load', updateActiveOnScroll);

// === HAMBURGER MENU (MOBILE) ===
const navToggle = document.getElementById('navToggle');
const navMenu   = document.getElementById('navMenu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close menu when a nav link is clicked
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
      navMenu.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// === SCROLL REVEAL ANIMATION (INTERSECTION OBSERVER) ===
const initScrollReveal = () => {
  const revealElements = document.querySelectorAll('.reveal');

  if (!revealElements.length) return;

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.08,
      rootMargin: '0px 0px -30px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('visible'));
  }
};

// Initialize scroll reveal on DOM load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initScrollReveal);
} else {
  initScrollReveal();
}
