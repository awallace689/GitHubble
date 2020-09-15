var fetch = require('node-fetch')
var queryCache = require('../services/CacheService.js')
var moment = require('moment');

/**
 * Send a request to GitHub GraphQL API v4.
 * 
 * @param {string} query: GraphQL query string.
 * @param {bool} enableCache=true: Should requests' response be cached?
 * @param {number} cacheTimeout=60: Time in minutes before invalidating cached item.
 */
async function ggqlRequest(query, token, enableCache = true, cacheTimeout = 60) {
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

  if (query == undefined) {
    throw TypeError("'query' is undefined.");
  }

  if (token == undefined) {
    throw TypeError("'token' is undefined.")
  }

  let cached = cache.hasOwnProperty(query)
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
    console.log(resp['errors']);
    throw new Error("Error parsing GraphQL query.");
  }
};


// QUERIES


const DatabasePopulateQuery = function (username) {
  const query = `
    query {
      user(login: "${username}") {
        avatarUrl
        bio
        followers(last: 1) {
          totalCount
        }
        following(last: 1) {
          totalCount
        }
        login
        name
        pullRequests(last: 1) {
          totalCount
        }
        repositories(last: 30) {
          ...repoInfoFragment
          totalCount
        }
        repositoriesContributedTo(last: 1) {
          totalCount
        }
        url
        watching(last: 1) {
          totalCount
        }
      }
    }

    ${repoInfoFragment}
  `;

  return query;
}


const InfoPanel = function (login = undefined) {
  const query = `
    query { 
      user(login: "${login}") {
        avatarUrl
        bio
        followers(last: 1) {
          totalCount
        }
        following(last: 1) {
          totalCount
        }
        login
        name
        pullRequests(last: 1) {
          totalCount
        }
        repositories(last: 30) {
          ...repoInfoFragment
          totalCount
        }
        repositoriesContributedTo(last: 1) {
          totalCount
        }
        url
        watching(last: 1) {
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

    ${repoInfoFragment}
  `;

  return query;
};

const LoginQuery = `
  query { 
    viewer { 
      login
    }
  }
`;


// END QUERIES


// FRAGMENTS


// Deps: None
const commitInfoFragment = `
  fragment branchCommitInfoFragment on Commit {
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
`;


const repoInfoFragment = `
  fragment repoInfoFragment on RepositoryConnection {
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
        ...branchCommitInfoFragment
      }
      pushedAt
      url
    }
  }

  ${commitInfoFragment}
`;


// END FRAGMENTS


const Queries = {
  databasePopulateQuery: DatabasePopulateQuery,
  infoPanel: InfoPanel,
  loginQuery: LoginQuery,
};


module.exports = {
  Queries,
  ggqlRequest
};