const dotenv = require('dotenv');

// get config vars
dotenv.config();

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      port: 6432,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations',
    },
    pool: {
      min: 2, // Minimum number of connections in the pool
      max: 10, // Maximum number of connections in the pool
    },
  },
};
