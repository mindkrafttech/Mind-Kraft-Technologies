// mindkraft-loader.js - FINAL CORRECTED VERSION (November 10, 2025 10:45 PM IST)
(() => {
  // ONLY RUN ONCE PER SESSION (Close & reopen = shows again)
  if (sessionStorage.getItem('mindkraft_loader_shown')) return;

  // BLOCK ALL INTERACTIONS
  document.documentElement.style.overflow = 'hidden';
  document.body.style.pointerEvents = 'none';

  const loaderHTML = `
    <div id="mindkraft-loader">
      <div class="loader-container">
        <div class="neural-brain">
          <div class="brain-glow"></div>
          <div class="brain-lines"></div>
        </div>
        <div class="loader-text">
          <h1><span>MIND</span> <span>KRAFT</span></h1>
          <h2>TECHNOLOGIES</h2>
          <p>Building Tomorrow's Tech Leaders</p>
        </div>
        <div class="progress-container">
          <div class="progress-bar">
            <div class="progress-fill"></div>
            <span class="progress-text">0%</span>
          </div>
        </div>
        <div class="status">Initializing Neural Network...</div>
      </div>
      <div class="bg-particles"></div>
    </div>
  `;

  document.body.insertAdjacentHTML('afterbegin', loaderHTML);

  // Generate floating particles
  const particles = document.querySelector('.bg-particles');
  for (let i = 0; i < 50; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + 'vw';
    p.style.animationDelay = Math.random() * 6 + 's';
    p.style.background = i % 3 === 0 ? '#ffd14a' : i % 2 === 0 ? '#d400ff' : '#216892';
    particles.appendChild(p);
  }

  // Progress animation
  let progress = 0;
  const progressFill = document.querySelector('.progress-fill');
  const progressText = document.querySelector('.progress-text');
  const status = document.querySelector('.status');

  const messages = [
    "Initializing Neural Network...",
    "Loading AI Engine...",
    "Connecting to Quantum Core...",
    "Activating Mind Kraft...",
    "Welcome to the Future!"
  ];

  const interval = setInterval(() => {
    progress += Math.random() * 16 + 8;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
    }
    progressFill.style.width = progress + '%';
    progressText.textContent = Math.round(progress) + '%';

    if (progress > 20 && progress < 40) status.textContent = messages[1];
    if (progress > 40 && progress < 60) status.textContent = messages[2];
    if (progress > 60 && progress < 80) status.textContent = messages[3];
    if (progress >= 80) status.textContent = messages[4];
  }, 280);

  // FINAL ANIMATION + TRIGGER POPUP AFTER 3 SECONDS
  setTimeout(() => {
    const loader = document.getElementById('mindkraft-loader');
    if (loader) {
      loader.classList.add('complete');
      status.textContent = "Welcome to MIND KRAFT TECHNOLOGIES";
    }

    setTimeout(() => {
      document.getElementById('mindkraft-loader')?.remove();
      document.documentElement.style.overflow = '';
      document.body.style.pointerEvents = '';

      // MARK LOADER AS SEEN
      sessionStorage.setItem('mindkraft_loader_shown', 'true');

      // TRIGGER POPUP + PARTICLES AFTER 3 SECONDS
      setTimeout(() => {
        if (typeof window.triggerMindKraftPopup === 'function') {
          window.triggerMindKraftPopup();
        }
      }, 3000);

      // SAFE TO RUN home.js FUNCTIONS
      if (typeof initHomePage === 'function') initHomePage();
      if (typeof startAnimations === 'function') startAnimations();

    }, 1200); // Wait for fade-out

  }, 4200); // Total loader time
})();