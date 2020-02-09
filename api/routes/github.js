var express = require('express');
var catchError = require('http-errors');
var router = express.Router();

var rp = require('request-promise');

/* GET home page. */
router.get('/', function(req, res, next) {
  const options = {
    url: 'https://api.github.com/users/awallace689',
    headers: {
      'User-Agent': 'request'
    }
  }

  rp(options)
    .then( resp => res.status(200).json(JSON.parse(resp)))
    .catch( () => next(catchError(500, `Request failed at ${options.url}.`)));
});

module.exports = router;
