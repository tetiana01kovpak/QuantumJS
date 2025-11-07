const reviewsContainer = document.querySelector(".js-review");
import { BASE_URL } from "./pixabay-api";
import axios from 'axios';



export async function loadFeedbacks(page=1) {
  try {
    const response = await axios.get(`${BASE_URL}feedbacks`);
     const feedbacksArray = Array.isArray(response.data.feedbacks) 
       console.log("API response:", response.data.feedbacks);
    return response.data; 

  } catch (error) {
    console.error("Помилка при завантаженні відгуків:", error);
    return []; 
  }
}

export function rating(rating){
if (rating> 3.3 && rating<=3.7 ){
return  3.5;
}
  if (rating >= 3.8 && rating <= 4.2) return 4;
  return Math.round(rating);
}


export function renderFeedbacks(feedbacks) {
  reviewsContainer.innerHTML = feedbacks.map(({rating, comment, name}) => `
    <li class="review-exemplar">
      <p class="review-stars" data-rating="${rating}">${rating}</p>
      <p class="text-review">${comment}</p>
      <p class="review-author">${name}</p>
    </li>
  `).join('');
}


export async function initReviews() {
  const feedbacks = await loadFeedbacks();
  renderFeedbacks(feedbacks);
}


initReviews();
