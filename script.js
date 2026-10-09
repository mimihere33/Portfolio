/**
 * Portfolio Interactive Logic & Cute Sound Synthesizer
 * - Folder card tab switching (3 top tabs, 3 bottom tabs)
 * - 6-petal rotating flower hover & click interactions
 * - Cute Web Audio API sound effects (no external audio files needed!)
 * - Sound mute/unmute toggle with localStorage persistence
 * - Dark / Light theme toggle with localStorage persistence
 * - Copy email helper & form feedback
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. CUTE SOUND SYNTHESIZER (Web Audio API)
  // =========================================================================
  let audioCtx = null;
  let isMuted = localStorage.getItem('portfolio_sound_muted') === 'true';

  // Pentatonic notes for 6 petals (C5, D5, E5, G5, A5, C6) - always sounds lovely!
  const petalFrequencies = [523.25, 587.33, 659.25, 783.99, 880.00];

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  /**
   * Play a gentle musical pop/bell when hovering or clicking a petal
   */
  function playPetalSound(index = 0) {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const baseFreq = petalFrequencies[index % petalFrequencies.length];
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      // Subtle pitch bend upwards for cute bounce
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.05, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch (e) {
      // Audio fallback silent
    }
  }

  /**
   * Play a gentle chime when card changes
   */
  function playCardChime() {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const freqs = [659.25, 987.77]; // E5, B5 soft chord
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.04);

        gain.gain.setValueAtTime(0.08, ctx.currentTime + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.04 + 0.28);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.04);
        osc.stop(ctx.currentTime + idx * 0.04 + 0.3);
      });
    } catch (e) {}
  }

  /**
   * Play a cute soft bubble pop for button clicks
   */
  function playCuteClick() {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.06);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch (e) {}
  }

  /**
   * Play a mechanical/toggle switch pop
   */
  function playToggleSound() {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {}
  }


  // =========================================================================
  // 2. MUTE BUTTON SETUP
  // =========================================================================
  const soundToggleBtn = document.getElementById('soundToggle');
  const soundStateText = soundToggleBtn ? soundToggleBtn.querySelector('.state-text') : null;

  function updateMuteUI() {
    if (isMuted) {
      document.body.classList.add('sound-muted');
      if (soundStateText) soundStateText.textContent = 'OFF';
      if (soundToggleBtn) soundToggleBtn.setAttribute('title', 'Sound effects: OFF (Click to turn ON)');
    } else {
      document.body.classList.remove('sound-muted');
      if (soundStateText) soundStateText.textContent = 'ON';
      if (soundToggleBtn) soundToggleBtn.setAttribute('title', 'Sound effects: ON (Click to turn OFF)');
    }
  }
  updateMuteUI();

  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      // First interaction enables audio context
      getAudioContext();
      isMuted = !isMuted;
      localStorage.setItem('portfolio_sound_muted', isMuted);
      updateMuteUI();
      if (!isMuted) {
      }
    });
  }


  // =========================================================================
  // 3. DARK / LIGHT THEME TOGGLE
  // =========================================================================
  const themeToggleBtn = document.getElementById('themeToggle');
  const htmlRoot = document.documentElement;

  // Check saved theme or system preference
  const savedTheme = localStorage.getItem('portfolio_theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
  htmlRoot.setAttribute('data-theme', initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';

      htmlRoot.setAttribute('data-theme', newTheme);
      localStorage.setItem('portfolio_theme', newTheme);
    });
  }


  // =========================================================================
  // 4. CARD & FLOWER SYNC CONTROLLER
  // =========================================================================
  const cardNames = {
    'about': 'About Me',
    'skills': 'Skills',
    'projects': 'Projects',
    'resume': 'Resume',
    'contact': 'Contact Me'
  };

  const allTabs = document.querySelectorAll('.folder-tabs .tab-btn');
  const allCards = document.querySelectorAll('.folder-body .card-panel');
  const allPetals = document.querySelectorAll('.flower-wheel .petal');
  const flowerWheel = document.getElementById('flowerWheel');
  const petalIndicator = document.getElementById('petalIndicator');
  const indicatorName = petalIndicator ? petalIndicator.querySelector('.indicator-name') : null;

  let currentActiveTarget = 'about';

  /**
   * Switch active card, synchronize tabs, update flower petal highlights
   */
  function switchCard(targetId, options = { playSound: true, soundType: 'chime', petalIndex: 0 }) {
    if (!targetId) return;

    // Normalize target ID in case it comes as "#card-projects" or "projects"
    const cleanId = targetId.replace('#', '').replace('card-', '');
    if (!cardNames[cleanId]) return;

    if (currentActiveTarget === cleanId && !options.force) {
      // Already active, still trigger sound if user tapped
      if (options.playSound) {
        if (options.soundType === 'petal') {
          playPetalSound(options.petalIndex);
        } else {
          playCuteClick();
        }
      }
      return;
    }

    currentActiveTarget = cleanId;

    // 1. Update Folder Tabs
    allTabs.forEach(tab => {
      const isMatch = tab.getAttribute('data-tab') === cleanId;
      tab.classList.toggle('active', isMatch);
      tab.setAttribute('aria-selected', isMatch ? 'true' : 'false');
    });

    // 2. Update Card Panels
    allCards.forEach(card => {
      const isMatch = card.id === `card-${cleanId}`;
      card.classList.toggle('active', isMatch);
    });

    // 3. Update Flower Petals Active State
    allPetals.forEach(petal => {
      const isMatch = petal.getAttribute('data-target') === cleanId;
      petal.classList.toggle('active', isMatch);
    });

    // 4. Update Status Indicator below flower
    if (indicatorName && cardNames[cleanId]) {
      indicatorName.textContent = cardNames[cleanId];
    }

    // 5. Sound trigger
    if (options.playSound) {
      if (options.soundType === 'petal') {
        playPetalSound(options.petalIndex);
      } else {
        playCardChime();
      }
    }
  }


  // -------------------------------------------------------------------------
  // Event: Folder Tabs Click (Top 3 & Bottom 3)
  // -------------------------------------------------------------------------
  allTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      const target = tab.getAttribute('data-tab');
      switchCard(target, { playSound: true, soundType: 'chime' });
    });
  });


  // -------------------------------------------------------------------------
  // Event: Flower Petal Hover & Click
  // "flower rotates slowly until hovered, when hovered over a petal it changes
  // the card into the associated with that card"
  // -------------------------------------------------------------------------
  allPetals.forEach((petal, index) => {
    const target = petal.getAttribute('data-target');

    // On Petal Hover (Mouse Enter) -> Switch card & play cute tone
    petal.addEventListener('mouseenter', () => {
      // Pause rotation
      if (flowerWheel) flowerWheel.classList.add('paused');
      switchCard(target, { playSound: true, soundType: 'petal', petalIndex: index });
    });

    // On Petal Click -> Switch card
    petal.addEventListener('click', () => {
      switchCard(target, { playSound: true, soundType: 'petal', petalIndex: index, force: true });
    });
  });

  // When mouse leaves the flower entirely, resume rotation smoothly
  if (flowerWheel) {
    flowerWheel.addEventListener('mouseleave', () => {
      flowerWheel.classList.remove('paused');
    });
  }


  // -------------------------------------------------------------------------
  // Event: In-Card Action Buttons (e.g., "Say Hello 👋", "See My Work 📁")
  // -------------------------------------------------------------------------
  document.querySelectorAll('.go-to-card').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = btn.getAttribute('data-target');
      switchCard(target, { playSound: true, soundType: 'chime' });
    });
  });


  // =========================================================================
  // 5. COPY EMAIL BUTTON
  // =========================================================================
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const userEmailElem = document.getElementById('userEmail');

  if (copyEmailBtn && userEmailElem) {
    copyEmailBtn.addEventListener('click', () => {
      const email = userEmailElem.textContent.trim();
      navigator.clipboard.writeText(email).then(() => {
        playCuteClick();
        const origText = copyEmailBtn.innerHTML;
        copyEmailBtn.innerHTML = 'Copied! ✨';
        copyEmailBtn.style.borderColor = 'var(--accent-color)';
        setTimeout(() => {
          copyEmailBtn.innerHTML = origText;
          copyEmailBtn.style.borderColor = '';
        }, 2000);
      }).catch(() => {
        // Fallback prompt if clipboard access blocked
        playCuteClick();
        prompt('Copy your email here:', email);
      });
    });
  }


  // =========================================================================
  // 6. CONTACT FORM SUBMISSION FEEDBACK
  // =========================================================================
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      playCuteClick();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        const origText = submitBtn.textContent;
        submitBtn.textContent = 'Message Sent! 🌸💌';
        submitBtn.disabled = true;
        setTimeout(() => {
          contactForm.reset();
          submitBtn.textContent = origText;
          submitBtn.disabled = false;
        }, 2500);
      }
    });
  }


  // =========================================================================
  // 7. AUTO-UPDATE FOOTER YEAR
  // =========================================================================
  const yearElem = document.getElementById('currentYear');
  if (yearElem) {
    yearElem.textContent = new Date().getFullYear();
  }

});
