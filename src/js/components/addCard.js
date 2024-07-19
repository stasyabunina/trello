import { saveData } from "./saveData";
import { save } from "./localStorage";
import { msnry } from "./masonry";
import addError from "./error";
import { columns, backgroundList, backgroundBtn, addTagBtn, tagMenu } from "./var";
import addNoColumnsText from "./addNoColumnsText";
import showMenu from "./showMenu";

const openAddCardForm = (element) => {
  if (document.querySelector('.column__form')) {
    document.querySelector('.column__form').previousElementSibling.classList.remove('hidden');
    document.querySelector('.column__form').remove();
  }

  if (tagMenu.classList.contains('header__tag-menu--shown')) {
    addTagBtn.classList.remove('header__add-tag-btn--flipped');
    tagMenu.classList.remove('header__tag-menu--shown');
  }

  if (document.querySelector('.column--new')) {
    document.querySelector('.column--new').remove();
    if (columns.children.length === 0) {
      addNoColumnsText();
    }
    msnry.layout();
  }

  const form = document.createElement('form');
  form.classList.add('column__form');
  form.innerHTML = `
      <textarea class="column__form-input" placeholder="Напиши что-нибудь..."></textarea>
      <ul class="column__form-tags"></ul>
      <div class="column__add-card-btns">
        <button class="column__add-card-btn">Добавить</button>
        <button class="column__cancel-card-btn" aria-label="Отменить" type="button">+</button>
      </div>
      `
  element.querySelector('.column__wrapper').append(form);
  element.querySelector('.column__btn').classList.add('hidden');
  for (const tag of saveData.tags) {
    const tagItem = document.createElement('li');
    tagItem.className = 'column__form-tag';
    tagItem.innerHTML = `
    <label class="column__form-tag-content">
      <input type="checkbox" class="column__tag-checkbox visually-hidden">
      <span class="column__form-tag-name">${tag.name}</span>
    </label>
    `
    form.querySelector('.column__form-tags').append(tagItem);
    tagItem.querySelector('.column__form-tag-content').addEventListener('click', () => {
      if (tagItem.querySelector('.column__form-tag-content').firstElementChild.checked === false) {
        tagItem.querySelector('.column__form-tag-content').firstElementChild.checked = true;
        tagItem.querySelector('.column__form-tag-content').closest('.column__form-tag').style.backgroundColor = tag.color;
      } else {
        tagItem.querySelector('.column__form-tag-content').firstElementChild.checked = false;
        tagItem.querySelector('.column__form-tag-content').closest('.column__form-tag').style.backgroundColor = 'lightgray';
      }
    })
  }
  msnry.layout();
  form.querySelector('.column__form-input').focus();
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (form.querySelector('.column__form-input').value.trim() === '') {
      addError(form.querySelector('.column__form-input'));
      return;
    }
    addCard(element, form);
    if (element.querySelector('.no-cards-text') && element.querySelector('.column__cards').children.length === 1) {
      element.querySelector('.no-cards-text').remove();
      msnry.layout();
    }
  })

  element.querySelector('.column__cancel-card-btn').addEventListener('click', () => {
    form.remove();
    element.querySelector('.column__btn').classList.remove('hidden');
    msnry.layout();
  })
}

