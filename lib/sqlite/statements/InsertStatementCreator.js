"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _SqliteUtils = _interopRequireDefault(require("../utils/SqliteUtils"));

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
      return _SqliteUtils.default.escapeName(key);
    });
    const placeHolderArray = new Array(keys.length).fill("?").join(", ");
    return {
      sql: `INSERT INTO ${_SqliteUtils.default.escapeName(this.tableName)} ( ${escapedKeys.join(", ")} ) VALUES ( ${placeHolderArray} )`,
      values: values
    };
  }

}

exports.default = InsertStatementCreator;
//# sourceMappingURL=InsertStatementCreator.js.map