/**
 * 山田工務店 - Main JavaScript
 * Handles animations, slider, parallax, and interactions
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('[Main] DOM Content Loaded');
  
  // Initialize all components
  initHeaderScroll();
  initHeroSlider();
  initFadeInObserver();
  initParallax();
  initEventBanner();
  initMobileMenu();
  
  // デバッグ: 右側の余白をチェック
  setTimeout(function() {
    const bodyWidth = document.body.offsetWidth;
    const windowWidth = window.innerWidth;
    const htmlWidth = document.documentElement.offsetWidth;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    
    console.log('[Debug] Width check:', {
      bodyWidth: bodyWidth,
      windowWidth: windowWidth,
      htmlWidth: htmlWidth,
      difference: bodyWidth - windowWidth,
      scrollbarWidth: scrollbarWidth
    });
    
    // 右側の余白がある場合、警告を表示
    if (bodyWidth > windowWidth) {
      console.warn('[Debug] Right margin detected!', {
        bodyWidth: bodyWidth,
        windowWidth: windowWidth,
        excess: bodyWidth - windowWidth
      });
    }
    
    // メニューボタンの状態をチェック
    const menuToggle = document.querySelector('.header__menu-toggle');
    const nav = document.querySelector('.header__nav');
    if (menuToggle && nav) {
      console.log('[Debug] Menu elements:', {
        toggleDisplay: window.getComputedStyle(menuToggle).display,
        toggleVisibility: window.getComputedStyle(menuToggle).visibility,
        navDisplay: window.getComputedStyle(nav).display,
        navPosition: window.getComputedStyle(nav).position,
        navRight: window.getComputedStyle(nav).right,
        windowWidth: window.innerWidth
      });
    }
  }, 1000);
});

/**
 * Header scroll effect
 * Changes header background on scroll
 */
function initHeaderScroll() {
  const header = document.getElementById('header');
  let lastScrollY = 0;
  
  function updateHeader() {
    const scrollY = window.scrollY;
    
    if (scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    lastScrollY = scrollY;
  }
  
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader(); // Initial check
}

/**
 * Hero Image Slider
 * Automatic slide transition every 5 seconds
 */
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero__slide');
  let currentSlide = 0;
  const slideCount = slides.length;
  const slideInterval = 5000; // 5 seconds
  
  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
  }
  
  function nextSlide() {
    currentSlide = (currentSlide + 1) % slideCount;
    showSlide(currentSlide);
  }
  
  // Start automatic slideshow
  if (slideCount > 1) {
    setInterval(nextSlide, slideInterval);
  }
  
  // Preload images for smoother transitions
  slides.forEach(slide => {
    const img = slide.querySelector('img');
    if (img) {
      const preload = new Image();
      preload.src = img.src;
    }
  });
}

/**
 * Fade-in Animation Observer
 * Elements fade in when they enter the viewport
 * Transition: 0.8s opacity animation
 */
function initFadeInObserver() {
  const fadeElements = document.querySelectorAll('.fade-in');
  
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  };
  
  const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add delay for staggered effect within grids
        const parent = entry.target.parentElement;
        const siblings = parent ? parent.querySelectorAll('.fade-in') : [];
        const index = Array.from(siblings).indexOf(entry.target);
        const delay = index * 100; // 100ms stagger
        
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        
        fadeInObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  fadeElements.forEach(el => fadeInObserver.observe(el));
}

/**
 * Parallax Effect for Works Grid
 * Items move at different speeds on scroll
 */
function initParallax() {
  const parallaxItems = document.querySelectorAll('.parallax-item');
  
  if (parallaxItems.length === 0) return;
  
  // Assign random speed multipliers to each item
  const speeds = [];
  parallaxItems.forEach(() => {
    speeds.push(0.02 + Math.random() * 0.03); // 0.02 to 0.05
  });
  
  function updateParallax() {
    const scrollY = window.scrollY;
    
    parallaxItems.forEach((item, index) => {
      const rect = item.getBoundingClientRect();
      const itemCenter = rect.top + rect.height / 2;
      const windowCenter = window.innerHeight / 2;
      const distance = itemCenter - windowCenter;
      const translateY = distance * speeds[index];
      
      // Only apply when element is in view
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        item.style.transform = `translateY(${translateY}px)`;
      }
    });
  }
  
  // Use requestAnimationFrame for smooth animation
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateParallax();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/**
 * Event Banner
 * Can be closed by user
 */
