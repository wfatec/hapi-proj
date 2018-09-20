const Recipes = require('./handlers/recipes');
const Assets = require('./handlers/assets');

module.exports = [{
    method: 'GET',
    path: '/{param*}',
    handler: Assets.servePublicDirectory,
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
        auth: 'api'
    },
    handler: Recipes.create
}]