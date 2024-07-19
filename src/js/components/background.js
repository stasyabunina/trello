import { save } from "./localStorage";
import { saveData } from "./saveData";
import { backgroundBtn, backgroundList, colorBtn, gradientBtn, gradient, tagMenu, addTagBtn } from "./var";

backgroundBtn.addEventListener('click', () => {
  if (backgroundBtn.querySelector('.header__arrow-svg').classList.contains('header__arrow-svg--flipped')) {
    backgroundBtn.querySelector('.header__arrow-svg').classList.remove('header__arrow-svg--flipped');
    backgroundList.classList.remove('header__background-list--shown');
  } else {
    backgroundBtn.querySelector('.header__arrow-svg').classList.add('header__arrow-svg--flipped');
    const coords = backgroundBtn.getBoundingClientRect();

    backgroundList.style.top = coords.top + backgroundBtn.clientHeight + 10 + 'px';
    backgroundList.style.left = coords.left + 'px';
    backgroundList.classList.add('header__background-list--shown');

    if (document.querySelector('.column__menu')) {
      document.querySelector('.column__menu').classList.remove('column__menu--shown');
      document.querySelector('.column__menu').classList.add("column__menu--hidden");
      document.querySelector('.column__menu').addEventListener('animationend', () => {
        document.querySelector('.column__menu').remove();
      })
    }

    if (tagMenu.classList.contains('header__tag-menu--shown')) {
      addTagBtn.classList.remove('header__add-tag-btn--flipped');
      tagMenu.classList.remove('header__tag-menu--shown');
    }

    setTimeout(() => {
      backgroundList.querySelector('.header__background-color').focus();
    }, 100)
  }
})

gradientBtn.addEventListener('click', () => {
  gradient.classList.remove('hidden');
  document.body.style.backgroundColor = 'white';
  backgroundList.classList.remove('header__background-list--shown');
  backgroundBtn.querySelector('.header__arrow-svg').classList.remove('header__arrow-svg--flipped');
  saveData.backgroundColor = 'gradient';
  save();
})

colorBtn.addEventListener('input', () => {
  gradient.classList.add('hidden');
  document.body.style.backgroundColor = colorBtn.value;
  saveData.backgroundColor = colorBtn.value;
  save();
})
