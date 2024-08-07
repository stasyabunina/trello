const backgroundBtn = document.querySelector('.header__change-background-btn');
const backgroundList = document.querySelector('.header__background-list');
const gradientBtn = document.querySelector('.header__background-gradient');
const colorBtn = document.querySelector('.header__background-color');
const gradient = document.getElementById('gradient-canvas');
const loader = document.querySelector('.loader-wrapper');
const columns = document.querySelector('.manager__columns');
const managerWrapper = document.querySelector('.manager__wrapper');
const addColumnBtn = document.querySelector('.header__add-column-btn');
const clearDataBtn = document.querySelector('.header__clear-btn');
const addTagBtn = document.querySelector('.header__add-tag-btn');
const tagMenu = document.querySelector('.header__tag-menu');
const tagMenuList = tagMenu.querySelector('.header__tag-list');
const tagMenuColorInput = tagMenu.querySelector('.header__tag-color-input');
const tagMenuNameInput = tagMenu.querySelector('.header__tag-name-input');
const tagForm = document.querySelector('.header__tag-form');
const tagRemoveBtns = document.querySelectorAll('.header__tag-remove');
const tagFormCancel = document.querySelector('.header__tag-form-cancel');

export { backgroundBtn, backgroundList, colorBtn, gradientBtn, gradient, loader, columns, addColumnBtn, managerWrapper, clearDataBtn, addTagBtn, tagMenu, tagMenuList, tagMenuColorInput, tagMenuNameInput, tagForm, tagRemoveBtns, tagFormCancel };
