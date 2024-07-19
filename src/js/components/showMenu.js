import { saveData } from "./saveData";
import { save } from "./localStorage";
import { msnry } from "./masonry";
import addNoCardsText from "./addNoCardsText";
import addError from "./error";

const showMenu = (card) => {
  const list = document.createElement('ul');
  list.classList.add('column__menu');
  list.innerHTML = `
    <li class="column__menu-item">
      <button type="button" class="column__menu-edit-btn column__menu-item-btn">Редактировать...</button>
    </li>
    <li class="column__menu-item">
      <button type="button" class="column__menu-delete-btn column__menu-item-btn">Удалить</button>
    </li>
    `
  card.append(list);

  list.style.top = card.clientHeight + 'px';
  list.classList.add('column__menu--shown');

  list.querySelector('.column__menu-delete-btn').addEventListener('click', () => {
    const dataColumn = saveData.columns.find(column => column.name === card.closest('.column').querySelector('.column__title').textContent);
    const dataColumnIndex = saveData.columns.indexOf(dataColumn);
    const cardObj = saveData.columns[dataColumnIndex].cards.find(card => card.text === list.closest('.column__card').querySelector('.column__text').textContent);
    saveData.columns[dataColumnIndex].cards.splice(saveData.columns[dataColumnIndex].cards.indexOf(cardObj), 1);
    save();
    if (list.closest('.column__cards').children.length === 1) {
      addNoCardsText(list.closest('.column__cards'));
    }
    list.closest('.column__card').remove();
    msnry.layout();
  })

  list.querySelector('.column__menu-edit-btn').addEventListener('click', () => {
    if (document.querySelector('.column__form')) {
      document.querySelector('.column__form').remove();
      card.closest('.column').querySelector('.column__btn').classList.remove('hidden');
      msnry.layout();
    }

    const text = list.closest('.column__card').querySelector('.column__text').textContent;

    const form = document.createElement('form');
    form.classList.add('column__edit-card-form');
    form.innerHTML = `
    <label class="column__edit-card-label">
                  <textarea class="column__edit-card-input" placeholder="Напиши что-нибудь..."></textarea>
                </label>
                <div class="column__edit-card-btns">
                  <button class="column__edit-card-btn">Сохранить изменения</button>
                  <button class="column__edit-card-cancel" type="button" aria-label="Закрыть меню">+</button>
                </div>
    `;

    form.querySelector('.column__edit-card-input').value = text;
    form.querySelector('.column__edit-card-input').focus();

    list.closest('.column__card').querySelector('.column__text').before(form);
    list.closest('.column__card').querySelector('.column__text').classList.add('hidden');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (form.querySelector('.column__edit-card-input').value.trim() === '') {
        addError(form.querySelector('.column__edit-card-input'));
        return;
      }

      const dataColumn = saveData.columns.find(column => column.name === card.closest('.column').querySelector('.column__title').textContent);
      const dataColumnIndex = saveData.columns.indexOf(dataColumn);
      const cardObj = saveData.columns[dataColumnIndex].cards.find(card => card.text === form.nextElementSibling.textContent);
      const dataCardIndex = saveData.columns[dataColumnIndex].cards.indexOf(cardObj);
      saveData.columns[dataColumnIndex].cards[dataCardIndex].text = form.querySelector('.column__edit-card-input').value.trim();
      save();

      form.nextElementSibling.classList.remove('hidden');
      form.nextElementSibling.textContent = linkifyHtml(form.querySelector('.column__edit-card-input').value.trim(), { target: "_blank" });
      form.remove();
      msnry.layout();
    })

    form.querySelector('.column__edit-card-cancel').addEventListener('click', () => {
      form.nextElementSibling.classList.remove('hidden');
      form.remove();
      msnry.layout();
    })

    msnry.layout();
  })
}

export default showMenu;
