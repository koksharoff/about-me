(() => {
  const root = document.documentElement;
  root.classList.remove('no-js');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- hero: field rows converging to the horizon ---------- */
  const rows = document.getElementById('rows');
  if (rows) {
    const NS = 'http://www.w3.org/2000/svg';
    const vx = 760, vy = 120;          // vanishing point
    for (let i = -26; i <= 26; i++) {
      const p = document.createElementNS(NS, 'path');
      const bx = 600 + i * 70;
      p.setAttribute('d', `M${vx} ${vy} Q ${(vx + bx) / 2} ${vy + 260} ${bx} 700`);
      rows.appendChild(p);
    }
    for (let k = 1; k <= 9; k++) {       // horizontal furrows, denser near the horizon
      const t = Math.pow(k / 9, 2.2);
      const y = vy + (700 - vy) * t;
      const l = document.createElementNS(NS, 'line');
      l.setAttribute('x1', 0); l.setAttribute('x2', 1200);
      l.setAttribute('y1', y); l.setAttribute('y2', y);
      l.setAttribute('stroke-opacity', (0.15 + t * 0.35).toFixed(2));
      rows.appendChild(l);
    }
  }

  /* ---------- header: light over light sections, burger ---------- */
  const header = document.querySelector('.header');
  const hero = document.querySelector('.hero');
  const darkBlocks = [...document.querySelectorAll('.hero, .night, .join')];
  const updateHeader = () => {
    const y = 40;
    const overDark = darkBlocks.some(el => {
      const r = el.getBoundingClientRect();
      return r.top <= y && r.bottom >= y;
    });
    header.classList.toggle('is-light', !overDark);
  };
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
  window.addEventListener('resize', updateHeader);

  const burger = document.querySelector('.burger');
  const nav = document.getElementById('nav');
  const setMenu = open => {
    header.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
  };
  burger.addEventListener('click', () => setMenu(!header.classList.contains('is-open')));
  nav.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
  document.addEventListener('click', e => { if (!header.contains(e.target)) setMenu(false); });

  /* ---------- reveal on scroll ---------- */
  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        const el = en.target;
        const siblings = [...el.parentElement.children].filter(c => c.classList.contains('reveal'));
        const idx = Math.max(0, siblings.indexOf(el));
        el.style.transitionDelay = `${Math.min(idx, 6) * (reduce.matches ? 40 : 70)}ms`;
        el.classList.add('is-in');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(el => io.observe(el));
  } else {
    items.forEach(el => el.classList.add('is-in'));
  }
  // first screen shows at once
  hero && hero.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.transitionDelay = `${i * (reduce.matches ? 60 : 110)}ms`;
    requestAnimationFrame(() => el.classList.add('is-in'));
  });

  /* ---------- timeline accordion ---------- */
  document.querySelectorAll('.step__head').forEach(btn => {
    btn.addEventListener('click', () => {
      const step = btn.closest('.step');
      const open = !step.classList.contains('is-open');
      step.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
    });
  });
  const firstStep = document.querySelector('.step');
  if (firstStep) { firstStep.classList.add('is-open'); firstStep.querySelector('.step__head').setAttribute('aria-expanded', 'true'); }

  /* ---------- interests ---------- */
  const INTERESTS = [
    {
      title: 'Агротех', sub: 'Цифровизация хранения зерна',
      text: 'До 5–7 % урожая в год теряется при доработке и хранении. Мне интересно, как простая связка «данные датчиков + учёт + отчётность» превращает эти потери в управляемый риск.',
      list: ['Термометрия и самосогревание зерна', 'Учёт в 1С и ФГИС «Зерно»', 'Выставки: ЮГАГРО, «Золотая осень»']
    },
    {
      title: 'Стартапы и финансирование', sub: 'Как вырасти без продажи долей',
      text: 'Строю «Моё зерно» на пилотах, грантах и выручке. Прохожу акселераторы, готовлю инвестиционные пакеты и финансовые модели.',
      list: ['Агроакселератор РСХБ — первый этап пройден', 'Грант ФСИ «Студенческий стартап» — заявка подана', 'Финмодель на 2027–2031 годы']
    },
    {
      title: 'Инфраструктура и DevOps', sub: 'Серверы, которые не падают',
      text: 'Опыт в DevOps помог в одиночку развернуть облачную платформу. Люблю, когда сервер настраивается одной командой и одинаково на dev, stage и prod.',
      list: ['Ansible, Docker, CI/CD', 'Защищённый MQTT, бэкапы, мониторинг', 'Безопасность серверов по умолчанию']
    },
    {
      title: 'Продуктовая разработка', sub: 'От идеи до работающего кабинета',
      text: 'Go на сервере, React в интерфейсе, интеграции с внешними системами. Делаю и инструменты для себя — когда их нет или они неудобны.',
      list: ['Интеграции с 1С и государственными API', 'Трекер времени в коде для VS Code', 'Telegram-бот с грантами и конкурсами']
    },
    {
      title: 'Маркетинг B2B', sub: 'Как продавать консервативной отрасли',
      text: 'Агрорынок не покупает «технологии ради технологий». Учусь говорить на языке денег и потерь, хожу на конференции и выстраиваю воронку первых продаж.',
      list: ['База из 86 хранилищ зерна в CRM', 'Холодные звонки вместе с маркетологом', 'Конференции и форумы по маркетингу']
    },
    {
      title: 'Личный бренд', sub: 'Путь 19-летнего фаундера в Instagram',
      text: 'Рассказываю честно, без глянца: что получается, что нет и чему я учусь по дороге.',
      list: ['Как найти нишу для бизнеса', 'Где брать финансирование и как проверить спрос', 'Как не сравнивать себя с другими и не выгореть']
    },
    {
      title: 'ИИ в агро', sub: 'В разработке',
      text: 'Хочу научиться предсказывать самосогревание зерна заранее, а не замечать его по факту. Сейчас прогнозы в платформе строятся по трендам — модель ещё впереди.',
      list: ['Тема заявки на грант ФСИ', 'Данные термометрии как основа для модели', 'Планирую подаваться в Yandex AI Startup Lab']
    }
  ];

  const tabs = [...document.querySelectorAll('.interests__list [role="tab"]')];
  const panel = document.querySelector('.interest');
  const $ = id => document.getElementById(id);
  const render = i => {
    const d = INTERESTS[i];
    $('i-num').textContent = i + 1;
    $('i-title').textContent = d.title;
    $('i-sub').textContent = d.sub;
    $('i-text').textContent = d.text;
    $('i-list').replaceChildren(...d.list.map(t => { const li = document.createElement('li'); li.textContent = t; return li; }));
  };
  const select = i => {
    tabs.forEach((t, k) => { t.setAttribute('aria-selected', String(k === i)); t.tabIndex = k === i ? 0 : -1; });
    panel.classList.add('is-swapping');
    setTimeout(() => { render(i); panel.classList.remove('is-swapping'); }, 180);
  };
  tabs.forEach((t, i) => {
    t.tabIndex = i === 0 ? 0 : -1;
    t.addEventListener('click', () => select(i));
    t.addEventListener('keydown', e => {
      const dir = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
      if (!dir) return;
      e.preventDefault();
      const n = (i + dir + tabs.length) % tabs.length;
      tabs[n].focus(); select(n);
    });
  });
  render(0);
})();
