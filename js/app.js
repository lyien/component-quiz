import { COPY, QUESTIONS, RESULTS, LOADING_ROW } from './data.js';
import { scoreQuiz } from './scoring.js';
import { ICONS } from './icons.js';
import { downloadShareCard } from './share-card.js';

const app = document.getElementById('app');
const LOADING_MS = 2500;
const MARQUEE_SPEED = 60; // px per second — slow, steady scroll

const state = {
  screen: 'intro', // intro | question | loading | result | gallery
  q: 0,
  answers: Array(QUESTIONS.length).fill(null),
  result: null, // the visitor's own result
  view: null, // result being viewed from the gallery
};

let loadingTimer = null;

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const artSrc = (key) => `assets/illustrations/${RESULTS[key].art.file}`;

const menuChip = () => `
  <div class="menu">
    <button class="btn btn--primary btn--menu" type="button" data-action="restart">
      ${ICONS.quiz}<span>${esc(COPY.menu)}</span>
    </button>
  </div>`;

/* ---------------- Screens ---------------- */

function introView() {
  return `
  <section class="screen screen--intro" aria-labelledby="screen-title">
    <div class="card intro">
      <div class="intro__text">
        <h1 class="title-h1" id="screen-title" tabindex="-1">${esc(COPY.title)}</h1>
        <p class="body-lg">${esc(COPY.subtitle)}</p>
      </div>
      <div class="intro__art">
        <img class="art--desktop" src="assets/illustrations/intro-desktop.svg" width="572" height="323" alt="A jumble of smiling UI components: a button, toast, accordion, carousel, hero, navigation bar, tag and footer." />
        <img class="art--mobile" src="assets/illustrations/intro-mobile.svg" width="350" height="350" alt="" />
      </div>
      <div class="intro__actions">
        <button class="btn btn--primary" type="button" data-action="start">${esc(COPY.start)}</button>
      </div>
    </div>
    <footer class="site-footer">${esc(COPY.footer)}</footer>
  </section>`;
}

function questionView() {
  const { q, a } = QUESTIONS[state.q];
  const chosen = state.answers[state.q];
  const name = `q${state.q}`;
  return `
  <section class="screen screen--top" aria-labelledby="screen-title">
    ${menuChip()}
    <form class="card question" data-form="question" novalidate>
      <span class="question__handle question__handle--tl" aria-hidden="true"></span>
      <span class="question__handle question__handle--tr" aria-hidden="true"></span>
      <span class="question__handle question__handle--bl" aria-hidden="true"></span>
      <span class="question__handle question__handle--br" aria-hidden="true"></span>
      <div class="question__head">
        <p class="eyebrow">${esc(COPY.progress(state.q + 1, QUESTIONS.length))}</p>
        <h1 class="title-h2" id="screen-title" tabindex="-1">${esc(q)}</h1>
      </div>
      <fieldset class="answers">
        <legend class="visually-hidden">${esc(q)}</legend>
        ${a
          .map(
            ([label], i) => `
          <label class="answer">
            <input type="radio" name="${name}" value="${i}" ${chosen === i ? 'checked' : ''} />
            <span class="answer__radio" aria-hidden="true"></span>
            <span class="answer__label">${esc(label)}</span>
          </label>`
          )
          .join('')}
      </fieldset>
      <div class="question__actions">
        <button class="btn btn--secondary" type="button" data-action="back">${esc(COPY.back)}</button>
        <button class="btn btn--primary" type="submit" data-next ${chosen == null ? 'disabled' : ''}>${esc(COPY.next)}</button>
      </div>
    </form>
  </section>`;
}

