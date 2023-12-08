export default class ToDoList {
  constructor(element) {
    this.element = element;
  }

  init() {
    const cards = this.element.querySelectorAll('.column__card');

    cards.forEach((card) => {
      this.onMouseOverEventListener(card);
      this.onMouseLeaveEventListener(card);
    })

    this.addCardEventListener();
    this.removeCardEventListener();
  }

  onMouseOverEventListener(card) {
    card.onmouseover = function () {
      if (document.querySelector('.close')) {
        document.querySelector('.close').remove();
      }

      const closeBtn = document.createElement('button');
      closeBtn.classList.add('close');
      closeBtn.innerHTML = '&#10006;';
      closeBtn.type = 'button';

      card.append(closeBtn);
    }
  }

  onMouseLeaveEventListener(card) {
    card.onmouseleave = function () {
      document.querySelector('.close').remove();
    };
  }

  removeCardEventListener() {
    if (document.querySelector('.close')) {
      document.querySelector('.close').addEventListener('click', () => {
        console.log('works?');
        document.querySelector('.close').closest('.column__card').remove()
      })
    }
  }

  addCardEventListener() {
    const addBtns = document.querySelectorAll('.column__btn');

    addBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        if (document.querySelector('.form')) {
          document.querySelector('.form').remove();
          addBtns.forEach((el) => {
            el.classList.remove('column__btn--hidden');
          })
        }

        this.createForm(btn);
        this.closeFormEventListener(addBtns);

        btn.classList.add('column__btn--hidden');
        document.querySelector('.form__input').focus();
      })
    })
  }

  createForm(id) {
    const form = document.createElement('form');
    const textarea = document.createElement('textarea');
    const addBtn = document.createElement('button');
    const closeForm = document.createElement('button');

    form.classList.add('form');
    textarea.classList.add('form__input');
    textarea.placeholder = 'Enter a title for this card...'
    addBtn.classList.add('form__add');
    addBtn.textContent = 'Add card';
    closeForm.classList.add('form__close');
    closeForm.innerHTML = '&#10006;';
    closeForm.type = 'button';

    id.closest('.column__wrapper').append(form);
    form.append(textarea);
    form.append(addBtn);
    form.append(closeForm);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.addCard(form, textarea);
      textarea.value = '';
      textarea.focus();
    })
  }

  closeFormEventListener(addBtns) {
    const removeFormBtn = document.querySelector('.form__close');

    removeFormBtn.addEventListener('click', () => {
      removeFormBtn.closest('form').remove();

      addBtns.forEach((el) => {
        el.classList.remove('column__btn--hidden');
      })
    })
  }

  addCard(form, input) {
    const card = document.createElement('li');
    const text = document.createElement('p');

    card.classList.add('column__card');
    text.classList.add('column__text');
    text.innerHTML = input.value;

    card.append(text);
    const formColumn = form.closest('.column__wrapper');
    formColumn.querySelector('.column__cards').append(card);
  }
}
