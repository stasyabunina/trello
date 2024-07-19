const addNoCardsText = (list) => {
  const emptyCardText = document.createElement('span');
  emptyCardText.classList.add('no-cards-text');
  emptyCardText.textContent = 'У этой колонки отсутствуют задачи. Вы можете создать карточку, нажав на кнопку "Добавить карточку" ниже.';
  list.before(emptyCardText);
}

export default addNoCardsText;
