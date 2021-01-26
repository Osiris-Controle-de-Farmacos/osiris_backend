// Update with your config settings.
module.exports = {

  development: {
    client: 'mysql',
    connection: {
      host: '127.0.0.1',
      user: 'admin',
      password: 'admin',
      database: 'osiris'
    }
  },

  staging: {
    client: 'mysql',
    connection: {
      host : '127.0.0.1',
      user : 'admin',
      password : 'admin',
      database : 'osiris'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
