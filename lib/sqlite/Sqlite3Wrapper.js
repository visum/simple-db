"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class Sqlite3Wrapper {
  constructor(database) {
    this.database = database;
  }

  async runAsync(sql, values = []) {
    return await new Promise((resolve, reject) => {
      return this.database.run(sql, values, function (error) {
        if (error != null) {
          reject(error);
        } else {
          resolve(this);
        }
      });
    });
  }

  async allAsync(sql, values = []) {
    return await new Promise((resolve, reject) => {
      return this.database.all(sql, values, (error, result) => {
        if (error != null) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }

}

exports.default = Sqlite3Wrapper;
//# sourceMappingURL=Sqlite3Wrapper.js.map