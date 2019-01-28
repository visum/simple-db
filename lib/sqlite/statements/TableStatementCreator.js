"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jsonschema = require("jsonschema");

var _jsonschema2 = _interopRequireDefault(_jsonschema);

var _tableJsonSchema = require("../tableJsonSchema");

var _tableJsonSchema2 = _interopRequireDefault(_tableJsonSchema);

var _SchemaUtils = require("../utils/SchemaUtils");

var _SchemaUtils2 = _interopRequireDefault(_SchemaUtils);

var _SqliteUtils = require("../utils/SqliteUtils");

var _SqliteUtils2 = _interopRequireDefault(_SqliteUtils);

var _UniqueExpressionCreator = require("./UniqueExpressionCreator");

var _UniqueExpressionCreator2 = _interopRequireDefault(_UniqueExpressionCreator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TableStatementCreator = function () {
    function TableStatementCreator(schema) {
        _classCallCheck(this, TableStatementCreator);

        this.schema = schema;
        this.validator = new _jsonschema2.default.Validator();
    }

    _createClass(TableStatementCreator, [{
        key: "getTableName",
        value: function getTableName() {
            return _SqliteUtils2.default.escapeName(_SchemaUtils2.default.getTableNameFromSchema(this.schema));
        }
    }, {
        key: "removeNullOrEmptyStrings",
        value: function removeNullOrEmptyStrings(expression) {
            return expression.filter(function (part) {
                return typeof part === "string" && part.length > 0;
            });
        }
    }, {
        key: "validateSchema",
        value: function validateSchema() {
            var validationResults = this.validator.validate(this.schema, _tableJsonSchema2.default);

            if (validationResults.errors.length > 0) {
                var error = new Error("Schema Error");
                error.validationErrors = validationResults.errors;
                throw error;
            }
        }
    }, {
        key: "createPrimaryKeysExpression",
        value: function createPrimaryKeysExpression() {
            var keys = this.schema.primaryKeys.map(function (column) {
                return _SqliteUtils2.default.escapeName(column);
            }).join(", ");

            return "PRIMARY KEY(" + keys + ")";
        }
    }, {
        key: "createUniqueExpressions",
        value: function createUniqueExpressions() {
            if (Array.isArray(this.schema.unique)) {
                return this.schema.unique.map(function (unique) {

                    var uniqueExpression = new _UniqueExpressionCreator2.default(unique);
                    return uniqueExpression.createExpression();
                }).join(", ");
            }
            return "";
        }
    }, {
        key: "createForeignKeysExpression",
        value: function createForeignKeysExpression() {
            var foreignKeys = this.schema.foreignKeys || {};

            return Object.keys(foreignKeys).map(function (name) {
                var column = foreignKeys[name];
                var columnName = _SqliteUtils2.default.escapeName(name);
                var source = _SqliteUtils2.default.escapeName(_SchemaUtils2.default.getTableNameFromSchema(column.source));
                var sourceColumn = _SqliteUtils2.default.escapeName(column.source.column);

                return "FOREIGN KEY (" + columnName + ") REFERENCES " + source + " (" + sourceColumn + ")";
            }).join(", ");
        }
    }, {
        key: "createTableStatement",
        value: function createTableStatement() {
            this.validateSchema();
            var expression = [];

            expression.push(this.createColumnsExpression());
            expression.push(this.createPrimaryKeysExpression());
            expression.push(this.createUniqueExpressions());
            expression.push(this.createForeignKeysExpression());

            var cleanedExpression = this.removeNullOrEmptyStrings(expression);

            var sql = "CREATE TABLE IF NOT EXISTS " + this.getTableName() + " (" + cleanedExpression.join(", ") + ")";

            return {
                sql: sql,
                values: []
            };
        }
    }, {
        key: "createDropTableStatment",
        value: function createDropTableStatment() {
            var sql = "DROP TABLE IF EXISTS " + this.getTableName();

            return {
                sql: sql,
                values: []
            };
        }
    }, {
        key: "createColumnExpression",
        value: function createColumnExpression(_ref) {
            var name = _ref.name,
                type = _ref.type,
                isRequired = _ref.isRequired,
                isIndexed = _ref.isIndexed,
                defaultValue = _ref.defaultValue;


            var expression = [];
            expression.push("" + _SqliteUtils2.default.escapeName(name));

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
    }, {
        key: "createColumnsExpression",
        value: function createColumnsExpression() {
            var _this = this;

            return this.schema.columns.map(function (column) {
                return _this.createColumnExpression(column);
            }).join(", ");
        }
    }], [{
        key: "createTableStatement",
        value: function createTableStatement(schema) {
            var tableStatementCreator = new TableStatementCreator(schema);
            return tableStatementCreator.createTableStatement();
        }
    }, {
        key: "createDropTableStatement",
        value: function createDropTableStatement() {
            var tableStatementCreator = new TableStatementCreator(schema);
            return tableStatementCreator.createDropTableStatement();
        }
    }]);

    return TableStatementCreator;
}();

exports.default = TableStatementCreator;
//# sourceMappingURL=TableStatementCreator.js.map