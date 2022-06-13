const mariadb = require('mariadb');

const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database:  process.env.DB_NAME,
  connectionLimit: 5
});

pool.getConnection((error, connection) =>
{
  if (error)
    return console.error(error);
  return connection.release();
});

pool.on('error', (error) =>
{
  console.log(error);
});

module.exports = pool