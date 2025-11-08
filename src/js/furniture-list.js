import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import {
  categoriesListEl,
  productsListEl,
  btnLoadMore,
  loaderEl,
} from './refs';

/* ================= Scroll restoration ================= */
document.addEventListener('DOMContentLoaded', () => {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
});

/* ================= Config ================= */
const BASE_URL = 'https://furniture-store-v2.b.goit.study/api';

/* ================= Category name map ================= */
const MOD_TO_NAME = {
  soft: "М'які меблі",
  wardrobes: 'Шафи та системи зберігання',
  beds: 'Ліжка та матраци',
  tables: 'Столи',
  chairs: 'Стільці та табурети',
  kitchens: 'Кухні',
  kids: 'Меблі для дитячої',
  office: 'Меблі для офісу',
  hallway: 'Меблі для передпокою',
  bathroom: 'Меблі для ванної кімнати',
  outdoor: 'Садові та вуличні меблі',
  decor: 'Декор та аксесуари',
};

/* ================= Toast ================= */
function showError(message) {
  iziToast.error({ title: 'Помилка', message, position: 'topRight' });
}
function showEndOfAllToast() {
  iziToast.show({
    message: 'Це всі товари у розділі «Всі товари».',
    position: 'topRight',
  });
}

/* ================= Loader & Load more sync ================= */
function updateLoadMoreVisibility() {
  const shouldShow =
    productsListEl && productsListEl.children.length < state.total;
  if (btnLoadMore) btnLoadMore.hidden = !shouldShow;
}
function showLoader() {
  if (loaderEl) loaderEl.hidden = false;
  if (btnLoadMore) btnLoadMore.hidden = true;
}
function hideLoader() {
  if (loaderEl) loaderEl.hidden = true;
  updateLoadMoreVisibility();
}

/* ================= State ================= */
let state = { categoryId: '', page: 1, limit: 8, total: 0 };

/* ================= API ================= */
async function getCategories() {
  const { data } = await axios.get(`${BASE_URL}/categories`);
  return data;
}
async function getFurnitures() {
  const params = { page: state.page, limit: state.limit };
  if (state.categoryId) params.category = state.categoryId;
  const { data } = await axios.get(`${BASE_URL}/furnitures`, { params });
  return data;
}

/* ================= Templating ================= */
const priceUA = v => new Intl.NumberFormat('uk-UA').format(v) + ' грн';
const colors = a =>
  (a || [])
    .slice(0, 3)
    .map(c => `<li class="color-dot" style="background:${c}"></li>`)
    .join('');

const card = ({ _id, name, images = [], price, color = [] }) => `
<li class="product-card" data-id="${_id}">
  <div class="product-card__media">
    <img class="product-card__img" src="${
      images[0] || ''
    }" alt="${name}" loading="lazy">
  </div>
  <div class="product-card__body">
    <h3 class="product-card__title" title="${name}">${name}</h3>
    <ul class="product-card__colors">${colors(color)}</ul>
    <p class="product-card__price">${priceUA(price)}</p>
    <button class="product-card__btn" type="button">Детальніше</button>
  </div>
</li>`;

/* ================= Renderers ================= */
async function renderCategories() {
  const list = await getCategories();
  const map = Object.fromEntries(list.map(c => [c.name, c._id]));

  categoriesListEl.querySelectorAll('.category-chip').forEach(btn => {
    if (btn.classList.contains('category-chip--all')) return;

    const mod = [...btn.classList]
      .find(c => c.startsWith('category-chip--'))
      ?.replace('category-chip--', '');
    const name = MOD_TO_NAME[mod];

    const labelEl = btn.querySelector('.furniture-categories__js');
    if (!name || !labelEl) {
      btn.disabled = true;
      return;
    }

    labelEl.textContent = name;
    btn.dataset.categoryId = map[name] || '';
  });
}

async function renderProducts(replace = true) {
  const { furnitures, totalItems } = await getFurnitures();
  state.total = totalItems;

  const html = furnitures.map(card).join('');
  if (replace) productsListEl.innerHTML = html;
  else productsListEl.insertAdjacentHTML('beforeend', html);
}

/* ================= Events ================= */
categoriesListEl.addEventListener('click', async e => {
  const btn = e.target.closest('.category-chip');
  if (!btn) return;

  categoriesListEl
    .querySelectorAll('.active-frame')
    .forEach(b => b.classList.remove('active-frame'));
  btn.classList.add('active-frame');

  state.categoryId = btn.dataset.categoryId || '';
  state.page = 1;

  try {
    showLoader();
    productsListEl.innerHTML = '';
    await renderProducts(true);
  } catch (err) {
    showError(
      'Не вдалося завантажити товари цієї категорії. Спробуйте пізніше.'
    );
  } finally {
    hideLoader();
  }
});

btnLoadMore.addEventListener('click', async () => {
  state.page += 1;

  btnLoadMore.disabled = true;
  showLoader();
  try {
    const prevCount = productsListEl.children.length;
    await renderProducts(false);

    const firstNew = productsListEl.children[prevCount];
    if (firstNew)
      firstNew.scrollIntoView({ behavior: 'smooth', block: 'start' });

    const noMore = productsListEl.children.length >= state.total;
    if (noMore && state.categoryId === '') {
      showEndOfAllToast();
    }
  } catch (err) {
    showError('Не вдалося завантажити додаткові товари. Спробуйте знову.');
  } finally {
    btnLoadMore.disabled = false;
    hideLoader();
  }
});

/* ================= Init ================= */
(async function init() {
  try {
    showLoader();
    await renderCategories();
    await renderProducts(true);
  } catch (err) {
    showError('Помилка ініціалізації. Оновіть сторінку або спробуйте пізніше.');
  } finally {
    hideLoader();
  }
})();
