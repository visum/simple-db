"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _SelectStatementCreator = require("./statements/SelectStatementCreator");

var _SelectStatementCreator2 = _interopRequireDefault(_SelectStatementCreator);

var _Sqlite3Wrapper = require("./Sqlite3Wrapper");

var _Sqlite3Wrapper2 = _interopRequireDefault(_Sqlite3Wrapper);

var _CountStatementCreator = require("./statements/CountStatementCreator");

var _CountStatementCreator2 = _interopRequireDefault(_CountStatementCreator);

var _DeleteWhereStatementCreator = require("./statements/DeleteWhereStatementCreator");

var _DeleteWhereStatementCreator2 = _interopRequireDefault(_DeleteWhereStatementCreator);

var _UpdateWhereStatementCreator = require("./statements/UpdateWhereStatementCreator");

var _UpdateWhereStatementCreator2 = _interopRequireDefault(_UpdateWhereStatementCreator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Provider = function () {
    function Provider(_ref) {
        var database = _ref.database;

        _classCallCheck(this, Provider);

        if (database == null) {
            throw new Error("Null Exception: database cannot be null.");
        }

        this.database = database;
        this.sqliteDatabaseWrapper = new _Sqlite3Wrapper2.default(this.database);
    }

    _createClass(Provider, [{
        key: "toArrayAsync",
        value: function toArrayAsync(queryable) {
            var _SelectStatementCreat = _SelectStatementCreator2.default.createStatement(queryable),
                sql = _SelectStatementCreat.sql;

            return this.sqliteDatabaseWrapper.allAsync(sql);
        }
    }, {
        key: "getFirstAsync",
        value: function getFirstAsync(queryable) {
            return this.toArrayAsync(queryable).then(function (results) {
                return results[0] || null;
            });
        }
    }, {
        key: "getCountAsync",
        value: function getCountAsync(queryable) {
            var _CountStatementCreato = _CountStatementCreator2.default.createStatement(queryable),
                sql = _CountStatementCreato.sql;

            return this.sqliteDatabaseWrapper.allAsync(sql).then(function (results) {
                return results[0]["count(*)"];
            });
        }
    }, {
        key: "getSqlAndValues",
        value: function getSqlAndValues(queryable) {
            return _CountStatementCreator2.default.createStatement(queryable);
        }
    }, {
        key: "removeAsync",
        value: function removeAsync(queryable) {
            var _DeleteWhereStatement = _DeleteWhereStatementCreator2.default.createStatement(queryable),
                sql = _DeleteWhereStatement.sql;

            return this.sqliteDatabaseWrapper.allAsync(sql);
        }
    }, {
        key: "updateAsync",
        value: function updateAsync(queryable, updates) {
            var _UpdateWhereStatement = _UpdateWhereStatementCreator2.default.createStatement(queryable, updates),
                sql = _UpdateWhereStatement.sql,
                values = _UpdateWhereStatement.values;

            return this.sqliteDatabaseWrapper.runAsync(sql, values);
        }
    }]);

    return Provider;
}();

exports.default = Provider;
//# sourceMappingURL=Provider.js.map