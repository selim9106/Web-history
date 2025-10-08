// Navigation functionality
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("nav-menu");
const overlay = document.getElementById("overlay");

hamburger.addEventListener("click", () => {
  navMenu.classList.toggle("active");
  overlay.classList.toggle("active");
});

overlay.addEventListener("click", () => {
  navMenu.classList.remove("active");
  overlay.classList.remove("active");
});

// Vertical Timeline Functionality
class VerticalTimeline {
  constructor() {
    this.timelineItems = document.querySelectorAll(".timeline-item");
    this.eraIndicators = document.querySelectorAll(".era-indicator");
    this.currentActiveItem = null;
    this.currentActiveEra = null;

    this.init();
  }

  init() {
    this.setupIntersectionObserver();
    this.setupEraIndicatorClicks();
    this.setupScrollEffects();
    // this.setupMobileNavVisibility(); // Temporarily disabled for debugging

    // Initially show first item
    if (this.timelineItems.length > 0) {
      this.timelineItems[0].classList.add("visible", "active");
      this.currentActiveItem = this.timelineItems[0];
      this.updateActiveEra(1);
    }
  }

  setupIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: "-20% 0px -20% 0px",
      threshold: 0.5,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Make item visible
          entry.target.classList.add("visible");

          // Set as active (focus) item
          this.setActiveItem(entry.target);

          // Update era indicator
          const era = entry.target.dataset.era;
          if (era) {
            this.updateActiveEra(parseInt(era));
          }
        }
      });
    }, options);

    this.timelineItems.forEach((item) => {
      observer.observe(item);
    });
  }

  setActiveItem(item) {
    // Remove active from previous item
    if (this.currentActiveItem) {
      this.currentActiveItem.classList.remove("active");
    }

    // Set new active item
    item.classList.add("active");
    this.currentActiveItem = item;
  }

  updateActiveEra(eraNumber) {
    if (this.currentActiveEra === eraNumber) return;

    // Remove active from all era indicators
    this.eraIndicators.forEach((indicator) => {
      indicator.classList.remove("active");
    });

    // Remove active from all mobile nav items
    const mobileNavItems = document.querySelectorAll(".mobile-nav-item");
    mobileNavItems.forEach((item) => {
      item.classList.remove("active");
    });

    // Add active to current era indicator
    const activeIndicator = document.querySelector(
      `.era-indicator[data-era="${eraNumber}"]`
    );
    if (activeIndicator) {
      activeIndicator.classList.add("active");
    }

    // Add active to current mobile nav item
    const activeMobileNav = document.querySelector(
      `.mobile-nav-item[data-era="${eraNumber}"]`
    );
    if (activeMobileNav) {
      activeMobileNav.classList.add("active");
    }

    this.currentActiveEra = eraNumber;
  }

  setupEraIndicatorClicks() {
    // Handle regular era indicators
    this.eraIndicators.forEach((indicator) => {
      indicator.addEventListener("click", () => {
        const eraNumber = indicator.dataset.era;
        const firstItemOfEra = document.querySelector(
          `.timeline-item.era-${eraNumber}`
        );

        if (firstItemOfEra) {
          firstItemOfEra.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      });
    });

    // Handle mobile vertical navigation
    const mobileNavItems = document.querySelectorAll(".mobile-nav-item");
    mobileNavItems.forEach((item) => {
      item.addEventListener("click", () => {
        const eraNumber = item.dataset.era;
        const firstItemOfEra = document.querySelector(
          `.timeline-item.era-${eraNumber}`
        );

        if (firstItemOfEra) {
          firstItemOfEra.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      });
    });
  }

  setupScrollEffects() {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateScrollEffects = () => {
      const scrollY = window.scrollY;
      const scrollDirection = scrollY > lastScrollY ? "down" : "up";

      // Progressive reveal effect
      this.timelineItems.forEach((item, index) => {
        const rect = item.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Calculate visibility percentage
        const visibilityThreshold = windowHeight * 0.7;

        if (rect.top < visibilityThreshold && rect.bottom > 0) {
          if (!item.classList.contains("visible")) {
            // Add staggered animation delay
            setTimeout(() => {
              item.classList.add("visible");
            }, index * 100);
          }
        }
      });

      lastScrollY = scrollY;
      ticking = false;
    };

    window.addEventListener("scroll", () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollEffects);
        ticking = true;
      }
    });
  }

  setupMobileNavVisibility() {
    const mobileNav = document.querySelector(".mobile-vertical-nav");
    const timelineSection = document.querySelector(".timeline-section");

    if (!mobileNav || !timelineSection) return;

    // Only set up intersection observer on mobile screens
    if (window.innerWidth > 640) return;

    // Initially show the mobile nav (it should be visible by default on mobile)
    mobileNav.style.opacity = "0.4";
    mobileNav.style.visibility = "visible";
    mobileNav.style.pointerEvents = "all";

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Timeline section is visible, show mobile nav
            mobileNav.style.opacity = "0.4";
            mobileNav.style.visibility = "visible";
            mobileNav.style.pointerEvents = "all";
          } else {
            // Timeline section is not visible, hide mobile nav
            mobileNav.style.opacity = "0";
            mobileNav.style.visibility = "hidden";
            mobileNav.style.pointerEvents = "none";
          }
        });
      },
      {
        root: null,
        rootMargin: "-10% 0px -10% 0px",
        threshold: 0.1,
      }
    );

    observer.observe(timelineSection);
  }
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Advanced hover effects - only on desktop
if (window.innerWidth > 640) {
  const timelineItems = document.querySelectorAll(".timeline-item");
  timelineItems.forEach((item) => {
    const content = item.querySelector(".timeline-content");
    const marker = item.querySelector(".timeline-marker");

    if (content && marker) {
      item.addEventListener("mouseenter", () => {
        content.style.transform = "translateX(15px) scale(1.02)";
        marker.style.transform = "scale(1.2)";
      });

      item.addEventListener("mouseleave", () => {
        // Only reset if not the active item
        if (!item.classList.contains("active")) {
          content.style.transform = "translateX(0) scale(1)";
          marker.style.transform = "scale(1)";
        }
      });
    }
  });
}