function loadingView() {
  const group = LOADING_ROW.map((k) => {
    const { w, h } = RESULTS[k].art;
    return `<img src="${artSrc(k)}" width="${w}" height="${h}" alt="" />`;
  }).join('');
  return `
  <section class="screen screen--top" aria-labelledby="screen-title">
    ${menuChip()}
    <div class="card loading" role="status">
      <div class="loading__title">
        <h1 class="title-h2" id="screen-title" tabindex="-1">${esc(COPY.loading)}</h1>
        <span class="dots" aria-hidden="true"><span></span><span></span><span></span></span>
      </div>
      <div class="marquee" aria-hidden="true">
        <div class="marquee__track">
          <div class="marquee__group">${group}</div>
          <div class="marquee__group">${group}</div>
        </div>
      </div>
    </div>
  </section>`;
}

function resultView(key, fromGallery) {
  const r = RESULTS[key];
  const actions = fromGallery
    ? `<button class="btn btn--primary" type="button" data-action="gallery">${ICONS.arrowLeft}<span>${esc(COPY.backToGallery)}</span></button>`
    : `<button class="btn btn--primary" type="button" data-action="restart"><span>${esc(COPY.retake)}</span>${ICONS.restart}</button>
       <button class="btn btn--secondary" type="button" data-action="gallery"><span>${esc(COPY.allComponents)}</span>${ICONS.grid}</button>`;
  return `
  <section class="screen screen--center" aria-labelledby="screen-title">
    <article class="card result">
      <div class="result__profile">
        <div class="result__head">
          <p class="eyebrow">${esc(COPY.resultEyebrow)}</p>
          <h1 class="title-h2" id="screen-title" tabindex="-1">${esc(r.name)}</h1>
        </div>
        <figure class="result__art" style="margin:0">
          <div class="result__art-img">
            <img src="${artSrc(key)}" width="${r.art.w}" height="${r.art.h}" alt="Illustration of a smiling ${esc(r.name)} component" />
          </div>
          <figcaption class="result__caption">“${esc(r.tagline)}”</figcaption>
          <div class="result__save-row">
            <button class="btn-icon" type="button" data-action="save" data-key="${key}" aria-label="${esc(COPY.save)}" title="${esc(COPY.save)}">${ICONS.save}</button>
          </div>
        </figure>
        <p class="body-lg">${esc(r.description)}</p>
        <div class="result__details">
          <div class="detail"><p class="eyebrow">${esc(COPY.strengths)}</p><p class="body-lg">${esc(r.strengths)}</p></div>
          <div class="detail"><p class="eyebrow">${esc(COPY.bugs)}</p><p class="body-lg">${esc(r.bug)}</p></div>
          <div class="detail"><p class="eyebrow">${esc(COPY.pairing)}</p><p class="body-lg">${esc(r.pairing)}</p></div>
        </div>
      </div>
      <div class="result__actions">${actions}</div>
    </article>
  </section>`;
}

function galleryView() {
  const tiles = Object.entries(RESULTS)
    .map(([key, r]) => {
      const wide = r.art.w / r.art.h > 4;
      return `
      <li>
        <button class="tile" type="button" data-action="view" data-key="${key}">
          <span class="tile__art${wide ? ' tile__art--wide' : ''}"><img src="${artSrc(key)}" width="${r.art.w}" height="${r.art.h}" alt="" /></span>
          <span class="tile__label">${esc(r.name)}</span>
        </button>
      </li>`;
    })
    .join('');
  return `
  <section class="screen screen--gallery" aria-labelledby="screen-title">
    <div class="card gallery">
      <h1 class="title-h2" id="screen-title" tabindex="-1">${esc(COPY.galleryTitle)}</h1>
      <ul class="gallery__grid">${tiles}</ul>
      <div class="gallery__actions">
        <button class="btn btn--secondary" type="button" data-action="to-result">${ICONS.arrowLeft}<span>${esc(COPY.back)}</span></button>
        <button class="btn btn--primary" type="button" data-action="restart"><span>${esc(COPY.retake)}</span>${ICONS.restart}</button>
      </div>
    </div>
  </section>`;
}

/* ---------------- Rendering + navigation ---------------- */

