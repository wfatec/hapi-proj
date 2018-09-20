'use strict';

const Hapi = require('hapi');
const Inert = require('inert');
const Path = require('path');
const Vision = require('vision');
const Handlebars = require('handlebars');
const AuthBearer = require('hapi-auth-bearer-token');

const db = require('./db');
const validateFunc = require('./auth').api;

const server = Hapi.server({
    port: 3000,
    host: 'localhost',
});

const init = async () => {

    server.bind({ db : db });

    await server.register([Inert, AuthBearer, Vision]);

    server.views({
        engines: { 
            hbs: Handlebars
        },
        relativeTo: __dirname,  // 所有路径相对于执行脚本所在的根目录
        path: './views',
        layoutPath: './views/layout',  // 在此处查找布局
        layout: true, // 渲染视图时使用布局
        isCached: false,  // 不缓存视图，而是在每次使用时重新加载(建议只在开发模式下使用)
        partialsPath: './views/partials' // 在此处查找片段
    })
    
    server.auth.strategy('api', 'bearer-access-token', {
        allowQueryToken: true,              // optional, false by default
        validate: validateFunc,
    });

    // server.auth.default('api');

    server.route(require('./routes'));

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();