import removeTag from "./removeTag";

const addTag = (tag, list) => {
  const tagItem = document.createElement('li');
  tagItem.classList.add('header__tag-item');
  tagItem.style.backgroundColor = tag.color;
  const tagName = document.createElement('span');
  tagName.classList.add('header__tag-name');
  tagName.textContent = '#' + tag.name;
  const tagRemoveBtn = document.createElement('button');
  tagRemoveBtn.classList.add('header__tag-remove');
  tagRemoveBtn.type = 'button';
  tagRemoveBtn.ariaLabel = 'Удалить тег';
  tagRemoveBtn.textContent = '+';
  tagItem.append(tagName);
  tagItem.append(tagRemoveBtn);
  list.append(tagItem);

  if (document.querySelector('.column__form')) {
    const tagItem = document.createElement('li');
    tagItem.className = 'column__form-tag';
    tagItem.innerHTML = `
    <label class="column__form-tag-content">
      <input type="checkbox" class="column__tag-checkbox visually-hidden">
      <span class="column__form-tag-name">${tag.name}</span>
    </label>
    `
    document.querySelector('.column__form-tags').append(tagItem);
    tagItem.querySelector('.column__form-tag-content').addEventListener('click', () => {
      if (tagItem.querySelector('.column__form-tag-content').firstElementChild.checked === false) {
        tagItem.querySelector('.column__form-tag-content').firstElementChild.checked = true;
        tagItem.querySelector('.column__form-tag-content').closest('.column__form-tag').style.backgroundColor = tag.color;
      } else {
        tagItem.querySelector('.column__form-tag-content').firstElementChild.checked = false;
        tagItem.querySelector('.column__form-tag-content').closest('.column__form-tag').style.backgroundColor = 'lightgray';
      }
    })
  }

  tagRemoveBtn.addEventListener('click', () => {
    removeTag(tagRemoveBtn);
  })
}

export default addTag;
