const gallery = document.querySelector('.slider'); 
const images = gallery.querySelectorAll('.image');
const scrollLeft = document.querySelector('.scroll-left');
const scrollRight = document.querySelector('.scroll-right');
const indicators = document.querySelector('.circle__container');
const stopper = document.querySelector('.stopper');

let currentIndex = 0;
let autoplayInterval;

// Функция отображения текущего изображения
function showSlide(index) {
  images.forEach((img, i) => {
    img.classList.remove('active');
    indicators.children[i].classList.remove('active');
    if (i === index) {
      img.classList.add('active');
      indicators.children[i].classList.add('active');
    }
  });
}

// Создание индикаторов
function createIndicators() {
  images.forEach((_, index) => {
    const circle = document.createElement('div');
    circle.classList.add('circle');
    if (index === 0) circle.classList.add('active');
    circle.addEventListener('click', () => {
      currentIndex = index;
      showSlide(currentIndex);
    });
    indicators.appendChild(circle);
  });
}

// Переключение на следующий слайд
function nextSlide() {
  currentIndex = (currentIndex + 1) % images.length;
  showSlide(currentIndex);
}

// Переключение на предыдущий слайд
function prevSlide() {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  showSlide(currentIndex);
}

// Автопроигрывание
function startAutoplay() {
  autoplayInterval = setInterval(nextSlide, 3000); // Интервал 3 секунды
}

// Остановка автопроигрывания
function stopAutoplay() {
  clearInterval(autoplayInterval);
}

// Тач и мышь свайпы
let startX = 0;
let isDragging = false;

function onStart(e) {
  isDragging = true;
  startX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
}

function onEnd(e) {
  if (!isDragging) return;
  isDragging = false;
  const endX = e.type.includes('mouse') ? e.pageX : e.changedTouches[0].clientX;
  const diff = endX - startX;

  if (diff > 50) {
    prevSlide();
  } else if (diff < -50) {
    nextSlide();
  }
}

// Подключение событий
gallery.addEventListener('mousedown', onStart);
gallery.addEventListener('mouseup', onEnd);
gallery.addEventListener('touchstart', onStart);
gallery.addEventListener('touchend', onEnd);

// Инициализация
createIndicators();
showSlide(currentIndex);
startAutoplay();

// Обработчики событий
scrollRight.addEventListener('click', nextSlide);
scrollLeft.addEventListener('click', prevSlide);
stopper.addEventListener('click', stopAutoplay);

// Поддержка клавиш клавиатуры
document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight') nextSlide();
  if (event.key === 'ArrowLeft') prevSlide();
});
