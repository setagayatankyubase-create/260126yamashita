/**
 * 鳥山工務店 - Main JavaScript
 * Handles animations, slider, parallax, and interactions
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all components
  initHeaderScroll();
  initHeroSlider();
  initFadeInObserver();
  initParallax();
  initEventBanner();
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
 * Mobile menu toggle (if needed)
 */
const menuToggle = document.querySelector('.header__menu-toggle');
const nav = document.querySelector('.header__nav');

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
    menuToggle.classList.toggle('active');
  });
}
