new Swiper('.swiper-container', {
  effect: 'coverflow',
  grabCursor: true,
  centeredSlides: true,
  slidesPerView: '1.5',
  coverflowEffect: {
    rotate: 20,
    stretch: 0,
    depth: 200,
    modifier: 1,
    slideShadows: false,
  },
  loop: true,
  pagination: {
    el: '.swiper-pagination',
  },
})

new Swiper('.swiper-containerF', {
  grabCursor: true,
  centeredSlides: true,
  slidesPerView: '1',
  loop: true,
  pagination: {
    el: '.swiper-paginationF',
    type: 'bullets',
  },
})
