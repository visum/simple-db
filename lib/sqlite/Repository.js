"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Provider = require("./Provider");

var _Provider2 = _interopRequireDefault(_Provider);

var _Queryable = require("../queryable/Queryable");

var _Queryable2 = _interopRequireDefault(_Queryable);

var _EntityToSqlFactory = require("./factories/EntityToSqlFactory");

var _EntityToSqlFactory2 = _interopRequireDefault(_EntityToSqlFactory);

var _Sqlite3Wrapper = require("./Sqlite3Wrapper");

var _Sqlite3Wrapper2 = _interopRequireDefault(_Sqlite3Wrapper);

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

            var entityToSqlFactory = new _EntityToSqlFactory2.default({
                tableName: this.name,
                entity: entity,
                primaryKeys: this.primaryKeys
            });

            var _entityToSqlFactory$c = entityToSqlFactory.createInsertStatement(),
                sql = _entityToSqlFactory$c.sql,
                values = _entityToSqlFactory$c.values;

            return this.sqliteDatabaseWrapper.runAsync(sql, values);
        }
    }, {
        key: "removeAsync",
        value: function removeAsync(entity) {
            var entityToSqlFactory = new _EntityToSqlFactory2.default({
                tableName: this.name,
                entity: entity,
                primaryKeys: this.primaryKeys
            });

            var _entityToSqlFactory$c2 = entityToSqlFactory.createDeleteStatement(),
                sql = _entityToSqlFactory$c2.sql,
                values = _entityToSqlFactory$c2.values;

            return this.sqliteDatabaseWrapper.runAsync(sql, values);
        }
    }, {
        key: "updateAsync",
        value: function updateAsync(entity) {

            var entityToSqlFactory = new _EntityToSqlFactory2.default({
                tableName: this.name,
                entity: entity,
                primaryKeys: this.primaryKeys
            });

            var _entityToSqlFactory$c3 = entityToSqlFactory.createUpdateStatement(),
                sql = _entityToSqlFactory$c3.sql,
                values = _entityToSqlFactory$c3.values;

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