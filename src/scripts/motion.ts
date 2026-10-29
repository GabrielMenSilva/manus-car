// Único módulo de JS do site: menu, rolagem, reveals, aberto/fechado, voltar ao topo e lightbox.
// Sem dependências. Respeita prefers-reduced-motion (o CSS já desliga as transições).

const root = document.documentElement;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

/* ---------- Header: estado de rolagem e altura ---------- */
const header = document.querySelector<HTMLElement>('[data-header]');
const toTop = document.querySelector<HTMLElement>('[data-to-top]');

if (header) {
  // ResizeObserver evita ler offsetHeight no carregamento (reflow forçado).
  new ResizeObserver(([entry]) => {
    root.style.setProperty('--header-h', `${Math.round(entry.borderBoxSize[0].blockSize)}px`);
  }).observe(header);
}

let ticking = false;
const onScroll = () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const y = window.scrollY;
    header?.setAttribute('data-scrolled', String(y > 24));
    toTop?.setAttribute('data-visible', String(y > 700));
    ticking = false;
  });
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Menu mobile ---------- */
const menuBtn = document.querySelector<HTMLButtonElement>('[data-menu-btn]');
const menu = document.querySelector<HTMLElement>('[data-menu]');

const setMenu = (open: boolean) => {
  if (!menuBtn || !menu || !header) return;
  menu.setAttribute('data-open', String(open));
  header.setAttribute('data-menu-open', String(open));
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  root.classList.toggle('scroll-lock', open);
  // Fora de vista, o painel não deve receber foco.
  menu.toggleAttribute('inert', !open);
};
const isMenuOpen = () => menuBtn?.getAttribute('aria-expanded') === 'true';

if (menuBtn && menu) {
  menu.setAttribute('inert', '');
  menuBtn.addEventListener('click', () => setMenu(!isMenuOpen()));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMenuOpen()) {
      setMenu(false);
      menuBtn.focus();
    }
  });
  document.addEventListener('click', (e) => {
    if (isMenuOpen() && header && !header.contains(e.target as Node)) setMenu(false);
  });
  window.matchMedia('(min-width: 1024px)').addEventListener('change', (e) => {
    if (e.matches) setMenu(false);
  });
}

/* ---------- Âncoras: rolagem suave (CSS), foco no destino e fechar menu ---------- */
document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
  const id = a.getAttribute('href')!.slice(1);
  if (!id) return;
  a.addEventListener('click', () => {
    const target = document.getElementById(id);
    if (!target) return;
    if (isMenuOpen()) setMenu(false);
    target.focus({ preventScroll: true });
  });
});

/* ---------- Item ativo do menu (IntersectionObserver) ---------- */
const navLinks = [...document.querySelectorAll<HTMLAnchorElement>('[data-nav-link]')];
const sections = [...new Set(navLinks.map((l) => l.getAttribute('href')!.slice(1)))]
  .map((id) => document.getElementById(id))
  .filter((el): el is HTMLElement => !!el);

if ('IntersectionObserver' in window && sections.length) {
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((l) => {
          const active = l.getAttribute('href') === `#${entry.target.id}`;
          if (active) l.setAttribute('aria-current', 'true');
          else l.removeAttribute('aria-current');
        });
      });
    },
    { rootMargin: '-40% 0px -55% 0px' },
  );
  sections.forEach((s) => spy.observe(s));
}

/* ---------- Aparecer ao rolar (uma vez) ---------- */
const reveals = [...document.querySelectorAll<HTMLElement>('.reveal')];
if (reduceMotion.matches || !('IntersectionObserver' in window)) {
  reveals.forEach((el) => el.classList.add('is-in'));
} else {
  const io = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
  );
  reveals.forEach((el) => io.observe(el));
}

/* ---------- Aberto agora / Fechado ---------- */
interface Horario {
  dias: number[];
  abre?: string;
  fecha?: string;
}
const scheduleEl = document.getElementById('site-schedule');
const statusEls = document.querySelectorAll<HTMLElement>('[data-open-status]');

