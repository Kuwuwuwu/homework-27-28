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
