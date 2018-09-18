exports.find = function(request, h){
    let sql = 'SELECT * FROM recipes';
    const params = [];

    if (request.query.cuisine) {
        sql += ' WHERE cuisine = ?';
        params.push(request.query.cuisine);
    }

    return new Promise((resolve)=>{
        this.db.all(
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

exports.findone = function(request, h){
    return new Promise((resolve)=>{
        this.db.get(
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

exports.create = function(request, h){
    return new Promise((resolve)=>{
        const sql = 'INSERT INTO recipes (name, cooking_time, prep_time, serves, cuisine, ingredients, directions, user_id) VALUES (?,?,?,?,?,?,?,?)';
        this.db.run(
            sql,
            [
                request.payload.name,
                request.payload.cooking_time,
                request.payload.prep_time,
                request.payload.serves,
                request.payload.cuisine,
                request.payload.ingredients,
                request.payload.derections,
                request.auth.artifacts.id,
            ],
            (err, results) => {

                if (err) {
                    throw err;
                }

                resolve({status: 'ok'});
            }
        );
    })
}