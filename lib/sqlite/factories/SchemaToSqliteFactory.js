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

var _SqliteUtils = require("../utils/SqliteUtils");

var _SqliteUtils2 = _interopRequireDefault(_SqliteUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SchemaToSqliteFactory = function () {
    function SchemaToSqliteFactory(schema) {
        _classCallCheck(this, SchemaToSqliteFactory);

        this.schema = schema;
        this.validator = new _jsonschema2.default.Validator();
    }

    _createClass(SchemaToSqliteFactory, [{
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
            var validationResults = this.validator.validate(this.schema, _repositoryJsonSchema2.default);

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
        key: "createUniqueColumns",
        value: function createUniqueColumns() {
            if (!Array.isArray(this.schema.unique) || this.schema.unique.length === 0) {
                return "";
            }

            var columns = this.schema.unique.map(function (columns) {
                return columns.map(function (column) {
                    return _SqliteUtils2.default.escapeName(column);
                });
            }).join(", ");

            return "UNIQUE (" + columns + ")";
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
            expression.push(this.createUniqueColumns());
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
    }]);

    return SchemaToSqliteFactory;
}();

exports.default = SchemaToSqliteFactory;
//# sourceMappingURL=SchemaToSqliteFactory.js.map