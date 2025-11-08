// product-modal.js

const modalOverlay = document.querySelector('.prod-modal-overlay');
const modalWindow = document.querySelector('.prod-modal-window');
const closeBtn = document.querySelector('.close-modal-btn');
const furnitureList = document.querySelector('.products-grid.furniture-list-js');

// === ОТКРЫТИЕ МОДАЛКИ ===
function openModal(productData) {
  // убираем класс скрытия
  modalOverlay.classList.remove('is-close');
  // блокируем прокрутку страницы
  document.body.style.overflow = 'hidden';

  // наполняем модалку данными
  modalWindow.querySelector('.prod-name').textContent = productData.name || 'Без назви';
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
    .map(img => `<img src="${img}" alt="${productData.name}" class="image-modal">`)
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
}

// === ЗАКРЫТИЕ МОДАЛКИ ===
function closeModal() {
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

// === ОТКРЫТИЕ ПО КНОПКЕ “Детальніше” ===
furnitureList.addEventListener('click', async e => {
  const btn = e.target.closest('.product-card__btn');
  if (!btn) return;

  const card = btn.closest('.product-card');
  const id = card.dataset.id;

  try {
    const res = await fetch(`https://furniture-store-v2.b.goit.study/api/furnitures/${id}`);
    const data = await res.json();
    openModal(data);
  } catch (err) {
    console.error('Помилка при завантаженні даних продукту:', err);
  }
});
