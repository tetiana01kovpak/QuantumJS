import { BASE_URL } from './pixabay-api';
import axios from 'axios';
import { reviewsContainer, buttonReviewLeft, buttonReviewRight } from './refs';

const END_POINT = 'feedbacks';

let allFeedbacks = [];
let currentPageIndex = 0;

function getItemPerPage() {
  const width = window.innerWidth;
  if (width < 768) {
    return 1;
  }
  if (width >= 768 && width < 1440) {
    return 2;
  }
  if (width >= 1440) {
    return 3;
  }
}

export async function loadFeedbacks(page = 1) {
  const response = await axios.get(`${BASE_URL}${END_POINT}`, {
    params: { page },
  });
  return response.data.feedbacks;
}

function renderStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  let starsHTML = '';

  for (let i = 0; i < fullStars; i++) {
    starsHTML += `
      <svg width="20" height="20" class="star-icon">
        <use href="../img/icons.svg#icon-star-fill"></use>
      </svg>
    `;
  }

  if (hasHalfStar) {
    starsHTML += `
      <svg width="20" height="20" class="star-icon">
        <use href="../img/icons.svg#icon-star-half"></use>
      </svg>
    `;
  }

  for (let i = 0; i < emptyStars; i++) {
    starsHTML += `
      <svg width="20" height="20" class="star-icon">
        <use href="../img/icons.svg#icon-star-blank"></use>
      </svg>
    `;
  }

  return `<div class="review-stars">${starsHTML}</div>`;
}

export function rating(rating) {
  if (rating > 3.3 && rating <= 3.7) {
    return 3.5;
  }
  if (rating >= 3.8 && rating <= 4.2) return 4;
  return Math.round(rating);
}

export function renderFeedbacks(feedbacks) {
  return feedbacks
    .map(({ rate, descr, name }) => {
      const normalizedRate = rating(rate);
      return `
    <li class="review-exemplar">
      ${renderStars(normalizedRate)}
      <p class="text-review">${descr}</p>
      <p class="review-author">${name}</p>
    </li>
  `;
    })
    .join('');
}

function displayCurrentPage() {
  const perPage = getItemPerPage();
  const startIndex = currentPageIndex * perPage;
  const endIndex = startIndex + perPage;
  const currentPageFeedbacks = allFeedbacks.slice(startIndex, endIndex);

  reviewsContainer.innerHTML = '';
  reviewsContainer.insertAdjacentHTML('beforeend', renderFeedbacks(currentPageFeedbacks));

  updateButtonStates();
}

function updateButtonStates() {
  const perPage = getItemPerPage();
  const totalPages = Math.ceil(allFeedbacks.length / perPage);

  if (buttonReviewLeft) {
    buttonReviewLeft.disabled = currentPageIndex === 0;
  }

  if (buttonReviewRight) {
    buttonReviewRight.disabled = currentPageIndex >= totalPages - 1;
  }
}


function goToPreviousPage() {
  if (currentPageIndex > 0) {
    currentPageIndex--;
    displayCurrentPage();
  }
}
function goToNextPage() {
  const perPage = getItemPerPage();
  const totalPages = Math.ceil(allFeedbacks.length / perPage);

  if (currentPageIndex < totalPages - 1) {
    currentPageIndex++;
    displayCurrentPage();
  }
}

function handleResize() {
  const perPage = getItemPerPage();
  const totalPages = Math.ceil(allFeedbacks.length / perPage);

  if (currentPageIndex >= totalPages) {
    currentPageIndex = Math.max(0, totalPages - 1);
  }

  displayCurrentPage();
}

export async function initReviews(page = 1) {
  try {
    const feedbacks = await loadFeedbacks(page);
    allFeedbacks = feedbacks;
    currentPageIndex = 0;

    displayCurrentPage();

    if (buttonReviewLeft) {
      buttonReviewLeft.addEventListener('click', goToPreviousPage);
    }

    if (buttonReviewRight) {
      buttonReviewRight.addEventListener('click', goToNextPage);
    }

    window.addEventListener('resize', handleResize);
  } catch (error) {
    console.error('Помилка при завантаженні відгуків:', error);
  }
}
