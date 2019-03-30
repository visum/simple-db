"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _SqlVisitor = _interopRequireDefault(require("../visitors/SqlVisitor"));

var _PostgreSQLUtils = _interopRequireDefault(require("../utils/PostgreSQLUtils"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class CountStatementCreator {
  constructor(queryable) {
    if (queryable == null) {
      throw new Error("Null Exception: A queryable is needed to create statement.");
    }

    this.queryable = queryable;
  }

  static createStatement(queryable) {
    const countStatementCreator = new CountStatementCreator(queryable);
    return countStatementCreator.createStatement();
  }

  getTableName() {
    return _PostgreSQLUtils.default.escapeName(this.queryable.query.type);
  }

  removeNullOrEmptyStrings(expression) {
    return expression.filter(part => {
      return typeof part === "string" && part.length > 0;
    });
  }

  createWhereSql() {
    const visitor = new _SqlVisitor.default();
    return visitor.createWhereExpression(this.queryable.query.expression);
  }

  createSelectSql() {
    return `SELECT count(*) FROM ${this.getTableName()}`;
  }

  createStatement() {
    const selectSql = this.createSelectSql();
    const whereSql = this.createWhereSql();
    const expression = [];
    expression.push(selectSql);

    if (whereSql != "") {
      expression.push(whereSql);
    }

    const cleanedExpression = this.removeNullOrEmptyStrings(expression);
    return {
      sql: cleanedExpression.join(" "),
      values: []
    };
  }

}

exports.default = CountStatementCreator;
//# sourceMappingURL=CountStatementCreator.js.map