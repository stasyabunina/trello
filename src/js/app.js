import ToDoList from './ToDoList';
import Storage from './Storage';

const container = document.querySelector('.container');

const storage = new Storage();

// storage.remove();

const list = new ToDoList(container, storage);

list.init();
