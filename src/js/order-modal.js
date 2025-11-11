import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const overlay = document.querySelector('.modal-overlay');
const form = overlay?.querySelector('.modal-form');
let orderData = {};

// === ВІДКРИТТЯ МОДАЛКИ ===
function open({ modelId = '', color = '' } = {}) {
  if (!overlay) return;
  orderData = { modelId, color };
  overlay.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  const modalWindow = overlay.querySelector('.modal'); // or your modal’s main block
  if (modalWindow) {
    modalWindow.style.maxHeight = '90vh';
    modalWindow.style.overflowY = 'auto';
  }
}

// === ЗАКРИТТЯ МОДАЛКИ ===
function close() {
  if (!overlay) return;
  overlay.classList.remove('is-open');
  document.body.style.overflow = '';
  const modalWindow = overlay.querySelector('.modal');
  if (modalWindow) {
    modalWindow.style.overflowY = '';
    modalWindow.style.maxHeight = '';
  }

  orderData = {};
  // прибрати червоні рамки після закриття
  [...form.elements].forEach(el => el.classList.remove('input-error'));
}

// === ОБРОБНИКИ ===

// кнопка закриття
overlay?.querySelector('.modal-close')?.addEventListener('click', close);

// клік по оверлею
overlay?.addEventListener('click', e => e.target === overlay && close());

// клавіша Escape
document.addEventListener(
  'keydown',
  e => e.key === 'Escape' && overlay?.classList.contains('is-open') && close()
);

// відкриття через тестову кнопку (видалити після інтеграції)
document.addEventListener('click', e => {
  const btn = e.target.closest('.modal-sub-btn');
  if (!btn) return;

  closeProductModal();
  const prodModal = document.querySelector('.prod-modal-window');
  const modelId =
    prodModal?.dataset.modelId ||
    btn.dataset.modelId ||
    '682f9bbf8acbdf505592ac42';
  const color =
    document.querySelector('input[name="product-color"]:checked')?.value || '';

  document.querySelector('.prod-modal-overlay')?.classList.remove('is-open');

  open({ modelId, color });
});

// === ВАЛІДАЦІЯ І ПОДСВІЧУВАННЯ ПОЛІВ ===
[...form?.elements].forEach(el => {
  if (el.tagName !== 'BUTTON') {
    el.addEventListener('input', () => el.classList.remove('input-error'));
  }
});

// === ПОДАЧА ФОРМИ ===
form?.addEventListener('submit', async e => {
  e.preventDefault();

  // прибираємо попередні помилки
  [...form.elements].forEach(el => el.classList.remove('input-error'));

  // перевірка валідності
  let hasError = false;
  [...form.elements].forEach(el => {
    if (el.tagName !== 'BUTTON' && !el.checkValidity()) {
      el.classList.add('input-error');
      hasError = true;
    }
  });

  if (hasError) {
    form.reportValidity(); // стандартні підказки браузера
    return;
  }

  const data = new FormData(form);
  const payload = {
    name: (data.get('name') || '').toString().trim(),
    phone: (data.get('phone') || '').toString().trim(),
    modelId: orderData.modelId,
    color: orderData.color,
    comment: (data.get('comment') || '').toString().trim(),
  };
  console.log(payload);

  try {
    const res = await fetch(
      'https://furniture-store-v2.b.goit.study/api/orders',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      iziToast.error({
        title: 'Помилка',
        message: json.message || `${res.status} ${res.statusText}`,
      });
      return;
    }

    const result = await res.json();
    iziToast.success({
      title: 'Успіх',
      message: `Замовлення прийнято. Номер: ${result.orderNum}`,
    });
    form.reset();
    close();
  } catch (err) {
    iziToast.error({ title: 'Помилка мережі', message: err.message });
  }
});

export { open as openOrderModal, close as closeOrderModal };
import { closeModal as closeProductModal } from './product-modal.js';
