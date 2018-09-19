const Recipes = require('./handlers/recipes');
const Static = require('./handlers/static');

module.exports = [{
    method: 'GET',
    path: '/',
    handler: Static.static,
},{
    method: 'GET',
    path: '/api/recipes',
    handler: Recipes.find,
},{
    method: 'GET',
    path: '/api/recipes/{id}',
    handler: Recipes.findone,
},{
    method: 'POST',
    path: '/api/recipes',
    config: {
        auth: 'simple'
    },
    handler: Recipes.create
}]