"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _PostgreSQLUtils = _interopRequireDefault(require("../utils/PostgreSQLUtils"));

var _AbstractStatementCreator = _interopRequireDefault(require("./AbstractStatementCreator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class DeleteStatementCreator extends _AbstractStatementCreator.default {
  static createStatement(options) {
    const deleteStatementCreator = new DeleteStatementCreator(options);
    return deleteStatementCreator.createStatement();
  }

  createStatement() {
    const entity = this.entity;

    if (!this.validateEntityPrimaryKeys(entity)) {
      throw new Error("Cannot delete entity: Invalid primary key(s).");
    }

    const whereStatement = this.createWhereExpression(entity);
    return {
      sql: `DELETE FROM ${_PostgreSQLUtils.default.escapeName(this.tableName)} ${whereStatement}`,
      values: []
    };
  }

}

exports.default = DeleteStatementCreator;
//# sourceMappingURL=DeleteStatementCreator.js.map