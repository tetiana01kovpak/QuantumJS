import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const overlay = document.querySelector('.modal-overlay');
const form = overlay?.querySelector('.modal-form');
let orderData = {};

function open({ modelId = '', color = '' } = {}) {
  if (!overlay) return;
  orderData = { modelId, color };
  overlay.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function close() {
  if (!overlay) return;
  overlay.classList.remove('is-open');
  document.body.style.overflow = '';
  orderData = {};
}

// Testing only - delete after product model handles submit
document.addEventListener('click', e => {
  const btn = e.target.closest('.modal-sub-btn');
  if (!btn) return;

  const prodModal = document.querySelector('.prod-modal-window');
  const modelId =
    prodModal?.dataset.modelId ||
    btn.dataset.modelId ||
    '682f9bbf8acbdf505592ac42';
  const color =
    document.querySelector('input[name="product-color"]:checked')?.value || '';

  document.querySelector('.prod-modal-overlay')?.classList.remove('is-open');

  console.log(modelId, color);
  open({ modelId, color });
});

overlay?.querySelector('.modal-close')?.addEventListener('click', close);
overlay?.addEventListener('click', e => e.target === overlay && close());
document.addEventListener(
  'keydown',
  e => e.key === 'Escape' && overlay?.classList.contains('is-open') && close()
);

form?.addEventListener('submit', async e => {
  e.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
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
