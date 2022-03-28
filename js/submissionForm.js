//Реализация открытия и закрытия модального окна
const buttonForm = document.querySelector(".top-menu__button-form");
const buttonCancel = document.querySelector(".modal-window__button--cancel");
const crossClosure = document.querySelector(".modal-window__close-icon");
const modalOverlay = document.querySelector(".overlay-container");
const htmlTag = document.getElementsByTagName("html");
const modalWindow = document.getElementById("modal-window");

function openModalWindow() {
  modalOverlay.classList.add("overlay-container--show");
  htmlTag[0].style.overflow = "hidden";
  submitButton.disabled = isSubmitDisabled;
}

function closeModalWindow() {
  modalOverlay.classList.remove("overlay-container--show");
  htmlTag[0].style.overflow = "auto";
  resetFormState();
}

function resetFormState() {
  resetPhoneInput();
  resetNameInput();
}

function resetPhoneInput() {
  textErrorOfPhone.style.display = "none";
  inputPhone.value = "";
  hasPhoneError = false;
  hasTouchedPhoneInput = false;
  inputPhone.classList.remove("input__phone--error");
}

function resetNameInput() {
  inputName.value = "";
  hasNameError = false;
  hasTouchedNameInput = false;
  textErrorOfName.style.display = "none";
  inputName.classList.remove("input__name--error");
}

buttonForm.addEventListener("click", openModalWindow);
buttonCancel.addEventListener("click", closeModalWindow);
crossClosure.addEventListener("click", closeModalWindow);
modalOverlay.addEventListener("click", closeModalWindow);
modalWindow.addEventListener("click", function (event) {
  event.stopPropagation();
});

//Реализация валидации
const inputPhone = document.querySelector(".input__phone");
const inputName = document.querySelector(".input__name");
const textErrorOfPhone = document.querySelector(".input__phone-error-text");
const textErrorOfName = document.querySelector(".input__name-error-text");
const submitButton = document.querySelector(".modal-window__button--submit");

//Переменные для 2-ух инпутов, которые отслеживают ошибку в форме и был ли затронут инпут
let hasPhoneError = false;
let hasTouchedPhoneInput = false;
let hasNameError = false;
let hasTouchedNameInput = false;

//Переменная, которая отвечает за состояние disabled
let isSubmitDisabled = true;

//Проверка поля inputPhone
function handlePhoneInput(event) {
  hasTouchedPhoneInput = true;
  const number = event.target.value;
  const regexp = /^(8|\+7)\d{10}$/;

  if (!regexp.test(number)) {
    inputPhone.classList.add("input__phone--error");
    textErrorOfPhone.style.display = "block";
    hasPhoneError = true;
  } else {
    inputPhone.classList.remove("input__phone--error");
    textErrorOfPhone.style.display = "none";
    hasPhoneError = false;
  }
}

//Проверка поля inputName
function handleNameInput(event) {
  hasTouchedNameInput = true;
  const name = event.target.value;
  const regexp = /^\D{3,}$/;

  if (!regexp.test(name)) {
    inputName.classList.add("input__name--error");
    textErrorOfName.style.display = "block";
    hasNameError = true;
  } else {
    inputName.classList.remove("input__name--error");
    textErrorOfName.style.display = "none";
    hasNameError = false;
  }
}

//Проверка одновременно двух полей, корректно ли они заполнены
//Если оба поля заполнены верно - убрать disabled
function checkValidateForm() {
  const isPhoneInputCorrect = !hasPhoneError && hasTouchedPhoneInput;
  const isNameInputCorrect = !hasNameError && hasTouchedNameInput;

  const isSubmitDisabled = !isPhoneInputCorrect || !isNameInputCorrect;
  submitButton.disabled = isSubmitDisabled;
}

//Вешаем события на оба инпута
inputPhone.addEventListener("input", (event) => {
  handlePhoneInput(event);
  checkValidateForm();
});

inputName.addEventListener("input", (event) => {
  handleNameInput(event);
  checkValidateForm();
});

//Отправка формы на сервер
function fetchTableData() {
  const modalWindowContainer = document.querySelector(
    ".modal-window__container"
  );
  modalWindowContainer.style.display = "none";

  const preloader = document.querySelector(".preloader");
  preloader.style.display = "flex";

  fetch("https://jsonplaceholder.typicode.com/todos")
    .then((response) => response.json())
    .then((arr) => {
      const filteredArr = filterArr(arr);
      createTable(filteredArr);
    })
    .catch((error) => {
      showError();
      console.error(error);
    })
    .finally(() => (preloader.style.display = "none"));
}

function showError() {
  const requestErrorTitle = document.querySelector(".request-error");
  requestErrorTitle.style.display = "block";
}

function filterArr(arg) {
  return arg.filter((elem) => elem.userId === 5 && elem.completed === false);
}

submitButton.addEventListener("click", fetchTableData);

//Отрисовка таблицы
function createTable(data) {
  const tableTag = document.getElementById("table");
  const theadTag = document.createElement("thead");
  const tbodyTag = document.createElement("tbody");
  const trTag = document.createElement("tr");
  tableTag.append(theadTag);
  tableTag.append(tbodyTag);
  theadTag.append(trTag);

  const arrKeysObject = Object.keys(data[0]);

  arrKeysObject.forEach((elem) => {
    const thTag = document.createElement("th");
    thTag.innerHTML = elem;
    thTag.className = "table__th";
    trTag.append(thTag);
  });

  data.forEach((obj) => {
    const trTag = document.createElement("tr");
    tbodyTag.append(trTag);

    const arrValuesObj = Object.values(obj);

    arrValuesObj.forEach((elem) => {
      const tdTag = document.createElement("td");
      tdTag.innerHTML = elem;
      tdTag.className = "table__td";
      trTag.append(tdTag);
    });
  });
}
