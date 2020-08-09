var token = require('../secrets.mjs').githubToken
var fetch = require('node-fetch')
var queryCache = require('../services/CacheService.mjs')
var moment = require('moment');

/**
 * Send a request to GitHub GraphQL API v4.
 * @async

 * @param {string} query: GraphQL query string.
 * @param {bool} enableCache=true: Should requests' response be cached?
 * @param {number} cacheTimeout=60: Time in minutes before invalidating cached item.
 */
async function ggqlRequest(query, enableCache = true, cacheTimeout = 60) {
  const cache = queryCache.Cache.getInstance();
  const gitHubGraphqlOptions = {
    method: 'POST',
    headers: {
      'User-Agent': 'GitHubble',
      'Content-Type': 'application/json',
      'Authorization': `bearer ${token}`
    },
    body: JSON.stringify({ "query": query })
  };

  if (query === undefined) {
    throw TypeError("'query' is undefined.");
  }

  let cached = enableCache
    && cache.hasOwnProperty(query)
    && cache[query].cache_timestamp.diff(moment(), 'minutes') < cacheTimeout

  if (enableCache && cached) {
    return cache[query];
  }

  let resp = await fetch('https://api.github.com/graphql', gitHubGraphqlOptions);
  resp = await resp.json();

  if (!resp["errors"]) {
    if (enableCache) {
      resp["cache_timestamp"] = moment();
      cache[query] = resp;
    }

    return resp;
  }
  else {
    throw Error(JSON.stringify(resp));
  }
};


// QUERIES


const InfoPanel = function (login = undefined) {
  const query = `
    { 
      user(login: "${login}") {
        name
        login
        repositories(last: 30) {
          nodes {
            createdAt
            pushedAt
            description
            isEmpty
            openGraphImageUrl
            languages(last: 10) {
              nodes {
                name
                color
              }
            }
            name
            object(expression: "master") {
              ... on Commit {
                history(first: 3) {
                  totalCount
                  nodes {
                    abbreviatedOid
                    authoredDate
                    additions
                    author {
                      name
                    }
                    deletions
                    message
                  }
                }
              }
            }
            pushedAt
            url
          }
          totalCount
        }
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