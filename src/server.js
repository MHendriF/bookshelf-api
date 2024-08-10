const Hapi = require('@hapi/hapi');
const { nanoid } = require('nanoid');
const books = require('./books');

const init = async () => {
  const server = Hapi.server({
    port: 9000,
    host: 'localhost',
  });

  // Kriteria 4: Menampilkan Seluruh Buku dengan Query Parameters
  server.route({
    method: 'GET',
    path: '/books',
    handler: (request, h) => {
      const { name, reading, finished } = request.query;

      let filteredBooks = books;

      if (name) {
        const searchName = name.toLowerCase();
        filteredBooks = filteredBooks.filter((book) =>
          book.name.toLowerCase().includes(searchName)
        );
      }

      if (reading !== undefined) {
        const isReading = reading === '1';
        filteredBooks = filteredBooks.filter(
          (book) => book.reading === isReading
        );
      }

      if (finished !== undefined) {
        const isFinished = finished === '1';
        filteredBooks = filteredBooks.filter(
          (book) => book.finished === isFinished
        );
      }

      return h
        .response({
          status: 'success',
          data: {
            books: filteredBooks.map((book) => ({
              id: book.id,
              name: book.name,
              publisher: book.publisher,
            })),
          },
        })
        .code(200);
    },
  });

  // Kriteria 3: Menyimpan Buku
  server.route({
    method: 'POST',
    path: '/books',
    handler: (request, h) => {
      const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
      } = request.payload;

      if (!name) {
        return h
          .response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
          })
          .code(400);
      }

      if (readPage > pageCount) {
        return h
          .response({
            status: 'fail',
            message:
              'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
          })
          .code(400);
      }

      const id = nanoid(16);
      const insertedAt = new Date().toISOString();
      const updatedAt = insertedAt;
      const finished = pageCount === readPage;

      const newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt,
      };

      books.push(newBook);

      const isSuccess = books.filter((book) => book.id === id).length > 0;

      if (isSuccess) {
        return h
          .response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
              bookId: id,
            },
          })
          .code(201);
      }

      return h
        .response({
          status: 'error',
          message: 'Buku gagal ditambahkan',
        })
        .code(500);
    },
  });

  // Kriteria 5: Menampilkan Detail Buku
  server.route({
    method: 'GET',
    path: '/books/{bookId}',
    handler: (request, h) => {
      const { bookId } = request.params;
      const book = books.filter((b) => b.id === bookId)[0];

      if (book) {
        return h
          .response({
            status: 'success',
            data: {
              book,
            },
          })
          .code(200);
      }

      return h
        .response({
          status: 'fail',
          message: 'Buku tidak ditemukan',
        })
        .code(404);
    },
  });

  // Kriteria 6: Mengubah Data Buku
  server.route({
    method: 'PUT',
    path: '/books/{bookId}',
    handler: (request, h) => {
      const { bookId } = request.params;
      const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
      } = request.payload;

      if (!name) {
        return h
          .response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
          })
          .code(400);
      }

      if (readPage > pageCount) {
        return h
          .response({
            status: 'fail',
            message:
              'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
          })
          .code(400);
      }

      const updatedAt = new Date().toISOString();
      const index = books.findIndex((book) => book.id === bookId);

      if (index !== -1) {
        books[index] = {
          ...books[index],
          name,
          year,
          author,
          summary,
          publisher,
          pageCount,
          readPage,
          reading,
          updatedAt,
        };

        return h
          .response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
          })
          .code(200);
      }

      return h
        .response({
          status: 'fail',
          message: 'Gagal memperbarui buku. Id tidak ditemukan',
        })
        .code(404);
    },
  });

  // Kriteria 7: Menghapus Buku
  server.route({
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: (request, h) => {
      const { bookId } = request.params;
      const index = books.findIndex((book) => book.id === bookId);

      if (index !== -1) {
        books.splice(index, 1);
        return h
          .response({
            status: 'success',
            message: 'Buku berhasil dihapus',
          })
          .code(200);
      }

      return h
        .response({
          status: 'fail',
          message: 'Buku gagal dihapus. Id tidak ditemukan',
        })
        .code(404);
    },
  });

  await server.start();
  console.log('Server berjalan pada %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
