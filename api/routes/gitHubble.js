var express = require('express');
var cors = require('cors');
var environment = require('../environment.mjs');
var catchError = require('http-errors');
var rp = require('request-promise');
var lookup = require('../services/userLookupService.mjs');
var mongo = require('../services/mongoService.mjs');
var moment = require('moment');
var parseLink = require('parse-link-header');


var router = express.Router();

router.get('/', function (req, res) {
  res.status(200).send(
    "Routes: <ul>\
    <li>/profile/:uid&nbsp&nbsp::&nbsp&nbspget GitHub profile with identifier 'uid'</li>\
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

router.get('/getUsers', cors(environment.corsOptions), function (req, res, next) {
  mongo.getAll('Users')
    .then(result => res.status(200).json(result))
    .catch(err => res.status(500).send(err));
});

router.post('/populate/:id', cors(environment.corsOptions), async function (req, res, next) {
  async function usersRequest(options) {
    let response = await rp(options);
    return {
      link: parseLink(response.headers.link),
      body: JSON.parse(response.body)
    };
  };
  const allUsersOptions = {
    url: 'https://api.github.com/users',
    headers: {
      'User-Agent': 'placeholder'
    },
    qs: {
      'since': req.params['id']
    },
    resolveWithFullResponse: true
  };
  let resp = null;

  try {
    if (!resp) {
      resp = await rateLimitGuard(allUsersOptions, res, usersRequest);
      // allUsersOptions.qs.since = resp.link.next.since;
      // mongo.insertMany('Users', resp.body);
    }
    res.status(200).send(resp);
  }
  catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

async function rateLimitGuard(options, res, func = undefined, notify=false) {
  const rateOptions = {
    url: 'https://api.github.com/rate_limit',
    headers: {
      'User-Agent': 'placeholder'
    },
  };
  let remaining = null;
  let resp = await rp(rateOptions);

  remaining = JSON.parse(resp).resources.core.remaining;
  console.log("Remaining: ", remaining - 1);
  if (remaining > 0) {
    if (func) {
      return await func(options);
    }
    else {
      return await rp(options);
    }
  }
  else {
    if (notify) {
      res.status(403).json({ message: "Rate limit exceeded." });
    }
  }
}

module.exports = router;
