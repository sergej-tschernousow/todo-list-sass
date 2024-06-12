// new AirDatepicker('#airdatepicker', {
//    position: 'top left',
//    timepicker: true
// });
// new AirDatepicker('#airdatepicker1', {
//    position: 'top left',
//    timepicker: true
// });
const date = new Date();
const DAY_OF_WEEK = [
   'Воскресенье',
   'Понедельник',
   'Вторник',
   'Среда',
   'Четверг',
   'Пятница',
   'Суббота'
];
const MONTH = [
   'Января',
   'Февраля',
   'Марта',
   'Апреля',
   'Майя',
   'Июня',
   'Июля',
   'Августа',
   'Сентября',
   'Октября',
   'Ноября',
   'Декабря'
];
// const editBlock =
//    '<div class="edit-wrap"><button class="delete" value="del"><img src="./img/icons/delete.svg" alt="delete button" /></button></div>';
const editMenu =
   '<div class="edit-menu"><img src="./img/icons/dots.svg" alt="Edit menu" /><button class="delete" value="del"><img src="./img/icons/delete.svg" alt="Delete Task" /></button><button class="edit-task" value="edit"><img src="./img/icons/edit.svg" alt="" /></button></div>';
const todaysDate = document.querySelector('.date');
const addingTastForm = document.querySelector('.adding-task');
const inputsTask = document.querySelectorAll('.adding-task [type="text"]');
const resetBtn = document.querySelector('.reset');
const cancelBtn = document.querySelector('.cancel');
const todoList = document.querySelector('.todo-list');
const searchBtn = document.querySelector('#search');
const searchBtnIcon = document.querySelector('.search-btn');
const searchList = document.querySelector('.search-list');
const menuBtn = document.querySelector('.menu-btn');
const closeBtn = document.querySelector('.close');
const overlay = document.querySelector('.overlay');
const tabsBtn = document.querySelectorAll('.tabs-btn');
const editingForm = document.querySelector('.editing-form');
const inputsEditingForm = editingForm.querySelectorAll('input[type="text"]');

const taskList = JSON.parse(localStorage.getItem('taskList')) || [];

todaysDate.innerHTML = `<div class="date"><p class="day-of-week">${
   DAY_OF_WEEK[date.getDay()]
}</p><p class="date-and-month">${date.getDate()} ${
   MONTH[date.getMonth()]
}</p></div>`;

document
   .querySelectorAll('form')
   .forEach(item => item.addEventListener('submit', e => e.preventDefault()));
renderTaskList(taskList);

[resetBtn, cancelBtn].forEach(item =>
   item.addEventListener('click', resetInputsValue)
);

cancelBtn.addEventListener('click', showHiddeElement);
searchBtn.addEventListener('input', searchTask);

addingTastForm.addEventListener('submit', processingFormData);

tabsBtn.forEach(el => {
   el.addEventListener('click', actionTabs);
});

menuBtn.addEventListener('click', e => {
   showHiddeElement([[overlay, true], [addingTastForm, true], [menuBtn]]);
});

closeBtn.addEventListener('click', e => {
   showHiddeElement([
      [overlay],
      [menuBtn, true],
      [editingForm],
      [addingTastForm]
   ]);
});

window.addEventListener('resize', e => {
   if (e.target.innerWidth > 425) {
      showHiddeElement([[overlay], [menuBtn], [addingTastForm], [editingForm]]);
   } else {
      showHiddeElement([[menuBtn, true]]);
   }
});

function renderTaskList(list) {
   if (taskList.length > 0) {
      todoList.textContent = '';
      list.forEach(el => {
         createItemOfList(el);
      });
   }
}

function actionTabs(e) {
   tabsBtn.forEach(btn => showHiddeElement([[btn]]));
   showHiddeElement([[e.target, true]]);
   const filterValue = e.target.value;
   filterValue === 'all'
      ? allTask()
      : filterValue === 'completed'
      ? completedTask()
      : plannedTask();
}
function resetInputsValue() {
   document
      .querySelectorAll('input[type="text"]')
      .forEach(item => (item.value = ''));
}

function upgradeTaskList() {
   localStorage.setItem('taskList', JSON.stringify(taskList));
}

function createElement(elem, className, text) {
   const el = document.createElement(elem);
   if (className) el.classList.add(className);
   if (text) el.textContent = text;
   return el;
}

function createItemOfList({
   id: id,
   content: content,
   day: day,
   checked: checkedStatus
}) {
   const li = createElement('li');
   const checkbox = createElement('input');
   const div = createElement('div', 'list-item');
   const dayP = createElement('p', 'day', day);
   const contentP = createElement('p', 'content', content);
   li.innerHTML = editMenu;
   li.setAttribute('id', id);
   checkbox.setAttribute('type', 'checkbox');
   checkbox.checked = checkedStatus;
   li.append(checkbox, div);
   div.append(dayP, contentP);
   li.addEventListener('click', addEventOfTodoList);
   if (checkedStatus) li.classList.add('checked');

   todoList.append(li);
}

