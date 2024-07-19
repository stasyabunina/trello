import { clearDataBtn } from "./var";
import { saveData } from "./saveData";
import { save } from "./localStorage";
import addNoColumnsText from "./addNoColumnsText";
import { msnry } from "./masonry";

clearDataBtn.addEventListener('click', () => {
  document.querySelectorAll('.column').forEach((column) => {
    column.remove();
  })
  addNoColumnsText();

  saveData.columns = [];
  saveData.tags = [];
  save(saveData);
  msnry.layout();
})