// Keyboard navigation
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowDown" || e.key === "ArrowUp") {
    e.preventDefault();

    const currentActive = document.querySelector(".timeline-item.active");
    if (!currentActive) return;

    let targetItem;
    if (e.key === "ArrowDown") {
      targetItem = currentActive.nextElementSibling;
    } else {
      targetItem = currentActive.previousElementSibling;
    }

    if (targetItem && targetItem.classList.contains("timeline-item")) {
      targetItem.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }
});

// Initialize timeline when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new VerticalTimeline();
});

// URL Analyzer Functionality
class URLAnalyzer {
  constructor() {
    this.urlInput = document.getElementById("urlInput");
    this.analyzeBtn = document.getElementById("analyzeBtn");
    this.resultElements = {
      protocol: document.getElementById("resultProtocol"),
      domain: document.getElementById("resultDomain"),
      port: document.getElementById("resultPort"),
      path: document.getElementById("resultPath"),
      query: document.getElementById("resultQuery"),
      fragment: document.getElementById("resultFragment"),
    };

    this.init();
  }

  init() {
    this.analyzeBtn.addEventListener("click", () => this.analyzeURL());
    this.urlInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.analyzeURL();
      }
    });

    // Add hover effects to URL parts
    this.setupURLPartHovers();
  }

  analyzeURL() {
    const urlString = this.urlInput.value.trim();

    if (!urlString) {
      this.showError("Veuillez entrer une URL");
      return;
    }

    try {
      // Add protocol if missing
      const fullURL = urlString.startsWith("http")
        ? urlString
        : `https://${urlString}`;
      const url = new URL(fullURL);

      // Update results
      this.resultElements.protocol.textContent = url.protocol;
      this.resultElements.domain.textContent = url.hostname;
      this.resultElements.port.textContent =
        url.port || (url.protocol === "https:" ? "443" : "80");
      this.resultElements.path.textContent = url.pathname || "/";
      this.resultElements.query.textContent = url.search || "-";
      this.resultElements.fragment.textContent = url.hash || "-";

      // Show result section
      document.getElementById("urlResult").style.display = "block";

      // Add animation
      document.getElementById("urlResult").classList.add("show-result");
    } catch (error) {
      this.showError("URL invalide. Veuillez vérifier le format.");
    }
  }

  showError(message) {
    // Simple error handling - could be enhanced with better UI
    alert(message);
  }

  setupURLPartHovers() {
    const urlParts = document.querySelectorAll(".url-part");
    urlParts.forEach((part) => {
      part.addEventListener("mouseenter", () => {
        part.classList.add("highlighted");
      });
      part.addEventListener("mouseleave", () => {
        part.classList.remove("highlighted");
      });
    });
  }
}

// Initialize URL Analyzer when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new URLAnalyzer();
  initializeMobileNavVisibility();
});

// Hide mobile timeline navigation when outside timeline section
function initializeMobileNavVisibility() {
  const mobileNav = document.querySelector(".mobile-vertical-nav");
  const timelineSection = document.querySelector(".timeline-section");

  if (!mobileNav || !timelineSection) return;

  // Observer to track when timeline section is visible
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Timeline section is visible, show mobile nav
          mobileNav.style.display = "flex";
        } else {
          // Timeline section is not visible, hide mobile nav
          mobileNav.style.display = "none";
        }
      });
    },
    {
      threshold: 0.05, // Show/hide when 5% of timeline is visible
      rootMargin: "0px 0px -10% 0px", // Add some margin for better UX
    }
  );

  observer.observe(timelineSection);
}

// Add scroll-based fade effect for timeline fade top
window.addEventListener("scroll", () => {
  const fadeTop = document.querySelector(".timeline-fade-top");
  const scrollY = window.scrollY;

  if (fadeTop) {
    const opacity = Math.min(scrollY / 300, 1);
    fadeTop.style.opacity = opacity;
  }
});
