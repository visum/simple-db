"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _SqlVisitor = _interopRequireDefault(require("../visitors/SqlVisitor"));

var _SqliteUtils = _interopRequireDefault(require("../utils/SqliteUtils"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class SelectStatementCreator {
  constructor(queryable) {
    if (queryable == null) {
      throw new Error("Null Exception: A queryable is needed to create statement.");
    }

    this.queryable = queryable;
  }

  static createStatement(queryable) {
    const selectStatementCreator = new SelectStatementCreator(queryable);
    return selectStatementCreator.createStatement();
  }

  getTableName() {
    return _SqliteUtils.default.escapeName(this.queryable.query.type);
  }

  removeNullOrEmptyStrings(expression) {
    return expression.filter(part => {
      return typeof part === "string" && part.length > 0;
    });
  }

  createWhereExpression() {
    const visitor = new _SqlVisitor.default();
    return visitor.createWhereExpression(this.queryable.query.expression);
  }

  createSelectSql() {
    const select = this.queryable.query.select;
    let columns = Object.keys(select).map(key => {
      return `${key} AS ${select[key]}`;
    });

    if (columns.length === 0) {
      columns = ["*"];
    }

    return `SELECT ${columns.join(", ")} FROM ${this.getTableName()}`;
  }

  createOrderBySql() {
    if (this.queryable.query.orderBy.length === 0) {
      return "";
    }

    const series = this.queryable.query.orderBy.map(orderBy => {
      return `${_SqliteUtils.default.escapeName(orderBy.column)} ${orderBy.type}`;
    }).join(", ");
    return `ORDER BY ${series}`;
  }

  createLimitAndOffsetSql() {
    let limit = this.queryable.query.limit;
    let offset = this.queryable.query.offset;
    return `LIMIT ${limit} OFFSET ${offset}`;
  }

  createStatement() {
    const selectSql = this.createSelectSql();
    const whereSql = this.createWhereExpression();
    const orderBySql = this.createOrderBySql();
    const limitAndOffsetSql = this.createLimitAndOffsetSql();
    const expression = [];
    expression.push(selectSql);

    if (whereSql != "") {
      expression.push(whereSql);
    }

    if (orderBySql != "") {
      expression.push(orderBySql);
    }

    if (limitAndOffsetSql != "") {
      expression.push(limitAndOffsetSql);
    }

    const cleanedExpression = this.removeNullOrEmptyStrings(expression);
    return {
      sql: cleanedExpression.join(" "),
      values: []
    };
  }

}

exports.default = SelectStatementCreator;
//# sourceMappingURL=SelectStatementCreator.js.map