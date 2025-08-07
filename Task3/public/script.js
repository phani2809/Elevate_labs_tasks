async function fetchBooks() {
    const res = await fetch('/books');
    const books = await res.json();
    const list = document.getElementById('book-list');
    list.innerHTML = '';
    books.forEach(book => {
        const div = document.createElement('div');
        div.className = 'book';
        div.innerHTML = `
            <strong>${book.title}</strong> by ${book.author}
            <button onclick="deleteBook(${book.id})">Delete</button>
            <button onclick="showUpdateForm(${book.id}, '${book.title}', '${book.author}')">Update</button>
        `;
        list.appendChild(div);
    });
}

document.getElementById('add-book-form').onsubmit = async function(e) {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    await fetch('/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, author })
    });
    this.reset();
    fetchBooks();
};

async function deleteBook(id) {
    await fetch(`/books/${id}`, { method: 'DELETE' });
    fetchBooks();
}

function showUpdateForm(id, currentTitle, currentAuthor) {
    const form = document.createElement('form');
    form.innerHTML = `
        <input type="text" id="update-title" value="${currentTitle}" required>
        <input type="text" id="update-author" value="${currentAuthor}" required>
        <button type="submit">Save</button>
    `;
    const bookDiv = event.target.parentElement;
    bookDiv.appendChild(form);

    form.onsubmit = async function(e) {
        e.preventDefault();
        const title = form.querySelector('#update-title').value;
        const author = form.querySelector('#update-author').value;
        await fetch(`/books/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, author })
        });
        fetchBooks();
    };
}

fetchBooks();