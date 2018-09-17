'use strict';

const Hapi = require('hapi');
const Sqlite3 = require('sqlite3');

const db = new Sqlite3.Database('./dindin.sqlite');

const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});

server.route([{
    method: 'GET',
    path: '/api/recipes',
    handler: function (request, h) {

        db.all('SELECT * FROM recipes', (err, results) => {

            if (err) {
                throw err;
            }

            return h.response(results);
        });
    }
}]);

const init = async () => {
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();