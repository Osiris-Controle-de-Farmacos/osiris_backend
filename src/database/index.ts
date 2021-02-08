import knex from 'knex';

const db = knex({
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    //user: 'admin',
    //password: 'admin',
    user: 'root',
    password: 'corea',
    database: 'osiris'
  }
});

export default db;