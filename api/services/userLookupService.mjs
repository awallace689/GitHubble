var moment = require('moment');


let instance = null

class UserInfo
{
  constructor(data) {
    this.data = data;
    this.timestamp = moment();
  }
}

// Singleton implementation from:
// https://blog.logrocket.com/design-patterns-in-node-js/
class UserLookupTable {

    constructor() {
     this.table = {};
    }

    static getInstance() {
     if(!instance) {
         instance = new UserLookupTable();
     }

     return instance;
    }
}

module.exports = { UserLookupTable, UserInfo };