// Update with your config settings.
module.exports = {

  development: {
    client: 'mysql',
    connection: {
      host: '127.0.0.1',
      user: 'root',
      password: 'corea',
      database: 'osiris'
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: 'src/database/migrations',
    }
  },

  staging: {
    client: 'mysql',
    connection: {
      host: '127.0.0.1',
      user: 'root',
      password: 'corea',
      database: 'osiris'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: 'src/database/migrations',
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      host: '127.0.0.1',
      user: 'admin',
      password: 'admin',
      database: 'osiris'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: 'src/database/migrations',
    }
  }
};
