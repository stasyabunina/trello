const addError = (element, type) => {
  if (document.querySelector('.error')) {
    document.querySelector('.error').remove();
  }
  const error = document.createElement('span');
  error.classList.add('error');
  if (type === 'nameColumn') {
    error.textContent = 'Такая колонка уже существует.';
  } else if (type === 'nameTag') {
    error.textContent = 'Такой тег уже существует.';
  } else {
    error.textContent = 'Поле не может быть пустым.';
  }
  element.after(error);
}

export default addError;
