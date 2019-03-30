"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _PostgreSQLUtils = _interopRequireDefault(require("../utils/PostgreSQLUtils"));

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

    const tokens = keys.reduce((accumulator, key, index) => {
      if (this.primaryKeys.includes(key)) {
        return accumulator;
      }

      accumulator.placeHolderValues.push(`${_PostgreSQLUtils.default.escapeName(key)} = $${index}`);
      accumulator.values.push(entity[key]);
      return accumulator;
    }, {
      placeHolderValues: [],
      values: []
    });
    const whereStatement = this.createWhereExpression();
    return {
      sql: `UPDATE ${_PostgreSQLUtils.default.escapeName(this.tableName)} SET ${tokens.placeHolderValues.join(", ")} ${whereStatement}`,
      values: tokens.values
    };
  }

}

exports.default = UpdateStatementCreator;
//# sourceMappingURL=UpdateStatementCreator.js.map