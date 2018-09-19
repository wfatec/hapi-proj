exports.static = function(request, h){

    let path = 'public/index.html';

    return h.file(path);
}