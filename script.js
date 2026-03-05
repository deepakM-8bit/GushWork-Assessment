document.addEventListener("DOMContentLoaded", () => {
  /* 1. NAVBAR — Products Dropdown Toggle */
  const productsDropdown = document.getElementById("products-dropdown");
  const productsToggle = document.getElementById("products-toggle");
  const dropdownMenu = document.getElementById("dropdown-menu");

  if (productsToggle && productsDropdown) {
    // Toggle dropdown on button click
    productsToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      productsDropdown.classList.toggle("open");
    });

    // Close dropdown when clicking anywhere else on the page
    document.addEventListener("click", (e) => {
      if (!productsDropdown.contains(e.target)) {
        productsDropdown.classList.remove("open");
      }
    });

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        productsDropdown.classList.remove("open");
      }
    });
  }

  /* 2. BREADCRUMB — Update product name when dropdown item is clicked */
  const breadcrumbCurrent = document.getElementById("breadcrumb-product");
  const dropdownItems = document.querySelectorAll(".dropdown-item");

  dropdownItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();

      // Get the product name from data attribute
      const productName = item.getAttribute("data-product");

      // Update the breadcrumb text
      if (breadcrumbCurrent && productName) {
        breadcrumbCurrent.textContent = productName;
      }

      // Close the dropdown after selection
      productsDropdown.classList.remove("open");
    });
  });

  /* 3. MOBILE HAMBURGER — Toggle mobile nav*/
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("nav-links");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("mobile-open");

      // Animate hamburger → X
      const spans = hamburger.querySelectorAll("span");
      if (navLinks.classList.contains("mobile-open")) {
        spans[0].style.transform = "rotate(45deg) translate(5px, 5px)";
        spans[1].style.opacity = "0";
        spans[2].style.transform = "rotate(-45deg) translate(5px, -5px)";
      } else {
        spans[0].style.transform = "";
        spans[1].style.opacity = "";
        spans[2].style.transform = "";
      }
    });
  }

  /* STICKY ACTION BAR  */

  /* STICKY ACTION BAR
   Appears below navbar after scrolling past hero */
  const stickyBar = document.getElementById("sticky-action-bar");
  const heroSection = document.getElementById("hero");
  const navbar = document.getElementById("main-header");

  let lastScroll = window.scrollY;

  window.addEventListener(
    "scroll",
    () => {
      const heroBottom = heroSection.getBoundingClientRect().bottom;
      const currentScroll = window.scrollY;

      const scrollingDown = currentScroll > lastScroll;
      const scrollingUp = currentScroll < lastScroll;

      // USER BELOW HERO
      if (heroBottom <= 0) {
        stickyBar.classList.add("visible");

        if (scrollingDown) {
          navbar.classList.add("nav-hidden");
          document.body.classList.add("navbar-hidden");
        }

        if (scrollingUp) {
          navbar.classList.remove("nav-hidden");
          document.body.classList.remove("navbar-hidden");
        }
      }

      // USER INSIDE HERO
      else {
        stickyBar.classList.remove("visible");
        navbar.classList.remove("nav-hidden");
      }

      lastScroll = currentScroll;
    },
    { passive: true },
  );

  /*  IMAGE CAROUSEL — Prev/Next buttons + Thumbnail clicks */
  // All carousel images
  const carouselImages = [
    {
      src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=500&fit=crop",
      alt: "HDPE Pipe - Premium Quality View 1",
    },
    {
      src: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&h=500&fit=crop",
      alt: "HDPE Pipe - Premium Quality View 2",
    },

    {
      src: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&h=500&fit=crop",
      alt: "HDPE Pipe - Premium Quality View 3",
    },
    {
      src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=500&fit=crop",
      alt: "HDPE Pipe - Premium Quality View 4",
    },
  ];

  let currentIndex = 0;

  const mainImage = document.getElementById("main-product-image");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const thumbnails = document.querySelectorAll(".thumb");

  /**
   * Updates the main image and highlights the active thumbnail.
   * @param {number} index - The target slide index
   */
  function goToSlide(index) {
    // Clamp index within bounds
    currentIndex = (index + carouselImages.length) % carouselImages.length;

    if (mainImage) {
      mainImage.src = carouselImages[currentIndex].src;
      mainImage.alt = carouselImages[currentIndex].alt;
    }

    // Update active thumbnail highlight
    thumbnails.forEach((thumb, i) => {
      thumb.classList.toggle("active", i === currentIndex);
    });
  }

  // Prev button
  if (prevBtn) {
    prevBtn.addEventListener("click", () => goToSlide(currentIndex - 1));
  }

  // Next button
  if (nextBtn) {
    nextBtn.addEventListener("click", () => goToSlide(currentIndex + 1));
  }

  // Thumbnail clicks
  thumbnails.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      const idx = parseInt(thumb.getAttribute("data-index"), 10);
      goToSlide(idx);
    });
  });

  /*  IMAGE ZOOM — Lens + Portal on desktop hover  */
  const mainContainer = document.getElementById("main-image-container");
  const lens = document.getElementById("zoom-lens");
  const portal = document.getElementById("zoom-portal");

  if (mainContainer && lens && portal && mainImage) {
    // Show lens & portal when mouse enters the image container
    mainContainer.addEventListener("mouseenter", () => {
      if (window.innerWidth < 1400) return; // Desktop only

      lens.style.display = "block";
      portal.style.display = "block";

      // Set background image in portal to the current main image
      portal.style.backgroundImage = `url('${mainImage.src}')`;

      // Scale ratio: how much bigger the portal is vs the lens
      const cx = portal.offsetWidth / lens.offsetWidth;
      const cy = portal.offsetHeight / lens.offsetHeight;

      // Make the background image inside portal larger by that ratio
      portal.style.backgroundSize = `${mainImage.offsetWidth * cx}px ${mainImage.offsetHeight * cy}px`;
    });

    // Hide lens & portal when mouse leaves
    mainContainer.addEventListener("mouseleave", () => {
      lens.style.display = "none";
      portal.style.display = "none";
    });

    // Track mouse movement — move the lens and update portal background position
    mainContainer.addEventListener("mousemove", moveLens);

    function moveLens(e) {
      e.preventDefault();

      // Get cursor position relative to the image element
      const rect = mainImage.getBoundingClientRect();
      let x = e.clientX - rect.left - lens.offsetWidth / 2;
      let y = e.clientY - rect.top - lens.offsetHeight / 2;

      // Boundary clamp — keep lens inside image bounds
      x = Math.max(0, Math.min(x, mainImage.offsetWidth - lens.offsetWidth));
      y = Math.max(0, Math.min(y, mainImage.offsetHeight - lens.offsetHeight));

      // Position the lens
      lens.style.left = x + "px";
      lens.style.top = y + "px";

      // Move portal background in the opposite direction (magnified)
      const cx = portal.offsetWidth / lens.offsetWidth;
      const cy = portal.offsetHeight / lens.offsetHeight;
      portal.style.backgroundPosition = `-${x * cx}px -${y * cy}px`;
    }
  }

  /*  MODAL SYSTEM — Quote & Datasheet modals*/
  const datasheetModal = document.getElementById("datasheet-modal");
  const quoteModal = document.getElementById("quote-modal");

  // Selectors for all buttons that open each modal
  const openDatasheetBtns = document.querySelectorAll(
    "#trigger-datasheet-hero, .trigger-datasheet-btn",
  );
  const openQuoteBtns = document.querySelectorAll(
    ".open-quote-modal, #trigger-quote-hero",
  );
  const closeBtns = document.querySelectorAll(".modal-close");

  /** Opens a modal overlay */
  function openModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.add("active");
    document.body.style.overflow = "hidden"; // Lock background scroll
  }

  /** Closes all open modals */
  function closeAllModals() {
    document.querySelectorAll(".modal-overlay").forEach((modal) => {
      modal.classList.remove("active");
    });
    document.body.style.overflow = ""; // Restore scroll
  }

  // Open datasheet modal
  openDatasheetBtns.forEach((btn) =>
    btn.addEventListener("click", () => openModal(datasheetModal)),
  );

  // Open quote modal
  openQuoteBtns.forEach((btn) =>
    btn.addEventListener("click", () => openModal(quoteModal)),
  );

  // Close buttons (X)
  closeBtns.forEach((btn) => btn.addEventListener("click", closeAllModals));

  // Close when clicking the dark backdrop
  document.querySelectorAll(".modal-overlay").forEach((overlay) => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeAllModals();
    });
  });

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAllModals();
  });

  /* FAQ ACCORDION */
  const accordionItems = document.querySelectorAll(".accordion-item");

  accordionItems.forEach((item) => {
    const header = item.querySelector(".accordion-header");
    const content = item.querySelector(".accordion-content");

    if (!header || !content) return;

    header.addEventListener("click", () => {
      const isOpen = item.classList.contains("active");

      // Close all open accordions first (single-open behaviour)
      accordionItems.forEach((other) => {
        other.classList.remove("active");
        const otherContent = other.querySelector(".accordion-content");
        if (otherContent) otherContent.style.maxHeight = null;
      });

      // If the clicked item wasn't open, open it now
      if (!isOpen) {
        item.classList.add("active");
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  });

  // Applications
  const slider = document.querySelector(".horizontal-scroll-wrapper");
  const prev = document.querySelector(".apps-prev");
  const next = document.querySelector(".apps-next");

  next.addEventListener("click", () => {
    slider.scrollBy({ left: 320, behavior: "smooth" });
  });

  prev.addEventListener("click", () => {
    slider.scrollBy({ left: -320, behavior: "smooth" });
  });

  /*  MANUFACTURING PROCESS TABS */
  const tabs = document.querySelectorAll(".tab-btn");
  const panes = document.querySelectorAll(".tab-pane");

  let currentIdx = 0;

  function showTab(index) {
    tabs.forEach((btn) => btn.classList.remove("active"));
    panes.forEach((p) => p.classList.remove("active"));

    tabs[index].classList.add("active");
    panes[index].classList.add("active");

    currentIdx = index;
  }

  tabs.forEach((btn, i) => {
    btn.addEventListener("click", () => {
      showTab(i);
    });
  });

  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("tab-next")) {
      let next = currentIdx + 1;

      if (next < tabs.length) {
        showTab(next);
      }
    }

    if (e.target.classList.contains("tab-prev")) {
      let prev = currentIdx - 1;

      if (prev >= 0) {
        showTab(prev);
      }
    }
  });
});
