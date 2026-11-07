'use strict';
(() => {
  const data = window.PORTFOLIO;
  let language = document.documentElement.lang === 'ar' ? 'ar' : 'en';
  let activeFilter = 'all';
  let activeProject = null;
  let projectTrigger = null;
  const select = (en, ar) => language === 'ar' ? ar : en;
  const local = value => Array.isArray(value) ? value[language === 'ar' ? 1 : 0] : value;
  const esc = value => String(value).replace(/[&<>"']/g, x => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
  const dual = (value, tag = 'span', cls = '') => `<${tag}${cls ? ` class="${cls}"` : ''}>${esc(local(value))}</${tag}>`;
  const projectList = document.getElementById('project-list');
  const softwareGrid = document.getElementById('software-grid');
  const atlasList = document.getElementById('atlas-list');
  const nav = document.getElementById('primary-nav');
  const menu = document.getElementById('menu-toggle');
  const dialog = document.getElementById('project-dialog');
  const languageButton = document.getElementById('language-toggle');
  const meta = document.querySelector('meta[name="description"]');
  const englishDescription = meta.content;
  const softwareLogos = {
    'Storm Drainage Calculation Dashboard':'storm-drainage.png','GIS Development Skills':'gis-development-skills.svg',
    'MIRSAD':'mirsad.svg','GeoVision':'geovision.png','SmartCalculator':'smartcalculator.ico',
    'SmartPhotoOrganizer':'smartphoto.ico','RoboTransfer':'robotransfer.ico','DropAndCopy':'dropandcopy.ico',
    'Charge Alert':'chargealert.png','Z EARTH':'zearth-approved.png','FitraShield':'fitrashield-official.png',
    'Ahmad Ibrahim Portfolio':'../ahmad-signature-vector.svg'
  };

  function setMenu(open) {
    nav.classList.toggle('open', open);
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? select('Close navigation', 'إغلاق قائمة التنقل') : select('Open navigation', 'فتح قائمة التنقل'));
  }

  function renderProjects() {
    projectList.innerHTML = data.projects.slice(1).map(project => `<article class="project-row">
      <span class="project-number">${esc(project.number)}</span>
      ${dual(project.kind, 'span', 'project-tag')}
      <div>${dual(project.title, 'h3')}${dual(project.location, 'p', 'project-place')}</div>
      ${dual(project.summary, 'p')}
      <button class="project-button project-open" data-project="${esc(project.id)}" type="button" aria-label="${esc(select('Explore project: ', 'تفاصيل مشروع: ') + local(project.title))}"><span aria-hidden="true">↗</span></button>
    </article>`).join('');
  }

  function renderSoftware() {
    const visible = data.software.filter(item => activeFilter === 'all' || item.group === activeFilter);
    softwareGrid.innerHTML = visible.map(item => `<article class="software-card" data-group="${esc(item.group)}">
      <div class="software-card-top">${softwareLogos[item.name] ? `<span class="software-symbol has-logo" aria-hidden="true"><img src="assets/project-logos/${esc(softwareLogos[item.name])}" alt="" width="40" height="40" loading="lazy"></span>` : ''}${dual(item.tag, 'span', 'software-kind')}</div>
      <h3>${esc(item.name)}</h3>${dual(item.subtitle, 'p', 'software-subtitle')}
      ${dual(item.description, 'p', 'software-description')}
      ${item.status ? dual(item.status, 'span', 'status-note') : ''}
      <div class="software-bottom"><span class="software-stack" dir="ltr">${esc(item.stack)}</span>${item.repo ? `<a class="repo-link" href="https://github.com/ahmadibrahim4geo/${encodeURIComponent(item.repo)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(select('Open ', 'فتح مستودع ') + item.name + select(' on GitHub', ' على GitHub'))}">GitHub ↗</a>` : ''}</div>
    </article>`).join('');
    document.getElementById('software-count').textContent = select(`${visible.length} PROJECTS / 2026`, `${visible.length} مشروعًا / ٢٠٢٦`);
    document.querySelectorAll('[data-filter]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === activeFilter)));
  }

  function renderAtlases() {
    atlasList.innerHTML = data.atlases.map(atlas => `<article class="atlas-item"><span class="atlas-year">${esc(atlas.year)}</span><div>${dual(atlas.title, 'h3')}<p class="atlas-registration"><span>${select('DEPOSIT', 'رقم الإيداع')} <b dir="ltr">${esc(atlas.deposit)}</b></span><span>ISBN <b dir="ltr">${esc(atlas.isbn)}</b></span></p></div></article>`).join('');
  }

  function projectContent(project) {
    const pairs = [
      [select('MY CONTRIBUTION', 'دوري في المشروع'), project.role],
      [select('SCOPE OF WORK', 'نطاق العمل'), project.scope],
      [select('OUTPUTS SUPPORTED', 'المخرجات التي ساهمت في إعدادها'), project.outputs]
    ];
    document.getElementById('dialog-content').innerHTML = `${dual(project.location, 'p', 'dialog-place')}<h2 id="dialog-title">${esc(local(project.title))}</h2><dl class="dialog-details">${pairs.map(([label, value]) => `<div><dt>${esc(label)}</dt><dd>${esc(local(value))}</dd></div>`).join('')}</dl><div class="dialog-footer"><span dir="ltr">${esc(project.tools)}</span><a href="assets/Ahmad_Ibrahim_CV_Final_Improved.pdf?v=6c3df8c0cb" target="_blank" rel="noopener">${select('Read the complete CV ↗', 'عرض السيرة الذاتية الكاملة ↗')}</a></div>`;
  }

  function applyLanguage(next) {
    language = next === 'ar' ? 'ar' : 'en';
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-en][data-ar]').forEach(element => { element.textContent = element.dataset[language]; });
    languageButton.textContent = select('العربية', 'English');
    languageButton.lang = select('ar', 'en');
    languageButton.setAttribute('aria-label', select('Switch to Arabic', 'Switch to English'));
    nav.setAttribute('aria-label', select('Primary navigation', 'التنقل الرئيسي'));
    document.querySelector('.filters').setAttribute('aria-label', select('Filter software projects', 'تصفية المشاريع البرمجية'));
    document.querySelector('.dialog-close').setAttribute('aria-label', select('Close project details', 'إغلاق تفاصيل المشروع'));
    document.querySelector('.brand').setAttribute('aria-label', select('Ahmad Ibrahim — home', 'أحمد إبراهيم — الصفحة الرئيسية'));
    document.querySelector('.portrait').alt = select('Ahmad Ibrahim', 'أحمد إبراهيم');
    document.querySelector('.network-figure img').alt = select('Illustrative drainage network schematic, not a project drawing', 'رسم تخطيطي توضيحي لشبكة تصريف، وليس رسمًا من مشروع فعلي');
    document.querySelectorAll('.contact-links, .hero-social-links').forEach(group => {
      const contacts = group.querySelectorAll('a');
      [['Email Ahmad Ibrahim','مراسلة أحمد إبراهيم بالبريد الإلكتروني'],['WhatsApp','واتساب'],['LinkedIn profile','الملف الشخصي على لينكدإن'],['GitHub profile','الملف الشخصي على GitHub']].forEach((pair, i) => { contacts[i].setAttribute('aria-label', local(pair)); contacts[i].title = local(pair); });
    });
    document.getElementById('back-to-top').setAttribute('aria-label', select('Back to top','العودة إلى أعلى الصفحة'));
    document.title = select('Ahmad Ibrahim — GIS, Stormwater & Geospatial Development', 'أحمد إبراهيم — نظم المعلومات الجغرافية وشبكات الأمطار والتطوير الجغرافي');
    meta.content = select(englishDescription, 'ملف أعمال أحمد إبراهيم في نظم المعلومات الجغرافية للبنية التحتية وشبكات تصريف الأمطار والرسم الهيدرولوجي والبرمجيات الجغرافية وستة أطالس جغرافية مسجلة. مصر والسعودية.');
    renderProjects(); renderSoftware(); renderAtlases();
    if (activeProject) projectContent(activeProject);
    setMenu(false);
    document.dispatchEvent(new CustomEvent('portfolio:language', {detail: language}));
    try { localStorage.setItem('portfolio-lang', language); } catch { /* The page remains usable when storage is disabled. */ }
  }

  languageButton.addEventListener('click', () => applyLanguage(language === 'ar' ? 'en' : 'ar'));
  menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
  document.addEventListener('click', event => {
    if (!nav.contains(event.target) && !menu.contains(event.target)) setMenu(false);
    const trigger = event.target.closest('.project-open');
    if (!trigger) return;
    const project = data.projects.find(item => item.id === trigger.dataset.project);
    if (!project) return;
    activeProject = project; projectTrigger = trigger; projectContent(project);
    dialog.showModal(); document.body.classList.add('dialog-open');
    dialog.querySelector('.dialog-close').focus();
  });
  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => { activeFilter = button.dataset.filter; renderSoftware(); }));
  document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => { document.body.classList.remove('dialog-open'); activeProject = null; projectTrigger?.focus(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') setMenu(false); });
  const mobile = window.matchMedia('(max-width: 1100px)');
  mobile.addEventListener('change', () => setMenu(false));
  applyLanguage(language);
})();
