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

// Create an observer to detect which section is currently visible
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setActiveLink(entry.target.id);
      }
    });
  },
  {
    root: null,
    rootMargin: "-40% 0px -50% 0px",
    threshold: 0,
  },
);

// Observe every section on the page
sections.forEach((section) => sectionObserver.observe(section));
