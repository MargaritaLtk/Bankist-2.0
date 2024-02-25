'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
const imgTargets = document.querySelectorAll('img[data-src]');

const openModal = function () {
   modal.classList.remove('hidden');
   overlay.classList.remove('hidden');
};

const closeModal = function () {
   modal.classList.add('hidden');
   overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++) btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
   if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
   }
});

btnScrollTo.addEventListener('click', function (e) {
   // first way
   // const s1coords = section1.getBoundingClientRect();
   // window.scrollTo({
   //   left: s1coords.left + window.scrollX,
   //   top: s1coords.top + window.scrollY,
   //   behavior: 'smooth',
   // });

   //better way
   section1.scrollIntoView({ behavior: 'smooth' });
});

//smooth nav scrolling
document.querySelector('.nav__links').addEventListener('click', function (e) {
   e.preventDefault();
   if (e.target.classList.contains('nav__link')) {
      const id = e.target.getAttribute('href');
      if (id !== '#') document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
   }
});

//tabbed component
tabsContainer.addEventListener('click', function (e) {
   const clickedBtn = e.target.closest('.operations__tab');
   if (!clickedBtn) return;

   //Remove active classes
   tabs.forEach((tab) => tab.classList.remove('operations__tab--active'));
   tabsContent.forEach((content) => content.classList.remove('operations__content--active'));

   clickedBtn.classList.add('operations__tab--active');
   document.querySelector(`.operations__content--${clickedBtn.dataset.tab}`).classList.add('operations__content--active');
});

//menu fade animation
const handleHover = function (e) {
   if (e.target.classList.contains('nav__link')) {
      const link = e.target;
      const siblings = link.closest('.nav').querySelectorAll('.nav__link');

      siblings.forEach((el) => {
         if (el !== link) {
            el.style.opacity = this;
         }
      });
   }
};

nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

const navHeight = nav.getBoundingClientRect().height;
const stickyNav = function (entries, observer) {
   const [entry] = entries;
   if (!entry.isIntersecting) {
      nav.classList.add('sticky');
   } else {
      nav.classList.remove('sticky');
   }
};

const headerObserver = new IntersectionObserver(stickyNav, { root: null, rootMargin: `-${navHeight}px`, threshold: 0 });
headerObserver.observe(header);

//reveal secions
const revealSections = function (entries, observer) {
   const [entry] = entries;

   if (!entry.isIntersecting) return;
   entry.target.classList.remove('section--hidden');
   observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSections, { root: null, threshold: 0.15 });

allSections.forEach(function (section) {
   sectionObserver.observe(section);
   // section.classList.add('section--hidden');
});

//lazy loading images

const loadImg = function (entries, observer) {
   const [entry] = entries;
   if (!entry.isIntersecting) return;

   entry.target.src = entry.target.dataset.src;

   entry.target.addEventListener('load', function () {
      entry.target.classList.remove('lazy-img');
   });
   observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, { root: null, threshold: 0, rootMargin: '200px' });
imgTargets.forEach((img) => imgObserver.observe(img));

//slider

const slider = function () {
   const slides = document.querySelectorAll('.slide');
   const dotContainer = document.querySelector('.dots');
   const btnLeft = document.querySelector('.slider__btn--left');
   const btnRight = document.querySelector('.slider__btn--right');

   let currSlide = 0;
   const maxSlide = slides.length;

   const goToSlide = (slide) => slides.forEach((s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`));

   const createDots = function () {
      slides.forEach(function (_s, i) {
         dotContainer.insertAdjacentHTML('beforeend', `<button class="dots__dot" data-slide="${i}"></button>`);
      });
   };

   const activateDot = function (slide) {
      document.querySelectorAll('.dots__dot').forEach((dot) => dot.classList.remove('dots__dot--active'));
      document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
   };

   const init = function () {
      createDots();
      activateDot(0);
      goToSlide(0);
   };

   init();

   const goToNextSlide = function () {
      currSlide == maxSlide - 1 ? (currSlide = 0) : currSlide++;
      // currSlide == maxSlide - 1 ? '' : currSlide++;
      goToSlide(currSlide);
      activateDot(currSlide);
   };

   const goToPrevSlide = function () {
      if (currSlide === 0) {
         return;
      } else {
         currSlide--;
      }

      // if (currSlide === 0) {
      //    currSlide = maxSlide - 1;
      // } else {
      //    currSlide--;
      // }
      goToSlide(currSlide);
      activateDot(currSlide);
   };

   btnRight.addEventListener('click', goToNextSlide);
   btnLeft.addEventListener('click', goToPrevSlide);

   document.addEventListener('keydown', function (e) {
      e.key == 'ArrowRight' && goToNextSlide();
      e.key == 'ArrowLeft' && goToPrevSlide();
   });

   dotContainer.addEventListener('click', function (e) {
      if (e.target.classList.contains('dots__dot')) {
         const { slide } = e.target.dataset;
         goToSlide(slide);
         activateDot(slide);
      }
   });
};

slider();
