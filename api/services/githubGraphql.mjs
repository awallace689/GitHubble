var token = require('../secrets.mjs').githubToken
var fetch = require('node-fetch')
var CacheService = require('../services/CacheService.mjs')
var moment = require('moment');

/**
 * Send a request to GitHub GraphQL API v4.
 * @async

 * @param {string} query: GraphQL query string or function returning query string.
 * @param {bool} cacheRequest : Should requests' response be cached?
 * @param {number} cacheTimeout=60: Time in minutes before invalidating cached item.
 * @param {any[]} params: parameters to apply to 'query' function.
 */
async function ggqlRequest(query, cacheRequest, cacheTimeout=60, ...params) {
  let cache = CacheService.Cache.getInstance()
  if (query === undefined) {
    throw TypeError("'query' is undefined.");
  }

  let finalQuery;
  if (params) {
    finalQuery = query(...params);
  }
  else {
    finalQuery = query;
  }

  const gitHubGraphqlOptions = {
    method: 'POST',
    headers: {
      'User-Agent': 'GitHubble',
      'Content-Type': 'application/json',
      'Authorization': `bearer ${token}`
    },
    body: JSON.stringify({ "query": finalQuery })
  };

  let cached = cacheRequest 
    && cache.hasOwnProperty(finalQuery) 
    && cache[finalQuery].cache_timestamp.diff(moment(), 'minutes') < cacheTimeout

  if (cacheRequest && cached) {
    return cache[finalQuery];
  }

  let resp = await fetch('https://api.github.com/graphql', gitHubGraphqlOptions);
  resp = await resp.json();

  if (!resp["errors"]) {
    if (cacheRequest) {
      resp["cache_timestamp"] = moment();
      cache[finalQuery] = resp;
    }

    return resp;
  }
  else {
    throw Error(JSON.stringify(resp));
  }
};


// QUERIES


const InfoPanel = function (login) {
  const query = `
    { 
      user(login: "${login}") {
        name
        login
      }
      rateLimit {
        limit
        cost
        remaining
        resetAt
      }
    }
  `;

  return query;
};


// END QUERIES


const Queries = {
  infoPanel: InfoPanel,
};


module.exports = {
  Queries,
  ggqlRequest
};