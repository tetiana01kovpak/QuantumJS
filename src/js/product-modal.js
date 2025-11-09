import {
  modalOverlay,
  modalWindow,
  closeBtn,
  popularListEl, 
  productsListEl } from './refs';

// === ОТКРЫТИЕ МОДАЛКИ ===
function openModal(productData) {
  // убираем класс скрытия
  modalOverlay.classList.remove('is-close');
  // блокируем прокрутку страницы
  document.body.style.overflow = 'hidden';

  // наполняем модалку данными
  modalWindow.querySelector('.prod-name').textContent =
    productData.name || 'Без назви';
  modalWindow.querySelector('.prod-category').textContent =
    productData.category?.name || 'Категорія';
  modalWindow.querySelector('.prod-price').textContent =
    new Intl.NumberFormat('uk-UA').format(productData.price || 0) + ' грн';
  modalWindow.querySelector('.prod-descr').textContent =
    productData.description || 'Опис відсутній';
  modalWindow.querySelector('.prod-size').textContent = productData.size
    ? `Розміри: ${productData.size}`
    : '';

  // === картинки ===
  const imgCont = modalWindow.querySelector('.image-cont');
  imgCont.innerHTML = (productData.images || [])
    .slice(0, 3)
    .map(
      img => `<img src="${img}" alt="${productData.name}" class="image-modal">`
    )
    .join('');

  // === цвета ===
  const colorCont = modalWindow.querySelector('.color-btns');
  colorCont.innerHTML = (productData.color || [])
    .slice(0, 3)
    .map(
      (c, i) =>
        `<input class="color-btn" type="radio" name="product-color" value="${c}" ${
          i === 0 ? 'checked' : ''
        } style="background:${c}">`
    )
    .join('');

  // store current product id on the window for later retrieval
  if (productData._id) {
    modalWindow.dataset.modelId = productData._id;
  }
}

// === ЗАКРЫТИЕ МОДАЛКИ ===
export function closeModal() {
  modalOverlay.classList.add('is-close');
  document.body.style.overflow = '';
}

// === ОБРАБОТЧИКИ ===

// кнопка “X”
closeBtn.addEventListener('click', closeModal);

// клик по оверлею
modalOverlay.addEventListener('click', e => {
  if (e.target === modalOverlay) closeModal();
});

// клавиша Escape
window.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

// === ПЕРЕЙТИ ДО ЗАМОВЛЕННЯ ===
[popularListEl, productsListEl].forEach(listEl => {
  if (!listEl) return;

  listEl.addEventListener('click', e => {
    const btn = e.target.closest('.product-card__btn');
    if (!btn) return;

    const card = btn.closest('.product-card');
    const id = card.dataset.id;

    // Завантажуємо деталі продукту та відкриваємо модалку
    fetch(`https://furniture-store-v2.b.goit.study/api/furnitures/${id}`)
      .then(res => res.json())
      .then(data => openModal(data))
      .catch(err => console.error('Помилка при завантаженні даних продукту:', err));
  });
});

// === ПЕРЕЙТИ ДО ЗАМОВЛЕННЯ З МОДАЛКИ ===
modalWindow.addEventListener('click', e => {
  if (!e.target.closest('.order-btn')) return;

  const modelId = modalWindow.dataset.modelId;
  if (!modelId) return;

  const color =
    modalWindow.querySelector('input[name="product-color"]:checked')?.value ||
    '';

  closeModal();
  openOrderModal({ modelId, color });
});