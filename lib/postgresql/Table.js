"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Provider = _interopRequireDefault(require("./Provider"));

var _Queryable = _interopRequireDefault(require("../queryable/Queryable"));

var _PgWrapper = _interopRequireDefault(require("./PgWrapper"));

var _InsertStatementCreator = _interopRequireDefault(require("./statements/InsertStatementCreator"));

var _UpdateStatementCreator = _interopRequireDefault(require("./statements/UpdateStatementCreator"));

var _DeleteStatementCreator = _interopRequireDefault(require("./statements/DeleteStatementCreator"));

var _SchemaUtils = _interopRequireDefault(require("./utils/SchemaUtils"));

var _invokeMethodAsync = _interopRequireDefault(require("./utils/invokeMethodAsync"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Table {
  constructor({
    database,
    schema,
    lifeCycleDelegate
  }) {
    if (lifeCycleDelegate == null || typeof lifeCycleDelegate !== "object") {
      lifeCycleDelegate = {};
    }

    this.name = _SchemaUtils.default.getTableNameFromSchema(schema);
    this.database = database;
    this.pgDatabaseWrapper = new _PgWrapper.default(this.database);
    this.primaryKeys = schema.primaryKeys;
    this.lifeCycleDelegate = lifeCycleDelegate;
  }

  async addAsync(entity) {
    await (0, _invokeMethodAsync.default)(this.lifeCycleDelegate, "canEntityBeAddedAsync", [entity], true);
    const alteredEntity = await (0, _invokeMethodAsync.default)(this.lifeCycleDelegate, "prepareEntityToBeAddedAsync", [entity], entity);

    const {
      sql,
      values
    } = _InsertStatementCreator.default.createStatement({
      tableName: this.name,
      entity: alteredEntity,
      primaryKeys: this.primaryKeys
    });

    const result = await this.pgDatabaseWrapper.runAsync(sql, values);
    const inserted = result.rows[0];
    return await (0, _invokeMethodAsync.default)(this.lifeCycleDelegate, "entityAddedAsync", [alteredEntity, inserted], inserted);
  }

  async removeAsync(entity) {
    await (0, _invokeMethodAsync.default)(this.lifeCycleDelegate, "canEntityBeRemovedAsync", [entity], true);
    const alteredEntity = await (0, _invokeMethodAsync.default)(this.lifeCycleDelegate, "prepareEntityToBeRemovedAsync", [entity], entity);

    const {
      sql,
      values
    } = _DeleteStatementCreator.default.createStatement({
      tableName: this.name,
      entity: alteredEntity,
      primaryKeys: this.primaryKeys
    });

    const result = await this.pgDatabaseWrapper.runAsync(sql, values);
    return (0, _invokeMethodAsync.default)(this.lifeCycleDelegate, "entityRemovedAsync", [alteredEntity, result], result);
  }

  async updateAsync(entity) {
    await (0, _invokeMethodAsync.default)(this.lifeCycleDelegate, "canEntityBeUpdatedAsync", [entity], true);
    const alteredEntity = await (0, _invokeMethodAsync.default)(this.lifeCycleDelegate, "prepareEntityToBeUpdatedAsync", [entity], entity);

    const {
      sql,
      values
    } = _UpdateStatementCreator.default.createStatement({
      tableName: this.name,
      entity: alteredEntity,
      primaryKeys: this.primaryKeys
    });

    const result = await this.pgDatabaseWrapper.runAsync(sql, values);
    return await (0, _invokeMethodAsync.default)(this.lifeCycleDelegate, "entityUpdatedAsync", [alteredEntity, result], result);
  }

  getQueryProvider() {
    return new _Provider.default({
      database: this.database,
      lifeCycleDelegate: this.lifeCycleDelegate
    });
  }

  where() {
    const provider = this.getQueryProvider();
    return new _Queryable.default({
      query: {
        type: this.name,
        expression: null,
        select: {},
        limit: "ALL",
        offset: 0,
        orderBy: []
      },
      provider: provider
    });
  }

}

exports.default = Table;
//# sourceMappingURL=Table.js.map