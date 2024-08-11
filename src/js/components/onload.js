import { saveData } from "./saveData";
import { save } from "./localStorage";
import { loader, columns, gradient, backgroundList, backgroundBtn, tagMenuList, tagMenu, addTagBtn } from "./var";
import addNoColumnsText from "./addNoColumnsText";
import { msnry } from "./masonry";
import openAddCardForm from "./addCard";
import addNoCardsText from "./addNoCardsText";
import showMenu from "./showMenu";
import addDragEventListeners from "./addDragEventListeners";
import addTag from "./addTag";

const renderColumns = () => {
  if (saveData.columns.length === 0) {
    addNoColumnsText();
  }

  for (const column of saveData.columns) {
    const li = document.createElement('li');
    li.className = 'manager__column column';
    li.innerHTML = `
    <article class="column__wrapper">
              <div class="column__title-remove-wrapper">
                <h2 class="column__title">${column.name}</h2>
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
    columns.append(li);

    msnry.appended(li);
    msnry.layout();

    li.querySelector('.column__remove-btn').addEventListener('click', () => {
      li.remove();
      saveData.columns.splice(saveData.columns.indexOf(column), 1);
      save();

      if (columns.children.length === 0) {
        addNoColumnsText();
      }

      msnry.layout();
    })

    li.querySelector('.column__btn').addEventListener('click', () => {
      openAddCardForm(li);
    })

    for (const card of column.cards) {
      const cardItem = document.createElement('li');
      cardItem.className = 'column__card';
      li.querySelector('.column__cards').append(cardItem);

      const linkifiedText = linkifyHtml(card.text, { target: "_blank" });

      if (card.hasOwnProperty('tags')) {
        cardItem.innerHTML = `
        <ul class="column__tags"></ul>
        <p class="column__text">${linkifiedText}</p>
        <button class="column__menu-btn" type="button" aria-label="Открыть меню">
          <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M2.25 6C2.25 5.58579 2.58579 5.25 3 5.25H21C21.4142 5.25 21.75 5.58579 21.75 6C21.75 6.41421 21.4142 6.75 21 6.75H3C2.58579 6.75 2.25 6.41421 2.25 6Z" fill="#000000"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M8.25 12C8.25 11.5858 8.58579 11.25 9 11.25L21 11.25C21.4142 11.25 21.75 11.5858 21.75 12C21.75 12.4142 21.4142 12.75 21 12.75L9 12.75C8.58579 12.75 8.25 12.4142 8.25 12Z" fill="#000000"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M2.25 18C2.25 17.5858 2.58579 17.25 3 17.25H21C21.4142 17.25 21.75 17.5858 21.75 18C21.75 18.4142 21.4142 18.75 21 18.75H3C2.58579 18.75 2.25 18.4142 2.25 18Z" fill="#000000"/>
          </svg>
        </button>
        `

        for (const tag of card.tags) {
          const tagItem = document.createElement('li');
          tagItem.className = 'column__tag';
          tagItem.innerHTML = `
          <div class="column__tag-content hidden">
            <span class="column__tag-name">${tag}</span>
            <button class="column__tag-btn" type="button" aria-label="Удалить метку">+</button>
          </div>
          `
          const dataTag = saveData.tags.find(dataTag => dataTag.name === tag);
          tagItem.style.backgroundColor = dataTag.color;
          cardItem.querySelector('.column__tags').append(tagItem);

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
            card.tags.splice(card.tags.indexOf(tag), 1);
            if (card.tags.length === 0) {
              delete card.tags;
            }
            save();
          })
        }
      } else {
        cardItem.innerHTML = `
        <p class="column__text">${linkifiedText}</p>
        <button class="column__menu-btn" type="button" aria-label="Открыть меню">
          <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M2.25 6C2.25 5.58579 2.58579 5.25 3 5.25H21C21.4142 5.25 21.75 5.58579 21.75 6C21.75 6.41421 21.4142 6.75 21 6.75H3C2.58579 6.75 2.25 6.41421 2.25 6Z" fill="#000000"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M8.25 12C8.25 11.5858 8.58579 11.25 9 11.25L21 11.25C21.4142 11.25 21.75 11.5858 21.75 12C21.75 12.4142 21.4142 12.75 21 12.75L9 12.75C8.58579 12.75 8.25 12.4142 8.25 12Z" fill="#000000"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M2.25 18C2.25 17.5858 2.58579 17.25 3 17.25H21C21.4142 17.25 21.75 17.5858 21.75 18C21.75 18.4142 21.4142 18.75 21 18.75H3C2.58579 18.75 2.25 18.4142 2.25 18Z" fill="#000000"/>
          </svg>
        </button>
        `
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
  }
}

window.addEventListener('load', () => {
  loader.remove();

  if (saveData.backgroundColor !== 'gradient') {
    gradient.classList.add('hidden');
    document.body.style.backgroundColor = saveData.backgroundColor;
  } else {
    gradient.classList.remove('hidden');
    document.body.style.backgroundColor = 'white';
  }

  renderColumns();

  columns.querySelectorAll('.column').forEach((column) => {
    if (column.querySelector('.column__cards').children.length === 0) {
      addNoCardsText(column.querySelector('.column__cards'));
    }
  })
  msnry.layout();
  addDragEventListeners();

  for (const tag of saveData.tags) {
    addTag(tag, tagMenuList);
  }
})

document.addEventListener('click', (e) => {
  let target = e.target;
  if (backgroundList.classList.contains('header__background-list--shown') || document.querySelector('.column__menu') || tagMenu.classList.contains('header__tag-menu--shown')) {
    if (backgroundList.classList.contains('header__background-list--shown')) {
      if (!target.closest('.header__change-background-btn') && !target.closest('.header__background-list')) {
        backgroundList.classList.remove('header__background-list--shown');
        backgroundBtn.querySelector('.header__arrow-svg').classList.remove('header__arrow-svg--flipped');
      }
    } else if (tagMenu.classList.contains('header__tag-menu--shown')) {
      if (!target.closest('.header__add-tag-btn') && !target.closest('.header__tag-menu')) {
        addTagBtn.classList.remove('header__add-tag-btn--flipped');
        tagMenu.classList.remove('header__tag-menu--shown');
      }
    } else {
      if (!target.closest('.column__menu-btn')) {
        document.querySelector('.column__menu').classList.remove('column__menu--shown');
        document.querySelector('.column__menu').classList.add("column__menu--hidden");
        document.querySelector('.column__menu').addEventListener('animationend', () => {
          document.querySelector('.column__menu').remove();
        })
      }
    }
  }
})

