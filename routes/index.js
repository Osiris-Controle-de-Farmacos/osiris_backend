var express = require('express');
var router = express.Router();
var knex = require('../config/connection')

/* GET home page. */
router.get('/', async function(req, res, next) {
  const clients = await knex("pet").select("*");
  res.json(clients);
});

module.exports = router;