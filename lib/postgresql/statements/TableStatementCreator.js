"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _SchemaUtils = _interopRequireDefault(require("../utils/SchemaUtils"));

var _PostgreSQLUtils = _interopRequireDefault(require("../utils/PostgreSQLUtils"));

var _UniqueExpressionCreator = _interopRequireDefault(require("./UniqueExpressionCreator"));

var _SchemaValidator = _interopRequireDefault(require("../SchemaValidator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class TableStatementCreator {
  constructor(schema) {
    this.schema = schema;
  }

  static createTableStatement(schema) {
    const tableStatementCreator = new TableStatementCreator(schema);
    return tableStatementCreator.createTableStatement();
  }

  static createDropTableStatement() {
    const tableStatementCreator = new TableStatementCreator(schema);
    return tableStatementCreator.createDropTableStatement();
  }

  getTableName() {
    return _PostgreSQLUtils.default.escapeName(_SchemaUtils.default.getTableNameFromSchema(this.schema));
  }

  removeNullOrEmptyStrings(expression) {
    return expression.filter(part => {
      return typeof part === "string" && part.length > 0;
    });
  }

  validateSchema() {
    return _SchemaValidator.default.validate(this.schema);
  }

  createPrimaryKeysExpression() {
    const keys = this.schema.primaryKeys.map(column => {
      return _PostgreSQLUtils.default.escapeName(column);
    }).join(", ");
    return `PRIMARY KEY(${keys})`;
  }

  createUniqueExpressions() {
    if (Array.isArray(this.schema.unique)) {
      return this.schema.unique.map(unique => {
        const uniqueExpression = new _UniqueExpressionCreator.default(unique);
        return uniqueExpression.createExpression();
      }).join(", ");
    }

    return "";
  }

  createForeignKeysExpression() {
    const foreignKeys = this.schema.foreignKeys || {};
    return Object.keys(foreignKeys).map(name => {
      const column = foreignKeys[name];

      const columnName = _PostgreSQLUtils.default.escapeName(name);

      const source = _PostgreSQLUtils.default.escapeName(_SchemaUtils.default.getTableNameFromSchema(column.source));

      const sourceColumn = _PostgreSQLUtils.default.escapeName(column.source.column);

      return `FOREIGN KEY (${columnName}) REFERENCES ${source} (${sourceColumn})`;
    }).join(", ");
  }

  createTableStatement() {
    this.validateSchema();
    const expression = [];
    expression.push(this.createColumnsExpression());
    expression.push(this.createPrimaryKeysExpression());
    expression.push(this.createUniqueExpressions());
    expression.push(this.createForeignKeysExpression());
    const cleanedExpression = this.removeNullOrEmptyStrings(expression);
    const sql = `CREATE TABLE IF NOT EXISTS ${this.getTableName()} (${cleanedExpression.join(", ")})`;
    return {
      sql,
      values: []
    };
  }

  createDropTableStatment() {
    const sql = `DROP TABLE IF EXISTS ${this.getTableName()}`;
    return {
      sql,
      values: []
    };
  }

  createColumnExpression({
    name,
    type,
    isRequired,
    isIndexed,
    defaultValue
  }) {
    const expression = [];
    expression.push(`${_PostgreSQLUtils.default.escapeName(name)}`);
    expression.push(type);

    if (isRequired) {
      expression.push("NOT NULL");
    }

    if (isIndexed) {
      expression.push("INDEXED");
    }

    if (defaultValue != null) {
      expression.push(this.sqlizeValue(defaultValue));
    }

    return expression.join(" ");
  }

  createColumnsExpression() {
    return this.schema.columns.map(column => {
      return this.createColumnExpression(column);
    }).join(", ");
  }

}

exports.default = TableStatementCreator;
//# sourceMappingURL=TableStatementCreator.js.map