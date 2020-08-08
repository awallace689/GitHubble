var express = require('express');
var cors = require('cors');
var environment = require('../environment.mjs');
var catchError = require('http-errors');
var rp = require('request-promise');
var lookup = require('../services/CacheService.mjs');
var mongo = require('../services/mongoService.mjs');
var moment = require('moment');
var parseLink = require('parse-link-header');
var { Queries, ggqlRequest } = require('../services/githubGraphql.mjs')

 
var router = express.Router();


router.get('/', function (req, res) {
  res.status(200).send(
    "Routes: <ul>\
    <li>/profile/:uid&nbsp&nbsp::&nbsp&nbspget GitHub profile with identifier 'uid'</li>\
    </ul>"
  );
})


router.get('/profile/:uid', cors(environment.corsOptions), function (req, res, next) {
  const uTable = lookup.Cache.getInstance().table;
  const uid = req.params["uid"];
  const cached = uTable.hasOwnProperty(uid) && uTable[uid].timestamp.diff(moment(), 'minutes') < 60;
  if (!cached) {
    const options = {
      url: 'https://api.github.com/users/' + req.params["uid"],
      headers: {
        'User-Agent': 'placeholder'
      }
    };

    request = () => {
      rp(options)
        .then(resp => {
          let jsonResponse = JSON.parse(resp);
          uTable[uid] = new lookup.Insert(jsonResponse);
          res.status(200).json(jsonResponse);
        })
        .catch(() => next(catchError(500, `Request failed at ${options.url}.`)));
    }
    rateLimitGuard(options, res, func = request);
  }
  else {
    res.status(200).json(uTable[uid].data);
  }
});


router.get('/infopanel/:uid', cors(environment.corsOptions), async function (req, res, next) {
  try {
    let respJson = await ggqlRequest(Queries.infoPanel(login=req.params["uid"]));
    res.status(200).json(respJson);
  }
  catch (err) {
    res.status(500).json(err.message);
  }
});


router.get('/Users', cors(environment.corsOptions), async function (req, res, next) {
  try {
    result = await mongo.getAll('Users');
    res.status(200).json(result);
  }
  catch (err) {
    res.status(500).send(err)
  }
});


router.post('/populate/:id', cors(environment.corsOptions), async function (req, res, next) {
  async function usersRequest(options) {
    let response = await rp(options);
    return {
      link: parseLink(response.headers.link),
      body: JSON.parse(response.body)
    };
  };

  let allUsersOptions = {
    url: 'https://api.github.com/users',
    headers: {
      'User-Agent': 'placeholder'
    },
    qs: {
      'since': req.params['id']
    },
    resolveWithFullResponse: true
  };

  try {
    let github_resp = await rateLimitGuard(allUsersOptions, res, func = usersRequest);
    let count = 1;
    while (github_resp.status != 429 && count < 30) {
      await mongo.insertMany('Users', github_resp.body);
      allUsersOptions.qs.since = parseInt(allUsersOptions.qs.since) + 30;
      github_resp = await rateLimitGuard(allUsersOptions, res, func = usersRequest);
      
      count++;
    }
  }
  catch (err) {
    res.status(500).send(err.message);
  }
  res.status(200).send();
});


async function rateLimitGuard(options, res, func = undefined) {
  const rateOptions = {
    url: 'https://api.github.com/rate_limit',
    headers: {
      'User-Agent': 'placeholder'
    },
  };

  let resp = await rp(rateOptions);
  let remaining = JSON.parse(resp).resources.core.remaining;
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
    res.status(429).json({ message: "GitHub API rate limit exceeded." });
  }
}

module.exports = router;
