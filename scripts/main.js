/**
 * 山田工務店 - Main JavaScript
 * Handles animations, slider, parallax, and interactions
 */

// デバッグモードの判定（本番環境では無効化）
const DEBUG_MODE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname.includes('localhost');

function debugLog(...args) {
  if (DEBUG_MODE) {
    console.log(...args);
  }
}

function debugError(...args) {
  if (DEBUG_MODE) {
    console.error(...args);
  } else {
    // 本番環境ではエラーのみ記録（必要に応じてエラー追跡サービスに送信）
    console.error(...args);
  }
}

function debugWarn(...args) {
  if (DEBUG_MODE) {
    console.warn(...args);
  }
}

document.addEventListener('DOMContentLoaded', function() {
  debugLog('========================================');
  debugLog('[Main] DOM Content Loaded');
  debugLog('========================================');
  
  // 二重スクロール問題の診断
  checkDoubleScroll();
  
  // Initialize all components
  initHeaderScroll();
  initHeroSlider();
  initFadeInObserver();
  initParallax();
  initEventBanner();
  initMobileMenu();
  
  // 詳細なデバッグ: 右側の余白をチェック
  setTimeout(function() {
    debugLog('========================================');
    debugLog('[Debug] 詳細な幅チェック開始');
    debugLog('========================================');
    
    const bodyWidth = document.body.offsetWidth;
    const bodyClientWidth = document.body.clientWidth;
    const bodyScrollWidth = document.body.scrollWidth;
    const windowWidth = window.innerWidth;
    const htmlWidth = document.documentElement.offsetWidth;
    const htmlClientWidth = document.documentElement.clientWidth;
    const htmlScrollWidth = document.documentElement.scrollWidth;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    
    debugLog('[Debug] 基本サイズ情報:', {
      bodyOffsetWidth: bodyWidth,
      bodyClientWidth: bodyClientWidth,
      bodyScrollWidth: bodyScrollWidth,
      windowInnerWidth: windowWidth,
      htmlOffsetWidth: htmlWidth,
      htmlClientWidth: htmlClientWidth,
      htmlScrollWidth: htmlScrollWidth,
      scrollbarWidth: scrollbarWidth,
      bodyExcess: bodyWidth - windowWidth,
      htmlExcess: htmlWidth - windowWidth
    });
    
    // ヘッダーの詳細チェック
    const header = document.querySelector('.header');
    const headerInner = document.querySelector('.header__inner');
    if (header) {
      const headerStyles = window.getComputedStyle(header);
      debugLog('[Debug] ヘッダー詳細:', {
        offsetWidth: header.offsetWidth,
        clientWidth: header.clientWidth,
        scrollWidth: header.scrollWidth,
        offsetLeft: header.offsetLeft,
        offsetRight: windowWidth - (header.offsetLeft + header.offsetWidth),
        paddingLeft: headerStyles.paddingLeft,
        paddingRight: headerStyles.paddingRight,
        marginLeft: headerStyles.marginLeft,
        marginRight: headerStyles.marginRight,
        width: headerStyles.width,
        maxWidth: headerStyles.maxWidth,
        boxSizing: headerStyles.boxSizing,
        overflowX: headerStyles.overflowX,
        position: headerStyles.position,
        left: headerStyles.left,
        right: headerStyles.right
      });
    }
    
    if (headerInner) {
      const innerStyles = window.getComputedStyle(headerInner);
      debugLog('[Debug] ヘッダー内部詳細:', {
        offsetWidth: headerInner.offsetWidth,
        clientWidth: headerInner.clientWidth,
        scrollWidth: headerInner.scrollWidth,
        paddingLeft: innerStyles.paddingLeft,
        paddingRight: innerStyles.paddingRight,
        marginLeft: innerStyles.marginLeft,
        marginRight: innerStyles.marginRight,
        width: innerStyles.width,
        maxWidth: innerStyles.maxWidth,
        boxSizing: innerStyles.boxSizing
      });
    }
    
    // 右側の余白がある場合、警告を表示
    if (bodyWidth > windowWidth || htmlWidth > windowWidth) {
      debugError('========================================');
      debugError('[Debug] 右側の余白が検出されました！');
      debugError('========================================');
      debugError('詳細:', {
        bodyWidth: bodyWidth,
        windowWidth: windowWidth,
        bodyExcess: bodyWidth - windowWidth,
        htmlWidth: htmlWidth,
        htmlExcess: htmlWidth - windowWidth
      });
      
      // 問題のある要素を探す
      const allElements = document.querySelectorAll('*');
      const problematicElements = [];
      allElements.forEach(function(el) {
        const styles = window.getComputedStyle(el);
        const elWidth = el.offsetWidth;
        const elRight = el.offsetLeft + elWidth;
        if (elRight > windowWidth + 10) { // 10pxの許容範囲
          problematicElements.push({
            element: el.tagName + (el.className ? '.' + el.className : '') + (el.id ? '#' + el.id : ''),
            width: elWidth,
            right: elRight,
            excess: elRight - windowWidth,
            paddingLeft: styles.paddingLeft,
            paddingRight: styles.paddingRight,
            marginLeft: styles.marginLeft,
            marginRight: styles.marginRight,
            maxWidth: styles.maxWidth,
            boxSizing: styles.boxSizing
          });
        }
      });
      
      if (problematicElements.length > 0) {
        debugError('[Debug] 問題のある要素:', problematicElements.slice(0, 10)); // 最初の10個だけ表示
      }
    }
    
    // メニューボタンの状態をチェック
    const menuToggle = document.querySelector('.header__menu-toggle');
    const nav = document.querySelector('.header__nav');
    if (menuToggle) {
      const toggleStyles = window.getComputedStyle(menuToggle);
      debugLog('[Debug] メニュートグル詳細:', {
        exists: !!menuToggle,
        offsetWidth: menuToggle.offsetWidth,
        offsetHeight: menuToggle.offsetHeight,
        display: toggleStyles.display,
        visibility: toggleStyles.visibility,
        opacity: toggleStyles.opacity,
        pointerEvents: toggleStyles.pointerEvents,
        zIndex: toggleStyles.zIndex,
        position: toggleStyles.position,
        cursor: toggleStyles.cursor,
        hasClickListener: menuToggle.onclick !== null || menuToggle.getAttribute('onclick') !== null
      });
      
      // イベントリスナーの確認
      debugLog('[Debug] メニュートグルイベント:', {
        hasEventListeners: menuToggle.addEventListener ? 'Yes' : 'No',
        classList: Array.from(menuToggle.classList),
        innerHTML: menuToggle.innerHTML.substring(0, 50)
      });
    } else {
      debugError('[Debug] メニュートグルが見つかりません！');
    }
    
    if (nav) {
      const navStyles = window.getComputedStyle(nav);
      debugLog('[Debug] ナビゲーション詳細:', {
        exists: !!nav,
        offsetWidth: nav.offsetWidth,
        offsetHeight: nav.offsetHeight,
        display: navStyles.display,
        position: navStyles.position,
        right: navStyles.right,
        width: navStyles.width,
        maxWidth: navStyles.maxWidth,
        zIndex: navStyles.zIndex,
        hasActiveClass: nav.classList.contains('active'),
        classList: Array.from(nav.classList)
      });
    } else {
      debugError('[Debug] ナビゲーションが見つかりません！');
    }
    
    debugLog('========================================');
    debugLog('[Debug] 詳細な幅チェック終了');
    debugLog('========================================');
  }, 1000);
  
  // リサイズ時にもチェック
  let resizeCheckTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeCheckTimer);
    resizeCheckTimer = setTimeout(function() {
      debugLog('[Debug] リサイズ後のチェック:', {
        windowWidth: window.innerWidth,
        bodyWidth: document.body.offsetWidth,
        htmlWidth: document.documentElement.offsetWidth
      });
    }, 500);
  });
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
  debugLog('========================================');
  debugLog('[Mobile Menu] 初期化開始');
  debugLog('========================================');
  
  const menuToggle = document.querySelector('.header__menu-toggle');
  const nav = document.querySelector('.header__nav');
  const body = document.body;

  debugLog('[Mobile Menu] 要素の検索結果:', {
    menuToggleFound: !!menuToggle,
    navFound: !!nav,
    menuToggleElement: menuToggle,
    navElement: nav,
    bodyElement: body
  });

  if (!menuToggle) {
    debugError('========================================');
    debugError('[Mobile Menu] エラー: メニュートグルが見つかりません！');
    debugError('========================================');
    debugError('検索したセレクター: .header__menu-toggle');
    debugError('HTML内の存在確認:', {
      allButtons: document.querySelectorAll('button').length,
      allMenuToggles: document.querySelectorAll('[class*="menu"]').length,
      headerButtons: document.querySelectorAll('header button').length
    });
    return;
  }
  
  if (!nav) {
    debugError('========================================');
    debugError('[Mobile Menu] エラー: ナビゲーションが見つかりません！');
    debugError('========================================');
    debugError('検索したセレクター: .header__nav');
    return;
  }
  
  // 要素の詳細情報を出力
  const toggleStyles = window.getComputedStyle(menuToggle);
  const navStyles = window.getComputedStyle(nav);
  
  debugLog('[Mobile Menu] メニュートグルの詳細:', {
    tagName: menuToggle.tagName,
    className: menuToggle.className,
    id: menuToggle.id,
    offsetWidth: menuToggle.offsetWidth,
    offsetHeight: menuToggle.offsetHeight,
    display: toggleStyles.display,
    visibility: toggleStyles.visibility,
    opacity: toggleStyles.opacity,
    pointerEvents: toggleStyles.pointerEvents,
    zIndex: toggleStyles.zIndex,
    position: toggleStyles.position,
    cursor: toggleStyles.cursor,
    padding: toggleStyles.padding,
    margin: toggleStyles.margin
  });
  
  debugLog('[Mobile Menu] ナビゲーションの詳細:', {
    tagName: nav.tagName,
    className: nav.className,
    id: nav.id,
    offsetWidth: nav.offsetWidth,
    offsetHeight: nav.offsetHeight,
    display: navStyles.display,
    position: navStyles.position,
    right: navStyles.right,
    width: navStyles.width,
    maxWidth: navStyles.maxWidth,
    zIndex: navStyles.zIndex,
    visibility: navStyles.visibility,
    opacity: navStyles.opacity
  });

  let isMenuOpen = false;

  function openMenu() {
    debugLog('========================================');
    debugLog('[Mobile Menu] メニューを開いています...');
    debugLog('========================================');
    
    nav.classList.add('active');
    menuToggle.classList.add('active');
    body.style.overflow = 'hidden';
    body.classList.add('menu-open');
    isMenuOpen = true;
    
    // デバッグ: メニューの状態を確認
    const navFinalStyles = window.getComputedStyle(nav);
    const toggleFinalStyles = window.getComputedStyle(menuToggle);
    
    debugLog('[Mobile Menu] メニューが開きました:', {
      navClasses: nav.className,
      navHasActive: nav.classList.contains('active'),
      navRight: navFinalStyles.right,
      navDisplay: navFinalStyles.display,
      navVisibility: navFinalStyles.visibility,
      navOpacity: navFinalStyles.opacity,
      navZIndex: navFinalStyles.zIndex,
      toggleClasses: menuToggle.className,
      toggleHasActive: menuToggle.classList.contains('active'),
      toggleDisplay: toggleFinalStyles.display,
      bodyOverflow: body.style.overflow,
      bodyHasMenuOpen: body.classList.contains('menu-open'),
      isMenuOpen: isMenuOpen
    });
    
    // アニメーション後の状態も確認
    setTimeout(function() {
      const navAfterStyles = window.getComputedStyle(nav);
      debugLog('[Mobile Menu] アニメーション後の状態:', {
        navRight: navAfterStyles.right,
        navTransform: navAfterStyles.transform
      });
    }, 600);
  }

  function closeMenu() {
    debugLog('========================================');
    debugLog('[Mobile Menu] メニューを閉じています...');
    debugLog('========================================');
    
    nav.classList.remove('active');
    menuToggle.classList.remove('active');
    body.style.overflow = '';
    body.classList.remove('menu-open');
    isMenuOpen = false;
    
    const navFinalStyles = window.getComputedStyle(nav);
    const toggleFinalStyles = window.getComputedStyle(menuToggle);
    
    debugLog('[Mobile Menu] メニューが閉じました:', {
      navClasses: nav.className,
      navHasActive: nav.classList.contains('active'),
      navRight: navFinalStyles.right,
      toggleClasses: menuToggle.className,
      toggleHasActive: menuToggle.classList.contains('active'),
      bodyOverflow: body.style.overflow,
      bodyHasMenuOpen: body.classList.contains('menu-open'),
      isMenuOpen: isMenuOpen
    });
  }

  // Add click event to toggle button
  function handleToggleClick(e) {
    debugLog('[Mobile Menu] トグルボタンがクリックされました！');
    
    // イベントの伝播を確実に停止
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    
    if (isMenuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
    
    return false;
  }
  
  // イベントリスナーの追加前に確認
  debugLog('[Mobile Menu] イベントリスナーの追加前の状態:', {
    hasOnClick: typeof menuToggle.onclick === 'function',
    onclickValue: menuToggle.onclick,
    hasAttributeOnclick: menuToggle.hasAttribute('onclick')
  });
  
  // clickイベントを追加（キャプチャフェーズで確実に処理）
  try {
    // キャプチャフェーズで追加（overlayより先に処理）
    menuToggle.addEventListener('click', handleToggleClick, { 
      passive: false, 
      capture: true,
      once: false
    });
    // 通常フェーズでも追加（念のため）
    menuToggle.addEventListener('click', handleToggleClick, { 
      passive: false,
      capture: false
    });
    debugLog('[Mobile Menu] clickイベントリスナーを追加しました（キャプチャフェーズ + 通常フェーズ）');
  } catch (error) {
    debugError('[Mobile Menu] clickイベントリスナーの追加に失敗:', error);
  }
  
  // デバッグ: ボタンがクリック可能か確認
  const finalToggleStyles = window.getComputedStyle(menuToggle);
  debugLog('[Mobile Menu] イベントリスナー追加後の状態:', {
    display: finalToggleStyles.display,
    visibility: finalToggleStyles.visibility,
    pointerEvents: finalToggleStyles.pointerEvents,
    zIndex: finalToggleStyles.zIndex,
    cursor: finalToggleStyles.cursor,
    position: finalToggleStyles.position
  });
  
  // 手動でクリックイベントをテスト
  debugLog('[Mobile Menu] テスト: 手動でクリックイベントを発火します...');
  setTimeout(function() {
    try {
      const testEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      });
      debugLog('[Mobile Menu] テストイベントを作成しました:', testEvent);
      // 実際には発火させない（デバッグ用のログのみ）
      debugLog('[Mobile Menu] 注意: 実際のテストイベントは発火していません（デバッグ用）');
    } catch (error) {
      debugError('[Mobile Menu] テストイベントの作成に失敗:', error);
    }
  }, 2000);

  // メニュー外をクリックしたら閉じる
  document.addEventListener('click', function(e) {
    // メニューが開いている時のみ処理
    if (!isMenuOpen) return;
    
    // トグルボタンやメニュー内の要素をクリックした場合は何もしない
    const clickedElement = e.target;
    
    // トグルボタンまたはその子要素をクリックした場合は無視
    if (clickedElement === menuToggle || 
        menuToggle.contains(clickedElement) || 
        clickedElement.closest('.header__menu-toggle') ||
        clickedElement.closest('button.header__menu-toggle')) {
      return;
    }
    
    // メニュー内の要素をクリックした場合は無視
    if (clickedElement === nav || 
        nav.contains(clickedElement) || 
        clickedElement.closest('.header__nav')) {
      return;
    }
    
    // メニュー外をクリックした場合はメニューを閉じる
    closeMenu();
  }, { passive: false });

  // Close menu when clicking on a link
  // モバイルメニュー内のすべてのリンクを取得
  const navLinks = nav.querySelectorAll('a[href]');
  debugLog('[Mobile Menu] Found nav links:', navLinks.length);
  navLinks.forEach((link, index) => {
    link.addEventListener('click', function(e) {
      debugLog('[Mobile Menu] Nav link clicked:', index, link.href);
      const href = link.getAttribute('href');
      
      // イベントの伝播を止めて、overlayのイベントが干渉しないようにする
      e.stopPropagation();
      e.stopImmediatePropagation();
      
      // リンクの遷移を確実にする
      if (href && href.startsWith('#')) {
        // アンカーリンクの場合はスムーススクロール
        e.preventDefault();
        const targetElement = document.querySelector(href);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
        setTimeout(function() {
          closeMenu();
        }, 300);
      } else if (href && href !== '#' && href !== '') {
        // 通常のリンクの場合は遷移
        closeMenu();
        // デフォルトの動作を実行（遷移）
      }
    }, { capture: true, passive: false }); // キャプチャフェーズでイベントを捕捉（オーバーレイより先に処理）
  });

  // Close menu on window resize (if resizing to desktop)
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      debugLog('[Mobile Menu] Window resized:', window.innerWidth);
      if (window.innerWidth > 1024 && isMenuOpen) {
        closeMenu();
      }
    }, 250);
  });

  debugLog('========================================');
  debugLog('[Mobile Menu] 初期化完了');
  debugLog('========================================');
  debugLog('最終状態:', {
    menuToggleExists: !!menuToggle,
    navExists: !!nav,
    overlayExists: !!overlay,
    isMenuOpen: isMenuOpen,
    windowWidth: window.innerWidth,
    isMobile: window.innerWidth <= 1024
  });
  debugLog('========================================');
}

/**
 * 二重スクロール問題の診断
 * CSSで設定されているが、念のため確認用
 */
function checkDoubleScroll() {
  const html = document.documentElement;
  const body = document.body;
  const htmlStyles = window.getComputedStyle(html);
  const bodyStyles = window.getComputedStyle(body);
  
  debugLog('[Scroll Debug] html要素:', {
    overflowY: htmlStyles.overflowY,
    hasScrollbar: html.scrollHeight > html.clientHeight
  });
  
  debugLog('[Scroll Debug] body要素:', {
    overflowY: bodyStyles.overflowY,
    hasScrollbar: body.scrollHeight > body.clientHeight
  });
  
  // CSSが効いていない場合のみJavaScriptで修正
  if (htmlStyles.overflowY !== 'visible') {
    html.style.setProperty('overflow-y', 'visible', 'important');
    debugWarn('[Scroll Debug] html要素をJavaScriptで修正しました');
  }
}
