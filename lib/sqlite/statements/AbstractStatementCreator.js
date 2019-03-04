"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _SqliteUtils = _interopRequireDefault(require("../utils/SqliteUtils"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class AbstractStatementCreator {
  constructor({
    entity,
    tableName,
    primaryKeys
  }) {
    this.entity = entity;
    this.tableName = tableName;
    this.primaryKeys = primaryKeys;
  }

  createWhereExpression() {
    const entity = this.entity;
    const columns = this.primaryKeys.map(key => {
      return `${_SqliteUtils.default.escapeName(key)} = ${_SqliteUtils.default.escapeValue(entity[key])}`;
    }).join(" AND ");
    return `WHERE ${columns}`;
  }

  validateEntityPrimaryKeys() {
    const entity = this.entity;

    if (this.primaryKeys.length === 1) {
      return entity[this.primaryKeys[0]] != null;
    } else if (this.primaryKeys.length > 1) {
      return this.primaryKeys.every(key => {
        return typeof entity[key] !== "undefined";
      });
    } else {
      return false;
    }
  }

}

exports.default = AbstractStatementCreator;
//# sourceMappingURL=AbstractStatementCreator.js.map