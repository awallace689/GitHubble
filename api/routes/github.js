var express = require('express');
var cors = require('cors');
var environment = require('../environment.mjs');
var catchError = require('http-errors');

var rp = require('request-promise');


var router = express.Router();

router.get('/', function(req, res) {
  res.status(200).send(
    "Routes: <ul>\
    <li>/profile/:uid&nbsp&nbsp::&nbsp&nbspgetGitHub profile with identifier 'uid'</li>\
    </ul>"
  );
})

router.get('/profile/:uid', cors(environment.corsOptions), function(req, res, next) {
  const options = {
    url: 'https://api.github.com/users/' + req.params["uid"],
    headers: {
      'User-Agent': 'placeholder'
    }
  }

  rp(options)
    .then( resp => res.status(200).json(JSON.parse(resp)))
    .catch( () => next(catchError(500, `Request failed at ${options.url}.`)));
});

module.exports = router;
