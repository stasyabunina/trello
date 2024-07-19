import { saveData } from "./saveData";
import { save } from "./localStorage";
import { columns, addColumnBtn } from "./var";
import addNoColumnsText from "./addNoColumnsText";
import { msnry } from "./masonry";
import openAddCardForm from "./addCard";
import addError from "./error";
import addNoCardsText from "./addNoCardsText";

const addColumn = () => {
  if (document.querySelector('.column__form')) {
    document.querySelector('.column__form').previousElementSibling.classList.remove('hidden');
    document.querySelector('.column__form').remove();
  }

  const li = document.createElement('li');
  li.className = 'manager__column column column--new';
  li.innerHTML = `
    <article class="column__wrapper">
              <form class="column__add-column-form">
                <label class="column__add-column-label">
                  <input class="column__add-column-input" type="text" placeholder="Название колонки...">
                </label>
                <button class="column__add-column-btn" aria-label="Добавить">
                  <span></span>
                </button>
                <button class="column__cancel-column-btn" type="button" aria-label="Отменить">+</button>
              </form>
            </article>
    `;

  columns.append(li);
  li.querySelector('.column__add-column-input').focus();
  window.scrollTo(0, document.body.scrollHeight);
  if (columns.children.length === 1) {
    document.querySelector('.no-columns-text').remove();
  }

  msnry.appended(li)
  msnry.layout();

  li.querySelector('.column__cancel-column-btn').addEventListener('click', () => {
    li.remove();
    if (columns.children.length === 0) {
      addNoColumnsText();
    }
    msnry.layout();
  })

  li.querySelector('.column__add-column-form').addEventListener('submit', (e) => {
    e.preventDefault();
    if (li.querySelector('.column__add-column-input').value.trim() === '') {
      addError(li.querySelector('.column__add-column-input'));
      return;
    }

    const dataColumn = saveData.columns.find(column => column.name === li.querySelector('.column__add-column-input').value.trim());
    if (dataColumn) {
      addError(li.querySelector('.column__add-column-input'), 'nameColumn');
      return;
    }

    li.classList.remove('column--new');
    const column = { name: li.querySelector('.column__add-column-input').value, cards: [] }
    saveData.columns.push(column);
    li.innerHTML = `
    <article class="column__wrapper">
      <div class="column__title-remove-wrapper">
      <h2 class="column__title">${li.querySelector('.column__add-column-input').value.trim()}</h2>
      <button type="button" class="column__remove-btn" title="Удалить колонку" aria-label="Удалить колонку">
        <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20.5001 6H3.5" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M18.8332 8.5L18.3732 15.3991C18.1962 18.054 18.1077 19.3815 17.2427 20.1907C16.3777 21 15.0473 21 12.3865 21H11.6132C8.95235 21 7.62195 21 6.75694 20.1907C5.89194 19.3815 5.80344 18.054 5.62644 15.3991L5.1665 8.5" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M6.5 6C6.55588 6 6.58382 6 6.60915 5.99936C7.43259 5.97849 8.15902 5.45491 8.43922 4.68032C8.44784 4.65649 8.45667 4.62999 8.47434 4.57697L8.57143 4.28571C8.65431 4.03708 8.69575 3.91276 8.75071 3.8072C8.97001 3.38607 9.37574 3.09364 9.84461 3.01877C9.96213 3 10.0932 3 10.3553 3H13.6447C13.9068 3 14.0379 3 14.1554 3.01877C14.6243 3.09364 15.03 3.38607 15.2493 3.8072C15.3043 3.91276 15.3457 4.03708 15.4286 4.28571L15.5257 4.57697C15.5433 4.62992 15.5522 4.65651 15.5608 4.68032C15.841 5.45491 16.5674 5.97849 17.3909 5.99936C17.4162 6 17.4441 6 17.5 6" stroke="#1C274C" stroke-width="1.5"/>
        </svg>
      </button>
      </div>
      <ul class="column__cards"></ul>
      <button class="column__btn" type="button"><span class="plus">+</span><span class="column__btn-text">Добавить карточку</span></button>
    </article>
    `;

    addNoCardsText(li.querySelector('.column__cards'));

    li.querySelector('.column__btn').addEventListener('click', () => {
      openAddCardForm(li);
    })

    li.querySelector('.column__remove-btn').addEventListener('click', () => {
      li.remove();
      saveData.columns.splice(saveData.columns.indexOf(column), 1);
      save();
      if (columns.children.length === 0) {
        addNoColumnsText();
      }
    })
    save();
    msnry.layout();
  })
}

addColumnBtn.addEventListener('click', () => {
  if (document.querySelector('.column--new')) {
    document.querySelector('.column--new').querySelector('.column__add-column-input').focus();
    return;
  }

  addColumn();
})
