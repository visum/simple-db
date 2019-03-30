"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _PostgreSQLUtils = _interopRequireDefault(require("../utils/PostgreSQLUtils"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class InsertStatementCreator {
  constructor({
    entity,
    tableName,
    primaryKeys
  }) {
    this.entity = entity;
    this.tableName = tableName;
    this.primaryKeys = primaryKeys;
  }

  static createStatement(options) {
    const insertStatementCreator = new InsertStatementCreator(options);
    return insertStatementCreator.createStatement();
  }

  createStatement() {
    const entity = this.entity;
    const keys = Object.keys(entity);
    const values = keys.map(key => {
      return entity[key];
    });
    const escapedKeys = keys.map(key => {
      return _PostgreSQLUtils.default.escapeName(key);
    });
    const placeHolderArray = keys.map((item, index) => `$${index + 1}`).join(", ");
    return {
      sql: `INSERT INTO ${_PostgreSQLUtils.default.escapeName(this.tableName)} ( ${escapedKeys.join(", ")} ) VALUES ( ${placeHolderArray} ) RETURNING *`,
      values: values
    };
  }

}

exports.default = InsertStatementCreator;
//# sourceMappingURL=InsertStatementCreator.js.map