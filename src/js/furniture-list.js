const categoryButtons = document.querySelectorAll('.furniture-categories__list .category-chip');

categoryButtons.forEach(button => {
button.addEventListener('click', () => {
    categoryButtons.forEach(btn => btn.classList.remove('active-frame'));
    button.classList.add('active-frame');
});
});

//

const BASE_URL = 'https://furniture-store-v2.b.goit.study/api';

async function fetchCategories() {
    const res = await fetch(`${BASE_URL}/categories`);
    if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
    }
    return res.json();
}

async function fillCategoryButtons() {
    try {
        const categories = await fetchCategories();
        const categoriesById = {};
        categories.forEach(cat => {
            categoriesById[cat._id] = cat;
        });

        const buttons = document.querySelectorAll(
        '.category-chip[data-category-id]'
        );

        buttons.forEach(button => {
        const id = button.dataset.categoryId;
        const span = button.querySelector('.furniture-categories__js');
        if (!span || !id) return;

        const category = categoriesById[id];
        if (category) {
            span.textContent = category.name;
        }
        });
    } catch (error) {
        console.error('Помилка завантаження категорії:', error);
    }
}

document.addEventListener('DOMContentLoaded', fillCategoryButtons);
