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

  /* ---------- section titles: split into words ---------- */
  document.querySelectorAll('main h2').forEach(h => {
    let i = 0;
    const wrap = node => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            const w = document.createElement('span');
            w.className = 'w'; w.style.setProperty('--i', i++); w.textContent = part;
            frag.appendChild(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') wrap(n);
      });
    };
    wrap(h);
    h.classList.add('split', 'reveal-split');
  });

  /* ---------- stats: count up ---------- */
  const countUp = el => {
    const m = el.textContent.match(/^(\d+)(.*)$/);
    if (!m) return;
    const to = +m[1], rest = m[2], dur = reduce.matches ? 500 : 1100, t0 = performance.now();
    const tick = now => {
      const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(to * e) + rest;
      if (k < 1) requestAnimationFrame(tick);
    };
    el.textContent = '0' + rest;
    requestAnimationFrame(tick);
  };
  setTimeout(() => document.querySelectorAll('.stats b').forEach(countUp), 400);

  /* ---------- timeline progress line ---------- */
  const timeline = document.querySelector('.timeline');
  if (timeline) {
    const upd = () => {
      const r = timeline.getBoundingClientRect();
      const p = (innerHeight * 0.6 - r.top) / r.height;
      timeline.style.setProperty('--progress', Math.max(0, Math.min(1, p)).toFixed(3));
    };
    upd();
    window.addEventListener('scroll', upd, { passive: true });
    window.addEventListener('resize', upd);
  }

  /* ---------- reveal on scroll ---------- */
  const items = document.querySelectorAll('.reveal, .reveal-split');
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
      title: 'DevOps и MLOps', sub: 'То, в чём я разбираюсь лучше всего',
      text: 'Опыт в DevOps, в том числе в крупной компании, помог в одиночку развернуть облачную платформу. Люблю, когда сервер настраивается одной командой и одинаково на dev, stage и prod. Дальше хочу расти в сторону MLOps.',
      list: ['Ansible, Docker, CI/CD', 'Защищённый MQTT, бэкапы, мониторинг', 'MLOps — следующая ступень']
    },
    {
      title: 'Агротех', sub: 'Цифровизация хранения зерна',
      text: 'До 5–7 % урожая в год теряется при доработке и хранении. Мне интересно, как простая связка «данные датчиков + учёт + отчётность» превращает эти потери в управляемый риск.',
      list: ['Термометрия и самосогревание зерна', 'Учёт в 1С и ФГИС «Зерно»', 'Выставки: ЮГАГРО, «Золотая осень»']
    },
    {
      title: 'Стартапы и финансирование', sub: 'Как вырасти без продажи долей',
      text: 'Участвую в двух стартапах. «Моё зерно» строю на пилотах, грантах и выручке: прохожу акселераторы, готовлю инвестиционные пакеты и финансовые модели.',
      list: ['Питч на инвестиционной сессии РСХБ', 'Грант ФСИ «Студенческий стартап» — заявка подана', 'Финмодель на 2027–2031 годы']
    },
    {
      title: 'Продуктовая разработка', sub: 'От идеи до работающего продукта',
      text: 'Работал в крупной компании и делаю свои проекты. Go на сервере, React в интерфейсе, интеграции с внешними системами.',
      list: ['Интеграции с 1С и государственными API', 'Свои инструменты: трекер времени, Telegram-бот', 'Разработка в двух стартапах']
    },
    {
      title: 'Маркетинг и продажи', sub: 'Очень нравится — и качаю специально',
      text: 'Агрорынок не покупает «технологии ради технологий». Учусь говорить на языке денег и потерь, поэтому пошёл работать в маркетинг.',
      list: ['Работа в маркетинге, чтобы прокачать продажи', 'Живые разговоры с клиентами на выставках', 'Конференции и форумы по маркетингу']
    },
    {
      title: 'Личный бренд', sub: 'Нравится — и, честно, пугает',
      text: 'Публичность часто пугает, и я с этим борюсь. Рассказываю о пути без глянца: что получается, что нет и чему учусь по дороге.',
      list: ['Как найти нишу и проверить спрос', 'Где брать финансирование', 'Как не сравнивать себя с другими и не выгореть']
    },
    {
      title: 'ИИ и компьютерное зрение', sub: 'В разработке',
      text: 'Во втором стартапе работаю с компьютерным зрением для мониторинга. В «Моё зерно» хочу научиться предсказывать самосогревание зерна заранее — сейчас прогнозы там строятся по трендам, модель ещё впереди.',
      list: ['Стартап на компьютерном зрении', 'Тема заявки на грант ФСИ', 'В планах — Yandex AI Startup Lab']
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
