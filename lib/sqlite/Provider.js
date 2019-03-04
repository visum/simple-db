"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _SelectStatementCreator = _interopRequireDefault(require("./statements/SelectStatementCreator"));

var _Sqlite3Wrapper = _interopRequireDefault(require("./Sqlite3Wrapper"));

var _CountStatementCreator = _interopRequireDefault(require("./statements/CountStatementCreator"));

var _DeleteWhereStatementCreator = _interopRequireDefault(require("./statements/DeleteWhereStatementCreator"));

var _UpdateWhereStatementCreator = _interopRequireDefault(require("./statements/UpdateWhereStatementCreator"));

var _Queryable = _interopRequireDefault(require("../../lib/queryable/Queryable"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const defaultRefineQueryable = queryable => queryable;

class Provider {
  constructor({
    database,
    refineQueryable
  }) {
    if (database == null) {
      throw new Error("Null Exception: database cannot be null.");
    }

    if (typeof refineQueryable !== "function") {
      refineQueryable = defaultRefineQueryable;
    }

    this.database = database;
    this.sqliteDatabaseWrapper = new _Sqlite3Wrapper.default(this.database);
    this.refineQueryable = refineQueryable;
  }

  _safelyRefineQueryable(queryable) {
    try {
      const alteredQueryable = this.refineQueryable(queryable);

      if (!(alteredQueryable instanceof _Queryable.default)) {
        throw new Error("Expected to have a queryable returned on refine Queryable.");
      }

      return alteredQueryable;
    } catch (error) {
      throw error;
    }
  }

  async toArrayAsync(queryable) {
    queryable = this._safelyRefineQueryable(queryable);

    const {
      sql
    } = _SelectStatementCreator.default.createStatement(queryable);

    return await this.sqliteDatabaseWrapper.allAsync(sql);
  }

  async getFirstAsync(queryable) {
    const results = await this.toArrayAsync(queryable);
    return results[0] || null;
  }

  async getCountAsync(queryable) {
    queryable = this._safelyRefineQueryable(queryable);

    const {
      sql
    } = _CountStatementCreator.default.createStatement(queryable);

    const results = await this.sqliteDatabaseWrapper.allAsync(sql);
    return results[0]["count(*)"];
  }

  getSqlAndValues(queryable) {
    queryable = this._safelyRefineQueryable(queryable);
    return _SelectStatementCreator.default.createStatement(queryable);
  }

  async removeAsync(queryable) {
    queryable = this._safelyRefineQueryable(queryable);

    const {
      sql
    } = _DeleteWhereStatementCreator.default.createStatement(queryable);

    return await this.sqliteDatabaseWrapper.allAsync(sql);
  }

  async updateAsync(queryable, updates) {
    queryable = this._safelyRefineQueryable(queryable);

    const {
      sql,
      values
    } = _UpdateWhereStatementCreator.default.createStatement(queryable, updates);

    return await this.sqliteDatabaseWrapper.runAsync(sql, values);
  }

}

exports.default = Provider;
//# sourceMappingURL=Provider.js.map