function createTask([task, date]) {
   return {
      id: `todo_${date + taskList.length + task}`,
      content: task,
      day: date,
      checked: false
   };
}

function allTask() {
   renderTaskList(taskList);
}

function completedTask() {
   const completedList = taskList.filter(el => el.checked);
   renderTaskList(completedList);
}

function plannedTask() {
   const plannedList = taskList.filter(el => !el.checked);
   renderTaskList(plannedList);
}

function searchTask(e) {
   const inputValue = e.target.value;
   if (inputValue.length === 0) showHiddeElement([[searchList]]);
   searchList.textContent = '';
   const regexp = new RegExp(`^0{0,1}${inputValue}.+`, 'i');
   const newSearchList = taskList.filter(
      item => regexp.test(item.day) || regexp.test(item.content)
   );

   if (inputValue.length > 0 && newSearchList.length > 0) {
      searchBtnIcon.addEventListener('click', e => {
         renderTaskList(newSearchList);

         tabsBtn.forEach(el => showHiddeElement([[el]]));
         searchList.classList.remove('active');
      });
      newSearchList.forEach(item =>
         regexp.test(item.day)
            ? createSearchList(item.day, item.id)
            : createSearchList(item.content, item.id)
      );
   }
}

function createSearchList(value, id) {
   const li = createElement('li');
   const btn = createElement('button');
   btn.textContent = value;
   btn.setAttribute('value', id);
   btn.addEventListener('click', addEventOfSerchList);
   li.append(btn);
   searchList.append(li);
   showHiddeElement([[searchList, true]]);
}

function addEventOfSerchList(e) {
   todoList.textContent = '';
   let val = e.target.getAttribute('value');
   createItemOfList(taskList[findIndexOftasklis(val)]);
   tabsBtn.forEach(el => showHiddeElement([[el]]));
   showHiddeElement([[searchList]]);
}

function addEventOfTodoList(e) {
   if (e.target.value === 'del') {
      removeTaskFromList(e.currentTarget);
   } else if (e.target.value === 'edit') {
      correctionTask(e.currentTarget.id);
   } else if (e.target.type === 'checkbox') {
      addEventChecked(e.target, e.currentTarget.id, e.currentTarget);
   }
}

function addEventChecked(el, id, parrent) {
   el.checked
      ? parrent.classList.add('checked')
      : parrent.classList.remove('checked');
   for (let item of taskList) {
      if (item.id === id) {
         item.checked = el.checked;
         upgradeTaskList();
         break;
      }
   }
}

function removeTaskFromList(el) {
   const ind = findIndexOftasklis(el.id);
   taskList.splice(ind, 1);
   upgradeTaskList();
   el.remove();
}

function sortTaslList() {
   taskList.sort((a, b) => {
      const aDay = a.day.split(/[\.\:\s]/);
      const bDay = b.day.split(/[\.\:\s]/);
      const aStr = aDay[1] + aDay[0] + aDay[3] + aDay[4];
      const bStr = bDay[1] + bDay[0] + bDay[3] + bDay[4];

      return aStr.localeCompare(bStr);
   });
}

function showHiddeElement(arr) {
   if (Array.isArray(arr)) {
      arr.forEach(item =>
         item[1]
            ? item[0].classList.add('active')
            : item[0].classList.remove('active')
      );
   } else {
      editingForm.classList.remove('active');
      overlay.classList.remove('active');
   }
}

function processingFormData(e) {
   const newTask = createTask([...inputsTask].map(el => el.value));
   if (newTask.day != '' && newTask.content != '') {
      taskList.push(newTask);
      sortTaslList();
      renderTaskList(taskList);
      upgradeTaskList();
      resetInputsValue();
   }
}

function correctionTask(id) {
   showHiddeElement([
      [overlay, true],
      [editingForm, true]
   ]);

   const ind = findIndexOftasklis(id);
   const oldTask = taskList[ind];
   inputsEditingForm.forEach((item, i) =>
      i === 0 ? (item.value = oldTask.content) : (item.value = oldTask.day)
   );
   function editBtn(e) {
      taskList[ind].content = inputsEditingForm[0].value;
      taskList[ind].day = inputsEditingForm[1].value;
      sortTaslList();
      upgradeTaskList();
      renderTaskList(taskList);

      showHiddeElement([[overlay], [editingForm]]);

      e.target.removeEventListener('click', editBtn);
   }
   editingForm
      .querySelector('[type="submit"]')
      .addEventListener('click', editBtn);
}

function findIndexOftasklis(id) {
   return taskList.findIndex(item => item.id === id);
}
