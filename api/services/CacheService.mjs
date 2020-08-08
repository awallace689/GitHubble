var moment = require('moment');


let instance = null

class Insert
{
  constructor(data) {
    this.data = data;
    this.timestamp = moment();
  }
}

// Singleton implementation from:
// https://blog.logrocket.com/design-patterns-in-node-js/
class Cache {

    constructor() {
     this.table = {};
    }

    static getInstance() {
     if(!instance) {
         instance = new Cache();
     }

     return instance;
    }
}

module.exports = { Cache, Insert };