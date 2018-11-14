"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Provider = require("./Provider");

var _Provider2 = _interopRequireDefault(_Provider);

var _Queryable = require("../queryable/Queryable");

var _Queryable2 = _interopRequireDefault(_Queryable);

var _Sqlite3Wrapper = require("./Sqlite3Wrapper");

var _Sqlite3Wrapper2 = _interopRequireDefault(_Sqlite3Wrapper);

var _InsertStatementCreator = require("./statements/InsertStatementCreator");

var _InsertStatementCreator2 = _interopRequireDefault(_InsertStatementCreator);

var _UpdateStatementCreator = require("./statements/UpdateStatementCreator");

var _UpdateStatementCreator2 = _interopRequireDefault(_UpdateStatementCreator);

var _DeleteStatementCreator = require("./statements/DeleteStatementCreator");

var _DeleteStatementCreator2 = _interopRequireDefault(_DeleteStatementCreator);

var _SchemaUtils = require("./utils/SchemaUtils");

var _SchemaUtils2 = _interopRequireDefault(_SchemaUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Repository = function () {
    function Repository(_ref) {
        var database = _ref.database,
            schema = _ref.schema;

        _classCallCheck(this, Repository);

        this.name = _SchemaUtils2.default.getTableNameFromSchema(schema);
        this.database = database;
        this.sqliteDatabaseWrapper = new _Sqlite3Wrapper2.default(this.database);
        this.primaryKeys = schema.primaryKeys;
    }

    _createClass(Repository, [{
        key: "addAsync",
        value: function addAsync(entity) {
            var _InsertStatementCreat = _InsertStatementCreator2.default.createStatement({
                tableName: this.name,
                entity: entity,
                primaryKeys: this.primaryKeys
            }),
                sql = _InsertStatementCreat.sql,
                values = _InsertStatementCreat.values;

            return this.sqliteDatabaseWrapper.runAsync(sql, values);
        }
    }, {
        key: "removeAsync",
        value: function removeAsync(entity) {
            var _DeleteStatementCreat = _DeleteStatementCreator2.default.createStatement({
                tableName: this.name,
                entity: entity,
                primaryKeys: this.primaryKeys
            }),
                sql = _DeleteStatementCreat.sql,
                values = _DeleteStatementCreat.values;

            return this.sqliteDatabaseWrapper.runAsync(sql, values);
        }
    }, {
        key: "updateAsync",
        value: function updateAsync(entity) {
            var _UpdateStatementCreat = _UpdateStatementCreator2.default.createStatement({
                tableName: this.name,
                entity: entity,
                primaryKeys: this.primaryKeys
            }),
                sql = _UpdateStatementCreat.sql,
                values = _UpdateStatementCreat.values;

            return this.sqliteDatabaseWrapper.runAsync(sql, values);
        }
    }, {
        key: "getQueryProvider",
        value: function getQueryProvider() {
            return new _Provider2.default({
                database: this.database
            });
        }
    }, {
        key: "where",
        value: function where() {
            var provider = this.getQueryProvider();

            return new _Queryable2.default({
                type: this.name,
                provider: provider
            });
        }
    }]);

    return Repository;
}();

exports.default = Repository;
//# sourceMappingURL=Repository.js.map