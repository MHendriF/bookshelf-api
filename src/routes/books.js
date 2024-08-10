const booksHandler = require('../handlers/books');
const booksValidator = require('../validators/books');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: booksHandler.addBook,
    options: {
      validate: booksValidator.addBook,
    },
  },
  {
    method: 'GET',
    path: '/books',
    handler: booksHandler.getAllBooks,
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: booksHandler.getBookById,
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: booksHandler.updateBook,
    options: {
      validate: booksValidator.updateBook,
    },
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: booksHandler.deleteBook,
  },
];

module.exports = routes;
