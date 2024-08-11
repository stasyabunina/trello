import { saveData } from "./saveData";
import { save } from "./localStorage";
import { msnry } from "./masonry";

const removeTag = (btn) => {
  const tagName = btn.previousElementSibling.textContent.slice(1);
  const tag = { name: tagName, color: btn.closest('.header__tag-item').style.backgroundColor };

  document.querySelectorAll('.column__tag-btn').forEach((tagItem) => {
    if (tagItem.previousElementSibling.textContent === tagName) {
      if (tagItem.closest('.column__tags').children.length === 1) {
        tagItem.closest('.column__tags').classList.add('hidden');
      }
      tagItem.closest('.column__tag').remove();
      msnry.layout();
    }
  })

  btn.closest('.header__tag-item').remove();

  for (const column of saveData.columns) {
    for (const card of column.cards) {
      if (card.hasOwnProperty('tags')) {
        for (const dataTag of card.tags) {
          if (dataTag === tagName) {
            card.tags.splice(card.tags.indexOf(tagName), 1);
            if (card.tags.length === 0) {
              delete card.tags;
            }
          }
        }
      }
    }
  }

  saveData.tags.splice(saveData.tags.indexOf(tag), 1);
  save();
}

export default removeTag;
