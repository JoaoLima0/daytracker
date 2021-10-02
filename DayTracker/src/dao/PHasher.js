const bcrypt = require('bcrypt');

class PHasher {

  static async hash(string){
    return await bcrypt.hash(string, 10);
  }

  static async compare(string, hashedstring){
    return await bcrypt.compare(string, hashedstring);
  }

}

module.exports = PHasher;
