"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _SqlVisitor = _interopRequireDefault(require("../visitors/SqlVisitor"));

var _PostgreSQLUtils = _interopRequireDefault(require("../utils/PostgreSQLUtils"));

var _crypto = require("crypto");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class UpdateWhereStatementCreator {
  constructor(queryable, updates) {
    if (queryable == null) {
      throw new Error("Null Argument Exception: A queryable is needed to create statement.");
    }

    if (updates == null) {
      throw new Error("Null Argument Exception: updates cannot be null.");
    }

    this.updates = updates;
    this.queryable = queryable;
  }

  static createStatement(queryable, updates) {
    const updateWhereStatementCreator = new UpdateWhereStatementCreator(queryable, updates);
    return updateWhereStatementCreator.createStatement();
  }

  getTableName() {
    return _PostgreSQLUtils.default.escapeName(this.queryable.query.type);
  }

  createWhereExpression() {
    const visitor = new _SqlVisitor.default();
    return visitor.createWhereExpression(this.queryable.query.expression);
  }

  createSetExpression() {
    const updates = this.updates;
    const keys = Object.keys(updates);
    const statement = keys.reduce((accumulator, key, index) => {
      if (key === "id") {
        return accumulator;
      }

      accumulator.placeHolderValues.push(`${_PostgreSQLUtils.default.escapeName(key)} = $${index + 1}`);
      accumulator.values.push(updates[key]);
      return accumulator;
    }, {
      placeHolderValues: [],
      values: []
    });
    return {
      sql: `UPDATE ${this.getTableName()} SET ${statement.placeHolderValues.join(", ")}`,
      values: statement.values
    };
  }

  createStatement() {
    const updates = this.updates;
    const updateStatement = this.createSetExpression(updates);
    const whereStatement = this.createWhereExpression();
    let sql = updateStatement.sql;

    if (whereStatement != "") {
      sql = `${sql} ${whereStatement}`;
    }

    return {
      sql,
      values: updateStatement.values
    };
  }

}

exports.default = UpdateWhereStatementCreator;
//# sourceMappingURL=UpdateWhereStatementCreator.js.map