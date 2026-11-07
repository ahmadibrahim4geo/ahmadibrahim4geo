'use strict';
(() => {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let pending = false;
  const navigation = [...document.querySelectorAll('#primary-nav a')].map(link => ({link, section:document.querySelector(link.getAttribute('href'))})).filter(item => item.section);
  function progress() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => {
      const range = document.documentElement.scrollHeight - innerHeight;
      const value = range > 0 ? Math.min(100, Math.max(0, scrollY / range * 100)) : 0;
      document.querySelector('.site-header').style.setProperty('--scroll-progress', value + '%');
      document.getElementById('back-to-top').classList.toggle('show', scrollY > 600);
      let current = null, closestTop = -Infinity;
      navigation.forEach(item => {
        const top = item.section.getBoundingClientRect().top;
        if (top <= innerHeight * .32 && top > closestTop) { current = item; closestTop = top; }
      });
      navigation.forEach(item => {
        item.link.classList.toggle('is-current', item === current);
        if (item === current) item.link.setAttribute('aria-current','location');
        else item.link.removeAttribute('aria-current');
      });
      pending = false;
    });
  }
  window.addEventListener('scroll', progress, {passive:true});
  window.addEventListener('resize', progress);
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), {threshold:.06});
    document.querySelectorAll('.section-heading, .featured-project, .workflow article, .experience-row, .message-panel').forEach(element => {
      element.classList.add('reveal-ready'); observer.observe(element);
    });
  }
  progress();
})();
