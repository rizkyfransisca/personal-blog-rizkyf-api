const Pool = require('pg').Pool

const pool = new Pool({
    user : "postgres",
    password : "rizkyroyal123",
    host : "localhost",
    port : 5432,
    database : "personalblog"
})

module.exports = pool