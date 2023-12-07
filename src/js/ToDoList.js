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
}
