const { Pool } = require('pg');

// reads connection string from the DATABASE_URL environment variable.
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

module.exports = pool;