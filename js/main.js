'use strict';

const clear = document.querySelector('.clear');
const dateElement = document.getElementById('date');
const list = document.getElementById('list');
const input = document.getElementById('input');
const addWithBtn = document.querySelector('.add-to-do');

//  assign classes to variables
const CHECK = 'item__select--done';
const UNCHECK = 'item__select--selected';
const LINE_THROUGH = 'lineThrough';

//  Variables
let LIST = [];  //  This empty array will be filled with objects of toDo's with such structure:
                //  {name: toDo, id: id, done: false, trash: false}
let id = 0;     //  starting point for id



// FUNCTIONS:
//  !First level (lowest) of abstruction
// generate and insert html into a certain place of list
function addToDo(toDo, id, done, trash ) {
  if (trash) {
    return;
  }

  const DONE = done ? CHECK : UNCHECK;
  const LINE = done ? LINE_THROUGH : '';
  const item = `
                <li class="item">
                    <div class="item__select item__select--selected ${DONE}" job="complete" id="${id}"></div>
                    <p class="text ${LINE}">${toDo}</p>
                    <div class="item__delete" job="delete" id="${id}"></div>
                </li>
               `;
  const position = 'beforeend';

  list.insertAdjacentHTML(position,item);
}

//???
function completeToDo(element) {
  element.classList.toggle(CHECK);
  element.classList.toggle(UNCHECK);
  element.parentNode.querySelector('.text').classList.toggle(LINE_THROUGH);
  LIST[element.id].done ? false : true;
}

function removeToDo(element) {
  element.parentNode.parentNode.removeChild(element.parentNode);
  LIST[element.id].trash = true;
}

// Second level of abstruction(highest)
// iterates every object in array by its keys and if trash not true it inserts object with addToDo into certain place in list
function loadToDo(array) {
  array.forEach(function(item) {
    addToDo(item.name, item.id, item.done, item.trash);
  });
}



// EVENTS:
// First level of abstruction(lowest)
//clear the local storage
clear.addEventListener('click', function() {
  localStorage.clear();
  location.reload();
});

// add button (in the next event you can add new toDo with 'Enter' key)
addWithBtn.addEventListener('click', () => {
  const toDo = input.value;
  if (toDo) {
    addToDo(toDo, id, false, false);
    LIST.push({
      name: toDo,
      id: id,
      done: false,
      trash: false
    });
    //add item to local storage - this code must be added every time the LIST array is updated
    localStorage.setItem('TODO',JSON.stringify(LIST));
    id++;
  }
  input.value = '';
});

// when press 'Enter'
document.addEventListener('keyup', function(event) {
  if (event.keyCode === 13) {
    const toDo = input.value;

    if (toDo) {
      addToDo(toDo, id, false, false);
      LIST.push(
        {
          name: toDo,
          id: id,
          done: false,
          trash: false
        }
      );
      localStorage.setItem('TODO', JSON.stringify(LIST));
      id++;
    }
    input.value = '';
  }
});

// Second level of abstruction (highest)
//  work of 'complete', 'delete' buttons
list.addEventListener('click', function(event){
  let element = event.target;
  if (element.attributes.job) {
    const elementJOB = element.attributes.job.value;
    if (elementJOB == 'complete') {
      completeToDo(element);
    } else if (elementJOB == 'delete') {
      removeToDo(element);
    }
  } else {
    return;
  }
  localStorage.setItem('TODO', JSON.stringify(LIST));
});


// GLOBAL LOGIC:
// Show todays date
let options = {
  weekday:  'long',
  month: 'short',
  day: 'numeric'
};

let today = new Date();
dateElement.innerHTML = today.toLocaleDateString('en-US', options);


//get item from local storage
let data = localStorage.getItem('TODO'); // Restore our list array

//check if data is not empty
if (data) {
  LIST = JSON.parse(data);
  loadToDo(LIST); //  We load the list to the page
  id = LIST.length;
} else {
  LIST = [];
  id = 0;
}
