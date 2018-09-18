'use strict';

const Hapi = require('hapi');
const AuthBearer = require('hapi-auth-bearer-token');

const db = require('./db');
const validateFunc = require('./auth').api;

const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});

const init = async () => {

    server.bind({ db : db });

    await server.register(AuthBearer)
    
    server.auth.strategy('simple', 'bearer-access-token', {
        allowQueryToken: true,              // optional, false by default
        validate: validateFunc,
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