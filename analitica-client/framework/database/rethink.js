const r = require('rethinkdb');
const RethinkDB = require('../../interface_adapters/storage/RethinkDB');

const database = async (host, port=28015, user, password, db) => {
    const con = await r.connect({
        host: host,
        port: port,
        db: db,
        user: user,
        password: password
    });
    const storage = new RethinkDB(con, r);
    return storage
}

module.exports = database;