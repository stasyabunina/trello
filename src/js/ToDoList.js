export default class ToDoList {
  constructor(element, storage) {
    this.element = element;
    this.listStorage = storage;
  }

  init() {
    this.load();
    this.checkCardsLength();

    const cards = this.element.querySelectorAll(".column__card");
    cards.forEach((card) => {
      this.onMouseEnterEventListener(card);
      this.onMouseLeaveEventListener(card);
    });

    this.addCardEventListener();
    this.removeAllCardsEventListener();
    this.dragEventListener();
  }

  onMouseEnterEventListener(card) {
    card.addEventListener("mouseenter", () => {
      if (this.element.querySelector(".close")) {
        this.element.querySelector(".close").remove();
      }

      const closeBtn = document.createElement("button");
      closeBtn.classList.add("close");
      closeBtn.innerHTML = "&#10006;";
      closeBtn.type = "button";

      card.append(closeBtn);

      this.removeCardEventListener(closeBtn);
    });
  }

  removeCardEventListener(btn) {
    btn.addEventListener("click", () => {
      btn.closest(".column__card").remove();
      this.save();
      this.checkCardsLength();
    });
  }

  onMouseLeaveEventListener(card) {
    card.addEventListener("mouseleave", (e) => {
      const relatedTarget = e.relatedTarget;
      if (relatedTarget !== null && relatedTarget.classList[0] !== "close") {
        this.element.querySelector(".close").remove();
      } else {
        return;
      }
    });
  }

  dragEventListener() {
    this.element.addEventListener("mousedown", (e) => {
      e.preventDefault();
      this.mouseDown(e);
    });

    this.element.addEventListener("mousemove", (e) => {
      e.preventDefault();
      this.mouseMove(e);
    });

    this.element.addEventListener("mouseup", (e) => {
      e.preventDefault();
      this.mouseUp(e);
    });
  }

  mouseDown(e) {
    if (e.button === 2 || e.target.classList.contains("close") === true) {
      return;
    }

    this.draggedCard = e.target.closest(".column__card");
    if (!this.draggedCard) {
      return;
    }

    this.ghostCard = this.draggedCard.cloneNode(true);
    this.ghostCard.classList.add("column__card--dragged");
    this.draggedCard.classList.add("transparent");

    const { width, height, left, top } =
      this.draggedCard.getBoundingClientRect();
    this.ghostCard.style.width = width + "px";
    this.ghostCard.style.height = height + "px";
    this.ghostCard.style.top = top + "px";
    this.ghostCard.style.left = left + "px";

    document.body.appendChild(this.ghostCard);

    this.element.style.cursor = "grabbing";

    this.ghostCardX = e.pageX - left;
    this.ghostCardY = e.pageY - top;

    if (
      this.draggedCard
        .closest(".column__cards")
        .querySelectorAll(".column__card").length -
        1 ===
      0
    ) {
      this.checkCardsLength();

      this.createNoCardText(this.draggedCard.closest(".column"));

      this.draggedCard.classList.add("column__card--hidden");
    }
  }

  mouseMove(e) {
    if (!this.ghostCard) {
      return;
    }

    this.ghostCard.style.left = e.pageX - this.ghostCardX + "px";
    this.ghostCard.style.top = e.pageY - this.ghostCardY + "px";

    const target = document.elementFromPoint(e.clientX, e.clientY);
    const column = document
      .elementFromPoint(e.clientX, e.clientY)
      .closest(".column");
    const { height, top } = this.draggedCard.getBoundingClientRect();
    const closestCard = document
      .elementFromPoint(e.clientX, e.clientY)
      .closest(".column__card");

    if (!closestCard && target.classList.contains("no-cards-text")) {
      column
        .querySelector(".no-cards-text")
        .nextElementSibling.append(this.draggedCard);
      this.draggedCard.classList.add("column__card--hidden");
    } else if (closestCard) {
      if (e.pageY < top - height / 2) {
        closestCard.before(this.draggedCard);
      } else {
        closestCard.after(this.draggedCard);
      }

      this.draggedCard.classList.remove("column__card--hidden");
    }
  }

  mouseUp(e) {
    if (e.button === 2 || !this.draggedCard) {
      return;
    }

    this.element.removeAttribute("style");

    if (
      this.draggedCard
        .closest(".column__cards")
        .querySelectorAll(".column__card").length -
        1 ===
      0
    ) {
      this.checkCardsLength();

      this.draggedCard.classList.remove("column__card--hidden");
    }

    this.ghostCard.classList.remove("column__card--dragged");
    this.draggedCard.classList.remove("transparent");
    this.ghostCard.remove();

    this.ghostCard = undefined;
    this.draggedCard = undefined;
    this.save();
  }

  addCardEventListener() {
    const addBtns = this.element.querySelectorAll(".column__btn");

    addBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (this.element.querySelector(".form")) {
          this.element.querySelector(".form").remove();
          addBtns.forEach((el) => {
            el.classList.remove("column__btn--hidden");
          });
        }

        this.createForm(btn);
        this.closeFormEventListener(addBtns);

        btn.classList.add("column__btn--hidden");
        this.element.querySelector(".form__input").focus();

        if (this.element.querySelector(".error")) {
          this.element.querySelector(".error").remove();
          this.element.querySelector(".form").classList.remove("form--error");
        }
      });
    });
  }

  createForm(id) {
    const form = document.createElement("form");
    const textarea = document.createElement("textarea");
    const addBtn = document.createElement("button");
    const closeForm = document.createElement("button");

    form.classList.add("form");
    textarea.classList.add("form__input");
    textarea.placeholder = "Enter a title for this card...";
    addBtn.classList.add("form__add");
    addBtn.textContent = "Add card";
    closeForm.classList.add("form__close");
    closeForm.innerHTML = "&#10006;";
    closeForm.type = "button";

    id.closest(".column__wrapper").append(form);
    form.append(textarea);
    form.append(addBtn);
    form.append(closeForm);

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.addCard(form, textarea);
      this.save();
      textarea.focus();

      this.checkCardsLength();
    });
  }

  closeFormEventListener(addBtns) {
    const removeFormBtn = this.element.querySelector(".form__close");

    removeFormBtn.addEventListener("click", () => {
      if (this.element.querySelector(".error")) {
        this.element.querySelector(".error").remove();
        this.element.querySelector(".form").classList.remove("form--error");
      }

      removeFormBtn.closest("form").remove();

      addBtns.forEach((el) => {
        el.classList.remove("column__btn--hidden");
      });
    });
  }

  addCard(form, input) {
    if (input.value.length > 200) {
      if (this.element.querySelector(".error")) {
        this.element.querySelector(".error").remove();
      }

      const charactersError = document.createElement("span");
      charactersError.classList.add("error");
      charactersError.textContent = `The card cannot be more than 200 characters long.`;
      const formColumn = form.closest(".column__wrapper");
      formColumn.append(charactersError);
      form.classList.add("form--error");
    } else if (input.value.trim() === "") {
      if (this.element.querySelector(".error")) {
        this.element.querySelector(".error").remove();
      }

      const error = document.createElement("span");
      error.classList.add("error");
      error.textContent = `The card cannot be empty.`;
      const formColumn = form.closest(".column__wrapper");
      formColumn.append(error);
      form.classList.add("form--error");
    } else {
      if (input.value.trim() != "") {
        const card = document.createElement("li");
        const text = document.createElement("p");

        card.classList.add("column__card");
        text.classList.add("column__text");
        text.innerHTML = input.value;

        card.append(text);
        const formColumn = form.closest(".column__wrapper");
        formColumn.querySelector(".column__cards").append(card);

        this.onMouseEnterEventListener(card);
        this.onMouseLeaveEventListener(card);

        if (this.element.querySelector(".error")) {
          this.element.querySelector(".error").remove();
          this.element.querySelector(".form").classList.remove("form--error");
        }

        input.value = "";
      }
    }
  }

  removeAllCardsEventListener() {
    const clearBtn = document.querySelector(".top__clear");

    clearBtn.addEventListener("click", () => {
      this.clearAllCards();
      const data = {
        toDo: [],
        inProgress: [],
        done: [],
      };

      this.listStorage.save(data);
      this.checkCardsLength();

      if (this.element.querySelector(".form")) {
        this.element.querySelector(".form").remove();

        const addBtns = this.element.querySelectorAll(".column__btn");

        addBtns.forEach((el) => {
          el.classList.remove("column__btn--hidden");
        });
      }
    });
  }

  clearAllCards() {
    const cards = this.element.querySelectorAll(".column__card");

    cards.forEach((card) => {
      card.remove();
    });
  }

  save() {
    const toDoCards = Array.from(
      this.element
        .querySelector(".column_to-do")
        .querySelectorAll(".column__card"),
    );
    const inProgressCards = Array.from(
      this.element
        .querySelector(".column_in-progress")
        .querySelectorAll(".column__card"),
    );
    const doneCards = Array.from(
      this.element
        .querySelector(".column_done")
        .querySelectorAll(".column__card"),
    );

    const data = {
      toDo: [],
      inProgress: [],
      done: [],
    };

    toDoCards.forEach((card) => {
      data.toDo.push(card.querySelector(".column__text").textContent);
    });

    inProgressCards.forEach((card) => {
      data.inProgress.push(card.querySelector(".column__text").textContent);
    });

    doneCards.forEach((card) => {
      data.done.push(card.querySelector(".column__text").textContent);
    });

    this.listStorage.save(data);
  }

  load() {
    const loadList = this.listStorage.load();
    const topText = document.querySelector(".top__text");

    if (loadList) {
      this.clearAllCards();

      for (const data of loadList.toDo) {
        const card = document.createElement("li");
        const text = document.createElement("p");

        card.classList.add("column__card");
        text.classList.add("column__text");
        text.textContent = data;

        card.append(text);
        this.element
          .querySelector(".column_to-do")
          .querySelector(".column__cards")
          .append(card);
      }

      for (const data of loadList.inProgress) {
        const card = document.createElement("li");
        const text = document.createElement("p");

        card.classList.add("column__card");
        text.classList.add("column__text");
        text.textContent = data;

        card.append(text);
        this.element
          .querySelector(".column_in-progress")
          .querySelector(".column__cards")
          .append(card);
      }

      for (const data of loadList.done) {
        const card = document.createElement("li");
        const text = document.createElement("p");

        card.classList.add("column__card");
        text.classList.add("column__text");
        text.textContent = data;

        card.append(text);
        this.element
          .querySelector(".column_done")
          .querySelector(".column__cards")
          .append(card);
      }

      topText.textContent = "Welcome back!";
    } else {
      topText.textContent = "Welcome!";
    }
  }

  checkCardsLength() {
    const columns = this.element.querySelectorAll(".column");

    columns.forEach((column) => {
      if (column.querySelectorAll(".column__card").length !== 0) {
        if (column.querySelector(".no-cards-text")) {
          column.querySelector(".no-cards-text").remove();
        }
        return;
      } else {
        this.createNoCardText(column);
      }
    });
  }

  createNoCardText(column) {
    if (column.querySelector(".no-cards-text")) {
      column.querySelector(".no-cards-text").remove();
    }

    const text = document.createElement("span");
    text.classList.add("no-cards-text");
    text.textContent = `You have no cards in your "${
      column.querySelector(".column__title").textContent
    }" list. You can create one by clicking the "Add another card" button below.`;

    column.querySelector(".column__title").after(text);
  }
}
