const modal = document.querySelector("#modal");
const modalContent = document.querySelector("#modal-content");
const newBookBtn = document.querySelector("#new-book-btn");
const closeBtn = document.querySelector("#close");
const form = document.querySelector("form");
const display = document.querySelector("#display");

let myLibrary = null;

window.addEventListener('load', () => {
  if (!localStorage.getItem('myLibrary')) {
    myLibrary = [];
  } else {
    myLibrary = JSON.parse(localStorage.getItem('myLibrary'));
    myLibrary.forEach(book => {
      Object.setPrototypeOf(book, Book.prototype);
    })
  }
  displayBook(myLibrary);
})

// Hide and display modal
window.addEventListener('click', e => {
  if (e.target === modal || e.target === closeBtn) {
    modal.style.display = "none";
  } else if (e.target === newBookBtn) {
    modal.style.display = "flex";
  }
})

// Add book to library
function Book(title, author, pages) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.readStatus = false;
};

Book.prototype.toggleStatus = function() {
  this.readStatus = !this.readStatus;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  addBookToLibrary(form.title.value, form.author.value, form.pages.value);
  localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
  display.innerHTML = "";
  resetForm();
  displayBook(myLibrary);
});

window.addEventListener('click', e => {
  if (e.target.className === 'toggle-btn') {
    let index = Number(e.target.getAttribute('data-index'));
    myLibrary[index].toggleStatus();
  } else if (e.target.className === 'delete-btn') {
    let index = Number(e.target.getAttribute('data-index'));
    myLibrary.splice(index, 1);
  }
  display.innerHTML = "";
  displayBook(myLibrary);
  localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
})

// Helper function

function addBookToLibrary(title, author, pages) {
  if (myLibrary.every(book => book.title != title)) {
    myLibrary.push(new Book(title, author, pages));
  }
  modal.style.display = "none";
}

function displayBook(books) {
  books.forEach(book => {
    let bookDiv = document.createElement("div");
    bookDiv.className = "book";
    for (let key of Object.getOwnPropertyNames(book)) {
      let content = document.createElement("p");
      content.className = `${key}`;
      if (key === 'readStatus') {
        content.textContent = book[key] ? 'Read' : 'Unread';
      } else {
        content.textContent = book[key];
      }
      bookDiv.appendChild(content);
    }
    let toogleBtn = document.createElement('button');
    toogleBtn.textContent = 'Toggle Status';
    toogleBtn.className = 'toggle-btn';
    toogleBtn.setAttribute('data-index', `${myLibrary.indexOf(book)}`);
    let deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'delete-btn';
    deleteBtn.setAttribute('data-index', `${myLibrary.indexOf(book)}`);
    bookDiv.append(toogleBtn);
    bookDiv.append(deleteBtn);
    display.appendChild(bookDiv);
  });
}

function resetForm() {
  form.title.value = "";
  form.author.value = "";
  form.pages.value = "";
}