// Add-on functionality

var subjectInput = document.querySelector('input'); // select input
var textAreaInput = document.querySelector('textarea'); // select textarea
var noteBox = document.querySelector('.notes-box'); // select div
var deleteNote = document.querySelector('.remove'); // get remove button
var addNoteButton = document.querySelector('.add-note'); // get add note button

// add click event listeners
addNoteButton.addEventListener('click', addNewNote); // onclick call addNewNote function
deleteNote.addEventListener('click', deleteNoteFromList); // onclick call deleteNoteFromList function

//add new note
function addNewNote() {
  var subjectTitleNote = subjectInput.value; // get the value of the subject
  var textNote = textAreaInput.value; // get the value of the textarea

  var gettingItem = browser.storage.local.get(subjectTitleNote);
  gettingItem.then((result) => {

    var noteObj = Object.keys(result); // put the result in noteObj variable
    if(noteObj.length < 1 && subjectTitleNote !== '' && textNote !== '') { // checks if the local storage is not empty
      storeNote(subjectTitleNote,textNote); // store the note in storage
    }
  }, onError);
}

// handle error function
function onError(error) {
  console.log(error); // display an error if something went wrong
}

// delete all items from localStorage
function deleteNoteFromList() {
  while (noteBox.firstChild) {
    noteBox.removeChild(noteBox.firstChild);
  }
  browser.storage.local.clear(); // clear all
}

// creates a local storage where the notes are saved
function createLocalStorage() {
  var gettingAllStorageItems = browser.storage.local.get(); // get all local storage
  gettingAllStorageItems.then((results) => {
    var noteKeys = Object.keys(results);
    for (let noteKey of noteKeys) { // store the value and the key in local storage
      var noteValue = results[noteKey];
      displayNote(noteKey,noteValue);
    }
  }, onError);
}

// display the local storage
function displayLocalStorage() {
  var localStorage =  browser.storage.local.get(); // get all local storage
  localStorage.then(function(e) {
    var localObj = Object.keys(e);
    for (let obj of localObj) {
      console.log(obj); // return title
      console.log(e[obj]); // return body
    }
  });
}

createLocalStorage(); // call local storage function

// display note in storage
function storeNote(title, body) {
  var storingNote = browser.storage.local.set({ [title] : body }); // url website cheia de titlu
  storingNote.then(() => {
    displayNote(title,body);
    displayLocalStorage(); // call the function to display the local storage
  }, onError);
}

// display note in the notes-box
function displayNote(title, body) {

  var noteDiv = document.createElement('div');
  var notDivChild = document.createElement('div');
  var headingNote = document.createElement('h2'); // heading title
  var textNote = document.createElement('p'); // text note
  var deleteBtn = document.createElement('button');

  noteDiv.setAttribute('class','new-note'); // set class for the div

  headingNote.textContent = title;
  textNote.textContent = body;
  deleteBtn.setAttribute('class','delete'); // set class
  deleteBtn.textContent = 'Delete note'; // set button text
 
  notDivChild.appendChild(headingNote);
  notDivChild.appendChild(textNote);
  notDivChild.appendChild(deleteBtn);
  noteDiv.appendChild(notDivChild);

  // delete every single note
  deleteBtn.addEventListener('click',(e) => {
    const event = e.target; // set target
    event.parentNode.parentNode.parentNode.removeChild(event.parentNode.parentNode);
    browser.storage.local.remove(title); // remove title from local storage
  })

  // create new notes
  var newDivNote = document.createElement('div');
  var titleNote = document.createElement('input');
  var messageNote = document.createElement('textarea');

  newDivNote.appendChild(titleNote); // append input to the div
  titleNote.value = title; // new title text
  newDivNote.appendChild(messageNote); //append textarea to the div
  messageNote.textContent = body; // new body text

  noteDiv.appendChild(newDivNote);

  noteBox.appendChild(noteDiv);
  newDivNote.style.display = 'none'; 
}