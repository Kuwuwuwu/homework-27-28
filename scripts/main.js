class Slider {
  constructor(selector, options = {}) {
    this.slider = document.querySelector(selector);
    this.images = this.slider.querySelectorAll('.image');
    this.scrollLeft = this.slider.querySelector('.scroll-left');
    this.scrollRight = this.slider.querySelector('.scroll-right');
    this.indicators = this.slider.querySelector('.circle__container');

    this.currentIndex = 0;
    this.interval = options.interval || 3000; // Интервал автопрокрутки
    this.enableAutoplay = options.enableAutoplay !== false; // Автопрокрутка по умолчанию включена
    this.autoplayInterval = null;

    this.init();
  }

  // Инициализация слайдера
  init() {
    this.createIndicators();
    this.showSlide(this.currentIndex);
    this.addEvents();
    if (this.enableAutoplay) {
      this.startAutoplay();
    }
  }

  // Отображение текущего слайда
  showSlide(index) {
    this.images.forEach((img, i) => {
      img.classList.toggle('active', i === index);
      this.indicators.children[i].classList.toggle('active', i === index);
    });
  }

  // Создание индикаторов
  createIndicators() {
    this.images.forEach((_, index) => {
      const circle = document.createElement('div');
      circle.classList.add('circle');
      if (index === 0) circle.classList.add('active');
      circle.addEventListener('click', () => {
        this.currentIndex = index;
        this.showSlide(this.currentIndex);
      });
      this.indicators.appendChild(circle);
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
    this.autoplayInterval = setInterval(() => {
      this.nextSlide();
    }, this.interval);
  }

  // Остановка автопрокрутки
  stopAutoplay() {
    clearInterval(this.autoplayInterval);
    this.autoplayInterval = null;
  }

  // Добавление событий
  addEvents() {
    this.scrollRight.addEventListener('click', () => {
      this.nextSlide();
    });

    this.scrollLeft.addEventListener('click', () => {
      this.prevSlide();
    });

    // Пауза при наведении мыши
    this.slider.addEventListener('mouseenter', () => {
      this.stopAutoplay();
    });

    this.slider.addEventListener('mouseleave', () => {
      if (this.enableAutoplay) {
        this.startAutoplay();
      }
    });
  }
}

// Инициализация слайдера
document.addEventListener('DOMContentLoaded', () => {
  new Slider('#slider', {
    interval: 5000,          // Интервал 5 секунд
    enableAutoplay: true     // Включить автопрокрутку
  });
});