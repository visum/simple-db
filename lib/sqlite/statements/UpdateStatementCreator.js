"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _SqliteUtils = _interopRequireDefault(require("../utils/SqliteUtils"));

var _AbstractStatementCreator = _interopRequireDefault(require("./AbstractStatementCreator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class UpdateStatementCreator extends _AbstractStatementCreator.default {
  static createStatement(options) {
    const updateStatementCreator = new UpdateStatementCreator(options);
    return updateStatementCreator.createStatement();
  }

  createStatement() {
    const entity = this.entity;
    const keys = Object.keys(entity);

    if (!this.validateEntityPrimaryKeys()) {
      throw new Error("Cannot update entity: Invalid primary key(s).");
    }

    const sqliteData = keys.reduce((accumulator, key) => {
      if (this.primaryKeys.includes(key)) {
        return accumulator;
      }

      accumulator.placeHolderValues.push(`${_SqliteUtils.default.escapeName(key)} = ?`);
      accumulator.values.push(entity[key]);
      return accumulator;
    }, {
      placeHolderValues: [],
      values: []
    });
    const whereStatement = this.createWhereExpression();
    return {
      sql: `UPDATE ${_SqliteUtils.default.escapeName(this.tableName)} SET ${sqliteData.placeHolderValues.join(", ")} ${whereStatement}`,
      values: sqliteData.values
    };
  }

}

exports.default = UpdateStatementCreator;
//# sourceMappingURL=UpdateStatementCreator.js.map