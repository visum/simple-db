"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _SqlVisitor = _interopRequireDefault(require("../visitors/SqlVisitor"));

var _PostgreSQLUtils = _interopRequireDefault(require("../utils/PostgreSQLUtils"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class DeleteWhereStatementCreator {
  constructor(queryable) {
    if (queryable == null) {
      throw new Error("Null Exception: A queryable is needed to create statement.");
    }

    this.queryable = queryable;
  }

  static createStatement(queryable) {
    const deleteWhereStatementCreator = new DeleteWhereStatementCreator(queryable);
    return deleteWhereStatementCreator.createStatement();
  }

  getTableName() {
    return _PostgreSQLUtils.default.escapeName(this.queryable.query.type);
  }

  createDeleteSql() {
    return `DELETE FROM ${this.getTableName()}`;
  }

  createWhereSql() {
    const visitor = new _SqlVisitor.default();
    return visitor.createWhereExpression(this.queryable.query.expression);
  }

  createStatement() {
    const deleteSql = this.createDeleteSql();
    const whereSql = this.createWhereSql();
    let sql = deleteSql;

    if (whereSql != "") {
      sql = `${sql} ${whereSql}`;
    }

    return {
      sql,
      values: []
    };
  }

}

exports.default = DeleteWhereStatementCreator;
//# sourceMappingURL=DeleteWhereStatementCreator.js.map