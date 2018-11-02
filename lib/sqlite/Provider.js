"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _QueryableToSqlFactory = require("./factories/QueryableToSqlFactory");

var _QueryableToSqlFactory2 = _interopRequireDefault(_QueryableToSqlFactory);

var _Sqlite3Wrapper = require("./Sqlite3Wrapper");

var _Sqlite3Wrapper2 = _interopRequireDefault(_Sqlite3Wrapper);

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
            var queryableToSqlFactory = new _QueryableToSqlFactory2.default({ queryable: queryable });

            var _queryableToSqlFactor = queryableToSqlFactory.createWhereStatement(),
                sql = _queryableToSqlFactor.sql;

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
            var queryableToSqlFactory = new _QueryableToSqlFactory2.default({ queryable: queryable });

            var _queryableToSqlFactor2 = queryableToSqlFactory.createCountStatement(),
                sql = _queryableToSqlFactor2.sql;

            return this.sqliteDatabaseWrapper.allAsync(sql).then(function (results) {
                return results[0]["count(*)"];
            });
        }
    }, {
        key: "removeAsync",
        value: function removeAsync(queryable) {
            var queryableToSqlFactory = new _QueryableToSqlFactory2.default({ queryable: queryable });

            var _queryableToSqlFactor3 = queryableToSqlFactory.createDeleteStatement(),
                sql = _queryableToSqlFactor3.sql;

            return this.sqliteDatabaseWrapper.allAsync(sql);
        }
    }, {
        key: "updateAsync",
        value: function updateAsync(queryable, entity) {
            var queryableToSqlFactory = new _QueryableToSqlFactory2.default({ queryable: queryable });
            var statement = queryableToSqlFactory.createUpdateStatement(entity);

            return this.sqliteDatabaseWrapper.runAsync(statement.sql, statement.values);
        }
    }]);

    return Provider;
}();

exports.default = Provider;
//# sourceMappingURL=Provider.js.map