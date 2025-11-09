import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import axios from 'axios';
import { BASE_URL } from './pixabay-api';
import iconsUrl from '../img/icons.svg';

import { Nextbtn, Prevbtn, paginationE2 } from './refs.js';

// ---- СЕЛЕКТОРИ ----
const ROOT = '.reviews__container'; // головний контейнер Swiper
const LIST = '.reviews__list.js-review';

// DOM
const rootEl = document.querySelector(ROOT);
const listEl = document.querySelector(LIST);

// ---- API ----
const API_URL = `${BASE_URL}${BASE_URL.endsWith('/') ? '' : '/'}feedbacks`;

// ---- ДОПОМІЖНІ ФУНКЦІЇ ----
function roundRating(n) {
  const r = Number(n) || 0;
  if (r > 3.3 && r <= 3.7) return 3.5;
  if (r >= 3.8 && r <= 4.2) return 4;
  return Math.round(r * 2) / 2;
}

function normalizeItem(raw) {
  return {
    rate: roundRating(raw.rate ?? raw.rating ?? raw.stars ?? 0),
    text: String(raw.descr ?? raw.comment ?? raw.text ?? ''),
    name: String(raw.name ?? raw.author ?? 'Анонім'),
  };
}

function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  let html = '';
  for (let i = 0; i < full; i++)
    html += `<svg width="20" height="20" class="star-icon"><use href="${iconsUrl}#icon-star-fill"></use></svg>`;
  if (half)
    html += `<svg width="20" height="20" class="star-icon"><use href="${iconsUrl}#icon-star-half"></use></svg>`;
  for (let i = 0; i < empty; i++)
    html += `<svg width="20" height="20" class="star-icon is-empty"><use href="${iconsUrl}#icon-star-blank"></use></svg>`;

  return `<div class="review-stars" data-rating="${rating}">${html}</div>`;
}

// ---- РОЗМІТКА СЛАЙДУ ----
const itemTpl = ({ rate, text, name }) => `
  <li class="review-exemplar swiper-slide">
    ${renderStars(rate)}
    <p class="text-review">“${text}”</p>
    <p class="review-author">${name}</p>
  </li>
`;

// ---- API: ЗАВАНТАЖЕННЯ ----
async function loadFeedbacks(limit = 10) {
  try {
    const { data } = await axios.get(API_URL, { params: { limit } });
    const arr = data?.feedbacks ?? data?.items ?? data?.data ?? data ?? [];
    return Array.isArray(arr) ? arr.slice(0, limit).map(normalizeItem) : [];
  } catch (e) {
    console.error('Помилка при завантаженні відгуків:', e);
    return [];
  }
}

// ---- РЕНДЕР ----
function renderFeedbacks(items) {
  if (!listEl) return;
  listEl.innerHTML = items.length
    ? items.map(itemTpl).join('')
    : `<li class="review-exemplar swiper-slide">
         <p class="text-review">Наразі відгуків немає.</p>
         <p class="review-author">—</p>
       </li>`;
}

// ---- ІНІЦІАЛІЗАЦІЯ SWIPER ----
export async function initReviews() {
  if (!rootEl || !listEl) return;

  const items = await loadFeedbacks(10);
  renderFeedbacks(items);

  const swiper = new Swiper(ROOT, {
    modules: [Navigation, Pagination],
    slidesPerView: 1,
    spaceBetween: 24,
    loop: false,

    navigation: {
      nextEl: Nextbtn,
      prevEl: Prevbtn,
    },
    pagination: {
      el: paginationE2,
      clickable: true,
      type: 'bullets',
    },
    breakpoints: {
      768: { slidesPerView: 2, slidesPerGroup: 2, spaceBetween: 24 },
      1440: { slidesPerView: 3, slidesPerGroup: 3, spaceBetween: 32 },
    },
  });
}
