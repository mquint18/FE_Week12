
document.addEventListener('DOMContentLoaded', function() {
   

const bookContainer = document.querySelector('#book-container')
const bookURL = `http://localhost:3000/books`
const bookForm = document.querySelector('#book-form')
let allBooks = []

//get data from json and display send to html webpage

fetch(`${bookURL}`)
    .then( response => response.json() )
    .then( bookData => bookData.forEach(function(book) {
    allBooks = bookData
    bookContainer.innerHTML += `
        <div id=${book.id}>
        <h2>${book.title}</h2>
        <h4>Author: ${book.author}</h4>
        <img src="${book.coverImage}" width="333" height="500">
        <p>${book.description}</p>
        <button data-id="${book.id}" id="edit-${book.id}" data-action="edit">Edit</button>
        <button data-id="${book.id}" id="delete-${book.id}" data-action="delete">Delete</button>
      </div>`
    })) // end of book fetch

// add new entry on webpage and send it to json server and update display on website

    bookForm.addEventListener('submit', (e) => {
     e.preventDefault()

     console.log(e.target)


    const titleInput = bookForm.querySelector('#title').value
    const authorInput = bookForm.querySelector('#author').value
    const coverImageInput = bookForm.querySelector('#coverImage').value
    const descInput = bookForm.querySelector('#description').value

    fetch(`${bookURL}`, {
      method: 'POST',
      body: JSON.stringify({
        title: titleInput,
        author: authorInput,
        coverImage: coverImageInput,
        description: descInput
      }),
      headers: {
        'Content-Type': 'application/json'
      }
      }).then( response => response.json())
        .then( book => {
        bookContainer.innerHTML += `
        <div id=${book.id}>
          <h2>${book.title}</h2>
          <h4>Author: ${book.author}</h4>
          <img src="${book.coverImage}" width="333" height="500">
          <p>${book.description}</p>
          <button data-id="${book.id}" id="edit-${book.id}" data-action="edit">Edit</button>
          <button data-id="${book.id}" id="delete-${book.id}" data-action="delete">Delete</button>
        </div>`
})
    //edit or delete entry from json and website
})
bookContainer.addEventListener('click', (e) => {
    if (e.target.dataset.action === 'edit') {
        const editButton = document.querySelector(`#edit-${e.target.dataset.id}`)
        editButton.disabled = true
        const bookData = allBooks.find((book) => {
        return book.id == e.target.dataset.id
      })
       e.target.parentElement.innerHTML += `
      <div id='edit-book'>
        <form id="book-form">
          <input required id="edit-title" placeholder="${bookData.title}">
          <input required id="edit-author" placeholder="${bookData.author}">
          <input required id="edit-coverImage" placeholder="${bookData.coverImage}">
          <input required id="edit-description" placeholder="${bookData.description}">
          <input type="submit" value="Edit Book">
      </div>`
      console.log(bookData)
      console.log('you pressed edit')
      bookContainer.addEventListener("submit", (e) => {
          e.preventDefault()
        const titleInput = document.querySelector("#edit-title").value
        const authorInput = document.querySelector("#edit-author").value
        const coverImageInput = document.querySelector("#edit-coverImage").value
        const descInput = document.querySelector("#edit-description").value
        const editedBook = document.querySelector(`#book-${bookData.id}`)

  fetch(`${bookURL}/${bookData.id}`, {
            method: 'PATCH',
            body: JSON.stringify({
              title: titleInput,
              author: authorInput,
              coverImage: coverImageInput,
              description: descInput
            }),
            headers: {
              'Content-Type': 'application/json'
            }
          }).then( response => response.json() 
        ).then( book => {
            editedBook.innerHTML = `
            <div id=book-${book.id}>
              <h2>${book.title}</h2>
              <h4>Author: ${book.author}</h4>
              <img src="${book.coverImage}" width="333" height="500">
              <p>${book.description}</p>
              <button data-id=${book.id} id="edit-${book.id}" data-action="edit">Edit</button>
              <button data-id=${book.id} id="delete-${book.id}" data-action="delete">Delete</button>
            </div>
            <div id=edit-book-${book.id}>
            </div>`
            editedBook.innerHTML = " "
          })
      })
    } else if (e.target.dataset.action === 'delete') {
      console.log('you pressed delete')
      //document.querySelector(`#book-${e.target.dataset.id}`).remove()
      fetch(`${bookURL}/${e.target.dataset.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        }).then( response => response.json())

    }
    
  })
 
})