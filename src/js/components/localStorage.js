import { saveData } from "./saveData";

function save() {
  localStorage.setItem("data", JSON.stringify(saveData));
}

function load() {
  try {
    return JSON.parse(localStorage.getItem("data"));
  } catch (e) {
    throw new Error("Invalid data");
  }
}

function remove() {
  localStorage.removeItem("data");
}

export { save, load, remove };
