export default function menuMobile() {
  const bntMobile = document.querySelector('.btn-mobile .button');

  function toggleMenu() {
    const headerUl = document.querySelector('.header-menu');
    headerUl.classList.toggle('active');
    const linha1 = document.querySelector('.line1');
    const linha2 = document.querySelector('.line2');
    const linha3 = document.querySelector('.line3');
    if (headerUl.classList.contains('active')) {
      linha1.style.transform = 'rotate(-45deg) translate(-8px, 8px)';
      linha2.style.opacity = '0';
      linha3.style.transform = 'rotate(45deg) translate(-3px, -4px)';
    } else {
      linha1.style.transform = '';
      linha2.style.opacity = '1';
      linha3.style.transform = '';
    }
  }

  bntMobile.addEventListener('click', toggleMenu);
}
