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
