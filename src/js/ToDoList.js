export default class ToDoList {
  constructor(element, storage) {
    this.element = element;
    this.listStorage = storage;
  }

  init() {
    this.load();
    this.checkCardsLength();

    const cards = document.querySelectorAll('.column__card');
    cards.forEach((card) => {
      this.onMouseEnterEventListener(card);
      this.onMouseLeaveEventListener(card);
    })


    this.addCardEventListener();
    this.removeAllCardsEventListener();
    this.dragEventListener();
  }

  onMouseEnterEventListener(card) {
    card.onmouseenter = () => {
      if (document.querySelector('.close')) {
        document.querySelector('.close').remove();
      }

      const closeBtn = document.createElement('button');
      closeBtn.classList.add('close');
      closeBtn.innerHTML = '&#10006;';
      closeBtn.type = 'button';

      card.append(closeBtn);

      closeBtn.addEventListener('click', () => {
        closeBtn.closest('.column__card').remove();
        this.save();
        this.checkCardsLength();
      })
    }
  }

  onMouseLeaveEventListener(card) {
    card.onmouseleave = (e) => {
      const relatedTarget = e.relatedTarget;
      if (relatedTarget !== null && relatedTarget.classList[0] !== 'close') {
        document.querySelector('.close').remove();
      } else {
        return;
      }
    }
  }

  dragEventListener() {
    const cardsLists = document.querySelectorAll('.column__cards');

    let actualElement;

    const onMouseOver = (e) => {
      const mouseOverItem = e.target;

      if (mouseOverItem.classList.contains('column__card')) {
        mouseOverItem.style.marginBottom = actualElement.offsetHeight + 'px';
      }

      actualElement.style.left = `${event.pageX - this.coordX}px`;
      actualElement.style.top = `${event.pageY - this.coordY}px`;
    }

    const onMouseOut = (e) => {
      const mouseOutItem = e.target;

      if (mouseOutItem.classList.contains('column__card')) {
        mouseOutItem.style.removeProperty('margin-bottom');
      }
    }

    const onMouseUp = (e) => {
      if (e.button !== 2 && e.target.classList.contains('close') !== true) {
        const mouseUpItem = e.target;

        if (mouseUpItem.classList.contains('column__card')) {
          mouseUpItem.before(actualElement);
        } else if (mouseUpItem.classList.contains('no-cards-text')) {
          mouseUpItem.nextElementSibling.append(actualElement);

          mouseUpItem.remove();
        } else {
          const actualElementParent = actualElement.closest('.column');

          if (actualElementParent.querySelectorAll('.column__card').length - 1 === 0) {
            actualElementParent.querySelector('.no-cards-text').remove();
          }
        }

        document.querySelector('.main').removeAttribute('style');
        actualElement.classList.remove('column__card--dragged');
        actualElement.style.removeProperty('width');
        actualElement.style.removeProperty('top');
        actualElement.style.removeProperty('left');

        actualElement = undefined;

        this.save();

        document.documentElement.removeEventListener('mouseup', onMouseUp);
        document.documentElement.removeEventListener('mouseover', onMouseOver);
        document.documentElement.addEventListener('mouseout', onMouseOut);
      }
    }

    cardsLists.forEach((cardsList) => {
      cardsList.addEventListener('mousedown', (e) => {
        if (e.button !== 2 && e.target.classList.contains('close') !== true) {
          e.preventDefault();
          actualElement = e.target;

          document.querySelector('.main').style.cursor = 'grabbing';
          const cardWidth = actualElement.offsetWidth;

          actualElement.classList.add('column__card--dragged');

          const { left, top } = actualElement.getBoundingClientRect();
          actualElement.style.width = cardWidth + 'px';
          actualElement.style.top = top + 'px';
          actualElement.style.left = left + 'px';

          this.coordX = event.pageX - left;
          this.coordY = event.pageY - top;

          if (actualElement.closest('.column__cards').querySelectorAll('.column__card').length - 1 === 0) {
            const actualElementParent = actualElement.closest('.column');

            if (actualElementParent.querySelector('.no-cards-text')) {
              actualElementParent.querySelector('.no-cards-text').remove();
            }

            const text = document.createElement('span');
            text.classList.add('no-cards-text');
            text.textContent = `You have no cards in your "${actualElementParent.querySelector('.column__title').textContent}" list. You can create one by clicking the "Add another card" button below.`;

            actualElementParent.querySelector('.column__title').after(text);
          }

          document.documentElement.addEventListener('mouseup', onMouseUp);
          document.documentElement.addEventListener('mouseover', onMouseOver);
          document.documentElement.addEventListener('mouseout', onMouseOut);
        }
      })
    })
  }

  removeAllCardsEventListener() {
    const clearBtn = document.querySelector('.top__clear');

    clearBtn.addEventListener('click', () => {
      this.clearAllCards();
      const data = {
        toDo: [],
        inProgress: [],
        done: [],
      };

      this.listStorage.save(data);
      this.checkCardsLength();

      if (document.querySelector('.form')) {
        document.querySelector('.form').remove();

        const addBtns = document.querySelectorAll('.column__btn');

        addBtns.forEach((el) => {
          el.classList.remove('column__btn--hidden');
        })
      }
    })
  }

  checkCardsLength() {
    const columns = document.querySelectorAll('.column');

    columns.forEach((column) => {
      if (column.querySelectorAll('.column__card').length === 0) {
        if (column.querySelector('.no-cards-text')) {
          column.querySelector('.no-cards-text').remove();
        }

        const text = document.createElement('span');
        text.classList.add('no-cards-text');
        text.textContent = `You have no cards in your "${column.querySelector('.column__title').textContent}" list. You can create one by clicking the "Add another card" button below.`;

        column.querySelector('.column__title').after(text);
      }
    })
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

        if (document.querySelector('.error')) {
          document.querySelector('.error').remove();
          document.querySelector('.form').removeAttribute('style');
        }
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
      this.save();
      textarea.focus();

      if (form.closest('.column').querySelector('.no-cards-text')) {
        form.closest('.column').querySelector('.no-cards-text').remove();
      }
    })
  }

  closeFormEventListener(addBtns) {
    const removeFormBtn = document.querySelector('.form__close');

    removeFormBtn.addEventListener('click', () => {
      if (document.querySelector('.error')) {
        document.querySelector('.error').remove();
        document.querySelector('.form').removeAttribute('style');
      }

      removeFormBtn.closest('form').remove();

      addBtns.forEach((el) => {
        el.classList.remove('column__btn--hidden');
      })
    })
  }

  addCard(form, input) {
    if (input.value.length > 200) {
      if (document.querySelector('.error')) {
        document.querySelector('.error').remove();
      }

      const charactersError = document.createElement('span');
      charactersError.classList.add('error');
      charactersError.classList.add('characters-error');
      charactersError.textContent = `The card cannot be more than 200 characters long.`;
      const formColumn = form.closest('.column__wrapper');
      formColumn.append(charactersError);
      form.style.marginBottom = '8px';
    } else if (input.value.trim() === '') {
      if (document.querySelector('.error')) {
        document.querySelector('.error').remove();
      }

      const error = document.createElement('span');
      error.classList.add('error');
      error.textContent = `The card cannot be empty.`;
      const formColumn = form.closest('.column__wrapper');
      formColumn.append(error);
      form.style.marginBottom = '8px';
    } else {
      if (input.value.trim() != '') {
        const card = document.createElement('li');
        const text = document.createElement('p');

        card.classList.add('column__card');
        text.classList.add('column__text');
        text.innerHTML = input.value;

        card.append(text);
        const formColumn = form.closest('.column__wrapper');
        formColumn.querySelector('.column__cards').append(card);

        this.onMouseEnterEventListener(card);
        this.onMouseLeaveEventListener(card);

        if (document.querySelector('.error')) {
          document.querySelector('.error').remove();
          document.querySelector('.form').removeAttribute('style');
        }

        input.value = '';
      }
    }
  }

  save() {
    const toDoCards = Array.from(document.querySelector('.column_to-do').querySelectorAll('.column__card'));
    const inProgressCards = Array.from(document.querySelector('.column_in-progress').querySelectorAll('.column__card'));
    const doneCards = Array.from(document.querySelector('.column_done').querySelectorAll('.column__card'));

    const data = {
      toDo: [],
      inProgress: [],
      done: [],
    };

    toDoCards.forEach((card) => {
      data.toDo.push(card.querySelector('.column__text').textContent);
    });

    inProgressCards.forEach((card) => {
      data.inProgress.push(card.querySelector('.column__text').textContent);
    });

    doneCards.forEach((card) => {
      data.done.push(card.querySelector('.column__text').textContent);
    });

    this.listStorage.save(data);
  }

  load() {
    const loadList = this.listStorage.load();
    const topText = document.querySelector('.top__text');

    if (loadList) {
      this.clearAllCards();

      for (const data of loadList.toDo) {
        const card = document.createElement('li');
        const text = document.createElement('p');

        card.classList.add('column__card');
        text.classList.add('column__text');
        text.textContent = data;

        card.append(text);
        document.querySelector('.column_to-do').querySelector('.column__cards').append(card);
      }

      for (const data of loadList.inProgress) {
        const card = document.createElement('li');
        const text = document.createElement('p');

        card.classList.add('column__card');
        text.classList.add('column__text');
        text.textContent = data;

        card.append(text);
        document.querySelector('.column_in-progress').querySelector('.column__cards').append(card);
      }

      for (const data of loadList.done) {
        const card = document.createElement('li');
        const text = document.createElement('p');

        card.classList.add('column__card');
        text.classList.add('column__text');
        text.textContent = data;

        card.append(text);
        document.querySelector('.column_done').querySelector('.column__cards').append(card);
      }

      topText.textContent = 'Welcome back!';
    } else {
      topText.textContent = 'Welcome!';
    }
  }

  clearAllCards() {
    const cards = document.querySelectorAll('.column__card');

    cards.forEach((card) => {
      card.remove();
    });
  }
}
