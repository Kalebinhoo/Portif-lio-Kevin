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

const currentYearElement = document.getElementById('currentYear');
if (currentYearElement) {
  currentYearElement.textContent = String(new Date().getFullYear());
}