const addCard = (element, form) => {
  const cardItem = document.createElement('li');
  cardItem.className = 'column__card';
  const linkifiedText = linkifyHtml(form.querySelector('.column__form-input').value.trim(), { target: "_blank" });
  cardItem.innerHTML = `
  <ul class="column__tags"></ul>
  <p class="column__text">${linkifiedText.trim()}</p>
  <button class="column__menu-btn" type="button" aria-label="Открыть меню">
          <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M2.25 6C2.25 5.58579 2.58579 5.25 3 5.25H21C21.4142 5.25 21.75 5.58579 21.75 6C21.75 6.41421 21.4142 6.75 21 6.75H3C2.58579 6.75 2.25 6.41421 2.25 6Z" fill="#000000"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M8.25 12C8.25 11.5858 8.58579 11.25 9 11.25L21 11.25C21.4142 11.25 21.75 11.5858 21.75 12C21.75 12.4142 21.4142 12.75 21 12.75L9 12.75C8.58579 12.75 8.25 12.4142 8.25 12Z" fill="#000000"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M2.25 18C2.25 17.5858 2.58579 17.25 3 17.25H21C21.4142 17.25 21.75 17.5858 21.75 18C21.75 18.4142 21.4142 18.75 21 18.75H3C2.58579 18.75 2.25 18.4142 2.25 18Z" fill="#000000"/>
          </svg>
        </button>
   `

  element.querySelector('.column__cards').append(cardItem);
  element.querySelector('.column__form').remove();
  element.querySelector('.column__btn').classList.remove('hidden');

  const dataColumn = saveData.columns.find(column => column.name === cardItem.closest('.column').querySelector('.column__title').textContent);
  const dataColumnIndex = saveData.columns.indexOf(dataColumn);
  let tags = [];

  const cardObj = { text: form.querySelector('.column__form-input').value };
  saveData.columns[dataColumnIndex].cards.push(cardObj);
  save();
  msnry.layout();

  const dataCardIndex = saveData.columns[dataColumnIndex].cards.indexOf(cardObj);
  const dataCard = saveData.columns[dataColumnIndex].cards[dataCardIndex];

  for (const checkbox of form.querySelectorAll('.column__tag-checkbox')) {
    if (checkbox.checked) {
      const tagItem = document.createElement('li');
      tagItem.className = 'column__tag';
      tagItem.innerHTML = `
          <div class="column__tag-content hidden">
            <span class="column__tag-name">${checkbox.nextElementSibling.textContent}</span>
            <button class="column__tag-btn" type="button" aria-label="Удалить метку">+</button>
          </div>
          `
      tagItem.style.backgroundColor = checkbox.closest('.column__form-tag').style.backgroundColor;
      cardItem.querySelector('.column__tags').append(tagItem);

      const tag = checkbox.nextElementSibling.textContent;
      tags.push(tag);
      dataCard.tags = tags;

      save();
      msnry.layout();

      tagItem.addEventListener('mouseenter', () => {
        tagItem.classList.add('column__tag--opened');
        tagItem.querySelector('.column__tag-content').classList.remove('hidden');
        msnry.layout();
      })

      tagItem.addEventListener('mouseleave', () => {
        tagItem.classList.remove('column__tag--opened');
        tagItem.querySelector('.column__tag-content').classList.add('hidden');
        msnry.layout();
      })

      tagItem.querySelector('.column__tag-btn').addEventListener('click', () => {
        tagItem.remove();
        if (cardItem.querySelector(".column__tags").children.length === 0) {
          cardItem.querySelector(".column__tags").remove();
        }

        saveData.columns[dataColumnIndex].cards[dataCardIndex].tags.splice(saveData.columns[dataColumnIndex].cards[dataCardIndex].tags.indexOf(tagItem.querySelector('.column__tag-name').textContent), 1);
        if (saveData.columns[dataColumnIndex].cards[dataCardIndex].tags.length === 0) {
          delete saveData.columns[dataColumnIndex].cards[dataCardIndex].tags;
        }

        save();
        msnry.layout();
      })
    }
  }

  cardItem.querySelector('.column__menu-btn').addEventListener('click', () => {
    if (document.querySelector('.column__menu')) {
      if (document.querySelector(".column__menu").previousElementSibling !== cardItem.querySelector('.column__menu-btn')) {
        document.querySelector('.column__menu').classList.remove('column__menu--shown');
        document.querySelector('.column__menu').classList.add("column__menu--hidden");
        document.querySelector('.column__menu').addEventListener('animationend', () => {
          document.querySelector('.column__menu').remove();
          showMenu(cardItem);
        })
      } else if (document.querySelector(".column__menu").previousElementSibling === cardItem.querySelector('.column__menu-btn')) {
        document.querySelector('.column__menu').classList.remove('column__menu--shown');
        document.querySelector('.column__menu').classList.add("column__menu--hidden");
        document.querySelector('.column__menu').addEventListener('animationend', () => {
          document.querySelector('.column__menu').remove();
        })
      }
    } else {
      showMenu(cardItem);
      if (backgroundList.classList.contains('header__background-list--shown')) {
        backgroundBtn.querySelector('.header__arrow-svg').classList.remove('header__arrow-svg--flipped');
        backgroundList.classList.remove('header__background-list--shown');
      }
    }
  })
}

export default openAddCardForm;
