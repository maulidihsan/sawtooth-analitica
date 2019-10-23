const dotenv = require('dotenv');
const httpserver = require('./framework/server/http');
const db = require('./framework/database/rethink');

dotenv.config();
const start = async () => {
    let dbInstance = null;
    try {
        dbInstance = await db(process.env.DB_HOST, process.env.DB_PORT, process.env.DB_USER, process.env.DB_PWD, process.env.DB_NAME);
    } catch (err) {
        console.error(err)
        console.error('Unable to connect to db.')
    }
    try {
        const http = await httpserver(dbInstance)
        await http.listen(process.env.PORT)
        console.log('Started server on port ', process.env.PORT);
    } catch (err) {
        console.error(err)
        console.error('Unable to start server.')
        process.exit(1);
    }
};

start();