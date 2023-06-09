// container to display all books
const booksDisplay = document.querySelector('.books-display');
const formContainer = document.querySelector('.form-container');
const bookForm = document.querySelector('#form');

function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
  this.id = Math.floor(Math.random() * 100000);
}

function addBookToLibrary(title, author, pages, read) {
  myLibrary.push(new Book(title, author, pages, read));
  saveAndRenderBooks();
}
function saveAndRenderBooks() {
  localStorage.setItem('library', JSON.stringify(myLibrary));
  renderLibrary();
}
bookForm.addEventListener('submit', function (e) {
  e.preventDefault();

  // grab form inputs and convert to obj
  const data = new FormData(e.target);
  console.log(e);
  let newBook = {};
  for (let [name, value] of data) {
    if (name === 'book-read') {
      newBook['book-read'] = true;
    } else {
      newBook[name] = value || '';
    }
  }
  if (!newBook['book-read']) {
    newBook['book-read'] = false;
  }
  if (document.querySelector('.form-title').textContent === 'Edit Book') {
    let id = e.target.id;
    let editBook = myLibrary.filter((book) => book.id == id)[0];
    editBook.title = newBook['title'];
    editBook.author = newBook['author'];
    editBook.pages = newBook['pages'];
    editBook.read = newBook['read'];
    saveAndRenderBooks();
  } else {
    addBookToLibrary(
      newBook['title'],
      newBook['author'],
      newBook['pages'],
      newBook['read']
    );
  }
  bookForm.reset();
  formContainer.style.display = 'none';
});

let myLibrary = [];

function addLocalStorage() {
  myLibrary = JSON.parse(localStorage.getItem('library') || []);
  saveAndRenderBooks();
}

function openAddForm() {
  document.querySelector('.form-container').style.display = 'flex';
  document.querySelector('#form-header').textContent = 'Add New Book';
  document.querySelector('#add-book-btn').textContent = 'Add';
}

// close form btn
// span.addEventListener('click', function () {
//   document.querySelector('.form-container').style.display = 'none';
// });

// click event to close form when clicking outside form
const outerForm = document.querySelector('.form-container');
window.addEventListener('click', function (e) {
  if (e.target == outerForm) {
    outerForm.style.display = 'none';
  }
});
// helper fn to create html elements w/ classes and text
function helperBookElement(el, textContent, className) {
  const element = document.createElement(el);
  element.textContent = textContent;
  element.classList.add(className);
  return element;
}
function helperLabelElement(el, attribute, attData, textContent) {
  const label = document.createElement(el);
  label.setAttribute(attribute, attData);
  label.textContent = textContent;
  return label;
}

function createEdit() {
  const editBtn = document.createElement('span');
  editBtn.classList.add('book-edit');
  const editIcon = document.createElement('img');
  editIcon.setAttribute('src', 'images/pencil.svg');
  editBtn.append(editIcon);
  editBtn.addEventListener('click', function () {
    preLoadEditForm();
  });
  return editBtn;
}

function preLoadEditForm(book) {
  formContainer.style.display = 'flex';
  document.querySelector('#form-header').textContent = 'Edit Book';
  document.querySelector('#add-book-btn').textContent = 'Edit';
  document.querySelector('#form').setAttribute('id', book.id);
  document.querySelector('#title').value = book.title || '';
  document.querySelector('#author').value = book.author || '';
  document.querySelector('#pages').value = book.pages || '';
  document.querySelector('#read').checked = book.read;
}
// delete funtionality
function deleteBook(index) {
  console.log(myLibrary.splice(index, 1));
  saveAndRenderBooks();
}

// helper fn to create input w/ event listener
function createBookOptions(bookItem, book) {
  let readDiv = document.createElement('div');
  readDiv.classList.add('book-read');
  readDiv.appendChild(helperLabelElement('label', 'for', 'read', 'Read'));

  let input = document.createElement('input');
  input.type = 'checkbox';
  input.setAttribute('name', 'read');
  input.setAttribute('id', 'read');
  input.addEventListener('click', function (e) {
    if (e.target.checked) {
      bookItem.setAttribute('class', 'book');
      book.read = true;
      saveAndRenderBooks();
    } else {
      bookItem.setAttribute('class', 'book');
      book.read = false;
      saveAndRenderBooks();
    }
  });
  if (book.read) {
    input.checked = true;
    bookItem.setAttribute('class', 'book');
  }
  readDiv.appendChild(input);
  return readDiv;
}

function createBookItems(book, index) {
  const bookItem = document.createElement('div');
  bookItem.setAttribute('id', index);
  bookItem.setAttribute('key', index);
  bookItem.classList.add('book');

  const bookCover = document.createElement('img');
  bookCover.setAttribute('src', 'images/wallpaper.jpg');

  bookInfo = document.createElement('div');
  bookInfo.classList.add('book-info');
  bookInfo.append(helperBookElement('h2', book.title, 'title'));
  bookInfo.append(helperBookElement('h3', book.author, 'author'));
  bookInfo.append(helperBookElement('h4', `${book.pages} pages`, 'pages'));

  bookOptions = document.createElement('div');
  bookOptions.classList.add('book-options');

  function createDelete() {
    const deleteBtn = document.createElement('span');
    deleteBtn.classList.add('book-delete');
    const deleteIcon = document.createElement('img');
    deleteIcon.setAttribute('src', 'images/delete.svg');
    deleteBtn.append(deleteIcon);
    deleteBtn.addEventListener('click', function () {
      deleteBook(index);
    });
    return deleteBtn;
  }

  bookEditAndDelete = helperBookElement('div', null, 'book-icons');
  bookEditAndDelete.append(createEdit(), createDelete());

  bookOptions.append(createBookOptions(bookItem, book), bookEditAndDelete);
  bookItem.append(bookCover, bookInfo, bookOptions);
  booksDisplay.append(bookItem);
}

function renderLibrary() {
  booksDisplay.innerHTML = `
  <div class="book add-book" onclick="openAddForm()">
  <img src="images/plus.svg" alt="">
</div>
  `;
  myLibrary.map((book, index) => {
    createBookItems(book, index);
  });
}

// render storage on page load
addLocalStorage();
