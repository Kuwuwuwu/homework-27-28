function Slider(selector, options) {
  this.slider = document.querySelector(selector);
  this.images = this.slider.querySelectorAll('.image');
  this.scrollLeft = this.slider.querySelector('.scroll-left');
  this.scrollRight = this.slider.querySelector('.scroll-right');
  this.indicators = this.slider.querySelector('.circle__container');
  this.stopper = this.slider.querySelector('.stopper');

  this.currentIndex = 0;
  this.autoplayInterval = null;
  this.interval = (options && options.interval) || 3000;

  this.startX = 0;
  this.startTime = 0;
  this.isDragging = false;

  this.init();
}

document.addEventListener('DOMContentLoaded', () => {
  const slider = document.getElementById('slider');
  const images = slider.querySelectorAll('.image');

  let currentIndex = 0;
  let autoplayInterval;
  let startX = 0;
  let isDragging = false;

  // Создание кнопок навигации
  const btnLeft = document.createElement('button');
  btnLeft.className = 'scroll-button scroll-left';
  btnLeft.setAttribute('aria-label', 'Previous slide');
  btnLeft.innerHTML = '&#10094;';
  slider.appendChild(btnLeft);

  const btnRight = document.createElement('button');
  btnRight.className = 'scroll-button scroll-right';
  btnRight.setAttribute('aria-label', 'Next slide');
  btnRight.innerHTML = '&#10095;';
  slider.appendChild(btnRight);

  // Создание индикаторов
  const indicators = document.createElement('div');
  indicators.className = 'circle__container';
  indicators.setAttribute('aria-label', 'Slide indicators');
  slider.appendChild(indicators);

  // Создание стоппера
  const stopper = document.createElement('div');
  stopper.className = 'stopper';
  stopper.setAttribute('aria-label', 'Stop autoplay');
  stopper.innerHTML = '&#10095;';
  slider.appendChild(stopper);

  // Отображение текущего слайда
  function showSlide(index) {
    images.forEach((img, i) => {
      img.classList.toggle('active', i === index);
      indicators.children[i].classList.toggle('active', i === index);
    });
  }

  // Создание индикаторов
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

  // Переключение слайдов
  function nextSlide() {
    currentIndex = (currentIndex + 1) % images.length;
    showSlide(currentIndex);
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showSlide(currentIndex);
  }

  // Автопроигрывание
  function startAutoplay() {
    autoplayInterval = setInterval(nextSlide, 3000);
  }

  function stopAutoplay() {
    clearInterval(autoplayInterval);
  }

  // Тач/мышь свайпы
  function onStart(e) {
    isDragging = true;
    startX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
  }

  function onEnd(e) {
    if (!isDragging) return;
    isDragging = false;
    const endX = e.type.includes('mouse') ? e.pageX : e.changedTouches[0].clientX;
    const diff = endX - startX;

    if (diff > 50) prevSlide();
    else if (diff < -50) nextSlide();
  }

  // Навешивание событий
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);
  stopper.addEventListener('click', stopAutoplay);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
  });

  slider.addEventListener('mousedown', onStart);
  slider.addEventListener('mouseup', onEnd);
  slider.addEventListener('touchstart', onStart);
  slider.addEventListener('touchend', onEnd);

  // Инициализация
  showSlide(currentIndex);
  startAutoplay();
});


Slider.prototype.init = function () {
  this.createIndicators();
  this.showSlide(this.currentIndex);
  this.addEvents();
  this.startAutoplay();
};

Slider.prototype.showSlide = function (index) {
  var self = this;
  this.images.forEach(function (img, i) {
    img.classList.toggle('active', i === index);
    self.indicators.children[i].classList.toggle('active', i === index);
  });
};

Slider.prototype.createIndicators = function () {
  var self = this;
  this.images.forEach(function (_, index) {
    var circle = document.createElement('div');
    circle.classList.add('circle');
    if (index === 0) circle.classList.add('active');
    circle.addEventListener('click', function () {
      self.currentIndex = index;
      self.showSlide(self.currentIndex);
    });
    self.indicators.appendChild(circle);
  });
};

Slider.prototype.nextSlide = function () {
  this.currentIndex = (this.currentIndex + 1) % this.images.length;
  this.showSlide(this.currentIndex);
};

Slider.prototype.prevSlide = function () {
  this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  this.showSlide(this.currentIndex);
};

Slider.prototype.startAutoplay = function () {
  var self = this;
  this.autoplayInterval = setInterval(function () {
    self.nextSlide();
  }, this.interval);
};

Slider.prototype.stopAutoplay = function () {
  clearInterval(this.autoplayInterval);
};

Slider.prototype.addEvents = function () {
  var self = this;

  this.scrollRight.addEventListener('click', function () {
    self.nextSlide();
  });

  this.scrollLeft.addEventListener('click', function () {
    self.prevSlide();
  });

  this.stopper.addEventListener('click', function () {
    self.stopAutoplay();
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowRight') self.nextSlide();
    if (event.key === 'ArrowLeft') self.prevSlide();
  });

  this.slider.addEventListener('mousedown', function (e) {
    self.onStart(e);
  });
  this.slider.addEventListener('mouseup', function (e) {
    self.onEnd(e);
  });
  this.slider.addEventListener('touchstart', function (e) {
    self.onStart(e);
  });
  this.slider.addEventListener('touchend', function (e) {
    self.onEnd(e);
  });
};

Slider.prototype.onStart = function (e) {
  this.isDragging = true;
  this.startX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
  this.startTime = new Date().getTime();
};

Slider.prototype.onEnd = function (e) {
  if (!this.isDragging) return;
  this.isDragging = false;
  var endX = e.type.includes('mouse') ? e.pageX : e.changedTouches[0].clientX;
  var diff = endX - this.startX;
  var elapsed = new Date().getTime() - this.startTime;

  if (diff > 50 || (diff > 30 && elapsed < 200)) {
    this.prevSlide();
  } else if (diff < -50 || (diff < -30 && elapsed < 200)) {
    this.nextSlide();
  }
};

Slider.prototype.toggleAutoplay = function () {
    if (this.autoplayInterval) {
        this.stopAutoplay();
        this.stopper.textContent = "Start"; // Меняем текст кнопки
    } else {
        this.startAutoplay();
        this.stopper.textContent = "Stop";
    }
};

this.stopper.addEventListener('click', function () {
    self.toggleAutoplay();
});