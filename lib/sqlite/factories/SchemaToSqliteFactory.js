"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jsonschema = require("jsonschema");

var _jsonschema2 = _interopRequireDefault(_jsonschema);

var _repositoryJsonSchema = require("../repositoryJsonSchema");

var _repositoryJsonSchema2 = _interopRequireDefault(_repositoryJsonSchema);

var _SchemaUtils = require("../utils/SchemaUtils");

var _SchemaUtils2 = _interopRequireDefault(_SchemaUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SchemaToSqliteFactory = function () {
    function SchemaToSqliteFactory(schema) {
        _classCallCheck(this, SchemaToSqliteFactory);

        this.schema = schema;
        this.validator = new _jsonschema2.default.Validator();
    }

    _createClass(SchemaToSqliteFactory, [{
        key: "removeNullOrEmptyStrings",
        value: function removeNullOrEmptyStrings(expression) {
            return expression.filter(function (part) {
                return typeof part === "string" && part.length > 0;
            });
        }
    }, {
        key: "validateSchema",
        value: function validateSchema() {
            var validationResults = this.validator.validate(this.schema, _repositoryJsonSchema2.default);

            if (validationResults.errors.length > 0) {
                var error = new Error("Schema Error");
                error.validationErrors = validationResults.errors;
                throw error;
            }
        }
    }, {
        key: "sqlizeValue",
        value: function sqlizeValue(value) {
            if (typeof value === "string") {
                return "'" + value.replace(/\'/, "''") + "'";
            }if (typeof value === "boolean") {
                return value ? 1 : 0;
            } else {
                return value.toString();
            }
        }
    }, {
        key: "sqlizeName",
        value: function sqlizeName(value) {
            return "\"" + value.replace(/\"/, "\"") + "\"";
        }
    }, {
        key: "createPrimaryKeysExpression",
        value: function createPrimaryKeysExpression() {
            var _this = this;

            var keys = this.schema.primaryKeys.map(function (column) {
                return _this.sqlizeName(column);
            }).join(", ");

            return "PRIMARY KEY(" + keys + ")";
        }
    }, {
        key: "createUniqueColumns",
        value: function createUniqueColumns() {
            var _this2 = this;

            if (!Array.isArray(this.schema.unique) || this.schema.unique.length === 0) {
                return "";
            }

            var columns = this.schema.unique.map(function (columns) {
                return columns.map(function (column) {
                    return _this2.sqlizeName(column);
                });
            }).join(", ");

            return "UNIQUE (" + columns + ")";
        }
    }, {
        key: "createForeignKeysExpression",
        value: function createForeignKeysExpression() {
            var _this3 = this;

            var foreignKeys = this.schema.foreignKeys || {};

            return Object.keys(foreignKeys).map(function (name) {
                var column = foreignKeys[name];
                var schemaUtils = new _SchemaUtils2.default(column.source);
                var columnName = _this3.sqlizeName(name);
                var source = _this3.sqlizeName(schemaUtils.getTableName());
                var sourceColumn = _this3.sqlizeName(column.source.column);

                return "FOREIGN KEY (" + columnName + ") REFERENCES " + source + " (" + sourceColumn + ")";
            }).join(", ");
        }
    }, {
        key: "createTableStatement",
        value: function createTableStatement() {
            this.validateSchema();
            var expression = [];
            var schemaUtils = new _SchemaUtils2.default(this.schema);
            var tableName = schemaUtils.getTableName();

            expression.push(this.createColumnsExpression());
            expression.push(this.createPrimaryKeysExpression());
            expression.push(this.createUniqueColumns());
            expression.push(this.createForeignKeysExpression());

            var cleanedExpression = this.removeNullOrEmptyStrings(expression);

            var sql = "CREATE TABLE IF NOT EXISTS " + this.sqlizeName(tableName) + " (" + cleanedExpression.join(", ") + ")";

            return {
                sql: sql,
                values: []
            };
        }
    }, {
        key: "createDropTableStatment",
        value: function createDropTableStatment() {
            var schemaUtils = new _SchemaUtils2.default(this.schema);
            var sql = "DROP TABLE IF EXISTS " + this.sqlizeName(schemaUtils.getTableName());

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
            expression.push("" + this.sqlizeName(name));

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
            var _this4 = this;

            return this.schema.columns.map(function (column) {
                return _this4.createColumnExpression(column);
            }).join(", ");
        }
    }]);

    return SchemaToSqliteFactory;
}();

exports.default = SchemaToSqliteFactory;
//# sourceMappingURL=SchemaToSqliteFactory.js.map