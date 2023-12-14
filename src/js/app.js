import ToDoList from "./ToDoList";
import Storage from "./Storage";

const container = document.querySelector(".list");

const storage = new Storage();

const list = new ToDoList(container, storage);

list.init();