if (scheduleEl?.textContent && statusEls.length) {
  const { tz, horarios } = JSON.parse(scheduleEl.textContent) as { tz: string; horarios: Horario[] };
  const diasSemana = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
  const dayIndex: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  const toMin = (s: string) => Number(s.slice(0, 2)) * 60 + Number(s.slice(3));
  const fmt = new Intl.DateTimeFormat('en-US', { timeZone: tz, weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
  const slotOf = (dia: number) => horarios.find((h) => h.abre && h.fecha && h.dias.includes(dia));

  const update = () => {
    const p = Object.fromEntries(fmt.formatToParts(new Date()).map((x) => [x.type, x.value]));
    const dia = dayIndex[p.weekday];
    const min = Number(p.hour) * 60 + Number(p.minute);
    const hoje = slotOf(dia);
    let state = 'closed';
    let label = '';
    if (hoje && min >= toMin(hoje.abre!) && min < toMin(hoje.fecha!)) {
      state = 'open';
      label = `Aberto agora, fecha às ${hoje.fecha}`;
    } else if (hoje && min < toMin(hoje.abre!)) {
      label = `Fechado agora, abre hoje às ${hoje.abre}`;
    } else {
      for (let d = 1; d <= 7; d++) {
        const next = slotOf((dia + d) % 7);
        if (next) {
          label = `Fechado agora, abre ${d === 1 ? 'amanhã' : diasSemana[(dia + d) % 7]} às ${next.abre}`;
          break;
        }
      }
    }
    statusEls.forEach((el) => {
      el.setAttribute('data-state', state);
      const l = el.querySelector('[data-label]');
      if (l && l.textContent !== label) l.textContent = label;
    });
  };
  update();
  setInterval(update, 60_000);
}

/* ---------- Carrossel de avaliações (mobile) ---------- */
const carousel = document.querySelector<HTMLElement>('[data-carousel]');
const prevBtn = document.querySelector<HTMLButtonElement>('[data-carousel-prev]');
const nextBtn = document.querySelector<HTMLButtonElement>('[data-carousel-next]');

if (carousel && prevBtn && nextBtn) {
  const behavior = (): ScrollBehavior => (reduceMotion.matches ? 'auto' : 'smooth');
  const step = (dir: 1 | -1) => carousel.scrollBy({ left: dir * carousel.clientWidth * 0.85, behavior: behavior() });
  prevBtn.addEventListener('click', () => step(-1));
  nextBtn.addEventListener('click', () => step(1));

  let pending = false;
  const syncEnds = () => {
    pending = false;
    prevBtn.disabled = carousel.scrollLeft <= 2;
    nextBtn.disabled = carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 2;
  };
  carousel.addEventListener(
    'scroll',
    () => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(syncEnds);
    },
    { passive: true },
  );
  syncEnds();
}

/* ---------- "Ver mais avaliações" ---------- */
const moreBtn = document.querySelector<HTMLButtonElement>('[data-more-btn]');
const morePanel = document.querySelector<HTMLElement>('[data-more-panel]');
const shownEl = document.querySelector<HTMLElement>('[data-shown]');

if (moreBtn && morePanel && shownEl) {
  const featuredCount = document.querySelectorAll('[data-carousel] > li').length;
  const totalCount = featuredCount + morePanel.querySelectorAll('li').length;
  const setMore = (open: boolean) => {
    morePanel.setAttribute('data-open', String(open));
    morePanel.toggleAttribute('inert', !open);
    moreBtn.setAttribute('aria-expanded', String(open));
    moreBtn.textContent = open ? 'Ver menos avaliações' : 'Ver mais avaliações';
    shownEl.textContent = String(open ? totalCount : featuredCount);
  };
  setMore(false);
  moreBtn.addEventListener('click', () => setMore(moreBtn.getAttribute('aria-expanded') !== 'true'));
}

/* ---------- Ano do rodapé ---------- */
document.querySelectorAll('[data-year]').forEach((el) => (el.textContent = String(new Date().getFullYear())));

/* ---------- Lightbox ---------- */
const dlg = document.getElementById('lightbox') as HTMLDialogElement | null;
const lbImg = document.getElementById('lightbox-img') as HTMLImageElement | null;

if (dlg && lbImg) {
  let origin: HTMLElement | null = null;
  let closing = false;

  const closeLightbox = () => {
    if (!dlg.open || closing) return;
    closing = true;
    dlg.classList.remove('is-open');
    window.setTimeout(
      () => {
        dlg.close();
        root.classList.remove('scroll-lock');
        origin?.focus();
        closing = false;
      },
      reduceMotion.matches ? 0 : 200,
    );
  };

  document.querySelectorAll<HTMLButtonElement>('[data-lightbox-open]').forEach((b) =>
    b.addEventListener('click', () => {
      origin = b;
      lbImg.src = b.dataset.full ?? '';
      lbImg.alt = b.dataset.alt ?? '';
      lbImg.style.width = `${b.dataset.w}px`; // nunca ampliar acima do tamanho nativo
      root.classList.add('scroll-lock');
      dlg.showModal();
      requestAnimationFrame(() => dlg.classList.add('is-open'));
    }),
  );
  dlg.querySelector('[data-lightbox-close]')?.addEventListener('click', closeLightbox);
  dlg.addEventListener('click', (e) => {
    if (e.target === dlg) closeLightbox();
  });
  // Esc: usa a animação de saída em vez do fechamento imediato do navegador.
  dlg.addEventListener('cancel', (e) => {
    e.preventDefault();
    closeLightbox();
  });
}
