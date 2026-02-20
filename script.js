const elements = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
});
elements.forEach(el => observer.observe(el));

const skillsTabs = document.querySelectorAll('.skills-tab');
const skillCards = document.querySelectorAll('.skill-card');

if (skillsTabs.length && skillCards.length) {
  const filterSkills = (filter) => {
    skillCards.forEach(card => {
      const cardType = card.dataset.skillType || 'frontend';
      const matches = filter === 'all' || cardType === filter;
      card.classList.toggle('hidden', !matches);
    });
  };

  skillsTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      if (tab.classList.contains('active')) return;
      skillsTabs.forEach(btn => btn.classList.remove('active'));
      tab.classList.add('active');
      filterSkills(tab.dataset.skillFilter || 'all');
    });
  });

  const initialFilter = document.querySelector('.skills-tab.active')?.dataset.skillFilter || 'all';
  filterSkills(initialFilter);
}

const bioElement = document.querySelector('.bio');
if (bioElement) {
  const textElement = bioElement.querySelector('.bio-text');
  const targetText = (bioElement.dataset.text || textElement?.textContent || '').trim();
  const TYPE_DELAY = 90;
  const DELETE_DELAY = 45;
  const HOLD_DELAY = 1800;
  let index = 0;
  let isDeleting = false;

  if (targetText && textElement) {
    textElement.textContent = '';
    bioElement.setAttribute('aria-label', targetText);

    const typeLoop = () => {
      textElement.textContent = targetText.slice(0, index);

      if (!isDeleting && index < targetText.length) {
        index += 1;
        setTimeout(typeLoop, TYPE_DELAY);
      } else if (!isDeleting && index === targetText.length) {
        setTimeout(() => {
          isDeleting = true;
          typeLoop();
        }, HOLD_DELAY);
      } else if (isDeleting && index > 0) {
        index -= 1;
        setTimeout(typeLoop, DELETE_DELAY);
      } else {
        isDeleting = false;
        setTimeout(typeLoop, 500);
      }
    };

    setTimeout(typeLoop, 500);
  }
}

const pixelCanvas = document.getElementById('pixelGrid');
if (pixelCanvas) {
  const ctx = pixelCanvas.getContext('2d');
  const GRID_VARIABLE = '--grid-size';
  const mobileMedia = window.matchMedia('(max-width: 768px)');
  const BOOST = 1;
  let pixelSize = 42;
  let decay = 0.02;
  let frameInterval = 1000 / 60;
  let cols = 0;
  let rows = 0;
  let cells = new Float32Array(0);
  let lastFrame = 0;

  function readGridSize() {
    const value = parseFloat(getComputedStyle(document.documentElement).getPropertyValue(GRID_VARIABLE));
    return Number.isFinite(value) ? value : 42;
  }

  function applyPerformanceProfile() {
    const fps = mobileMedia.matches ? 45 : 60;
    frameInterval = 1000 / fps;
    decay = mobileMedia.matches ? 0.035 : 0.02;
  }

  function resizeCanvas() {
    pixelSize = readGridSize();
    const width = window.innerWidth;
    const height = window.innerHeight;
    const dpr = window.devicePixelRatio || 1;
    pixelCanvas.style.width = `${width}px`;
    pixelCanvas.style.height = `${height}px`;
    pixelCanvas.width = Math.floor(width * dpr);
    pixelCanvas.height = Math.floor(height * dpr);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    cols = Math.ceil(width / pixelSize);
    rows = Math.ceil(height / pixelSize);
    cells = new Float32Array(cols * rows);
  }

  function energize(x, y) {
    if (!cells.length) return;
    const col = Math.floor(x / pixelSize);
    const row = Math.floor(y / pixelSize);
    if (col < 0 || row < 0 || col >= cols || row >= rows) return;
    const idx = row * cols + col;
    cells[idx] = Math.min(1, cells[idx] + BOOST);
  }

  function renderFrame() {
    ctx.clearRect(0, 0, pixelCanvas.width, pixelCanvas.height);
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const idx = row * cols + col;
        const value = cells[idx];
        if (value <= 0) continue;
        const nextValue = Math.max(0, value - decay);
        cells[idx] = nextValue;
        const alpha = Math.min(1, nextValue);
        ctx.fillStyle = `rgba(255, 32, 32, ${alpha})`;
        ctx.fillRect(col * pixelSize, row * pixelSize, pixelSize - 1, pixelSize - 1);
      }
    }
  }

  function animationLoop(timestamp = 0) {
    if (timestamp - lastFrame >= frameInterval) {
      lastFrame = timestamp;
      renderFrame();
    }
    requestAnimationFrame(animationLoop);
  }

  function shouldIgnorePixel(eventTarget) {
    const blockSelectors = [
      '.skills-sidebar',
      '.skills-tab',
      '.badges-modal',
      '.modal',
      '[data-modal]',
      '[role="dialog"]'
    ];
    return blockSelectors.some(sel => eventTarget?.closest(sel));
  }

  function handlePointer(event) {
    if (event.pointerType === 'touch' || shouldIgnorePixel(event.target)) return;
    energize(event.clientX, event.clientY);
  }

  function handleTouch(event) {
    const touch = event.touches[0];
    if (!touch || shouldIgnorePixel(event.target)) return;
    energize(touch.clientX, touch.clientY);
  }

  applyPerformanceProfile();
  resizeCanvas();
  requestAnimationFrame(animationLoop);
  window.addEventListener('pointermove', handlePointer);
  window.addEventListener('pointerdown', handlePointer);
  window.addEventListener('touchstart', handleTouch, { passive: true });
  window.addEventListener('touchmove', handleTouch, { passive: true });
  window.addEventListener('resize', resizeCanvas);

  const mediaChangeHandler = () => {
    applyPerformanceProfile();
    resizeCanvas();
  };

  if (mobileMedia.addEventListener) {
    mobileMedia.addEventListener('change', mediaChangeHandler);
  } else if (mobileMedia.addListener) {
    mobileMedia.addListener(mediaChangeHandler);
  }
}

const currentYearElement = document.getElementById('currentYear');
if (currentYearElement) {
  currentYearElement.textContent = String(new Date().getFullYear());
}