function render({ focus = true } = {}) {
  clearTimeout(loadingTimer);
  let html;
  switch (state.screen) {
    case 'question':
      html = questionView();
      break;
    case 'loading':
      html = loadingView();
      break;
    case 'result':
      html = resultView(state.view || state.result, Boolean(state.view));
      break;
    case 'gallery':
      html = galleryView();
      break;
    default:
      html = introView();
  }
  app.innerHTML = html;
  window.scrollTo(0, 0);

  if (state.screen === 'loading') startLoading();
  if (focus) {
    const heading = document.getElementById('screen-title');
    heading && heading.focus({ preventScroll: true });
  }
}

function snapshot() {
  return { screen: state.screen, q: state.q, view: state.view };
}

function go(screen, extra = {}, { replace = false } = {}) {
  Object.assign(state, { screen }, extra);
  const entry = snapshot();
  if (replace) history.replaceState(entry, '');
  else history.pushState(entry, '');
  render();
}

window.addEventListener('popstate', (e) => {
  const s = e.state;
  if (!s) {
    state.screen = 'intro';
  } else {
    // Never replay the loading screen, and don't show result pages without a result.
    let screen = s.screen === 'loading' ? 'question' : s.screen;
    if ((screen === 'result' || screen === 'gallery') && !state.result) screen = 'intro';
    Object.assign(state, { screen, q: s.q ?? 0, view: s.view ?? null });
  }
  render();
});

function startLoading() {
  // Marquee: scroll exactly one group-width per loop so it repeats with no jump.
  const track = app.querySelector('.marquee__track');
  const group = app.querySelector('.marquee__group');
  if (track && group) {
    const setup = () => {
      const dist = group.getBoundingClientRect().width;
      track.style.setProperty('--marquee-distance', `${dist}px`);
      track.style.setProperty('--marquee-duration', `${dist / MARQUEE_SPEED}s`);
    };
    const imgs = [...group.querySelectorAll('img')];
    Promise.all(imgs.map((img) => (img.complete ? null : img.decode().catch(() => null)))).then(setup);
    setup();
  }
  loadingTimer = setTimeout(() => {
    go('result', { view: null }, { replace: true });
  }, LOADING_MS);
}

/* ---------------- Events ---------------- */

app.addEventListener('change', (e) => {
  if (e.target.matches('.answers input[type="radio"]')) {
    state.answers[state.q] = Number(e.target.value);
    const next = app.querySelector('[data-next]');
    if (next) next.disabled = false;
  }
});

app.addEventListener('submit', (e) => {
  if (!e.target.matches('[data-form="question"]')) return;
  e.preventDefault();
  if (state.answers[state.q] == null) return;
  if (state.q < QUESTIONS.length - 1) {
    go('question', { q: state.q + 1 });
  } else {
    state.result = scoreQuiz(state.answers).winner;
    go('loading', { view: null });
  }
});

app.addEventListener('click', async (e) => {
  const el = e.target.closest('[data-action]');
  if (!el) return;
  const action = el.dataset.action;

  switch (action) {
    case 'start':
      state.answers = Array(QUESTIONS.length).fill(null);
      go('question', { q: 0, view: null });
      break;
    case 'back':
      if (state.q === 0) go('intro');
      else go('question', { q: state.q - 1 });
      break;
    case 'restart':
      state.answers = Array(QUESTIONS.length).fill(null);
      state.result = null;
      go('intro', { q: 0, view: null });
      break;
    case 'gallery':
      go('gallery', { view: null });
      break;
    case 'view':
      go('result', { view: el.dataset.key });
      break;
    case 'to-result':
      go('result', { view: null });
      break;
    case 'save': {
      if (el.getAttribute('aria-busy') === 'true') return;
      el.setAttribute('aria-busy', 'true');
      try {
        await downloadShareCard(el.dataset.key);
      } catch (err) {
        console.error(err);
        alert('Sorry, the image could not be saved. Try again in a moment.');
      } finally {
        el.removeAttribute('aria-busy');
      }
      break;
    }
  }
});

/* ---------------- Boot ---------------- */

history.replaceState(snapshot(), '');
render({ focus: false });
