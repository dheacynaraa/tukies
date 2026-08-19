// Get all navigation links and section inside the navigation menu and main section
const navLinks = document.querySelectorAll("#navMenu a");
const sections = document.querySelectorAll("main section");

// Function to set the active navigation link
const setActiveLink = (id) => {
  navLinks.forEach((item) => {
    const isActive = item.getAttribute("href") === `#${id}`;
    item.classList.toggle("active", isActive);
  });
};

// Add click event to each navigation link
navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();

    const targetId = link.getAttribute("href");
    const targetSection = document.querySelector(targetId);

    if (targetId) {
      setActiveLink(targetId.replace("#", ""));
    }

    if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// Update active link based on scroll position & bottom detection
const updateActiveOnScroll = () => {
  // Keep Ulasan active while the footer is visible.
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 80) {
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

window.addEventListener('scroll', updateActiveOnScroll);
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
