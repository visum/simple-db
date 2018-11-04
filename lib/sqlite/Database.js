"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Sqlite3Wrapper = require("./Sqlite3Wrapper");

var _Sqlite3Wrapper2 = _interopRequireDefault(_Sqlite3Wrapper);

var _TableCreator = require("./TableCreator");

var _TableCreator2 = _interopRequireDefault(_TableCreator);

var _Repository = require("./Repository");

var _Repository2 = _interopRequireDefault(_Repository);

var _SchemaUtils = require("./utils/SchemaUtils");

var _SchemaUtils2 = _interopRequireDefault(_SchemaUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Database = function () {
    function Database(_ref) {
        var database = _ref.database,
            schemas = _ref.schemas;

        _classCallCheck(this, Database);

        this.database = database;
        this.sqliteDatabaseWrapper = new _Sqlite3Wrapper2.default(database);
        this.schemas = Array.isArray(schemas) ? schemas : [];
    }

    _createClass(Database, [{
        key: "hasSchema",
        value: function hasSchema(schema) {
            return this.getSchema(schema) != null;
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
                return schema.name == innerSchema.name && schema.version == innerSchema.version;
            });
        }
    }, {
        key: "addRepositoryAsync",
        value: function addRepositoryAsync(schema) {
            var _this = this;

            var tableCreator = new _TableCreator2.default({
                database: this.database,
                schema: schema
            });

            return tableCreator.createRepositoryIfNotExistsAsync().then(function () {
                if (!_this.hasSchema(schema)) {
                    _this.schemas.push(schema);
                }
            });
        }
    }, {
        key: "removeRepositoryAsync",
        value: function removeRepositoryAsync(schema) {
            var _this2 = this;

            return tableCreator.dropRepositoryIfExistsAsync().then(function () {
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

            var tableName = _SchemaUtils2.default.getTableNameFromSchema(schema);
            var primaryKeys = _SchemaUtils2.default.getPrimaryKeysFromSchema(schema);
            var database = this.database;

            return new _Repository2.default({
                database: database,
                name: tableName,
                primaryKeys: primaryKeys
            });
        }
    }]);

    return Database;
}();

exports.default = Database;
//# sourceMappingURL=Database.js.map