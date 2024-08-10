const Hapi = require('@hapi/hapi');
const booksRoutes = require('./routes/books');

const init = async () => {
  const server = Hapi.server({
    port: 9000,
    host: 'localhost',
  });

  server.route(booksRoutes);

  await server.start();
  console.log('Server berjalan pada %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
