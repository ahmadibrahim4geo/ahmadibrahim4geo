'use strict';
(() => {
  const canvas = document.getElementById('portfolio-globe');
  const context = canvas.getContext('2d');
  if (!context || !window.d3) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const button = document.getElementById('motion-toggle');
  const reset = document.getElementById('globe-reset');
  let paused = reduced.matches, visible = true, dragging = false;
  let width = 0, height = 0, lastTime = 0, pointer = null, land = null;
  let rotation = [-35, -24, 0];
  const projection = d3.geoOrthographic().clipAngle(90).precision(.5);
  const path = d3.geoPath(projection, context);
  const grid = d3.geoGraticule10();
  function labels() {
    const ar = document.documentElement.lang === 'ar';
    button.setAttribute('aria-pressed', String(paused));
    button.setAttribute('aria-label', paused ? (ar ? 'تشغيل دوران الكرة الأرضية' : 'Resume rotation') : (ar ? 'إيقاف دوران الكرة الأرضية' : 'Pause rotation'));
    button.title = button.getAttribute('aria-label');
    button.innerHTML = paused ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 11 7-11 7Z"/></svg>' : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5v14M15 5v14"/></svg>';
    reset.setAttribute('aria-label', ar ? 'إعادة عرض الكرة الأرضية' : 'Reset globe view');
    canvas.setAttribute('aria-label', ar ? 'كرة أرضية تفاعلية. اسحب أو استخدم مفاتيح الأسهم للدوران.' : 'Interactive world globe. Drag or use arrow keys to rotate.');
    document.body.classList.toggle('motion-paused', paused);
  }
  function draw() {
    if (!land || !width) return;
    context.clearRect(0, 0, width, height);
    projection.rotate(rotation);
    context.beginPath(); path({type:'Sphere'}); context.fillStyle = '#0e1b25'; context.fill();
    context.beginPath(); path(grid); context.strokeStyle = '#29404c'; context.lineWidth = .65; context.stroke();
    context.beginPath(); path(land); context.fillStyle = '#28454e'; context.fill(); context.strokeStyle = '#6b989b'; context.lineWidth = .65; context.stroke();
    context.beginPath(); path({type:'Sphere'}); context.strokeStyle = '#59777d'; context.lineWidth = 1; context.stroke();
    // Regional context, not a client project site or live position.
    for (const point of [[31,27],[45,24]]) {
      if (d3.geoDistance(point, [-rotation[0], -rotation[1]]) < Math.PI / 2) {
        const position = projection(point); context.beginPath(); context.arc(position[0],position[1],3,0,Math.PI*2); context.fillStyle='#d9b77d';context.fill();
      }
    }
  }
  function resize() {
    const rect = canvas.getBoundingClientRect(); width = rect.width; height = rect.height;
    const ratio = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
    context.setTransform(ratio,0,0,ratio,0,0);
    projection.translate([width / 2,height / 2]).scale(Math.min(width,height) * .445); draw();
  }
  function animate(time) {
    const delta = Math.min(time - (lastTime || time), 50); lastTime = time;
    if (!paused && !dragging && visible && !document.hidden) { rotation[0] += delta * .0014; draw(); }
    requestAnimationFrame(animate);
  }
  canvas.addEventListener('pointerdown', event => {
    dragging = true; pointer = [event.clientX,event.clientY,...rotation]; canvas.setPointerCapture(event.pointerId); canvas.classList.add('is-dragging');
  });
  canvas.addEventListener('pointermove', event => {
    if (!dragging || !pointer) return;
    rotation = [pointer[2] + (event.clientX-pointer[0])*.32, Math.max(-75,Math.min(75,pointer[3]-(event.clientY-pointer[1])*.32)),0];draw();
  });
  const release = () => { dragging = false; pointer = null; canvas.classList.remove('is-dragging'); };
  canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',release);
  canvas.addEventListener('keydown', event => {
    const changes = {ArrowLeft:[-4,0],ArrowRight:[4,0],ArrowUp:[0,4],ArrowDown:[0,-4]};
    if (!changes[event.key]) return;
    event.preventDefault();rotation[0]+=changes[event.key][0];rotation[1]=Math.max(-75,Math.min(75,rotation[1]+changes[event.key][1]));draw();
  });
  button.addEventListener('click',()=>{paused=!paused;labels();});
  reset.addEventListener('click',()=>{rotation=[-35,-24,0];draw();});
  reduced.addEventListener('change',()=>{paused=reduced.matches;labels();draw();});
  document.addEventListener('portfolio:language', labels);
  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;}).observe(canvas);
  fetch('assets/maps/land-110m.geojson').then(response=>{if(!response.ok)throw Error('Map unavailable');return response.json();}).then(data=>{
    land=data;resize();canvas.classList.add('is-ready');document.querySelector('.globe-fallback').hidden=true;requestAnimationFrame(animate);
  }).catch(()=>{canvas.hidden=true;button.disabled=true;reset.disabled=true;});
  labels();
})();
