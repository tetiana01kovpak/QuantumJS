import { initReviews } from './js/feedback.js'; 

initReviews();
import { toggleNavMenu } from './js/header.js';
import './js/faq.js';
import './js/order-modal.js';
import './js/furniture-list.js';
import './js/product-modal.js';
import './js/popular-products.js';

document.addEventListener('pointerdown', (e) => {
  const btn = e.target.closest('.button');
  if (btn) {
    setTimeout(() => btn.blur(), 0);
  }
});