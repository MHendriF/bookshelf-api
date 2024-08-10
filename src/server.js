const Hapi = require('@hapi/hapi');
const booksRoutes = require('./routes/books');

const init = async () => {
  const server = Hapi.server({
    port: 9000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  server.route(booksRoutes);

  await server.start();
};

process.on('unhandledRejection', () => {
  process.exit(1);
});

init();
