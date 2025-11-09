import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import axios from 'axios';
import { BASE_URL } from './pixabay-api';
import iconsUrl from '../img/icons.svg';




// Селектори / константи
const ROOT = '.reviews-swiper';  // контейнер Swiper
const LIST = '.review.js-review';     // <ul class="review js-review"> 
const STAR_FULL = 'icon-star-fill';
const STAR_HALF = 'icon-star-half';
// DOM
const rootEl = document.querySelector(ROOT);
const listEl = document.querySelector(LIST);
// API endpoint
const API_URL = `${BASE_URL}${BASE_URL.endsWith('/') ? '' : '/'}feedbacks`;
// Округлення рейтингу за ТЗ
function roundRating(n) {
 const r = Number(n) || 0;
 if (r > 3.3 && r <= 3.7) return 3.5;
 if (r >= 3.8 && r <= 4.2) return 4;
 return Math.round(r * 2) / 2; // крок 0.5
}
// Нормалізація даних з бекенду
function normalizeItem(raw) {
 return {
  rate: roundRating(raw.rate ?? raw.rating ?? raw.stars ?? 0),
  text: String(raw.descr ?? raw.comment ?? raw.text ?? ''),
  name: String(raw.name ?? raw.author ?? 'Анонім'),
 };
}
// Іконка зі спрайта
const icon = (id, extra = '') =>
 `<svg class="star-icon ${extra}" width="20" height="20" aria-hidden="true"><use href="${iconsUrl}#${id}"></use></svg>`;
// Розмітка зірок (повні / половинка / «порожні» як тьмяні)
function stars(rate) {
 const v = Math.max(0, Math.min(5, Number(rate) || 0));
 const full = Math.floor(v);
 const half = v - full >= 0.5 ? 1 : 0;
 const empty = 5 - full - half;
 return `
  <div class="review-stars" data-rating="${v}" aria-label="Рейтинг ${v} з 5">
   ${Array.from({ length: full }, () => icon(STAR_FULL)).join('')}
   ${half ? icon(STAR_HALF) : ''}
   ${Array.from({ length: empty }, () => icon(STAR_FULL, 'is-empty')).join('')}
  </div>
 `;
}
// Шаблон слайду
const itemTpl = ({ rate, text, name }) => `
 <li class="review-exemplar swiper-slide">
  ${stars(rate)}
  <p class="text-review">“${text}”</p>
  <p class="review-author">${name}</p>
 </li>
`;
// Завантажити до 10 відгуків
export async function loadFeedbacks(limit = 10) {
 try {
  const { data } = await axios.get(API_URL, { params: { limit } });
  const arr = data?.feedbacks ?? data?.items ?? data?.data ?? data ?? [];
  return Array.isArray(arr) ? arr.slice(0, limit).map(normalizeItem) : [];
 } catch (e) {
  console.error('Помилка при завантаженні відгуків:', e);
  return [];
 }
}
// Рендер списку
export function renderFeedbacks(items) {
 if (!listEl) return;
 listEl.classList.add('swiper-wrapper');
 listEl.innerHTML = items.length
  ? items.map(itemTpl).join('')
  : `<li class="review-exemplar swiper-slide">
     <p class="text-review">Наразі відгуків немає.</p>
     <p class="review-author">—</p>
    </li>`;
}
// Ініціалізація секції
export async function initReviews() {
 if (!rootEl || !listEl) return;
 const items = await loadFeedbacks(10);
  renderFeedbacks(items);
  
 // 1/2/3 картки на брейкпоінтах; стрілки праворуч; булети зліва
 const swiper = new Swiper(ROOT, {
    modules: [Navigation, Pagination],
    slidesPerView: 1,
    slidesPerGroup: 1,
    spaceBetween: 24,
    watchOverflow: true,
    centeredSlides: false,
    loop: false,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      renderBullet: (i, className) =>
        `<button class="${className}" type="button" aria-label="Перейти до відгуку ${i + 1}"></button>`,
  },
  navigation: {
   nextEl: '.swiper-button-next',
   prevEl: '.swiper-button-prev',
   disabledClass: 'is-disabled',
  },
  breakpoints: {
  768: { slidesPerView: 2, slidesPerGroup: 2, spaceBetween: 24 },
  1440: { slidesPerView: 3, slidesPerGroup: 3, spaceBetween: 32 },
  },
 });
  setSlideWidths(swiper);

  window.addEventListener('resize', () => setSlideWidths(swiper));
}
