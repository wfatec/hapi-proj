const Sqlite3 = require('sqlite3');

exports.api = async (request, token, h) => {

    // here is where you validate your token
    // comparing with token from your database for example
    return new Promise((resolve)=>{
        const db = new Sqlite3.Database('./dindin.sqlite');
        db.get(
            'SELECT * FROM users WHERE token = ?',
            [token],
            (err, result) => {
                if (err) {
                    throw err;
                }
                resolve(result)
            }
        )
    })
    .then((user) => {
        if (typeof user === 'undefined') {
            return { isValid: false };
        } else {
            const isValid = true;
            
            const credentials = { token };
            const artifacts = { 
                id: user.id,
                username: user.username
            };
        
            return { isValid, credentials, artifacts };
        }
    })
}