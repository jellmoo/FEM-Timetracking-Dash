let jsonData = [];
let currentTimeframe = 'daily';

fetch('/data.json')
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    jsonData = data;
    renderCards();
  })
  .catch((error) => {
    console.error('Failed to fetch data:', error);
    // Add visual feedback for users
    document.querySelector('#cards').innerHTML = '<p>Failed to load data. Please check the console for details.</p>';
  });

function createActivityCard(activity) {
  const timeframe = activity.timeframes[currentTimeframe];
  const previousLabel =
    currentTimeframe === 'daily'
      ? 'Yesterday'
      : currentTimeframe === 'weekly'
      ? 'Last Week'
      : 'Last Month';
  
  return `
    <article class="card card--${activity.title.toLowerCase().replaceAll(' ', '-')}">
      <div class="card__content">
        <div class="card__header">
          <h2 class="card__title">${activity.title}</h2>
          <img src="images/icon-ellipsis.svg" alt="ellipsis icon" class="card__icon" />
        </div>
        <div class="card__stats">
          <p class="card__current">${timeframe.current}hrs</p>
          <p class="card__previous">${previousLabel} - ${timeframe.previous}hrs</p>
        </div>
      </div>
    </article>
  `; 
}

function renderCards() {
  const cardsContainer = document.querySelector('#cards');
  let html = '';
  
  jsonData.forEach((activity) => {
    html += createActivityCard(activity);
  });
  
  cardsContainer.innerHTML = html;
}

function switchTimeframe(timeframe) {
  const allButtons = document.querySelectorAll('.profile__filters .btn');
  const activeButton = document.querySelector(`[data-time="${timeframe}"]`);
  
  allButtons.forEach((btn) => {
    btn.classList.remove('active');
  });
  
  if (activeButton) {
    activeButton.classList.add('active');
  }
  
  currentTimeframe = timeframe;
  renderCards();
}

function initializeEventListeners() {
  const filterButtons = document.querySelectorAll('.profile__filters .btn');
  filterButtons.forEach((button) => {
    button.addEventListener('click', function () {
      const timeframe = this.getAttribute('data-time');
      switchTimeframe(timeframe);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initializeEventListeners();
});