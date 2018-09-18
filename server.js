'use strict';

const Hapi = require('hapi');
const Sqlite3 = require('sqlite3');
const AuthBearer = require('hapi-auth-bearer-token');

const db = new Sqlite3.Database('./dindin.sqlite');

const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});

const init = async () => {

    server.bind({ db : db });

    await server.register(AuthBearer)
    
    server.auth.strategy('simple', 'bearer-access-token', {
        allowQueryToken: true,              // optional, false by default
        validate: async (request, token, h) => {

            // here is where you validate your token
            // comparing with token from your database for example
            const isValid = token === '1234';

            const credentials = { token };
            const artifacts = { test: 'info' };

            return { isValid, credentials, artifacts };
        }
    });

    server.auth.default('simple');

    
    
    server.route(require('./routes'));

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();