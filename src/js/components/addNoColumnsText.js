import { managerWrapper } from "./var";

const addNoColumnsText = () => {
  if (document.querySelector('.no-columns-text')) {
    return;
  }
  const emptyColumnText = document.createElement('span');
  emptyColumnText.classList.add('no-columns-text');
  emptyColumnText.textContent = 'У вас отсутствуют колонки для задач. Вы можете создать колонку, нажав на кнопку "+" топ справа.';
  managerWrapper.prepend(emptyColumnText);
}

export default addNoColumnsText;
