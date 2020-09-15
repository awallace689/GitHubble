var express = require('express');
var cors = require('cors');
var environment = require('../environment.js');
var catchError = require('http-errors');
var rp = require('request-promise');
var lookup = require('../services/CacheService.js');
var mongo = require('../services/mongoService.js');
var moment = require('moment');
var parseLink = require('parse-link-header');
var fetch = require('node-fetch');
var { Queries, ggqlRequest } = require('../services/githubGraphql.js');
var { client_id, client_secret, githubToken } = require('../secrets.js');


var router = express.Router();


router.get('/', function (req, res) {
  res.status(200).send(
    "Routes: <ul>\
    <li>/profile/:uid&nbsp&nbsp::&nbsp&nbspget GitHub profile with identifier 'uid'</li>\
    </ul>"
  );
});


router.post('/github/user', cors(environment.corsOptions), async function (req, res, next) {
  try {
    const token = req.body.token;
    
    let respJson = await ggqlRequest(Queries.loginQuery, token);
    res.status(200).json(respJson);
  }
  catch (err) {
    res.status(500).send(err.message);
  }
});


router.post('/github/infopanel/:uid', cors(environment.corsOptions), async function (req, res, next) {
  try {
    const token = req.body.token;

    let respJson = await ggqlRequest(Queries.infoPanel(login = req.params["uid"]), token);
    res.status(200).json(respJson);
  }
  catch (err) {
    res.status(500).send(err.message);
  }
});


router.post('/github/:code', cors(environment.corsOptions), async function (req, res, next) {
  const tokenCode = req.params['code'];
  try {
    let result = await fetch(
      `https://github.com/login/oauth/access_token?client_id=${client_id}&client_secret=${client_secret}&code=${tokenCode}`,
      { method: 'POST' }
    );

    let body = await result.text();
    let access_token_var = body.split('&')[0];
    let token = access_token_var.split('=')[1];
    res.status(200).send(token);
  }
  catch (err) {
    res.status(400).send(err.message);
  }
});


router.get('/Users', cors(environment.corsOptions), async function (req, res, next) {
  try {
    result = await mongo.getAll('UsersGQL');
    res.status(200).json(result);
  }
  catch (err) {
    res.status(500).send(err);
  }
});


router.post('/transform', cors(environment.corsOptions), async function (req, res, next) {
  let gqlUsersList = [];
  let usersList = await mongo.getAll('Users');
  console.log(usersList.length)
  let i = 0;
  while (i < usersList.length) {
    let gqlUser;
    try {
      gqlUser = await ggqlRequest(Queries.infoPanel(usersList[i].login), githubToken);
      if (i == 869) {
        console.log(gqlUser.data.user)
      }
      gqlUsersList.push(gqlUser.data.user);
      console.log(i, gqlUser.data.user.login);
    }
    catch (error) {
      console.log(error)
    }
    i++;
  }

  await mongo.insertMany('UsersGQL', gqlUsersList);
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
