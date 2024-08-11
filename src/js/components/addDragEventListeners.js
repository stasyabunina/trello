import addNoCardsText from "./addNoCardsText";
import { saveData } from "./saveData";
import { save } from "./localStorage";
import { msnry } from "./masonry";

let draggedCard;
let ghostCard;
let ghostCardX;
let ghostCardY;

let dataColumnDragged;
let dataColumnDraggedIndex;
let cardObjDragged;

const mouseDown = (e) => {
  draggedCard = e.target.closest(".column__card");
  if (!draggedCard || e.button === 2) {
    return;
  }

  dataColumnDragged = saveData.columns.find(column => column.name === draggedCard.closest('.column').querySelector('.column__title').textContent);
  dataColumnDraggedIndex = saveData.columns.indexOf(dataColumnDragged);
  cardObjDragged = saveData.columns[dataColumnDraggedIndex].cards.find(card => card.text === draggedCard.querySelector('.column__text').textContent);

  ghostCard = draggedCard.cloneNode(true);
  ghostCard.classList.add("column__card--dragged");
  draggedCard.classList.add("transparent");

  const { width, height, left, top } =
    draggedCard.getBoundingClientRect();

  ghostCard.style.width = width + "px";
  ghostCard.style.height = height + "px";
  ghostCard.style.top = top + window.scrollY + "px";
  ghostCard.style.left = left + "px";

  document.body.appendChild(ghostCard);

  document.querySelectorAll('.column__card').forEach((card) => {
    card.style.cursor = 'grabbing';
  })
  document.body.classList.add('grabbing');

  ghostCardX = e.pageX - left;
  ghostCardY = e.pageY - document.documentElement.scrollTop - top;

  if (draggedCard.closest(".column__cards").querySelectorAll(".column__card").length - 1 === 0) {
    addNoCardsText(draggedCard.closest('.column__cards'));

    draggedCard.classList.add("hidden");
  }

  msnry.layout();
}

const mouseMove = (e) => {
  if (e.clientY > window.innerHeight) {
    return;
  }

  ghostCard.style.position = 'absolute';
  ghostCard.style.left = e.pageX - ghostCardX + "px";
  ghostCard.style.top = e.pageY - ghostCardY + "px";

  const target = document.elementFromPoint(e.clientX, e.clientY);
  if (!target) {
    return;
  }
  const column = document.elementFromPoint(e.clientX, e.clientY).closest(".column");
  const { height, top } = draggedCard.getBoundingClientRect();
  const closestCard = document.elementFromPoint(e.clientX, e.clientY).closest(".column__card");

  if (!closestCard && target.classList.contains("no-cards-text")) {
    column.querySelector(".no-cards-text").nextElementSibling.append(draggedCard);
    draggedCard.classList.add("hidden");
    msnry.layout();
  } else if (closestCard) {
    if (e.pageY < top - height / 2) {
      closestCard.before(draggedCard);
    } else {
      closestCard.after(draggedCard);
    }

    draggedCard.classList.remove("hidden");
    msnry.layout();
  }
}

const mouseUp = (e) => {
  if (e.button === 2 || !draggedCard) {
    return;
  }

  document.body.classList.remove('grabbing');
  document.querySelectorAll('.column__card').forEach((card) => {
    card.removeAttribute('style');
  })

  if (draggedCard.closest(".column__cards").querySelectorAll(".column__card").length - 1 === 0) {
    if (draggedCard.closest(".column__cards").previousElementSibling.classList.contains('no-cards-text')) {
      draggedCard.closest(".column__cards").previousElementSibling.remove();
    }

    draggedCard.classList.remove("hidden");
  }

  ghostCard.classList.remove("column__card--dragged");
  draggedCard.classList.remove("transparent");
  ghostCard.remove();

  saveData.columns[dataColumnDraggedIndex].cards.splice(saveData.columns[dataColumnDraggedIndex].cards.indexOf(cardObjDragged), 1);

  dataColumnDragged = saveData.columns.find(column => column.name === draggedCard.closest('.column').querySelector('.column__title').textContent);
  dataColumnDraggedIndex = saveData.columns.indexOf(dataColumnDragged);

  saveData.columns[dataColumnDraggedIndex].cards.push(cardObjDragged);

  ghostCard = undefined;
  draggedCard = undefined;
  msnry.layout();
  save();
}

const addDragEventListeners = () => {
  document.addEventListener("mousedown", (e) => {
    let target = e.target;
    if (!document.querySelector(".column__edit-card-form") && !target.closest('.column__text') && !target.closest('.column__tags') && !target.closest('.column__menu-btn') && !target.closest('.column__menu')) {
      mouseDown(e);
    }
  });

  document.addEventListener("mousemove", (e) => {
    if (!document.querySelector(".column__edit-card-form") && ghostCard) {
      e.preventDefault();
      mouseMove(e);
    }
  });

  document.addEventListener("mouseup", (e) => {
    if (!document.querySelector(".column__edit-card-form")) {
      mouseUp(e);
    }
  });
}

export default addDragEventListeners;
