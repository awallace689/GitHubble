var express = require('express');
var cors = require('cors');
var environment = require('../environment.mjs');
var catchError = require('http-errors');
var rp = require('request-promise');
var lookup = require('../services/userLookupService.mjs');
var mongo = require('../services/mongoService.mjs');
var moment = require('moment');


var router = express.Router();

router.get('/', function (req, res) {
  res.status(200).send(
    "Routes: <ul>\
    <li>/profile/:uid&nbsp&nbsp::&nbsp&nbspgetGitHub profile with identifier 'uid'</li>\
    </ul>"
  );
})

router.get('/profile/:uid', cors(environment.corsOptions), function (req, res, next) {
  let uTable = lookup.UserLookupTable.getInstance().table;
  let uid = req.params["uid"];

  if (!uTable.hasOwnProperty(uid)
    || uTable[uid].timestamp.diff(moment(), 'minutes') > 60) {
    const options = {
      url: 'https://api.github.com/users/' + req.params["uid"],
      headers: {
        'User-Agent': 'placeholder'
      }
    };

    rp(options)
      .then(resp => {
        let jsonResponse = JSON.parse(resp);
        uTable[uid] = new lookup.UserInfo(jsonResponse);
        res.status(200).json(jsonResponse);
      })
      .catch(() => next(catchError(500, `Request failed at ${options.url}.`)));
  }
  else {
    res.status(200).json(uTable[uid].data);
  }
});

router.post('/populate', cors(environment.corsOptions), function (req, res, next) {
  const rateOptions = {
    url: 'https://api.github.com/rate_limit',
    headers: {
      'User-Agent': 'placeholder'
    }
  };

  const usersOptions = {
    url: 'https://api.github.com/users/' + req.params["uid"],
    headers: {
      'User-Agent': 'placeholder'
    }
  }

  mongo.getAll('Users', res);
});

module.exports = router;
