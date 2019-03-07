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

var _invokeMethodAsync = _interopRequireDefault(require("./utils/invokeMethodAsync"));

var _invokeMethod = _interopRequireDefault(require("./utils/invokeMethod"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Provider {
  constructor({
    database,
    lifeCycleDelegate
  }) {
    if (database == null) {
      throw new Error("Null Exception: database cannot be null.");
    }

    this.database = database;
    this.sqliteDatabaseWrapper = new _Sqlite3Wrapper.default(this.database);
    this.lifeCycleDelegate = lifeCycleDelegate;
  }

  async _prepareQueryable(queryable) {
    await (0, _invokeMethodAsync.default)(this.lifeCycleDelegate, "canQueryAsync", [queryable]);
    return this._safelyRefineQueryable(queryable);
  }

  _safelyRefineQueryable(queryable) {
    try {
      const alteredQueryable = (0, _invokeMethod.default)(this.lifeCycleDelegate, "refineQueryable", [queryable], queryable);

      if (!(alteredQueryable instanceof _Queryable.default)) {
        throw new Error("Expected to have a queryable returned on refine Queryable.");
      }

      return alteredQueryable;
    } catch (error) {
      throw error;
    }
  }

  async toArrayAsync(queryable) {
    queryable = await this._prepareQueryable(queryable);

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
    queryable = await this._prepareQueryable(queryable);

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
    await (0, _invokeMethodAsync.default)(this.lifeCycleDelegate, "canEntitiesBeRemovedAsync", [queryable]);
    queryable = await this._prepareQueryable(queryable);

    const {
      sql
    } = _DeleteWhereStatementCreator.default.createStatement(queryable);

    const result = await this.sqliteDatabaseWrapper.allAsync(sql);
    await (0, _invokeMethodAsync.default)(this.lifeCycleDelegate, "entitiesRemovedAsync", [queryable, result]);
    return result;
  }

  async updateAsync(queryable, updates) {
    await (0, _invokeMethodAsync.default)(this.lifeCycleDelegate, "canEntitiesBeUpdatedAsync", [queryable]);
    queryable = await this._prepareQueryable(queryable);

    const {
      sql,
      values
    } = _UpdateWhereStatementCreator.default.createStatement(queryable, updates);

    const result = await this.sqliteDatabaseWrapper.runAsync(sql, values);
    await (0, _invokeMethodAsync.default)(this.lifeCycleDelegate, "entitiesUpdatedAsync", [queryable, result]);
    return result;
  }

}

exports.default = Provider;
//# sourceMappingURL=Provider.js.map