function initEventBanner() {
  const banner = document.getElementById('eventBanner');
  
  if (!banner) return;
  
  // Optional: Add close button functionality
  // For now, banner stays visible
  
  // Hide banner when scrolling to footer
  const footer = document.querySelector('.footer');
  
  if (footer) {
    const footerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          banner.style.opacity = '0';
          banner.style.pointerEvents = 'none';
        } else {
          banner.style.opacity = '1';
          banner.style.pointerEvents = 'auto';
        }
      });
    }, { threshold: 0.1 });
    
    footerObserver.observe(footer);
  }
}

/**
 * Smooth scroll for anchor links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    
    if (href === '#') return;
    
    e.preventDefault();
    
    const target = document.querySelector(href);
    if (target) {
      const headerHeight = document.getElementById('header').offsetHeight;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

/**
 * Mobile menu toggle
 */
function initMobileMenu() {
  console.log('[Mobile Menu] Initializing...');
  
  const menuToggle = document.querySelector('.header__menu-toggle');
  const nav = document.querySelector('.header__nav');
  const body = document.body;

  console.log('[Mobile Menu] Elements found:', {
    menuToggle: !!menuToggle,
    nav: !!nav,
    menuToggleElement: menuToggle,
    navElement: nav
  });

  if (!menuToggle || !nav) {
    console.error('[Mobile Menu] Elements not found!', { menuToggle, nav });
    return;
  }

  // Create overlay element if it doesn't exist
  let overlay = document.querySelector('.mobile-menu-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'mobile-menu-overlay';
    body.appendChild(overlay);
    console.log('[Mobile Menu] Overlay created');
  }

  let isMenuOpen = false;

  function openMenu() {
    console.log('[Mobile Menu] Opening menu...');
    nav.classList.add('active');
    menuToggle.classList.add('active');
    overlay.classList.add('active');
    body.style.overflow = 'hidden';
    body.classList.add('menu-open');
    isMenuOpen = true;
    
    // デバッグ: メニューの状態を確認
    console.log('[Mobile Menu] Menu opened', {
      navClasses: nav.className,
      toggleClasses: menuToggle.className,
      overlayClasses: overlay.className,
      navStyle: window.getComputedStyle(nav).right
    });
  }

  function closeMenu() {
    console.log('[Mobile Menu] Closing menu...');
    nav.classList.remove('active');
    menuToggle.classList.remove('active');
    overlay.classList.remove('active');
    body.style.overflow = '';
    body.classList.remove('menu-open');
    isMenuOpen = false;
    
    console.log('[Mobile Menu] Menu closed', {
      navClasses: nav.className,
      toggleClasses: menuToggle.className
    });
  }

  // Add click event to toggle button - 複数の方法で確実に動作させる
  function handleToggleClick(e) {
    console.log('[Mobile Menu] Toggle button clicked', {
      isMenuOpen: isMenuOpen,
      event: e,
      target: e.target
    });
    e.preventDefault();
    e.stopPropagation();
    
    if (isMenuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }
  
  // 複数のイベントタイプで確実に動作させる
  menuToggle.addEventListener('click', handleToggleClick, { passive: false });
  menuToggle.addEventListener('touchend', function(e) {
    e.preventDefault();
    handleToggleClick(e);
  }, { passive: false });
  
  // デバッグ: ボタンがクリック可能か確認
  console.log('[Mobile Menu] Toggle button setup:', {
    display: window.getComputedStyle(menuToggle).display,
    visibility: window.getComputedStyle(menuToggle).visibility,
    pointerEvents: window.getComputedStyle(menuToggle).pointerEvents,
    zIndex: window.getComputedStyle(menuToggle).zIndex
  });

  // Close menu when clicking on overlay
  overlay.addEventListener('click', function(e) {
    console.log('[Mobile Menu] Overlay clicked');
    e.stopPropagation();
    closeMenu();
  });

  // Close menu when clicking on a link
  const navLinks = nav.querySelectorAll('.header__nav-link');
  console.log('[Mobile Menu] Found nav links:', navLinks.length);
  navLinks.forEach((link, index) => {
    link.addEventListener('click', function(e) {
      console.log('[Mobile Menu] Nav link clicked:', index);
      closeMenu();
    });
  });

  // Close menu on window resize (if resizing to desktop)
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      console.log('[Mobile Menu] Window resized:', window.innerWidth);
      if (window.innerWidth > 1024 && isMenuOpen) {
        closeMenu();
      }
    }, 250);
  });

  console.log('[Mobile Menu] Initialization complete');
}
