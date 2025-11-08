import { loadFeedbacks, renderFeedbacks, initReviews } from './js/feedback';

initReviews();
import { toggleNavMenu } from './js/header';
import './js/faq.js';
import './js/order-modal.js';
import './js/furniture-list.js';
import './js/product-modal.js';

document.addEventListener('pointerdown', (e) => {
  const btn = e.target.closest('.button');
  if (btn) {
    setTimeout(() => btn.blur(), 0);
  }
});
