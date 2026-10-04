const header = document.querySelector('.site-header');
const progress = document.querySelector('.scroll-progress span');
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.main-nav');
const navLinks = [...document.querySelectorAll('.main-nav a')];
const sections = [...document.querySelectorAll('main section[id], footer[id]')];

function updateScrollUI(){
  const y = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${max > 0 ? (y / max) * 100 : 0}%`;
  header.classList.toggle('scrolled', y > 18);
  let current = 'about';
  for (const section of sections){
    if (y >= section.offsetTop - 140) current = section.id;
  }
  navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${current}`));
}
window.addEventListener('scroll', updateScrollUI, {passive:true});
updateScrollUI();

navToggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});
navLinks.forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  navToggle?.setAttribute('aria-expanded','false');
}));

const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.style.setProperty('--delay', `${Number(entry.target.dataset.delay || 0)}ms`);
    requestAnimationFrame(() => entry.target.classList.add('visible'));
    obs.unobserve(entry.target);
  });
}, {threshold:.12});
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const backToTop = document.querySelector('.back-to-top');
backToTop?.addEventListener('click', (event) => {
  event.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

const mobileMedia = window.matchMedia('(max-width: 900px)');
function syncMobileMenu(open){
  if (!nav || !navToggle) return;
  nav.classList.toggle('open', open);
  navToggle.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open && mobileMedia.matches ? 'hidden' : '';
}

navToggle?.addEventListener('click', () => {
  requestAnimationFrame(() => {
    const isOpen = nav?.classList.contains('open');
    document.body.style.overflow = isOpen && mobileMedia.matches ? 'hidden' : '';
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && nav?.classList.contains('open')) syncMobileMenu(false);
});

document.addEventListener('click', (event) => {
  if (!mobileMedia.matches || !nav?.classList.contains('open')) return;
  if (nav.contains(event.target) || navToggle?.contains(event.target)) return;
  syncMobileMenu(false);
});

window.addEventListener('resize', () => {
  if (!mobileMedia.matches && nav?.classList.contains('open')) syncMobileMenu(false);
});

navLinks.forEach(link => link.addEventListener('click', () => {
  document.body.style.overflow = '';
}));
