import { noData } from "./noData";
import { load } from "./localStorage";

const loadData = load();

let saveData = {};

if (loadData) {
  saveData = loadData;
} else {
  saveData = noData;
}

export { saveData };
