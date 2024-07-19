import { saveData } from "./saveData";
import { save } from "./localStorage";
import { addTagBtn, tagMenu, tagMenuNameInput, tagMenuColorInput, tagForm, tagMenuList, tagRemoveBtns, tagFormCancel } from './var';
import addError from './error';
import addTag from './addTag';
import removeTag from "./removeTag";

addTagBtn.addEventListener('click', () => {
  if (addTagBtn.classList.contains('header__add-tag-btn--flipped')) {
    addTagBtn.classList.remove('header__add-tag-btn--flipped');
    tagMenu.classList.remove('header__tag-menu--shown');
  } else {
    addTagBtn.classList.add('header__add-tag-btn--flipped');
    const coords = addTagBtn.getBoundingClientRect();

    tagMenu.style.top = coords.top + addTagBtn.clientHeight + 10 + 'px';
    tagMenu.style.left = coords.left - tagMenu.clientWidth + document.querySelector('.header__right').clientWidth + 'px';
    tagMenu.classList.add('header__tag-menu--shown');

    setTimeout(() => {
      tagMenuNameInput.focus();
    }, 100)

    if (document.querySelector('.column__form')) {
      document.querySelector('.column__form').previousElementSibling.classList.remove('hidden');
      document.querySelector('.column__form').remove();
    }
  }
})

tagForm.addEventListener('submit', (e) => {
  const cardObj = { name: tagMenuNameInput.value.trim(), color: tagMenuColorInput.value };

  e.preventDefault();
  if (tagMenuNameInput.value.trim() === '') {
    addError(tagForm);
    return;
  }
  const dataTag = saveData.tags.find(tag => tag.name === tagMenuNameInput.value.trim());
  if (dataTag) {
    addError(tagForm, 'nameTag');
    return;
  }
  addTag(cardObj, tagMenuList);
  saveData.tags.push(cardObj);
  save();
  if (document.querySelector('.error')) {
    document.querySelector('.error').remove();
  }
  tagMenuNameInput.value = '';
  tagMenuNameInput.focus();
})

tagFormCancel.addEventListener('click', () => {
  addTagBtn.classList.remove('header__add-tag-btn--flipped');
  tagMenu.classList.remove('header__tag-menu--shown');
})

tagRemoveBtns.forEach((btn) => {
  removeTag(btn);
})


