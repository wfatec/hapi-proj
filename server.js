'use strict';

const Hapi = require('hapi');
const Sqlite3 = require('sqlite3');

const db = new Sqlite3.Database('./dindin.sqlite');

const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});

server.bind({ db : db });

server.route(require('./routes'));

const init = async () => {
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();