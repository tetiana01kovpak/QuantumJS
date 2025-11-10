import axios from 'axios';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { popularListEl, btnPrev, btnNext, paginationEl } from './refs.js';
import { BASE_URL } from './pixabay-api.js';

const priceUA = v => new Intl.NumberFormat('uk-UA').format(v) + ' грн';
const colors = a =>
  (a || [])
    .slice(0, 3)
    .map(c => `<li class="color-dot" style="background:${c}"></li>`)
    .join('');

const card = ({ _id, name, images = [], price, color = [] }) => `
<li class="swiper-slide product-card" data-id="${_id}">
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

async function getPopularProducts() {
  const { data } = await axios.get(`${BASE_URL}furnitures?type=popular`);
  return data.furnitures || [];
}

async function initPopularProducts() {
  try {
    const products = await getPopularProducts();
    if (!products.length) return;

    popularListEl.innerHTML = products.map(card).join('');

    const swiper = new Swiper('.popular-products__container', {
      modules: [Navigation, Pagination],
      slidesPerView: 4,
      spaceBetween: 10,
      navigation: {
        nextEl: btnNext,
        prevEl: btnPrev,
      },
      pagination: {
        el: paginationEl,
        clickable: true,
        type: 'bullets',
      },
      breakpoints: {
        375: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1440: { slidesPerView: 4 },
      },
      on: {
        slideChange: function () {
          btnPrev.disabled = this.isBeginning;
          btnNext.disabled = this.isEnd;
        },
      },
      watchOverflow: true,
      on: {
        init: function () {
          btnPrev.disabled = this.isBeginning;
          btnNext.disabled = this.isEnd;
        },
        slideChange: function () {
          btnPrev.disabled = this.isBeginning;
          btnNext.disabled = this.isEnd;
        },
      },
    });

    // Ініціалізація кнопок
    btnPrev.disabled = true;
    btnNext.disabled = products.length <= swiper.params.slidesPerView;
  } catch (err) {
    console.error('Помилка завантаження популярних товарів:', err);
  }
}

document.addEventListener('DOMContentLoaded', initPopularProducts);
