var express = require('express');
var catchError = require('http-errors');
var router = express.Router();
const cors = require('cors');


var rp = require('request-promise');
var config = require('../config.mjs');

router.get('/', function(req, res) {
  res.status(200).send(
    "Routes: <ul>\
    <li>/profile/:uid&nbsp&nbsp::&nbsp&nbspget GitHub profile with identifier 'uid'</li>\
    </ul>"
  );
})

router.get('/profile/:uid', cors(config.corsOptions), function(req, res, next) {
  const options = {
    url: 'https://api.github.com/users/' + req.params["uid"],
    headers: {
      'User-Agent': 'request'
    }
  }

  rp(options)
    .then( resp => res.status(200).json(JSON.parse(resp)))
    .catch( () => next(catchError(500, `Request failed at ${options.url}.`)));
});

module.exports = router;
