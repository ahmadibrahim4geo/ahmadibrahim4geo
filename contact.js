'use strict';
/* The provider's multipart JSON endpoint keeps delivery on the page. Success
   requires an HTTP success response and a literal JSON {ok: true}. */
(() => {
  const form = document.getElementById('contact-form');
  const picker = document.getElementById('message-files');
  const list = document.getElementById('attachment-list');
  const drop = document.getElementById('attachment-drop');
  const send = document.getElementById('send-message');
  const status = document.getElementById('contact-status');
  const endpoint = window.PORTFOLIO_CONTACT?.endpoint || '';
  const localEndpoint = ['localhost','127.0.0.1'].includes(location.hostname) && endpoint === location.origin + '/test-delivery';
  const ready = /^https:\/\/formsubmit\.app\/f\/[a-zA-Z0-9_-]+$/.test(endpoint) || localEndpoint;
  const renderedAt = Date.now();
  const LIMIT = 4_000_000; // Leave room below the provider's ~4.5 MB request cap.
  const allowed = new Set(['pdf','doc','docx','xls','xlsx','csv','txt','png','jpg','jpeg','webp','zip','kml','kmz','geojson']);
  let files = [];
  let submission = null;
  let messageKey = '';
  let messageKind = '';
  const isArabic = () => document.documentElement.lang === 'ar';
  const choose = (en, ar) => isArabic() ? ar : en;
  const messages = {
    sending: ['Sending your message and attachments. Please keep this page open…', 'جارٍ إرسال الرسالة والمرفقات. يُرجى إبقاء الصفحة مفتوحة…'],
    accepted: ['Your message was received. Thank you for getting in touch.', 'تم استلام رسالتك. شكرًا لتواصلك.'],
    unconfirmed: ['We could not confirm acceptance. Your message and files are still here. Keep a copy before retrying, as the previous request may still be processing.', 'لم نتمكن من تأكيد قبول الرسالة. رسالتك ومرفقاتك ما زالت هنا. احتفظ بنسخة قبل إعادة المحاولة، فقد يكون الطلب السابق قيد المعالجة.'],
    rejected: ['The service could not accept your message. Your text and files are preserved. Please try again later or use the contact buttons above.', 'تعذر قبول الرسالة من الخدمة. تم الاحتفاظ بالنص والمرفقات. حاول لاحقًا أو استخدم وسائل التواصل بالأعلى.'],
    rateLimited: ['Please wait a minute before sending again. Your message and attachments are preserved.', 'يُرجى الانتظار دقيقة قبل المحاولة مجددًا. رسالتك ومرفقاتك محفوظة في الصفحة.'],
    notReady: ['Direct messages are temporarily unavailable. Please use the email or WhatsApp buttons above.', 'الرسائل المباشرة غير متاحة مؤقتًا. يُرجى استخدام البريد الإلكتروني أو واتساب بالأعلى.'],
    tooMany: ['Please choose up to 3 attachments.', 'يُرجى اختيار 3 مرفقات بحد أقصى.'],
    tooLarge: ['The combined attachment size must be 4 MB or less.', 'يجب ألا يتجاوز إجمالي حجم المرفقات 4 ميجابايت.'],
    unsupported: ['Choose PDF, Office documents, CSV/TXT, images, ZIP, KML/KMZ or GeoJSON files.', 'اختر PDF أو مستندات Office أو CSV/TXT أو صورًا أو ZIP أو KML/KMZ أو GeoJSON.'],
    empty: ['Please enter a name, subject and a message of at least 10 characters.', 'يُرجى كتابة الاسم وعنوان الرسالة ونص لا يقل عن 10 أحرف.'],
    unavailable: ['In-page delivery requires an HTTPS website. Please use the published portfolio.', 'الإرسال داخل الصفحة يتطلب موقعًا عبر HTTPS. يُرجى استخدام البورتفوليو المنشور.']
  };
  function show(key, kind = '') {
    messageKey = key; messageKind = kind;
    status.textContent = key ? messages[key][isArabic() ? 1 : 0] : '';
    status.dataset.kind = kind;
  }
  function refreshLabels() {
    if (messageKey) show(messageKey, messageKind);
    if (submission) send.querySelector('span').textContent = choose('Sending…', 'جارٍ الإرسال…');
    picker.setAttribute('aria-label', choose('Choose optional attachments', 'اختيار مرفقات اختيارية'));
    renderFiles();
  }
  function renderFiles() {
    list.replaceChildren();
    files.forEach((file, index) => {
      const row = document.createElement('li');
      const name = document.createElement('span'); name.className = 'attachment-name'; name.textContent = file.name;
      const size = document.createElement('span'); size.className = 'attachment-size'; size.dir = 'ltr'; size.textContent = (file.size / 1_000_000).toFixed(2) + ' MB';
      const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'attachment-remove'; remove.textContent = '×'; remove.disabled = !!submission;
      remove.setAttribute('aria-label', choose('Remove attachment: ', 'حذف المرفق: ') + file.name);
      remove.addEventListener('click', () => { files.splice(index, 1); renderFiles(); });
      row.append(name, size, remove); list.append(row);
    });
  }
  function addFiles(incoming) {
    if (submission) return;
    const next = [...files];
    for (const file of incoming) {
      if (!allowed.has(file.name.split('.').pop().toLowerCase())) { show('unsupported', 'error'); return; }
      if (!next.some(old => old.name === file.name && old.size === file.size && old.lastModified === file.lastModified)) next.push(file);
    }
    if (next.length > 3) { show('tooMany', 'error'); return; }
    if (next.reduce((sum, file) => sum + file.size, 0) > LIMIT) { show('tooLarge', 'error'); return; }
    files = next; show(''); renderFiles();
  }
  picker.addEventListener('change', () => { addFiles([...picker.files]); picker.value = ''; });
  ['dragenter','dragover'].forEach(event => drop.addEventListener(event, e => { e.preventDefault(); if (!submission) drop.classList.add('drag-over'); }));
  ['dragleave','drop'].forEach(event => drop.addEventListener(event, e => { e.preventDefault(); drop.classList.remove('drag-over'); }));
  drop.addEventListener('drop', e => addFiles([...e.dataTransfer.files]));
  function busy(value) {
    form.setAttribute('aria-busy', String(value));
    send.disabled = value || !ready; picker.disabled = value;
    form.querySelectorAll('.form-field input, .form-field textarea').forEach(input => { input.readOnly = value; });
    send.querySelector('span').textContent = value ? choose('Sending…','جارٍ الإرسال…') : choose('Send message','إرسال الرسالة');
    renderFiles();
  }
  function finish(key, kind) {
    submission = null;
    if (kind === 'success') { form.reset(); files = []; }
    busy(false); show(key, kind);
  }
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (submission || form.elements._gotcha.value) return;
    if (!ready) { show('notReady', 'error'); return; }
    if (!form.reportValidity()) return;
    const name = document.getElementById('sender-name').value.trim();
    const subject = document.getElementById('message-subject').value.trim();
    const message = document.getElementById('message-body').value.trim();
    if (!name || !subject || message.length < 10) { show('empty','error'); return; }
    if (location.protocol !== 'https:' && !['localhost','127.0.0.1'].includes(location.hostname)) { show('unavailable','error'); return; }
    const payload = new FormData(form);
    payload.set('name', name); payload.set('subject', subject); payload.set('message', message);
    payload.set('_subject', 'Portfolio enquiry: ' + subject.replace(/[\r\n]/g, ' '));
    payload.set('_ts', String(renderedAt));
    files.forEach((file, index) => payload.append('attachment' + (index + 1), file, file.name));
    const controller = new AbortController();
    submission = controller;
    busy(true); show('sending');
    const timeout = setTimeout(() => controller.abort(), 40000);
    try {
      const response = await fetch(endpoint, {method:'POST', body:payload, headers:{Accept:'application/json'}, signal:controller.signal, credentials:'omit', redirect:'error'});
      const result = await response.json();
      if (response.ok && result.ok === true) finish('accepted', 'success');
      else finish(result.error?.code === 'rate_limited' ? 'rateLimited' : 'rejected', 'error');
    } catch { finish('unconfirmed', 'error'); }
    finally { clearTimeout(timeout); }
  });
  document.addEventListener('portfolio:language', refreshLabels);
  busy(false);
  refreshLabels();
  if (!ready) show('notReady');
})();
