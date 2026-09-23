/**
 * STRIKE & PIN ENTERTAINMENT CENTER - GLOBAL SCRIPT
 * Handles: Preloader, Fixed Header, Click-only Dropdowns, Mobile Drawer,
 * Pure #000000 Dark Mode, RTL/LTR Direction, Scroll-to-top, Active States
 */

(function () {
  'use strict';

  // --- 1. Preloader Handling ---
  function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    const hidePreloader = () => {
      preloader.classList.add('fade-out');
      setTimeout(() => {
        if (preloader.parentNode) {
          preloader.parentNode.removeChild(preloader);
        }
      }, 550);
    };

    if (document.readyState === 'complete') {
      setTimeout(hidePreloader, 350);
    } else {
      window.addEventListener('load', () => setTimeout(hidePreloader, 350));
      // Fallback timeout in case resources take too long
      setTimeout(hidePreloader, 2000);
    }
  }

  // --- 2. Pure #000000 Dark Mode ---
  function initDarkMode() {
    const themeKey = 'bowling_center_theme';
    const darkToggleBtns = document.querySelectorAll('.dark-mode-toggle, #themeToggleBtn, [data-theme-toggle], .theme-toggle-btn');
    const root = document.documentElement;

    // Retrieve initial preference
    const savedTheme = localStorage.getItem(themeKey);
    // If not set, check if html already has class="dark"
    const isDark = savedTheme !== null ? savedTheme === 'dark' : root.classList.contains('dark');

    function applyTheme(dark) {
      if (dark) {
        root.classList.add('dark');
        localStorage.setItem(themeKey, 'dark');
      } else {
        root.classList.remove('dark');
        localStorage.setItem(themeKey, 'light');
      }
      darkToggleBtns.forEach((btn) => {
        btn.setAttribute('aria-pressed', dark ? 'true' : 'false');
        btn.setAttribute('title', dark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
        // Update label text if present inside button
        const labelSpan = btn.querySelector('.theme-label-text, .text-xs, .utility-label');
        if (labelSpan && !labelSpan.classList.contains('theme-toggle-icon')) {
          labelSpan.textContent = dark ? 'Light' : 'Dark';
        }
      });
    }

    applyTheme(isDark);

    darkToggleBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const currentlyDark = root.classList.contains('dark');
        applyTheme(!currentlyDark);
      });
    });
  }

  // --- 3. RTL / LTR Direction Toggle ---
  function initRTL() {
    const dirKey = 'bowling_center_direction';
    const rtlToggleBtns = document.querySelectorAll('.rtl-toggle-btn, #rtlToggleBtn, [data-rtl-toggle], .utility-btn.rtl-toggle-btn');
    const root = document.documentElement;

    const savedDir = localStorage.getItem(dirKey) || root.getAttribute('dir') || 'ltr';

    function applyDirection(dir) {
      root.setAttribute('dir', dir);
      localStorage.setItem(dirKey, dir);
      rtlToggleBtns.forEach((btn) => {
        const textSpan = btn.querySelector('.dir-label-text, .rtl-text-indicator, .utility-label');
        if (textSpan) {
          textSpan.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
        }
        btn.setAttribute('aria-label', dir === 'rtl' ? 'Switch to Left to Right' : 'Switch to Right to Left');
      });
    }

    applyDirection(savedDir);

    rtlToggleBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const currentDir = root.getAttribute('dir') || 'ltr';
        const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
        applyDirection(newDir);
      });
    });
  }

  // --- 4. Desktop Home Dropdown (CLICK ONLY, NEVER HOVER) ---
  function initDesktopDropdown() {
    // Support all dropdown trigger variants across index, home-2, and inner pages
    const dropdownTriggers = document.querySelectorAll('#homeDropdownTrigger, #homeDropdownBtn, .nav-dropdown-trigger, .dropdown-toggle');
    if (!dropdownTriggers.length) return;

    dropdownTriggers.forEach((trigger) => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const wrapper = trigger.closest('.nav-dropdown-wrapper, .dropdown-item, .nav-item');
        const menu = wrapper 
          ? (wrapper.querySelector('.dropdown-panel, .dropdown-menu') || document.getElementById('homeDropdownMenu'))
          : document.getElementById('homeDropdownMenu');

        const isCurrentlyOpen = wrapper ? wrapper.classList.contains('open') : (menu && menu.classList.contains('show'));

        // Close all other dropdowns first
        document.querySelectorAll('.nav-dropdown-wrapper.open, .dropdown-item.open, .nav-item.open').forEach((el) => {
          el.classList.remove('open');
        });
        document.querySelectorAll('.dropdown-panel.show, .dropdown-menu.show').forEach((el) => {
          el.classList.remove('show');
          el.style.display = '';
        });
        document.querySelectorAll('#homeDropdownTrigger, #homeDropdownBtn, .nav-dropdown-trigger, .dropdown-toggle').forEach((btn) => {
          btn.setAttribute('aria-expanded', 'false');
        });

        if (!isCurrentlyOpen) {
          if (wrapper) wrapper.classList.add('open');
          if (menu) {
            menu.classList.add('show');
            menu.style.display = 'flex';
          }
          trigger.setAttribute('aria-expanded', 'true');
        }
      });
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      const isInside = e.target.closest('.nav-dropdown-wrapper, .dropdown-panel, .dropdown-menu, .nav-dropdown-trigger, .dropdown-toggle, .dropdown-item');
      if (!isInside) {
        document.querySelectorAll('.nav-dropdown-wrapper.open, .dropdown-item.open, .nav-item.open').forEach((el) => {
          el.classList.remove('open');
        });
        document.querySelectorAll('.dropdown-panel.show, .dropdown-menu.show').forEach((el) => {
          el.classList.remove('show');
          el.style.display = '';
        });
        document.querySelectorAll('#homeDropdownTrigger, #homeDropdownBtn, .nav-dropdown-trigger, .dropdown-toggle').forEach((btn) => {
          btn.setAttribute('aria-expanded', 'false');
        });
      }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.nav-dropdown-wrapper.open, .dropdown-item.open, .nav-item.open').forEach((el) => {
          el.classList.remove('open');
        });
        document.querySelectorAll('.dropdown-panel.show, .dropdown-menu.show').forEach((el) => {
          el.classList.remove('show');
          el.style.display = '';
        });
        document.querySelectorAll('#homeDropdownTrigger, #homeDropdownBtn, .nav-dropdown-trigger, .dropdown-toggle').forEach((btn) => {
          btn.setAttribute('aria-expanded', 'false');
        });
      }
    });
  }

  // --- 5. Mobile Drawer & Home Accordion ---
  function initMobileMenu() {
    const mobileMenuBtns = document.querySelectorAll('#mobileMenuBtn, .mobile-toggle-btn');
    const mobileDrawer = document.getElementById('mobileDrawer') || document.querySelector('.mobile-drawer');
    const mobileBackdrops = document.querySelectorAll('#mobileDrawerBackdrop, #drawerBackdrop, .mobile-drawer-backdrop, .drawer-backdrop');
    const mobileDrawerCloses = document.querySelectorAll('#mobileDrawerClose, .mobile-drawer-close, .drawer-close-btn');
    const mobileAccordionToggles = document.querySelectorAll('#mobileHomeAccordionToggle, #mobileHomeToggle, .mobile-accordion-toggle');

    if (!mobileDrawer) return;

    function openMobileMenu() {
      // Ensure all mobile accordions (Home dropdown, etc.) start closed by default
      document.querySelectorAll('.mobile-accordion-wrapper, .mobile-nav-item').forEach((el) => {
        el.classList.remove('open');
      });
      document.querySelectorAll('.mobile-accordion-panel, .mobile-accordion-menu, .mobile-dropdown-panel').forEach((el) => {
        el.classList.remove('open');
      });
      document.querySelectorAll('#mobileHomeAccordionToggle, #mobileHomeToggle, .mobile-accordion-toggle').forEach((btn) => {
        btn.setAttribute('aria-expanded', 'false');
      });

      mobileDrawer.classList.add('active');
      mobileBackdrops.forEach((b) => b.classList.add('active'));
      document.body.classList.add('menu-open');
      document.documentElement.classList.add('menu-open');
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      mobileMenuBtns.forEach((btn) => btn.setAttribute('aria-expanded', 'true'));
    }

    function closeMobileMenu() {
      mobileDrawer.classList.remove('active');
      mobileBackdrops.forEach((b) => b.classList.remove('active'));
      document.body.classList.remove('menu-open');
      document.documentElement.classList.remove('menu-open');
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      mobileMenuBtns.forEach((btn) => btn.setAttribute('aria-expanded', 'false'));

      // Automatically collapse accordions when closing
      document.querySelectorAll('.mobile-accordion-wrapper, .mobile-nav-item').forEach((el) => {
        el.classList.remove('open');
      });
      document.querySelectorAll('.mobile-accordion-panel, .mobile-accordion-menu, .mobile-dropdown-panel').forEach((el) => {
        el.classList.remove('open');
      });
      document.querySelectorAll('#mobileHomeAccordionToggle, #mobileHomeToggle, .mobile-accordion-toggle').forEach((btn) => {
        btn.setAttribute('aria-expanded', 'false');
      });
    }

    mobileMenuBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (mobileDrawer.classList.contains('active')) {
          closeMobileMenu();
        } else {
          openMobileMenu();
        }
      });
    });

    mobileDrawerCloses.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        closeMobileMenu();
      });
    });

    mobileBackdrops.forEach((backdrop) => {
      backdrop.addEventListener('click', (e) => {
        e.preventDefault();
        closeMobileMenu();
      });
    });

    // Mobile Home Accordion: CLICK ONLY
    mobileAccordionToggles.forEach((toggle) => {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const parent = toggle.closest('.mobile-accordion-wrapper, .mobile-nav-item');
        if (!parent) return;
        const panel = parent.querySelector('.mobile-accordion-panel, .mobile-accordion-menu, .mobile-dropdown-panel');
        const isCurrentlyOpen = parent.classList.contains('open');

        if (isCurrentlyOpen) {
          parent.classList.remove('open');
          if (panel) panel.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        } else {
          parent.classList.add('open');
          if (panel) panel.classList.add('open');
          toggle.setAttribute('aria-expanded', 'true');
        }
      });
    });

    // Clicking any drawer link (excluding the accordion toggle button) closes the mobile menu
    const allDrawerLinks = mobileDrawer.querySelectorAll('a');
    allDrawerLinks.forEach((link) => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('active')) {
        closeMobileMenu();
      }
    });

    // Close when window is resized to desktop width
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1080 && mobileDrawer.classList.contains('active')) {
        closeMobileMenu();
      }
    });
  }

  // --- 6. Active Navigation Detection ---
  function initActiveNav() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const allLinks = document.querySelectorAll('.nav-link, .dropdown-item, .mobile-nav-link, .mobile-sub-link');

    allLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (!href) return;
      const targetFile = href.split('/').pop().split('#')[0];

      if (targetFile === currentPath || (currentPath === '' && targetFile === 'index.html')) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');

        // Highlight Desktop Home Trigger if on Home 1 or Home 2
        if (targetFile === 'index.html' || targetFile === 'home-2.html') {
          const homeTrigger = document.getElementById('homeDropdownTrigger') || document.getElementById('homeDropdownBtn');
          if (homeTrigger) homeTrigger.classList.add('active');
          const mobileAccordionToggle = document.getElementById('mobileHomeAccordionToggle') || document.getElementById('mobileHomeToggle');
          if (mobileAccordionToggle) mobileAccordionToggle.classList.add('active');
        }
      }
    });
  }

  // --- 7. Scroll to Top Button ---
  function initScrollToTop() {
    const scrollTopBtns = document.querySelectorAll('#scrollTopBtn, #scrollToTopBtn, .scroll-top-btn');
    if (!scrollTopBtns.length) return;

    window.addEventListener('scroll', () => {
      const isVisible = window.scrollY > 350;
      scrollTopBtns.forEach((btn) => {
        if (isVisible) {
          btn.classList.add('visible');
        } else {
          btn.classList.remove('visible');
        }
      });
    }, { passive: true });

    scrollTopBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    });
  }

  // --- 8. Interactive Lane Calculator (Home 1) ---
  function initLaneCalculator() {
    const bowlersSlider = document.getElementById('calcBowlers');
    const bowlersReadout = document.getElementById('calcBowlersVal');
    const durationChips = document.querySelectorAll('.calc-chip-btn');
    const shoesToggle = document.getElementById('calcShoesToggle');
    const arcadeToggle = document.getElementById('calcArcadeToggle');
    const totalAmount = document.getElementById('calcTotalAmount');
    const reserveBtn = document.getElementById('calcReserveBtn');

    if (!bowlersSlider || !totalAmount) return;

    let selectedDuration = 2; // Default 2 hours

    function calculateTotal() {
      const bowlers = parseInt(bowlersSlider.value, 10) || 4;
      if (bowlersReadout) {
        bowlersReadout.textContent = bowlers + (bowlers === 1 ? ' Player' : ' Players');
      }

      // Base pricing: $45 / hour for standard lane (up to 6 players, +$5/hr for 7 or 8)
      let hourlyRate = 45;
      if (bowlers > 6) {
        hourlyRate += 5;
      }
      let baseCost = hourlyRate * selectedDuration;

      // Shoes: $4.50 per bowler
      let shoesCost = 0;
      if (shoesToggle && shoesToggle.classList.contains('active')) {
        shoesCost = bowlers * 4.5;
      }

      // Arcade tokens: $15 per bowler VIP arcade power card
      let arcadeCost = 0;
      if (arcadeToggle && arcadeToggle.classList.contains('active')) {
        arcadeCost = bowlers * 15;
      }

      const total = baseCost + shoesCost + arcadeCost;
      totalAmount.textContent = '$' + total.toFixed(2);

      if (reserveBtn) {
        reserveBtn.href = `book-lane.html?bowlers=${bowlers}&duration=${selectedDuration}&shoes=${shoesToggle && shoesToggle.classList.contains('active') ? '1' : '0'}`;
      }
    }

    bowlersSlider.addEventListener('input', calculateTotal);

    durationChips.forEach((chip) => {
      chip.addEventListener('click', () => {
        durationChips.forEach((c) => c.classList.remove('selected'));
        chip.classList.add('selected');
        selectedDuration = parseInt(chip.dataset.hours, 10) || 2;
        calculateTotal();
      });
    });

    if (shoesToggle) {
      shoesToggle.addEventListener('click', () => {
        shoesToggle.classList.toggle('active');
        const box = shoesToggle.querySelector('.calc-custom-check');
        if (box) box.classList.toggle('checked');
        calculateTotal();
      });
    }

    if (arcadeToggle) {
      arcadeToggle.addEventListener('click', () => {
        arcadeToggle.classList.toggle('active');
        const box = arcadeToggle.querySelector('.calc-custom-check');
        if (box) box.classList.toggle('checked');
        calculateTotal();
      });
    }

    calculateTotal();
  }

  // --- 9. Booking Page (book-lane.html) Interactive Engine ---
  function initBookingEngine() {
    const bookingForm = document.getElementById('laneReservationForm');
    if (!bookingForm) return;

    // URL Param pre-population
    const urlParams = new URLSearchParams(window.location.search);
    const paramBowlers = urlParams.get('bowlers');
    const paramDuration = urlParams.get('duration');
    const paramShoes = urlParams.get('shoes');

    const bowlersSelect = document.getElementById('bookBowlersCount');
    const durationSelect = document.getElementById('bookDurationHours');
    const lanesSelect = document.getElementById('bookLanesCount');
    const shoesSelect = document.getElementById('bookShoesCount');
    const pizzaCheck = document.getElementById('enhancePizza');
    const arcadeCheck = document.getElementById('enhanceArcade');

    if (paramBowlers && bowlersSelect) {
      bowlersSelect.value = paramBowlers;
      if (shoesSelect && paramShoes === '1') {
        shoesSelect.value = paramBowlers;
      }
    }
    if (paramDuration && durationSelect) {
      durationSelect.value = paramDuration;
    }

    // Receipt Line Items
    const receiptLaneText = document.getElementById('receiptLaneText');
    const receiptLaneCost = document.getElementById('receiptLaneCost');
    const receiptShoesCost = document.getElementById('receiptShoesCost');
    const receiptEnhanceCost = document.getElementById('receiptEnhanceCost');
    const receiptTax = document.getElementById('receiptTax');
    const receiptGrandTotal = document.getElementById('receiptGrandTotal');

    // Zone selection buttons (hero pills + any in-form pills)
    const zonePills = document.querySelectorAll('.zone-pill-btn');
    let selectedZoneRate = 48; // Base rate for cosmic
    let selectedZoneName = 'Cosmic Main Deck';

    // Zone display badge in receipt header (for visual feedback)
    const receiptHeader = document.querySelector('.receipt-header');
    const reservationSection = document.getElementById('reservationEngineSection');

    zonePills.forEach((pill) => {
      pill.addEventListener('click', () => {
        zonePills.forEach((p) => p.classList.remove('active'));
        pill.classList.add('active');
        selectedZoneRate = parseFloat(pill.dataset.rate) || 48;
        selectedZoneName = pill.dataset.name || 'Cosmic Main Deck';
        recalcReceipt();

        // Scroll to reservation form smoothly if clicking hero pills
        const isHeroPill = pill.closest('.zone-selector-pills, .zone-pill-nav') !== null;
        if (isHeroPill && reservationSection) {
          setTimeout(() => {
            reservationSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
        }

        // Flash receipt card to show it updated
        const receiptCard = document.querySelector('.sticky-receipt-card');
        if (receiptCard) {
          receiptCard.style.transition = 'box-shadow 0.15s ease';
          receiptCard.style.boxShadow = '0 0 0 2px var(--brand-gold-500), 0 0 30px rgba(229,169,60,0.4)';
          setTimeout(() => {
            receiptCard.style.boxShadow = '';
          }, 700);
        }

        // Update zone name badge in receipt header
        if (receiptHeader) {
          let zoneBadge = receiptHeader.querySelector('.receipt-zone-badge');
          if (!zoneBadge) {
            zoneBadge = document.createElement('span');
            zoneBadge.className = 'receipt-zone-badge';
            zoneBadge.style.cssText = 'display: inline-block; padding: 2px 10px; border-radius: 999px; font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; background: rgba(229,169,60,0.15); border: 1px solid var(--border-brand); color: var(--brand-gold-400); margin-top: 6px;';
            receiptHeader.appendChild(zoneBadge);
          }
          zoneBadge.textContent = `Zone: ${selectedZoneName} — $${selectedZoneRate}/hr`;
        }
      });
    });

    // Time Slot chips
    const slotChips = document.querySelectorAll('.slot-chip');
    slotChips.forEach((chip) => {
      chip.addEventListener('click', () => {
        slotChips.forEach((c) => c.classList.remove('selected'));
        chip.classList.add('selected');
        const hiddenTime = document.getElementById('selectedTimeSlot');
        if (hiddenTime) hiddenTime.value = chip.dataset.slot;
      });
    });

    // Stepper Counter Buttons (- / +) for Bowlers, Lanes, Shoes
    const counterBtns = document.querySelectorAll('.counter-step-btn');
    const optionValues = {
      bookBowlersCount: ['2', '4', '6', '8', '12', '18'],
      bookLanesCount: ['1', '2', '3', '4'],
      bookShoesCount: ['0', '2', '4', '6', '8']
    };

    counterBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = btn.dataset.target;
        const action = btn.dataset.action;
        const selectEl = document.getElementById(targetId);
        if (!selectEl || !optionValues[targetId]) return;

        const vals = optionValues[targetId];
        let currentIdx = vals.indexOf(selectEl.value);
        if (currentIdx === -1) currentIdx = 0;

        if (action === 'increment' && currentIdx < vals.length - 1) {
          currentIdx++;
        } else if (action === 'decrement' && currentIdx > 0) {
          currentIdx--;
        }

        selectEl.value = vals[currentIdx];

        // Update visual display
        if (targetId === 'bookBowlersCount') {
          const display = document.getElementById('displayBowlersVal');
          if (display) display.textContent = selectEl.value;
        } else if (targetId === 'bookLanesCount') {
          const display = document.getElementById('displayLanesVal');
          if (display) display.textContent = selectEl.value;
        } else if (targetId === 'bookShoesCount') {
          const display = document.getElementById('displayShoesVal');
          if (display) display.textContent = selectEl.value;
        }

        recalcReceipt();
      });
    });

    // Multi-Step Interactive Wizard Navigation
    let currentWizardStep = 1;
    const wizardTabs = document.querySelectorAll('.wizard-step-tab');
    const wizardPanels = document.querySelectorAll('.wizard-step-panel');
    const wizardConnectors = document.querySelectorAll('.wizard-step-connector');
    const nextBtns = document.querySelectorAll('.wizard-next-btn');
    const backBtns = document.querySelectorAll('.wizard-back-btn');

    function goToWizardStep(stepNum) {
      if (stepNum < 1 || stepNum > 4) return;
      currentWizardStep = stepNum;

      // Update panels
      wizardPanels.forEach((panel) => {
        const panelStep = parseInt(panel.id.replace('stepPanel', ''), 10);
        panel.classList.toggle('active', panelStep === currentWizardStep);
      });

      // Update tabs and connectors
      wizardTabs.forEach((tab) => {
        const tabStep = parseInt(tab.dataset.step, 10);
        tab.classList.toggle('active', tabStep === currentWizardStep);
        tab.classList.toggle('completed', tabStep < currentWizardStep);
        tab.setAttribute('aria-selected', tabStep === currentWizardStep ? 'true' : 'false');
      });

      wizardConnectors.forEach((conn, idx) => {
        conn.classList.toggle('active', idx < currentWizardStep - 1);
      });
    }

    wizardTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const step = parseInt(tab.dataset.step, 10);
        goToWizardStep(step);
      });
    });

    nextBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const nextStep = parseInt(btn.dataset.next, 10);
        goToWizardStep(nextStep);
      });
    });

    backBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const prevStep = parseInt(btn.dataset.prev, 10);
        goToWizardStep(prevStep);
      });
    });

    function recalcReceipt() {
      const bowlers = parseInt(bowlersSelect ? bowlersSelect.value : 4, 10) || 4;
      const duration = parseInt(durationSelect ? durationSelect.value : 2, 10) || 2;
      const lanes = parseInt(lanesSelect ? lanesSelect.value : 1, 10) || 1;
      const shoes = parseInt(shoesSelect ? shoesSelect.value : 4, 10) || 0;

      // Base Lane Cost: Rate * Duration * Lanes
      const baseCost = selectedZoneRate * duration * lanes;
      if (receiptLaneText) {
        receiptLaneText.textContent = `${lanes}x ${selectedZoneName} (${duration} hrs)`;
      }
      if (receiptLaneCost) {
        receiptLaneCost.textContent = `$${baseCost.toFixed(2)}`;
      }

      // Shoes Cost: $4.50 * Count
      const shoesCost = shoes * 4.5;
      if (receiptShoesCost) {
        receiptShoesCost.textContent = `$${shoesCost.toFixed(2)}`;
      }

      // Enhancements Cost
      let enhanceCost = 0;
      if (pizzaCheck && pizzaCheck.checked) enhanceCost += 34.00;
      if (arcadeCheck && arcadeCheck.checked) enhanceCost += (bowlers * 15.00);
      if (receiptEnhanceCost) {
        receiptEnhanceCost.textContent = `$${enhanceCost.toFixed(2)}`;
      }

      const subtotal = baseCost + shoesCost + enhanceCost;
      const tax = subtotal * 0.0825; // 8.25% standard tax
      const grandTotal = subtotal + tax;

      if (receiptTax) {
        receiptTax.textContent = `$${tax.toFixed(2)}`;
      }
      if (receiptGrandTotal) {
        receiptGrandTotal.textContent = `$${grandTotal.toFixed(2)}`;
      }
    }

    [bowlersSelect, durationSelect, lanesSelect, shoesSelect, pizzaCheck, arcadeCheck].forEach((el) => {
      if (el) el.addEventListener('change', recalcReceipt);
    });

    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const modal = document.getElementById('bookingSuccessNotice');
      if (modal) {
        modal.style.display = 'flex';
      } else {
        alert('Lane slot reserved successfully! Check your email for QR confirmation ticket.');
      }
    });

    recalcReceipt();
  }

  // --- 10. FAQ Accordions (book-lane.html & others) ---
  function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-card-item');
    faqItems.forEach((item) => {
      const btn = item.querySelector('.faq-toggle-btn');
      if (!btn) return;
      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        faqItems.forEach((other) => {
          other.classList.remove('open');
          const otherBtn = other.querySelector('.faq-toggle-btn');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          item.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  // --- 11. Tournament Bracket & Division Drawer (leagues.html) ---
  function initTournamentBracket() {
    // 1. League Division Radar Selector
    const leagueRadarBtns = document.querySelectorAll('#leagueRadarSelectorStrip .radar-pill-btn');
    const leagueRadarTitle = document.getElementById('leagueRadarBandTitle');
    const leagueRadarTag = document.getElementById('leagueRadarTag');
    const leagueStat1 = document.getElementById('leagueRadarStat1');
    const leagueLabel1 = document.getElementById('leagueRadarLabel1');
    const leagueStat2 = document.getElementById('leagueRadarStat2');
    const leagueLabel2 = document.getElementById('leagueRadarLabel2');
    const leagueStat3 = document.getElementById('leagueRadarStat3');
    const leagueLabel3 = document.getElementById('leagueRadarLabel3');
    const leagueDesc = document.getElementById('leagueRadarDesc');

    const leagueRadarData = {
      scratch: {
        title: 'Scratch Masters (Thu 7:00 PM)',
        tag: 'USBC Sanctioned ✦ $12K Purse',
        stat1: '195+',
        label1: 'Min Avg Req',
        stat2: '$32',
        label2: 'Weekly Dues',
        stat3: '4 Spots',
        label3: 'Open Roster',
        desc: 'USBC Sport-certified league competing on rotating PBA Animal oil patterns with automated Specto telemetry, weekly stepladder finals, and ring awards.'
      },
      classic: {
        title: 'Classic Mixed Trio (Tue 6:30 PM)',
        tag: 'Handicap 80% ✦ $6K Purse',
        stat1: '150+',
        label1: 'Min Avg Req',
        stat2: '$26',
        label2: 'Weekly Dues',
        stat3: '6 Spots',
        label3: 'Open Roster',
        desc: 'Co-ed 3-person squads with an 80% handicap system. Balanced fun and spirited competitive play with mid-season cash qualifiers.'
      },
      pub: {
        title: 'Pub & Pint Social (Wed 7:30 PM)',
        tag: 'Craft Taps ✦ Pure Social',
        stat1: 'Any',
        label1: 'Min Avg Req',
        stat2: '$20',
        label2: 'Weekly Dues',
        stat3: '8 Spots',
        label3: 'Open Roster',
        desc: 'Casual 4-person social squads with complimentary craft beer pitcher rounds, arcade credits, and end-of-season awards banquet parties.'
      },
      weekend: {
        title: 'Weekend Cash Blitz (Sat 11:00 AM)',
        tag: 'Knockout ✦ $7K Purse',
        stat1: 'Open',
        label1: 'Min Avg Req',
        stat2: '$45',
        label2: 'Entry / Squad',
        stat3: '12 Spots',
        label3: 'Open Bracket',
        desc: 'High-octane double elimination knockout bracket held bi-weekly with live broadcast commentary, instant payouts, and trophy ceremonies.'
      }
    };

    if (leagueRadarBtns.length && leagueRadarTitle) {
      leagueRadarBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          leagueRadarBtns.forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');
          const divKey = btn.dataset.div;
          const data = leagueRadarData[divKey];
          if (data) {
            leagueRadarTitle.textContent = data.title;
            if (leagueRadarTag) leagueRadarTag.textContent = data.tag;
            if (leagueStat1) leagueStat1.textContent = data.stat1;
            if (leagueLabel1) leagueLabel1.textContent = data.label1;
            if (leagueStat2) leagueStat2.textContent = data.stat2;
            if (leagueLabel2) leagueLabel2.textContent = data.label2;
            if (leagueStat3) leagueStat3.textContent = data.stat3;
            if (leagueLabel3) leagueLabel3.textContent = data.label3;
            if (leagueDesc) leagueDesc.textContent = data.desc;
          }
        });
      });
    }

    // 2. Bracket pill buttons (if present)
    const bracketTabs = document.querySelectorAll('.bracket-pill-btn');
    if (bracketTabs.length) {
      bracketTabs.forEach((tab) => {
        tab.addEventListener('click', () => {
          bracketTabs.forEach((t) => t.classList.remove('active'));
          tab.classList.add('active');
          const activeName = tab.dataset.bracket;
          const bannerTitle = document.getElementById('activeBracketTitle');
          if (bannerTitle) {
            bannerTitle.textContent = activeName;
          }
        });
      });
    }

    // 3. Division Drawers toggle (if present)
    const toggleBtns = document.querySelectorAll('.division-drawer-toggle');
    toggleBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.division-strip-item');
        if (!item) return;
        const drawer = item.querySelector('.division-details-drawer');
        if (!drawer) return;
        const isHidden = drawer.style.display === 'none' || getComputedStyle(drawer).display === 'none';
        drawer.style.display = isHidden ? 'grid' : 'none';
        btn.textContent = isHidden ? 'Hide Specs' : 'View Specs';
      });
    });

    // 4. Draft agent buttons
    const draftBtns = document.querySelectorAll('.btn-draft-agent');
    draftBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const name = btn.dataset.agent || 'Bowler';
        alert(`Draft request sent to ${name}! They have been notified to join your squad.`);
        btn.textContent = 'Requested ✓';
        btn.disabled = true;
        btn.style.opacity = '0.6';
      });
    });
  }

  /* --------------------------------------------------------------------------
     12. Birthday Parties Interactive Engine
     -------------------------------------------------------------------------- */
  function initBirthdayPartySystem() {
    // 1. Vibe Picker
    const vibeBtns = document.querySelectorAll('.vibe-pill-btn');
    const vibeTitle = document.getElementById('vibeDisplayTitle');
    const vibeDesc = document.getElementById('vibeDisplayDesc');
    const vibeTag = document.getElementById('vibeHeroTag');

    const vibeData = {
      kids: {
        title: 'Kids Cosmic Glow Blast (Ages 5–12)',
        desc: 'Lightweight bowling balls (6–8 lbs), automated bumper rails that pop up just for kids, lightweight neon shoe valet, and non-stop kid pop radio.',
        tag: 'Kids Party Mode Active'
      },
      teens: {
        title: 'Teen Cosmic Takeover (Ages 13–17)',
        desc: 'UV blacklight glow pins, bass-thumping nightclub sound system, Instagrammable LED neon photo walls, and 60-minute free-play arcade cards.',
        tag: 'Teen Blacklight Mode Active'
      },
      adults: {
        title: 'Adult Milestone Bash & 21+ VIP',
        desc: 'Dedicated mezzanine VIP lanes, craft cocktail towers, artisan slider feasts, private lounge attendant, and full music volume controls.',
        tag: 'VIP 21+ Lounge Mode Active'
      }
    };

    if (vibeBtns.length && vibeTitle && vibeDesc) {
      vibeBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          vibeBtns.forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');
          const vibe = btn.dataset.vibe;
          if (vibeData[vibe]) {
            vibeTitle.textContent = vibeData[vibe].title;
            vibeDesc.textContent = vibeData[vibe].desc;
            if (vibeTag) vibeTag.textContent = vibeData[vibe].tag;
          }
        });
      });
    }

    // 2. Party Studio Configurator
    const guestCountEl = document.getElementById('partyGuestCount');
    const btnMinus = document.getElementById('btnGuestMinus');
    const btnPlus = document.getElementById('btnGuestPlus');
    const passGuests = document.getElementById('passGuestDisplay');
    const passTier = document.getElementById('passTierDisplay');
    const passTotal = document.getElementById('passTotalDisplay');
    const tierCards = document.querySelectorAll('.tier-option-card');
    const addonCards = document.querySelectorAll('.addon-card-check');

    let guests = 10;
    let tierPrice = 38; // Default: Glow Master
    let tierName = 'The Glow Master';

    function recalculateParty() {
      let addonTotal = 0;
      addonCards.forEach((card) => {
        if (card.classList.contains('active')) {
          const cost = parseInt(card.dataset.cost, 10) || 0;
          const isPerGuest = card.dataset.perGuest === 'true';
          if (isPerGuest) {
            addonTotal += cost * guests;
          } else {
            addonTotal += cost;
          }
        }
      });

      const total = (guests * tierPrice) + addonTotal;

      if (guestCountEl) guestCountEl.textContent = guests;
      if (passGuests) passGuests.textContent = `${guests} Guests`;
      if (passTier) passTier.textContent = tierName;
      if (passTotal) passTotal.textContent = `$${total}`;
    }

    if (btnMinus && btnPlus && guestCountEl) {
      btnMinus.addEventListener('click', () => {
        if (guests > 8) {
          guests -= 1;
          recalculateParty();
        }
      });

      btnPlus.addEventListener('click', () => {
        if (guests < 50) {
          guests += 1;
          recalculateParty();
        }
      });
    }

    if (tierCards.length) {
      tierCards.forEach((card) => {
        card.addEventListener('click', () => {
          tierCards.forEach((c) => c.classList.remove('selected'));
          card.classList.add('selected');
          tierPrice = parseInt(card.dataset.price, 10) || 38;
          tierName = card.dataset.tierName || 'The Glow Master';
          recalculateParty();
        });
      });
    }

    if (addonCards.length) {
      addonCards.forEach((card) => {
        card.addEventListener('click', () => {
          card.classList.toggle('active');
          const toggleBox = card.querySelector('.addon-toggle-box');
          if (toggleBox) {
            toggleBox.textContent = card.classList.contains('active') ? '✓' : '';
          }
          recalculateParty();
        });
      });
    }

    // 3. Feast Menu Tabs
    const feastTabs = document.querySelectorAll('.feast-tab-btn');
    const feastItems = document.querySelectorAll('.feast-item-card');

    if (feastTabs.length && feastItems.length) {
      feastTabs.forEach((tab) => {
        tab.addEventListener('click', () => {
          feastTabs.forEach((t) => t.classList.remove('active'));
          tab.classList.add('active');
          const cat = tab.dataset.category;

          feastItems.forEach((item) => {
            if (cat === 'all' || item.dataset.category === cat) {
              item.style.display = 'flex';
            } else {
              item.style.display = 'none';
            }
          });
        });
      });
    }

    // 4. Scratch Ticket Bonus
    const scratchBtn = document.getElementById('btnScratchBonus');
    const scratchResult = document.getElementById('scratchResultText');

    if (scratchBtn && scratchResult) {
      scratchBtn.addEventListener('click', () => {
        scratchBtn.style.display = 'none';
        scratchResult.innerHTML = '<span style="color: var(--accent-gold); font-weight: 800;">1,500 BONUS ARCADE TICKETS UNLOCKED!</span><br><small style="color: var(--text-secondary);">Use code GLOW300 at lane checkout.</small>';
      });
    }
  }

  /* --------------------------------------------------------------------------
     13. Pricing Terminal & Exchange Radar Engine
     -------------------------------------------------------------------------- */
  function initPricingTerminalSystem() {
    // 1. Pricing Radar HUD
    const radarBtns = document.querySelectorAll('.radar-pill-btn');
    const bandTitle = document.getElementById('radarBandTitle');
    const rateHourly = document.getElementById('radarRateHourly');
    const rateBowler = document.getElementById('radarRateBowler');
    const rateShoe = document.getElementById('radarRateShoe');
    const savingsTag = document.getElementById('radarSavingsTag');
    const bandDesc = document.getElementById('radarBandDesc');

    const radarData = {
      matinee: {
        title: 'Weekday Matinee (Mon–Thu before 5 PM)',
        hourly: '$34',
        bowler: '$7.00',
        shoe: 'FREE',
        tag: 'Smart Bowler Saver ✦ Save 40%',
        desc: 'Enjoy tranquil open lanes, unhurried practice frames, and complimentary rental shoes with every lane booking.'
      },
      prime: {
        title: 'Weekday Prime (Mon–Thu 5 PM–11 PM)',
        hourly: '$48',
        bowler: '$9.50',
        shoe: '$5.00',
        tag: 'Standard Evening Session',
        desc: 'Our signature social hours with ambient lounge soundtrack, full craft taphouse service, and lane-side appetizer delivery.'
      },
      cosmic: {
        title: 'Friday Cosmic Glow (7 PM–1 AM)',
        hourly: '$58',
        bowler: '$11.00',
        shoe: '$5.00',
        tag: 'UV Blacklight + Live DJ',
        desc: 'Pulsing dance lights, high-energy house beats, glowing neon pins, and runway laser effects across all 24 lanes.'
      },
      weekend: {
        title: 'Weekend Peak (Saturday & Sunday All Day)',
        hourly: '$64',
        bowler: '$12.50',
        shoe: '$5.00',
        tag: 'High Demand Slot',
        desc: 'Family weekend bowling with full access to the arcade parlor, mezzanine bar, and interactive multi-tier challenges.'
      }
    };

    if (radarBtns.length && bandTitle) {
      radarBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          radarBtns.forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');
          const band = btn.dataset.band;
          if (radarData[band]) {
            bandTitle.textContent = radarData[band].title;
            if (rateHourly) rateHourly.textContent = radarData[band].hourly;
            if (rateBowler) rateBowler.textContent = radarData[band].bowler;
            if (rateShoe) rateShoe.textContent = radarData[band].shoe;
            if (savingsTag) savingsTag.textContent = radarData[band].tag;
            if (bandDesc) bandDesc.textContent = radarData[band].desc;
          }
        });
      });
    }

    // 2. Arcade Exchange Board Selector
    const exchangeRows = document.querySelectorAll('.exchange-row-item');
    const displayCredits = document.getElementById('calcCreditsDisplay');
    const displayBonus = document.getElementById('calcBonusDisplay');
    const displayMins = document.getElementById('calcMinutesDisplay');

    if (exchangeRows.length && displayCredits) {
      exchangeRows.forEach((row) => {
        row.addEventListener('click', () => {
          exchangeRows.forEach((r) => r.classList.remove('active'));
          row.classList.add('active');
          const credits = row.dataset.credits;
          const bonus = row.dataset.bonus;
          const mins = row.dataset.mins;

          if (displayCredits) displayCredits.textContent = credits;
          if (displayBonus) displayBonus.textContent = bonus;
          if (displayMins) displayMins.textContent = mins;
        });
      });
    }
  }

  // Initialize all global components when DOM is ready
  /* --------------------------------------------------------------------------
     14. Contact Dispatch & Live Status Engine
     -------------------------------------------------------------------------- */
  function initContactDispatchSystem() {
    const deptBtns = document.querySelectorAll('.dept-pill-btn');
    const deptSelect = document.getElementById('contactDeptSelect');
    const contactForm = document.getElementById('contactDispatchForm');

    if (deptBtns.length && deptSelect) {
      deptBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          deptBtns.forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');
          const deptVal = btn.dataset.dept;
          if (deptVal) {
            deptSelect.value = deptVal;
          }
        });
      });

      deptSelect.addEventListener('change', () => {
        const val = deptSelect.value;
        deptBtns.forEach((btn) => {
          if (btn.dataset.dept === val) {
            btn.classList.add('active');
          } else {
            btn.classList.remove('active');
          }
        });
      });
    }

    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('contactName');
        const emailInput = document.getElementById('contactEmail');
        const msgInput = document.getElementById('contactMessage');
        const deptName = deptSelect ? deptSelect.options[deptSelect.selectedIndex].text : 'Concierge';

        if (!nameInput.value.trim() || !emailInput.value.trim() || !msgInput.value.trim()) {
          alert('Please fill out all required fields before dispatching your message.');
          return;
        }

        alert(`Thank you, ${nameInput.value.trim()}! Your message has been routed directly to the ${deptName} team. Our direct response window is under 2 hours.`);
        contactForm.reset();
      });
    }
  }

  /* --------------------------------------------------------------------------
     15. Dedicated Login & Registration Terminal
     -------------------------------------------------------------------------- */
  function initLoginPortalSystem() {
    const tabSignIn = document.getElementById('tabSignIn');
    const tabRegister = document.getElementById('tabRegister');
    const portalHeading = document.getElementById('portalHeading');
    const portalSubtext = document.getElementById('portalSubtext');
    const registerFields = document.querySelectorAll('.register-only-field');
    const authSubmitBtn = document.getElementById('authSubmitBtn');
    const authBottomSwitch = document.getElementById('authBottomSwitch');
    const passwordInput = document.getElementById('authPassword');
    const toggleEyeBtn = document.getElementById('togglePasswordEye');
    const authForm = document.getElementById('loginTerminalForm');

    function setAuthMode(mode) {
      if (mode === 'register') {
        if (tabSignIn) tabSignIn.classList.remove('active');
        if (tabRegister) tabRegister.classList.add('active');
        if (portalHeading) portalHeading.textContent = 'Create an account';
        if (portalSubtext) portalSubtext.textContent = 'Enter your details to create your bowler profile & rewards pass';
        registerFields.forEach((f) => f.style.display = 'block');
        if (authSubmitBtn) authSubmitBtn.innerHTML = '<span>REGISTER ACCOUNT &rarr;</span>';
        if (authBottomSwitch) {
          authBottomSwitch.innerHTML = 'Already have an account? <button type="button" class="auth-switch-action" id="btnSwitchSignIn">Sign in now</button>';
          const btnSwitchSignIn = document.getElementById('btnSwitchSignIn');
          if (btnSwitchSignIn) btnSwitchSignIn.addEventListener('click', () => setAuthMode('signin'));
        }
      } else {
        if (tabRegister) tabRegister.classList.remove('active');
        if (tabSignIn) tabSignIn.classList.add('active');
        if (portalHeading) portalHeading.textContent = 'Welcome back';
        if (portalSubtext) portalSubtext.textContent = 'Enter your credentials to access your account dashboard';
        registerFields.forEach((f) => f.style.display = 'none');
        if (authSubmitBtn) authSubmitBtn.innerHTML = '<span>SIGN IN &rarr;</span>';
        if (authBottomSwitch) {
          authBottomSwitch.innerHTML = 'Don\'t have an account? <button type="button" class="auth-switch-action" id="btnSwitchRegister">Register now</button>';
          const btnSwitchRegister = document.getElementById('btnSwitchRegister');
          if (btnSwitchRegister) btnSwitchRegister.addEventListener('click', () => setAuthMode('register'));
        }
      }
    }

    if (tabSignIn && tabRegister) {
      tabSignIn.addEventListener('click', () => setAuthMode('signin'));
      tabRegister.addEventListener('click', () => setAuthMode('register'));
    }

    const initialSwitch = document.getElementById('btnSwitchRegister');
    if (initialSwitch) {
      initialSwitch.addEventListener('click', () => setAuthMode('register'));
    }

    // Password visibility toggle
    if (toggleEyeBtn && passwordInput) {
      toggleEyeBtn.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
      });
    }

    // Forgot password link
    const btnForgot = document.getElementById('btnForgotPassword');
    if (btnForgot) {
      btnForgot.addEventListener('click', () => {
        alert('A password reset instruction link has been dispatched to your email.');
      });
    }

    // Social logins
    const btnGoogle = document.getElementById('btnGoogleLogin');
    if (btnGoogle) {
      btnGoogle.addEventListener('click', () => {
        alert('Google Authentication connected! Redirecting to member dashboard...');
        window.location.href = 'dashboard.html';
      });
    }

    const btnApple = document.getElementById('btnAppleLogin');
    if (btnApple) {
      btnApple.addEventListener('click', () => {
        alert('Apple ID Authentication connected! Redirecting to member dashboard...');
        window.location.href = 'dashboard.html';
      });
    }

    // Form submit
    if (authForm) {
      authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('authEmail').value;
        const isRegister = tabRegister && tabRegister.classList.contains('active');
        
        if (isRegister) {
          alert(`Account successfully created for ${email}! Redirecting to member dashboard...`);
        } else {
          alert(`Welcome back! Authenticated as ${email}. Redirecting to member dashboard...`);
        }
        window.location.href = 'dashboard.html';
      });
    }
  }

  /* --------------------------------------------------------------------------
     16. Member Dashboard Engine
     -------------------------------------------------------------------------- */
  function initDashboardSystem() {
    const userPill = document.getElementById('dashUserDropdown');
    const userMenu = document.getElementById('dashUserMenu');

    if (userPill && userMenu && !userPill.dataset.bound) {
      userPill.dataset.bound = 'true';

      userPill.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = userMenu.classList.contains('show');
        if (isOpen) {
          userMenu.classList.remove('show');
          userPill.setAttribute('aria-expanded', 'false');
        } else {
          userMenu.classList.add('show');
          userPill.setAttribute('aria-expanded', 'true');
        }
      });

      document.addEventListener('click', (e) => {
        if (!userPill.contains(e.target) && !userMenu.contains(e.target)) {
          userMenu.classList.remove('show');
          userPill.setAttribute('aria-expanded', 'false');
        }
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          userMenu.classList.remove('show');
          userPill.setAttribute('aria-expanded', 'false');
        }
      });
    }

    const btnBriefing = document.getElementById('btnConfirmBriefing');
    if (btnBriefing && !btnBriefing.dataset.bound) {
      btnBriefing.dataset.bound = 'true';
      btnBriefing.addEventListener('click', () => {
        btnBriefing.innerHTML = '<span>✓ BRIEFING CONFIRMED</span>';
        btnBriefing.style.background = 'linear-gradient(135deg, #7B0D27, #4D0717)';
        btnBriefing.style.borderColor = 'rgba(229, 169, 60, 0.6)';
        btnBriefing.style.color = '#F5BC51';
        btnBriefing.disabled = true;
      });
    }

    const sideBtns = document.querySelectorAll('.dash-nav-btn');
    if (sideBtns.length) {
      sideBtns.forEach((btn) => {
        btn.addEventListener('click', (e) => {
          if (!btn.getAttribute('href') || btn.getAttribute('href').startsWith('#')) {
            e.preventDefault();
            sideBtns.forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');
          }
        });
      });
    }

    const btnLogout = document.getElementById('dashLogoutBtn');
    if (btnLogout) {
      btnLogout.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Are you sure you want to sign out of your Strike & Pin member session?')) {
          window.location.href = 'index.html';
        }
      });
    }
  }

  // --- 16. About Page System (Interactive Facility Zones) ---
  function initAboutPageSystem() {
    const zoneBtns = document.querySelectorAll('.about-zone-btn');
    const zonePanes = document.querySelectorAll('.about-zone-pane');
    if (!zoneBtns.length) return;

    zoneBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetZone = btn.dataset.zone;
        zoneBtns.forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        zonePanes.forEach((pane) => {
          if (pane.id === `zone-${targetZone}`) {
            pane.classList.add('active');
          } else {
            pane.classList.remove('active');
          }
        });
      });
    });
  }

  // Initialize all global components when DOM is ready
  function initAllGlobalSystems() {
    initPreloader();
    initDarkMode();
    initRTL();
    initDesktopDropdown();
    initMobileMenu();
    initActiveNav();
    initScrollToTop();
    initLaneCalculator();
    initBookingEngine();
    initFaqAccordion();
    initTournamentBracket();
    initBirthdayPartySystem();
    initPricingTerminalSystem();
    initContactDispatchSystem();
    initLoginPortalSystem();
    initDashboardSystem();
    initAboutPageSystem();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllGlobalSystems);
  } else {
    initAllGlobalSystems();
  }

})();





