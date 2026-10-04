(() => {
  const $ = id => document.getElementById(id);
  const M = document.body.classList.contains('m');            // мобилка 360×800 или десктоп 1440×900
  const SW = M ? 360 : 1440, SH = M ? 800 : 900;
  const stage = $('stage'), overlay = $('overlay'), card = $('card'), scrim = $('scrim'), popup = $('popup');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const slow = new URLSearchParams(location.search).has('slow');
  const T = ms => reduce ? 1 : ms * (slow ? 3 : 1);
  const wait = ms => new Promise(r => setTimeout(r, ms));
  // фокус ставим явно только при работе с клавиатуры
  let kbd = false;
  addEventListener('keydown', e => { if (e.key === 'Tab' || e.key.startsWith('Arrow') || e.key === 'Enter' || e.key === ' ') kbd = true; }, true);
  addEventListener('pointerdown', () => { kbd = false; }, true);
  const focusTo = (target, quiet) => { if (kbd) target && target.focus(); else if (quiet) quiet.focus({ preventScroll: true }); };

  // сцена вписывается в окно; мобилка в рамке с отступом от краев
  const PAD = M ? 32 : 0;
  const fit = () => {
    const w = innerWidth, h = innerHeight, S = Math.min((h - PAD * 2) / SH, (w - PAD * 2) / SW);
    for (const el of [stage, overlay, $('boot')]) {
      el.style.zoom = S;
      el.style.left = ((w / S - SW) / 2) + 'px';
      el.style.top = ((h / S - SH) / 2) + 'px';
    }
    if (!M) {
      const extra = Math.max(0, (h / S - SH) / 2);
      $('scrooge').style.top = (900 + extra - 1583 + 160) + 'px';   // Скрудж стоит низом на нижнем крае
      $('mb').style.top = (85 + extra) + 'px';
    }
  };
  addEventListener('resize', fit); fit();

  /* ---------- данные ---------- */
  const mk = (d, w, m, off) => ({ key: d + m, d, w, m, mf: m === 'окт' ? 'октября' : 'ноября', off: !!off });
  const WEEKS = [
    { label: '22–28 окт', days: [mk(22,'пн','окт',1), mk(23,'вт','окт',1), mk(24,'ср','окт',1), mk(25,'чт','окт'), mk(26,'пт','окт'), mk(27,'сб','окт'), mk(28,'вс','окт')] },
    { label: '29 окт – 4 ноя', days: [mk(29,'пн','окт'), mk(30,'вт','окт'), mk(31,'ср','окт'), mk(1,'чт','ноя'), mk(2,'пт','ноя'), mk(3,'сб','ноя'), mk(4,'вс','ноя')] },
  ];
  const cd = () => WEEKS.flatMap(w => w.days).find(x => x.key === state.date);
  const TIMES = [['10:00',390],['11:40',420],['13:10',0],['14:20',520],['15:50',480],['17:30',560],['19:40',450],['20:40',590]];
  const ROWS = [7,7,9,11,11];
  const TAKEN = {'1':[], '2':[4,5], '3':[4,5,8], '4':[4,5,7,8], '5':[5,6]};
  const CITIES = ['Москва','Санкт-Петербург','Екатеринбург','Новосибирск','Казань'];
  const CINEMAS = [['Синема Парк Мега Белая Дача IMAX','Котельники, 1-й Покровский проезд, 5'],['Киномакс Урал','ул. Ленина, 12'],['Каро 11 Октябрь','Новый Арбат, 24'],
    ['Формула Кино Европа','пл. Киевского Вокзала, 2'],['Синема Парк Мега','МКАД, 24-й км'],['Москино Факел','ш. Энтузиастов, 15'],['Киномакс Атриум','ул. Земляной Вал, 33'],['Пионер','Кутузовский пр-т, 21']];
  const fresh = () => ({ city:'Москва', cinema:CINEMAS[0][0], week:0, date:'26окт', time:null, seats:[], email:'', consent:false, step:0, timer:null, left:600, resent:false });
  const state = fresh();
  const DEMO_EMAIL = 'quack@reginatarasova.com';
  const price = () => { const t = TIMES.find(x => x[0] === state.time); return t ? t[1] : 0; };
  const plural = (n, a, b, c) => { const m = n % 10, h = n % 100; return m === 1 && h !== 11 ? a : m >= 2 && m <= 4 && (h < 10 || h >= 20) ? b : c; };
  const rub = n => n.toLocaleString('ru-RU') + ' ₽';

  const chevR = '<svg width="12" height="12" viewBox="0 0 12 12"><path d="M4 2l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const chevL = '<svg width="12" height="12" viewBox="0 0 12 12"><path d="M8 2L4 6l4 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const chevD = '<svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const arrowR = '<svg width="16" height="16" viewBox="0 0 16 16"><path d="M2 8h12M9 3l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const arrowL = '<svg width="16" height="16" viewBox="0 0 16 16"><path d="M14 8H2M7 3L2 8l5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  const steps = n => `<div class="steps">${['Сеанс','Места','Оплата'].map((s, i) => `<span class="${i < n ? 'done' : i === n ? 'now' : ''}">${s}</span>`).join('')}</div>`;
  const mast = title => `<div class="mast" data-in>${title ? `<h2>${title}</h2>` : ''}<div class="rule"></div></div>`;
  const head = (label, meta = '') => `<div class="head"><b>${label}</b><span class="line"></span>${meta ? `<span class="meta">${meta}</span>` : ''}</div>`;
  const info = () => `<div class="info"><small>Кинотеатр</small><b>${state.cinema}</b><div class="row"><div><small>Зал</small><b>6</b></div><div><small>Дата</small><b>${cd().d} ${cd().mf}</b></div><div><small>Время</small><b>${state.time}</b></div></div></div>`;

  /* ---------- страницы карточки ---------- */
  const pages = [
    // 0. Сеанс
    () => `
      <div class="top" data-in>${steps(0)}<div class="cityw"><button class="city" data-act="city" aria-haspopup="listbox" aria-expanded="false">${state.city} ${chevD}</button><div class="citylist" role="listbox" hidden>${CITIES.map(c => `<button class="opt" role="option" aria-selected="${c === state.city}" data-city="${c}"><b>${c}</b></button>`).join('')}</div></div></div>
      ${mast('Программа сеансов')}
      <div class="body">
        <div data-in>${head('Дата', `<button class="chev" data-week="0" ${state.week === 0 ? 'disabled' : ''} aria-label="Прошлая неделя">${chevL}</button>${WEEKS[state.week].label}<button class="chev" data-week="1" ${state.week === 1 ? 'disabled' : ''} aria-label="Следующая неделя">${chevR}</button>`)}
          <div class="dates">${WEEKS[state.week].days.map(x => `<button class="date ${x.w === 'сб' || x.w === 'вс' ? 'we' : ''} ${state.date === x.key ? 'sel' : ''}" ${x.off ? 'disabled' : `data-date="${x.key}"`}><b>${x.d}</b><small>${x.w}</small></button>`).join('')}</div></div>
        <div data-in class="pick">${head('Кинотеатр')}<button class="select" data-act="list" aria-haspopup="listbox" aria-expanded="false"><span>${state.cinema}</span>${chevD}</button>
          <div class="list" role="listbox" hidden>${CINEMAS.map(([n, a]) => `<button class="opt ${n === state.cinema ? 'sel' : ''}" role="option" aria-selected="${n === state.cinema}" data-cinema="${n}"><b>${n}</b><small>${a}</small></button>`).join('')}</div></div>
        <div data-in>${head('Время', '8 сеансов')}
          <div class="times">${TIMES.map(([t, p]) => `<button class="time ${state.time === t ? 'sel' : ''}" ${p ? `data-time="${t}"` : 'disabled'}><b>${t}</b><small>${p ? p + ' ₽' : 'Нет мест'}</small></button>`).join('')}</div></div>
      </div>
      <div class="foot" data-in>
        <div class="sum ${state.time ? '' : 'muted'}"><b>${state.time ? `${cd().w}, ${cd().d} ${cd().m}, ${state.time}` : 'Выберите сеанс'}</b>${state.time ? `<small>${state.cinema}</small>` : ''}</div>
        <button class="cta" data-act="next" ${state.time ? '' : 'disabled'}>Выбрать места ${arrowR}</button>
      </div>`,
    // 1. Места
    () => {
      const n = state.seats.length;
      return `
      <div class="top" data-in>${steps(1)}</div>
      ${mast('')}
      <div class="body">
        <div data-in>${info()}</div>
        <div class="screen" data-in>Экран</div>
        <div class="hall" data-in>${ROWS.map((cnt, ri) => `<div class="r"><em>${ri + 1}</em>${Array.from({length: cnt}, (_, i) => {
          const id = `${ri + 1}-${i + 1}`, taken = TAKEN[ri + 1].includes(i + 1), on = state.seats.includes(id);
          return `<button class="seat ${on ? 'sel' : ''}" ${taken ? 'disabled aria-label="Занято"' : `data-seat="${id}"`}>${taken ? '' : i + 1}</button>`; }).join('')}</div>`).join('')}</div>
        <div class="legend" data-in><span><i></i>Свободно</span><span><i class="y"></i>Выбрано</span><span><i class="t"></i>Занято</span></div>
        <div class="note" id="note"></div>
      </div>
      <div class="foot" data-in>
        <button class="back" data-act="prev" aria-label="Назад">${arrowL}</button>
        <div class="sum ${n ? '' : 'muted'}"><b>${n ? `${n} ${plural(n,'билет','билета','билетов')}, ${rub(n * price())}` : 'Выберите места в зале'}</b>${n ? `<small>${seatText()}</small>` : ''}</div>
        <button class="cta" data-act="next" ${n ? '' : 'disabled'}>К оплате ${arrowR}</button>
      </div>`; },
    // 2. Оплата
    () => {
      const n = state.seats.length, ok = /^\S+@\S+\.\S+$/.test(state.email) && state.consent;
      return `
      <div class="top" data-in>${steps(2)}<span class="timer" aria-label="Бронь мест">${mmss()}</span></div>
      ${mast('')}
      <div class="body">
        <div class="box" data-in>
          ${info()}
          ${state.seats.map(s => { const [r, c] = s.split('-'); return `<div class="line2"><span>Ряд ${r}, место ${c}</span><span>${rub(price())}</span></div>`; }).join('')}
          <div class="total"><span>Итого</span><b>${rub(n * price())}</b></div>
        </div>
        <div class="field" data-in><label for="email">Электронная почта</label><input id="email" type="email" placeholder="you@example.com" value="${state.email}" autocomplete="email"><div class="msg" id="msg"></div></div>
        <button class="check ${state.consent ? 'on' : ''}" data-act="consent" data-in><i></i><span>Согласен с <a href="#" data-offer>условиями оферты</a></span></button>
      </div>
      <div class="foot" data-in>
        <button class="back" data-act="prev" aria-label="Назад">${arrowL}</button>
        <div class="sum"><b>${n} ${plural(n,'билет','билета','билетов')}</b><small>Придут на почту</small></div>
        <button class="cta ${ok ? '' : 'off'}" data-act="pay" aria-disabled="${!ok}">Оплатить ${rub(n * price())} ${arrowR}</button>
      </div>`; },
    // 3. Проверка оплаты
    () => `
      <div class="top" data-in>${steps(2)}</div>
      ${mast('')}
      <div class="wait" data-in><div class="spin"></div><h3>Проверяем оплату</h3><p>Получаем ответ от банка. Обычно это занимает несколько секунд, не закрывайте страницу</p></div>`,
    // 4. Билеты
    () => `
      ${mast('Билеты готовы!')}
      <div class="body">
        <div class="ticket" data-in>
          <div class="a"><h4>Утиные истории</h4>${info()}</div>
          <div class="b"><div><b>${seatText()}</b><small>Покажите QR-код на входе в зал. Он также есть в письме</small></div><a class="qr" href="assets/quack.jpg" download="quack.jpg" aria-label="Скачать билет"><img src="assets/qr.svg" alt="QR-код билета"><span><svg width="16" height="17" viewBox="0 0 16 17" fill="none"><path d="M8 1V11M3 7L8 12L13 7M1 16H15" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>Скачать</span></a></div>
        </div>
        <div class="after" data-in><p>Билеты, чек и вся информация о заказе в письме на ${state.email || DEMO_EMAIL}</p><p>${state.resent ? 'Отправили еще раз. Проверьте папку «Спам»' : 'Письмо не пришло? <a href="#" data-resend>Отправить еще раз</a>'}</p></div>
      </div>
      <div class="foot" data-in><button class="cta wide ghost" data-act="again">Купить еще билеты</button></div>`,
  ];

  const mmss = () => `${String(Math.floor(state.left / 60)).padStart(2, '0')}:${String(state.left % 60).padStart(2, '0')}`;
  // бронь мест: 10 минут с перехода к оплате
  function startTimer() {
    if (state.timer) return;
    state.left = 600;
    state.timer = setInterval(() => {
      state.left = Math.max(0, state.left - 1);
      const t = sheet.querySelector('.timer'); if (t) { t.textContent = mmss(); t.style.color = state.left < 60 ? 'var(--red)' : ''; }
      if (state.left === 0) { clearInterval(state.timer); state.timer = null; expire(); }
    }, 1000);
  }
  async function expire() {
    if (state.step > 2) return;
    state.seats = [];
    while (state.step > 1) await turn(-1);
    const n = sheet.querySelector('#note'); if (n) n.textContent = 'Время брони вышло, места вернулись в продажу. Выберите снова';
  }
  function seatText() {
    const by = {}; state.seats.forEach(s => { const [r, c] = s.split('-'); (by[r] = by[r] || []).push(+c); });
    return Object.entries(by).map(([r, cs]) => { cs.sort((a, b) => a - b); return `Ряд ${r}, ${cs.length > 1 ? 'места' : 'место'} ${cs.length > 1 ? cs.slice(0, -1).join(', ') + ' и ' + cs.at(-1) : cs[0]}`; }).join('; ');
  }

  /* ---------- отрисовка и события ---------- */
  let sheet = $('sheet');
  const render = (el = sheet) => { el.innerHTML = pages[state.step](); bind(el); };

  function bind(el) {
    el.querySelectorAll('[data-date]').forEach(b => b.onclick = () => { state.date = b.dataset.date; state.time = null; rerender(); });
    el.querySelectorAll('[data-week]').forEach(b => b.onclick = () => { state.week = +b.dataset.week; rerender(); });
    el.querySelectorAll('[data-city]').forEach(b => b.onclick = () => { state.city = b.dataset.city; render(); focusTo(sheet.querySelector('.city')); });
    el.querySelectorAll('[data-cinema]').forEach(b => b.onclick = () => { state.cinema = b.dataset.cinema; state.time = null; render(); focusTo(sheet.querySelector('.select')); });
    const off = el.querySelector('[data-offer]'); if (off) off.onclick = e => { e.preventDefault(); e.stopPropagation(); openOffer(); };
    const rs = el.querySelector('[data-resend]'); if (rs) rs.onclick = e => { e.preventDefault(); state.resent = true; rs.parentNode.textContent = 'Отправили еще раз. Проверьте папку «Спам»'; };
    el.querySelectorAll('[data-time]').forEach(b => b.onclick = () => { state.time = b.dataset.time; rerender(); });
    el.querySelectorAll('[data-seat]').forEach(b => b.onclick = () => {
      const id = b.dataset.seat, i = state.seats.indexOf(id);
      if (i >= 0) state.seats.splice(i, 1);
      else if (state.seats.length >= 6) { $('note').textContent = 'Можно выбрать не больше 6 мест в одном заказе'; return; }
      else state.seats.push(id);
      rerender();
    });
    const email = el.querySelector('#email');
    if (email) {
      email.oninput = () => { state.email = email.value; updatePay(el); };
      // для демо: по клику в пустое поле подставляем почту
      email.onfocus = () => { if (!email.value) { email.value = DEMO_EMAIL; state.email = DEMO_EMAIL; updatePay(el); } };
      email.onclick = email.onfocus;
      email.onblur = () => { const f = email.parentNode; const bad = state.email && !/^\S+@\S+\.\S+$/.test(state.email); f.classList.toggle('err', !!bad); f.querySelector('.msg').textContent = bad ? 'Проверьте адрес: похоже, есть ошибка' : ''; };
    }
    el.querySelectorAll('[data-act]').forEach(b => {
      const a = b.dataset.act;
      b.onclick = () => {
        if (b.disabled || b.classList.contains('going')) return;
        if (a === 'next') turn(+1);
        if (a === 'prev') turn(-1);
        if (a === 'consent') { state.consent = !state.consent; b.classList.toggle('on', state.consent); updatePay(el); }
        if (a === 'pay') { if (b.classList.contains('off')) showPayErrors(el); else pay(b); }
        if (a === 'again') { clearInterval(state.timer); Object.assign(state, { time:null, seats:[], email:'', consent:false, step:0, timer:null, resent:false }); turn(0, true); }
        if (a === 'city') toggleCity(el);
        if (a === 'list') toggleList(el);
      };
      // уголок газеты оттягивается при наведении на кнопку перехода (только мышь)
      if (['next', 'pay', 'again'].includes(a)) {
        b.onpointerenter = e => { if (e.pointerType === 'mouse' && !b.disabled && !b.classList.contains('off') && !turning) { hoverBtn = b; hoverCurl(true); } };
        b.onfocus = () => { if (!b.disabled && !turning && b.matches(':focus-visible')) hoverCurl(true); };
        b.onblur = () => { if (!turning && !hoverBtn) hoverCurl(false); };
      }
    });
  }
  function toggleList(el, force) {
    const list = el.querySelector('.list'), btn = el.querySelector('.select'); if (!list) return;
    const open = force ?? list.hidden;
    list.hidden = !open; btn.setAttribute('aria-expanded', open);
    if (open) { list.animate([{opacity:0, transform:'translateY(-4px)'},{opacity:1, transform:'none'}], {duration:T(160), easing:'ease-out'}); focusTo(list.querySelector('.opt.sel') || list.querySelector('.opt')); }
  }
  function closeList() { if (sheet) { toggleList(sheet, false); toggleCity(sheet, false); } }
  function toggleCity(el, force) {
    const list = el.querySelector('.citylist'), btn = el.querySelector('.city'); if (!list) return;
    const open = force ?? list.hidden;
    list.hidden = !open; btn.setAttribute('aria-expanded', open);
    if (open) { list.animate([{opacity:0, transform:'translateY(-4px)'},{opacity:1, transform:'none'}], {duration:T(160), easing:'ease-out'}); focusTo(list.querySelector('.opt.sel') || list.querySelector('.opt')); }
  }
  document.addEventListener('pointerdown', e => { if (!e.target.closest('.pick') && !e.target.closest('.cityw')) closeList(); });
  const emailOk = () => /^\S+@\S+\.\S+$/.test(state.email);
  function updatePay(el) {
    const ok = emailOk() && state.consent, b = el.querySelector('[data-act="pay"]');
    if (b) { b.classList.toggle('off', !ok); b.setAttribute('aria-disabled', !ok); }
    if (state.consent) el.querySelector('.check')?.classList.remove('err');
    if (emailOk()) { const f = el.querySelector('.field'); if (f) { f.classList.remove('err'); f.querySelector('.msg').textContent = ''; } }
  }
  // клик по неактивной «Оплатить» подсвечивает, что не заполнено
  function showPayErrors(el) {
    const f = el.querySelector('.field'), c = el.querySelector('.check');
    if (!emailOk()) { f.classList.add('err'); f.querySelector('.msg').textContent = state.email ? 'Проверьте адрес: похоже, есть ошибка' : 'Укажите почту, на нее придут билеты'; }
    if (!state.consent) c.classList.add('err');
    $('sr').textContent = 'Заполните почту и подтвердите согласие с офертой';
  }
  function rerender() {
    const active = document.activeElement, key = active && (active.dataset.date || active.dataset.time || active.dataset.seat || active.dataset.week);
    render();
    if (key) { const again = sheet.querySelector(`[data-date="${key}"],[data-time="${key}"],[data-seat="${key}"],[data-week="${key}"]:not([disabled])`) || sheet.querySelector('[data-week]:not([disabled])'); if (again && kbd) again.focus(); }
  }

  /* ---------- перелистывание: загиб бумаги ---------- */
  const W = M ? 360 : 480, H = M ? 592 : 568, C = { x: W, y: H };
  const HOVER = { x: W - 44, y: H - 30 };
  const END = { x: -1.75 * W, y: -0.18 * H };
  const CTRL = { x: W * .3, y: H * .62 };

  function clipRect(Mp, n, sign) {
    const pts = [[0,0],[W,0],[W,H],[0,H]], f = q => sign * ((q[0] - Mp.x) * n.x + (q[1] - Mp.y) * n.y), out = [];
    for (let i = 0; i < 4; i++) {
      const a = pts[i], b = pts[(i + 1) % 4], fa = f(a), fb = f(b);
      if (fa <= 0) out.push(a);
      if ((fa < 0 && fb > 0) || (fa > 0 && fb < 0)) { const t = fa / (fa - fb); out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]); }
    }
    return out;
  }
  const poly = pts => pts.length ? `polygon(${pts.map(p => `${p[0].toFixed(2)}px ${p[1].toFixed(2)}px`).join(',')})` : 'polygon(0 0,0 0,0 0)';

  function makeCurl(page) {
    const flap = document.createElement('div'); flap.className = 'flap';
    const back = document.createElement('div'); back.className = 'back'; back.style.width = W + 'px'; back.style.height = H + 'px'; flap.appendChild(back);
    const bs = document.createElement('div'); bs.className = 'strip backs'; back.appendChild(bs);
    const fs = document.createElement('div'); fs.className = 'strip front'; page.appendChild(fs);
    page.after(flap);
    let P = { ...C };
    const set = Q => {
      P = Q;
      const vx = C.x - P.x, vy = C.y - P.y, len = Math.hypot(vx, vy);
      if (len < .5) { page.style.clipPath = 'none'; back.style.clipPath = 'polygon(0 0,0 0,0 0)'; fs.style.opacity = bs.style.opacity = 0; return; }
      const n = { x: vx / len, y: vy / len }, u = { x: -n.y, y: n.x }, Mp = { x: (C.x + P.x) / 2, y: (C.y + P.y) / 2 };
      page.style.clipPath = poly(clipRect(Mp, n, 1));
      back.style.clipPath = poly(clipRect(Mp, n, -1));
      const a = u.x * u.x - u.y * u.y, b = 2 * u.x * u.y, d = -a;
      const e = Mp.x - (a * Mp.x + b * Mp.y), f = Mp.y - (b * Mp.x + d * Mp.y);
      back.style.transform = `matrix(${a},${b},${b},${d},${e},${f})`;
      const ang = Math.atan2(u.y, u.x) * 180 / Math.PI, k = Math.min(1, len / 260);
      fs.style.opacity = bs.style.opacity = 1;
      fs.style.height = (30 + 70 * k) + 'px';
      fs.style.transform = `translate(${Mp.x}px,${Mp.y}px) rotate(${ang}deg) translate(-1200px,0)`;
      bs.style.height = (40 + 90 * k) + 'px';
      bs.style.transform = `translate(${Mp.x}px,${Mp.y}px) rotate(${ang}deg) translate(-1200px,${-(40 + 90 * k)}px)`;
    };
    return { set, flap, get P() { return P; }, destroy() { flap.remove(); fs.remove(); page.style.clipPath = ''; } };
  }

  let tweenId = 0;
  function tween(curl, to, dur, ease, via, onK) {
    const id = ++tweenId, from = { ...curl.P }, t0 = performance.now();
    return new Promise(done => {
      const step = now => {
        if (id !== tweenId) return done(false);
        // rAF timestamp can precede t0; negative k would extrapolate the fold past the corner
        const k = Math.max(0, Math.min(1, (now - t0) / dur)), e = ease(k);
        const q = via ? { x: (1-e)*(1-e)*from.x + 2*(1-e)*e*via.x + e*e*to.x, y: (1-e)*(1-e)*from.y + 2*(1-e)*e*via.y + e*e*to.y }
                      : { x: from.x + (to.x - from.x) * e, y: from.y + (to.y - from.y) * e };
        curl.set(q); onK && onK(e);
        if (k < 1) requestAnimationFrame(step); else done(true);
      };
      requestAnimationFrame(step);
    });
  }
  const easeOut = k => 1 - Math.pow(1 - k, 3);
  const easeInOut = k => k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;

  let hover = null, hoverBtn = null;
  addEventListener('pointermove', e => {
    if (!hoverBtn || turning) return;
    const r = hoverBtn.getBoundingClientRect(), m = 3;
    if (e.clientX < r.left - m || e.clientX > r.right + m || e.clientY < r.top - m || e.clientY > r.bottom + m) { hoverBtn = null; hoverCurl(false); }
  });
  async function hoverCurl(on) {
    if (reduce || turning) return;
    if (on) {
      if (!hover) hover = makeCurl(sheet);
      tween(hover, HOVER, T(320), easeOut);
    } else if (hover) {
      const h = hover;
      const done = await tween(h, C, T(260), easeOut);
      if (done && hover === h && !hoverBtn && !turning) { h.destroy(); hover = null; }
    }
  }

  let turning = false;
  async function turn(dir, reset = false) {
    if (turning) return; turning = true;
    const old = sheet;
    if (!reset) state.step += dir;
    const next = document.createElement('div'); next.className = 'sheet';
    next.innerHTML = pages[state.step](); bind(next);
    const D = T(900);
    if (dir >= 0) {
      card.insertBefore(next, old);
      const c = hover || makeCurl(old); hover = null; hoverBtn = null;
      next.animate([{filter:'brightness(.9)'},{filter:'brightness(1)'}], {duration:D, fill:'forwards'});
      const fade = e => { const o = 1 - Math.max(0, (e - .3) / .7) ** 1.4; old.style.opacity = o; c.flap.style.opacity = o; };
      if (!reduce) await tween(c, END, D, easeInOut, CTRL, fade);
      c.destroy(); old.remove();
    } else {
      if (hover) { hover.destroy(); hover = null; } hoverBtn = null;
      old.after(next);
      const c = makeCurl(next); c.set({ ...END });
      old.animate([{filter:'brightness(1)'},{filter:'brightness(.9)'}], {duration:D, fill:'forwards'});
      const fade = e => { const o = 1 - Math.max(0, (.7 - e) / .7) ** 1.4; next.style.opacity = o; c.flap.style.opacity = o; };
      fade(0);
      if (!reduce) await tween(c, C, D, easeInOut, CTRL, fade);
      next.style.opacity = '';
      c.destroy(); old.remove();
    }
    next.getAnimations().forEach(a => a.cancel()); next.style.opacity = '';
    next.className = 'sheet cur'; next.id = 'sheet'; sheet = next;
    if (state.step === 2) startTimer();
    if (state.step === 3 || state.step === 0) { clearInterval(state.timer); state.timer = null; }
    $('sr').textContent = ['Шаг 1: сеанс','Шаг 2: места','Шаг 3: оплата','Проверяем оплату','Билеты готовы'][state.step];
    turning = false;
  }
  // после клика кнопка сразу неактивна, пока открывается переход в банк
  async function pay(b) {
    b.classList.add('going'); b.innerHTML = 'Переходим в банк…';
    await wait(T(900));
    await turn(+1); await wait(T(1600)); await turn(+1);
  }

  /* ---------- шторка на мобилке ---------- */
  let open = !M;
  const EASE = 'cubic-bezier(.2,.8,.2,1)';
  const LIFT = M ? 507 - 208 : 0;
  function setSheet(on, instant) {
    if (!M || on === open) return;
    open = on; card.classList.toggle('open', on);
    const d = instant ? 1 : T(520), o = { duration: d, easing: EASE, fill: 'forwards' };
    card.animate([{ transform: `translateY(${on ? 0 : -LIFT}px)` }, { transform: `translateY(${on ? -LIFT : 0}px)` }], o);
    $('scrooge').animate([{ transform: `translateY(${on ? 0 : -140}px)`, opacity: on ? 1 : 0 }, { transform: `translateY(${on ? -140 : 0}px)`, opacity: on ? 0 : 1 }], o);
    $('fade').animate([{ transform: `translateY(${on ? 0 : -140}px)`, opacity: on ? 1 : 0 }, { transform: `translateY(${on ? -140 : 0}px)`, opacity: on ? 0 : 1 }], o);
    $('brand').animate([{ transform: `translateY(${on ? 0 : -328}px)` }, { transform: `translateY(${on ? -328 : 0}px)` }], o);
    if (!on) closeList();
  }
  if (M) {
    // свернутая карточка: тап или свайп вверх раскрывает
    let y0 = null;
    const tap = $('tap'), grab = $('grab');
    tap.onpointerdown = e => { y0 = e.clientY; tap.setPointerCapture(e.pointerId); };
    tap.onpointerup = e => { if (y0 === null) return; const dy = e.clientY - y0; y0 = null; if (dy < 12) setSheet(true); };
    tap.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSheet(true); focusTo(sheet.querySelector('button:not([disabled])')); } };
    // раскрытая: свайп вниз за ручку или тап по ней сворачивает
    grab.onpointerdown = e => { y0 = e.clientY; grab.setPointerCapture(e.pointerId); };
    grab.onpointerup = e => { if (y0 === null) return; const dy = e.clientY - y0; y0 = null; if (dy > 20 || Math.abs(dy) < 6) setSheet(false); };
  }

  /* ---------- попап города ---------- */
  function cityPopup(list = false) {
    popup.innerHTML = list
      ? `<small>Выберите город</small><b></b>${CITIES.map(c => `<button class="c" data-c="${c}">${c}</button>`).join('')}`
      : `<small>Ваш город:</small><b>${state.city}</b><button class="btn yes" data-c="${state.city}">Да</button><button class="btn no" data-list>Нет, другой</button>`;
    popup.querySelectorAll('[data-c]').forEach(b => b.onclick = () => { state.city = b.dataset.c; closePopup(); render(); });
    const no = popup.querySelector('[data-list]');
    if (no) no.onclick = () => cityPopup(true);
    if (!popup.classList.contains('on')) {
      popup.classList.add('on'); scrim.classList.add('on');
      scrim.animate([{opacity:0},{opacity:1}], {duration:T(250), fill:'forwards'});
      popup.animate([{opacity:0, transform:'translateY(8px) scale(.97)'},{opacity:1, transform:'none'}], {duration:T(320), easing:EASE, fill:'forwards'});
    }
    setTimeout(() => focusTo(popup.querySelector('button'), popup), T(320));
  }
  function closePopup() {
    popup.classList.remove('on'); scrim.classList.remove('on');
    scrim.animate([{opacity:1},{opacity:0}], {duration:T(200), fill:'forwards'});
    popup.animate([{opacity:1},{opacity:0, transform:'translateY(4px)'}], {duration:T(180), fill:'forwards'});
  }
  scrim.onclick = closePopup;

  /* ---------- загрузка и появление ---------- */
  const imgs = ['assets/scrooge.webp', 'assets/logo.webp'];
  let loaded = 0;
  const ready = Promise.all(imgs.map(src => new Promise(r => { const i = new Image(); i.onload = i.onerror = () => { loaded++; r(); }; i.src = src; })));
  const settle = (el, a) => a.finished.then(() => { el.style.opacity = 1; el.style.transform = ''; a.cancel(); }).catch(() => {});
  // на десктопе низ знака уходит за край экрана, видно около 87%
  const VIS = M ? 1 : .874;

  async function intro() {
    sheet = card.querySelector('.sheet'); sheet.className = 'sheet cur'; render();
    const mb = $('mb'), fill = $('fill');
    fill.style.clipPath = 'inset(100% 0 0 0)';
    mb.animate([{opacity:0},{opacity:1}], {duration:T(400), fill:'forwards'});
    const t0 = performance.now(), MIN = T(2000);
    await new Promise(done => {
      const tick = now => {
        const k = Math.min(1, (now - t0) / MIN), cap = loaded / imgs.length;
        const v = Math.min(1 - Math.pow(1 - k, 2), cap === 1 ? 1 : .9 * cap + .05);
        fill.style.clipPath = `inset(${((1 - ((1 - VIS) + VIS * v)) * 100).toFixed(2)}% 0 0 0)`;
        mb.setAttribute('aria-valuenow', Math.round(v * 100));
        if (v >= 1) return done();
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    await ready;
    // знак гаснет и увеличивается, пока поверх собирается интерфейс
    mb.animate([{opacity:1, transform:'scale(1)'},{opacity:0, transform:'scale(1.15)'}], {duration:T(900), easing:'cubic-bezier(.4,0,.2,1)', fill:'forwards'});
    settle($('scrooge'), $('scrooge').animate([{opacity:0, transform:'translateY(90px)'},{opacity:1, transform:'translateY(0)'}],
      {duration:T(1100), easing:'cubic-bezier(.16,.9,.2,1)', fill:'forwards'}));
    // затемнение под Скруджем едет вместе с ним
    if (M) settle($('fade'), $('fade').animate([{opacity:0, transform:'translateY(90px)'},{opacity:1, transform:'translateY(0)'}],
      {duration:T(1100), easing:'cubic-bezier(.16,.9,.2,1)', fill:'forwards'}));
    settle($('logo'), $('logo').animate([{opacity:0, transform:'translateY(-14px) scale(.98)'},{opacity:1, transform:'none'}],
      {duration:T(700), delay:T(120), easing:EASE, fill:'forwards'}));
    settle($('tagline'), $('tagline').animate([{opacity:0, transform:'translateY(6px)'},{opacity:1, transform:'none'}],
      {duration:T(500), delay:T(260), easing:EASE, fill:'forwards'}));
    settle(card, card.animate([{opacity:0, transform:`translateY(${M ? 300 : 120}px)`},{opacity:1, transform:'translateY(0)'}],
      {duration:T(760), delay:T(M ? 360 : 200), easing:'cubic-bezier(.2,.85,.2,1)', fill:'forwards'}));
    const parts = sheet.querySelectorAll('[data-in]');
    parts.forEach((p, i) => p.animate([{opacity:0, transform:'translateY(-8px)'},{opacity:1, transform:'none'}],
      {duration:T(360), delay:T(560 + i * 90), easing:EASE, fill:'backwards'}));
    const rule = sheet.querySelector('.rule');
    rule && rule.animate([{transform:'scaleX(0)'},{transform:'scaleX(1)'}], {duration:T(520), delay:T(640), easing:'cubic-bezier(.6,0,.2,1)', fill:'backwards'});
    await wait(T(560 + parts.length * 90 + 450));
    cityPopup();
  }

  /* ---------- попап о фильме ---------- */
  const fscrim = $('fscrim');
  const filmText = `<p>Компиляция лучших эпизодов первого сезона мультсериала 1987 года, впервые на большом экране. Изображение и звук восстановили в 4K, а любимые приключения собрали в один фильм.</p>
        <p>Скрудж Макдак, Билли, Вилли и Дилли, Поночка и Зигзаг МакКряк снова ищут сокровища по всему свету, спорят с Братьями Гавс и не дают Магике де Гипнос добраться до заветной монетки.</p>`;
  const facts = `<div class="f"><span>Длительность</span><b>2 ч 18 мин</b></div><div class="f"><span>Возраст</span><b>6+</b></div>
        <div class="f"><span>Формат</span><b>Ремастер 4K</b></div><div class="f"><span>Премьера</span><b>25 октября</b></div>`;
  const filmFoot = `<div class="foot"><div class="sum"><b>С 25 октября</b><small>в кино</small></div><button class="cta" data-film="buy">Купить билеты ${arrowR}</button></div>`;
  const closeX = `<button class="x" data-film="close" aria-label="Закрыть"><svg width="14" height="14" viewBox="0 0 14 14"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" stroke-width="2"/></svg></button>`;
  const film = M ? $('mfilm') : $('film');
  if (M) film.innerHTML = `<h2>Утиные истории. Лучшее из первого сезона</h2><div class="rule"></div><article>${filmText}</article><div class="facts">${facts}</div>${filmFoot}${closeX}`;
  else {
    const html = `<header><h2>Утиные истории. Лучшее из первого сезона</h2></header><div class="rule"></div>
      <div class="cols"><article>${filmText}</article><div class="vr"></div><div class="facts">${facts}<div class="sp"></div>${filmFoot}</div></div>`;
    $('filmL').innerHTML = html; $('filmR').innerHTML = html + closeX; $('filmL').inert = true;
  }
  let filmOpen = false;
  function openFilm() {
    if (filmOpen) return; filmOpen = true;
    film.classList.add('on'); fscrim.classList.add('on');
    fscrim.animate([{opacity:0},{opacity:1}], {duration:T(220), fill:'forwards'});
    film.animate(M ? [{transform:'translateY(100%)'},{transform:'none'}] : [{opacity:0, transform:'translateY(10px)'},{opacity:1, transform:'none'}],
      {duration:T(M ? 360 : 260), easing:EASE, fill:'forwards'});
    setTimeout(() => focusTo(film.querySelector('[data-film="close"]'), film), T(260));
  }
  function closeFilm(toCard) {
    if (!filmOpen) return; filmOpen = false;
    fscrim.classList.remove('on');
    fscrim.animate([{opacity:1},{opacity:0}], {duration:T(200), fill:'forwards'});
    film.animate(M ? [{transform:'none'},{transform:'translateY(100%)'}] : [{opacity:1},{opacity:0, transform:'translateY(6px)'}], {duration:T(M ? 260 : 180), fill:'forwards'})
      .finished.then(() => { if (!filmOpen) film.classList.remove('on'); });
    if (toCard && M) setSheet(true);
    focusTo(toCard ? sheet.querySelector('button:not([disabled])') : $('logo'));
  }
  const logo = $('logo');
  logo.tabIndex = 0; logo.setAttribute('role', 'button'); logo.setAttribute('aria-label', 'О фильме');
  logo.onclick = openFilm;
  logo.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openFilm(); } };
  film.addEventListener('click', e => { const t = e.target.closest('[data-film]'); if (!t) return; closeFilm(t.dataset.film === 'buy'); });

  /* ---------- оферта ---------- */
  const offer = $('offer'); let offerOpen = false;
  function openOffer() {
    offerOpen = true; offer.classList.add('on'); fscrim.classList.add('on');
    fscrim.animate([{opacity:0},{opacity:1}], {duration:T(220), fill:'forwards'});
    offer.animate([{opacity:0, transform:'translateY(10px)'},{opacity:1, transform:'none'}], {duration:T(260), easing:EASE, fill:'forwards'});
    setTimeout(() => focusTo(offer.querySelector('.x'), offer), T(260));
  }
  function closeOffer() {
    if (!offerOpen) return; offerOpen = false; fscrim.classList.remove('on');
    fscrim.animate([{opacity:1},{opacity:0}], {duration:T(200), fill:'forwards'});
    offer.animate([{opacity:1},{opacity:0}], {duration:T(160), fill:'forwards'}).finished.then(() => { if (!offerOpen) offer.classList.remove('on'); });
    focusTo(sheet.querySelector('[data-offer]'));
  }
  offer.querySelectorAll('[data-offer-close]').forEach(b => b.onclick = closeOffer);
  fscrim.onclick = () => { closeFilm(); closeOffer(); };
  addEventListener('keydown', e => { if (e.key === 'Escape') { closeFilm(); closeOffer(); closeList(); } });
  document.fonts.ready.then(intro);
})();
