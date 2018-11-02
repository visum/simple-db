"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Sqlite3Wrapper = require("./Sqlite3Wrapper");

var _Sqlite3Wrapper2 = _interopRequireDefault(_Sqlite3Wrapper);

var _SqliteDatabaseCreator = require("./SqliteDatabaseCreator");

var _SqliteDatabaseCreator2 = _interopRequireDefault(_SqliteDatabaseCreator);

var _Repository = require("./Repository");

var _Repository2 = _interopRequireDefault(_Repository);

var _SchemaUtils = require("./utils/SchemaUtils");

var _SchemaUtils2 = _interopRequireDefault(_SchemaUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SqliteDatabase = function () {
    function SqliteDatabase(_ref) {
        var database = _ref.database;

        _classCallCheck(this, SqliteDatabase);

        this.database = database;
        this.sqliteDatabaseWrapper = new _Sqlite3Wrapper2.default(database);
        this.schemas = schemas;
    }

    _createClass(SqliteDatabase, [{
        key: "hasSchema",
        value: function hasSchema(schema) {
            return this.findSchema(schema) != null;
        }
    }, {
        key: "removeSchema",
        value: function removeSchema(schema) {
            var index = this.schemas.findIndex(function () {
                return schema.name == innerSchema && schema.version == innerSchema.version;
            });

            if (index > -1) {
                this.schemas.splice(index, 1);
            }
        }
    }, {
        key: "getSchema",
        value: function getSchema(schema) {
            return this.schemas.find(function (innerSchema) {
                return schema.name == innerSchema && schema.version == innerSchema.version;
            });
        }
    }, {
        key: "addRepositoryIfDoesNotExistsAsync",
        value: function addRepositoryIfDoesNotExistsAsync(schema) {
            var _this = this;

            var schemaToSqlite = new _SqliteDatabaseCreator2.default({
                database: this.database,
                schema: schema
            });

            return schemaToSqlite.createRepositoryIfNotExistsAsync().then(function () {
                if (!_this.hasSchema(schema)) {
                    _this.schemas.push(schema);
                }
            });
        }
    }, {
        key: "removeRepositoryIfExistsAsync",
        value: function removeRepositoryIfExistsAsync(schema) {
            var _this2 = this;

            return schemaToSqlite.dropRepositoryIfExistsAsync().then(function () {
                _this2.removeSchema(schema);
            });
        }
    }, {
        key: "getRepository",
        value: function getRepository(name, version) {
            var schema = this.getSchema({ name: name, version: version });

            if (schema == null) {
                throw new Error("Unable to find repository.");
            }

            var schemaUtils = new _SchemaUtils2.default(schema);
            var tableName = schemaUtils.getTableName();
            var primaryKeys = schemaUtils.getPrimaryKeys();
            var database = this.database;

            return new _Repository2.default({
                database: database,
                name: tableName,
                primaryKeys: primaryKeys
            });
        }
    }]);

    return SqliteDatabase;
}();

exports.default = SqliteDatabase;
//# sourceMappingURL=SqliteDatabase.js.map