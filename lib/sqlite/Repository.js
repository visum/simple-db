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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Repository = function () {
    function Repository(_ref) {
        var database = _ref.database,
            name = _ref.name,
            _ref$primaryKeys = _ref.primaryKeys,
            primaryKeys = _ref$primaryKeys === undefined ? ["id"] : _ref$primaryKeys;

        _classCallCheck(this, Repository);

        this.name = name;
        this.database = database;
        this.sqliteDatabaseWrapper = new _Sqlite3Wrapper2.default(this.database);
        this.primaryKeys = primaryKeys;
    }

    _createClass(Repository, [{
        key: "addAsync",
        value: function addAsync(entity) {

            var insertStatementCreator = new _InsertStatementCreator2.default({
                tableName: this.name,
                entity: entity,
                primaryKeys: this.primaryKeys
            });

            var _insertStatementCreat = insertStatementCreator.createStatement(),
                sql = _insertStatementCreat.sql,
                values = _insertStatementCreat.values;

            return this.sqliteDatabaseWrapper.runAsync(sql, values);
        }
    }, {
        key: "removeAsync",
        value: function removeAsync(entity) {
            var deleteStatementCreator = new _DeleteStatementCreator2.default({
                tableName: this.name,
                entity: entity,
                primaryKeys: this.primaryKeys
            });

            var _deleteStatementCreat = deleteStatementCreator.createStatement(),
                sql = _deleteStatementCreat.sql,
                values = _deleteStatementCreat.values;

            return this.sqliteDatabaseWrapper.runAsync(sql, values);
        }
    }, {
        key: "updateAsync",
        value: function updateAsync(entity) {

            var updateStatementCreator = new _UpdateStatementCreator2.default({
                tableName: this.name,
                entity: entity,
                primaryKeys: this.primaryKeys
            });

            var _updateStatementCreat = updateStatementCreator.createStatement(),
                sql = _updateStatementCreat.sql,
                values = _updateStatementCreat.values;

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