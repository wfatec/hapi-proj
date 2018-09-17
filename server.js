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
        let sql = 'SELECT * FROM recipes';
        const params = [];

        if (request.query.cuisine) {
            sql += ' WHERE cuisine = ?';
            params.push(request.query.cuisine);
        }

        return new Promise((resolve)=>{
            db.all(
                sql,
                params,
                (err, results) => {  
                    if (err) {
                        throw err;
                    }
                    resolve(results)
                }
            );
        })
    }
},{
    method: 'GET',
    path: '/api/recipes/{id}',
    handler: function (request, h) {
        return new Promise((resolve)=>{
            db.get(
                'SELECT * FROM recipes WHERE id = ?',
                [request.params.id],
                (err, results) => {

                    if (err) {
                        throw err;
                    }

                    resolve(results);
                }
            );
        })
        .then((results) => {
            if (typeof results !== 'undefined') {
                return results;
            } else {
                return h.response('Not found!').code(404)
            }
        })
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