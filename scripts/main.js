class Slider {
  constructor(selector, options = {}) {
    // Основные элементы и настройки
    this.slider = document.querySelector(selector);
    this.images = this.slider.querySelectorAll('.image');
    this.currentIndex = 0;

    // Параметры конфигурации
    this.interval = options.interval || 3000; // Интервал автопрокрутки
    this.enableAutoplay = options.enableAutoplay !== false; // Включить автоплей
    this.showIndicators = options.showIndicators !== false; // Отображать индикаторы
    this.swipeSensitivity = options.swipeSensitivity || 50; // Чувствительность свайпа

    // Автопрокрутка
    this.autoplayInterval = null;

    // События для свайпа
    this.startX = 0;
    this.isDragging = false;

    // Инициализация
    this.init();
  }

  // Инициализация слайдера
  init() {
    this.createNavigationButtons();
    if (this.showIndicators) this.createIndicators();
    this.showSlide(this.currentIndex);
    this.addEvents();
    if (this.enableAutoplay) this.startAutoplay();
  }

  // Отображение текущего слайда
  showSlide(index) {
    this.images.forEach((img, i) => {
      img.classList.toggle('active', i === index);
      if (this.showIndicators) {
        this.slider.querySelectorAll('.circle')[i].classList.toggle('active', i === index);
      }
    });
  }

  // Создание кнопок "вперед" и "назад"
  createNavigationButtons() {
    const btnLeft = document.createElement('button');
    btnLeft.className = 'scroll-button scroll-left';
    btnLeft.setAttribute('aria-label', 'Previous slide');
    btnLeft.innerHTML = '&#10094;';
    this.slider.appendChild(btnLeft);

    const btnRight = document.createElement('button');
    btnRight.className = 'scroll-button scroll-right';
    btnRight.setAttribute('aria-label', 'Next slide');
    btnRight.innerHTML = '&#10095;';
    this.slider.appendChild(btnRight);

    btnLeft.addEventListener('click', () => this.prevSlide());
    btnRight.addEventListener('click', () => this.nextSlide());
  }

  // Создание индикаторов
  createIndicators() {
    const indicators = document.createElement('div');
    indicators.className = 'circle__container';
    this.slider.appendChild(indicators);

    this.images.forEach((_, index) => {
      const circle = document.createElement('div');
      circle.classList.add('circle');
      if (index === 0) circle.classList.add('active');
      circle.addEventListener('click', () => {
        this.currentIndex = index;
        this.showSlide(this.currentIndex);
      });
      indicators.appendChild(circle);
    });
  }

  // Переключение на следующий слайд
  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.showSlide(this.currentIndex);
  }

  // Переключение на предыдущий слайд
  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.showSlide(this.currentIndex);
  }

  // Запуск автопрокрутки
  startAutoplay() {
    this.autoplayInterval = setInterval(() => this.nextSlide(), this.interval);
  }

  // Остановка автопрокрутки
  stopAutoplay() {
    clearInterval(this.autoplayInterval);
    this.autoplayInterval = null;
  }

  // Обработка свайпов
  handleSwipeStart(event) {
    this.isDragging = true;
    this.startX = event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
  }

  handleSwipeEnd(event) {
    if (!this.isDragging) return;
    this.isDragging = false;
    const endX = event.type.includes('mouse') ? event.pageX : event.changedTouches[0].clientX;
    const diff = endX - this.startX;

    if (diff > this.swipeSensitivity) {
      this.prevSlide();
    } else if (diff < -this.swipeSensitivity) {
      this.nextSlide();
    }
  }

  // Добавление событий
  addEvents() {
    this.slider.addEventListener('mouseenter', () => this.stopAutoplay());
    this.slider.addEventListener('mouseleave', () => {
      if (this.enableAutoplay) this.startAutoplay();
    });

    this.slider.addEventListener('mousedown', (e) => this.handleSwipeStart(e));
    this.slider.addEventListener('mouseup', (e) => this.handleSwipeEnd(e));
    this.slider.addEventListener('touchstart', (e) => this.handleSwipeStart(e));
    this.slider.addEventListener('touchend', (e) => this.handleSwipeEnd(e));

    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') this.nextSlide();
      if (e.key === 'ArrowLeft') this.prevSlide();
    });
  }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
  new Slider('#slider', {
    interval: 5000,          // Интервал автопрокрутки
    enableAutoplay: true,    // Включить автоплей
    showIndicators: true,    // Показать индикаторы
    swipeSensitivity: 75     // Чувствительность свайпа
  });
});