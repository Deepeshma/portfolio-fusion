document.addEventListener("DOMContentLoaded", function () {
  // Mobile Menu Toggle
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener("click", function () {
      this.classList.toggle("active");
      navLinks.classList.toggle("show"); // Changed from 'active' to 'show' to match CSS
      document.body.classList.toggle("menu-open"); // Add body class for overlay

      // Update aria-expanded
      const expanded = this.getAttribute("aria-expanded") === "true" || false;
      this.setAttribute("aria-expanded", !expanded);

      // Toggle menu animation (if you're using these specific classes)
      const bars = this.querySelectorAll(".bar");
      if (bars.length >= 3) {
        bars[0].classList.toggle("rotate-down");
        bars[1].classList.toggle("fade-out");
        bars[2].classList.toggle("rotate-up");
      }
    });
  }

  // Close mobile menu when clicking outside
  document.addEventListener("click", function (event) {
    if (
      navLinks.classList.contains("show") &&
      !event.target.closest(".nav-links") &&
      !event.target.closest(".mobile-menu-toggle")
    ) {
      navLinks.classList.remove("show"); // Changed from 'active' to 'show'
      mobileMenuToggle.classList.remove("active");
      mobileMenuToggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open"); // Remove body class
    }
  });

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      // Close mobile menu if open
      if (navLinks.classList.contains("show")) {
        // Changed from 'active' to 'show'
        navLinks.classList.remove("show");
        mobileMenuToggle.classList.remove("active");
        mobileMenuToggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("menu-open"); // Remove body class
      }

      const targetId = this.getAttribute("href").substring(1);
      if (!targetId) return; // Handle empty href="#"

      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        // Add offset for fixed header
        const headerHeight =
          document.querySelector(".glass-header").offsetHeight;
        const targetPosition =
          targetElement.getBoundingClientRect().top +
          window.pageYOffset -
          headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });

        // Update active nav link
        document.querySelectorAll(".nav-links a").forEach((link) => {
          link.classList.remove("active");
          link.removeAttribute("aria-current");
        });
        this.classList.add("active");
        this.setAttribute("aria-current", "page");
      }
    });
  });

  // Add scroll event listener to update active links based on scroll position
  window.addEventListener("scroll", function () {
    // Header shrink effect
    const header = document.querySelector(".glass-header");
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    // Highlight active section in navigation
    const scrollPosition = window.scrollY;
    const headerHeight = header.offsetHeight;

    document.querySelectorAll("section[id]").forEach((section) => {
      const sectionTop = section.offsetTop - headerHeight - 10;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        document.querySelectorAll(".nav-links a").forEach((link) => {
          link.classList.remove("active");
          link.removeAttribute("aria-current");

          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
          }
        });
      }
    });
  });

  // Close mobile menu on window resize
  window.addEventListener("resize", function () {
    if (window.innerWidth > 768 && navLinks.classList.contains("show")) {
      navLinks.classList.remove("show");
      mobileMenuToggle.classList.remove("active");
      mobileMenuToggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
    }
  });

  // Project Filtering
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Update active button
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");

      const filterValue = this.getAttribute("data-filter");

      projectCards.forEach((card) => {
        // Show all projects if filter is 'all'
        if (filterValue === "all") {
          card.style.display = "block";
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
          }, 100);
        } else {
          // Filter by category
          if (card.getAttribute("data-category") === filterValue) {
            card.style.display = "block";
            setTimeout(() => {
              card.style.opacity = "1";
              card.style.transform = "translateY(0)";
            }, 100);
          } else {
            card.style.opacity = "0";
            card.style.transform = "translateY(20px)";
            setTimeout(() => {
              card.style.display = "none";
            }, 300);
          }
        }
      });
    });
  });

  // Testimonial Slider
  let currentSlide = 0;
  const testimonials = document.querySelectorAll(".testimonial");
  const dots = document.querySelectorAll(".dot");
  const prevBtn = document.querySelector(".prev-testimonial");
  const nextBtn = document.querySelector(".next-testimonial");

  function showSlide(n) {
    // Loop back to start/end when reaching the limits
    if (n >= testimonials.length) currentSlide = 0;
    if (n < 0) currentSlide = testimonials.length - 1;

    // Hide all testimonials
    testimonials.forEach((testimonial) => {
      testimonial.style.transform = "translateX(-100%)";
      testimonial.style.opacity = "0";
      testimonial.style.display = "none";
    });

    // Deactivate all dots
    dots.forEach((dot) => {
      dot.classList.remove("active");
    });

    // Show current testimonial
    testimonials[currentSlide].style.display = "block";
    setTimeout(() => {
      testimonials[currentSlide].style.transform = "translateX(0)";
      testimonials[currentSlide].style.opacity = "1";
    }, 100);

    // Activate current dot
    dots[currentSlide].classList.add("active");
  }

  // Initialize slider
  if (testimonials.length > 0) {
    showSlide(currentSlide);

    // Set up event listeners for buttons
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        currentSlide--;
        showSlide(currentSlide);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        currentSlide++;
        showSlide(currentSlide);
      });
    }

    // Set up event listeners for dots
    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        currentSlide = index;
        showSlide(currentSlide);
      });
    });

    // Auto-advance slides every 5 seconds
    setInterval(() => {
      currentSlide++;
      showSlide(currentSlide);
    }, 5000);
  }

  // Form validation
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Basic form validation
      let valid = true;
      const name = document.getElementById("name");
      const email = document.getElementById("email");
      const subject = document.getElementById("subject");
      const message = document.getElementById("message");

      // Reset previous error states
      [name, email, subject, message].forEach((field) => {
        field.style.borderColor = "";
      });

      // Validate required fields
      if (!name.value.trim()) {
        name.style.borderColor = "var(--danger-color)";
        valid = false;
      }

      if (!email.value.trim() || !isValidEmail(email.value)) {
        email.style.borderColor = "var(--danger-color)";
        valid = false;
      }

      if (!subject.value.trim()) {
        subject.style.borderColor = "var(--danger-color)";
        valid = false;
      }

      if (!message.value.trim()) {
        message.style.borderColor = "var(--danger-color)";
        valid = false;
      }

      if (valid) {
        // Normally would submit form, but for this demo just show success message
        const submitButton = contactForm.querySelector(".submit-button");
        const originalButtonText = submitButton.innerHTML;

        submitButton.innerHTML = "<span>Sending...</span>";
        submitButton.disabled = true;

        // Simulate form submission
        setTimeout(() => {
          contactForm.reset();
          submitButton.innerHTML =
            '<span>Message Sent!</span> <i class="fas fa-check"></i>';
          submitButton.style.backgroundColor = "var(--success-color)";

          setTimeout(() => {
            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = false;
            submitButton.style.backgroundColor = "";
          }, 3000);
        }, 1500);
      }
    });
  }

  function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  // Navbar scroll effect
  const header = document.querySelector(".glass-header");

  window.addEventListener("scroll", function () {
    if (window.scrollY > 100) {
      header.classList.add("header-scrolled");
    } else {
      header.classList.remove("header-scrolled");
    }
  });

  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        // Stop observing once animation is triggered
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Elements to animate on scroll
  const elementsToAnimate = document.querySelectorAll(
    ".skill-item, .project-card, .timeline-item, .testimonial"
  );
  elementsToAnimate.forEach((element) => {
    observer.observe(element);
  });

  // Update active nav link based on scroll position
  const sections = document.querySelectorAll("section[id]");

  window.addEventListener("scroll", function () {
    let current = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;

      if (
        window.scrollY >= sectionTop &&
        window.scrollY < sectionTop + sectionHeight
      ) {
        current = section.getAttribute("id");
      }
    });

    document.querySelectorAll(".nav-links a").forEach((link) => {
      link.classList.remove("active");
      link.removeAttribute("aria-current");

      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      }
    });
  });

  // Animate typing effect for hero section
  const typedTextElement = document.querySelector(".typed-text");

  if (typedTextElement) {
    const textArray = [
      "Front-End Developer",
      "UI/UX Enthusiast",
      "JavaScript Wizard",
      "Web Designer",
    ];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeText() {
      const currentText = textArray[textIndex];

      if (isDeleting) {
        typedTextElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
      } else {
        typedTextElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
      }

      if (!isDeleting && charIndex === currentText.length) {
        isDeleting = true;
        typingSpeed = 1500; // Pause at the end of typing
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % textArray.length;
        typingSpeed = 500; // Pause before typing next string
      }

      setTimeout(typeText, typingSpeed);
    }

    setTimeout(typeText, 1000);
  }

  // Initialize code animation in hero section
  const codeElement = document.querySelector(".code-animation code");

  if (codeElement) {
    // Highlight code syntax
    const codeContent = codeElement.innerHTML;
    const highlightedCode = codeContent
      .replace(/(&lt;[^&]*&gt;)/g, '<span class="keyword">$1</span>')
      .replace(/"([^"]*)"/g, '<span class="string">"$1"</span>')
      .replace(
        /\b(const|function|return)\b/g,
        '<span class="keyword">$1</span>'
      )
      .replace(
        /\b(skills|passion|createExperience|innovation)\b/g,
        '<span class="variable">$1</span>'
      );

    codeElement.innerHTML = highlightedCode;
  }

  // Add header-scrolled class if page is loaded after scroll position
  if (window.scrollY > 100) {
    header.classList.add("header-scrolled");
  }
});
