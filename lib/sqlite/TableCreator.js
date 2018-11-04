"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Sqlite3Wrapper = require("./Sqlite3Wrapper");

var _Sqlite3Wrapper2 = _interopRequireDefault(_Sqlite3Wrapper);

var _TableStatementCreator = require("./statements/TableStatementCreator");

var _TableStatementCreator2 = _interopRequireDefault(_TableStatementCreator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TableCreator = function () {
    function TableCreator(_ref) {
        var database = _ref.database,
            schema = _ref.schema;

        _classCallCheck(this, TableCreator);

        this.database = database;
        this.schema = schema;
        this.sqliteDatabaseWrapper = new _Sqlite3Wrapper2.default(database);
        this.schemaToSqliteFactory = new _TableStatementCreator2.default(schema);
    }

    _createClass(TableCreator, [{
        key: "createRepositoryIfNotExistsAsync",
        value: function createRepositoryIfNotExistsAsync() {
            var _schemaToSqliteFactor = this.schemaToSqliteFactory.createTableStatement(),
                sql = _schemaToSqliteFactor.sql,
                values = _schemaToSqliteFactor.values;

            return this.sqliteDatabaseWrapper.runAsync(sql, values);
        }
    }, {
        key: "dropRepositoryIfExistsAsync",
        value: function dropRepositoryIfExistsAsync() {
            var _schemaToSqliteFactor2 = this.schemaToSqliteFactory.createDropTableStatment(),
                sql = _schemaToSqliteFactor2.sql,
                values = _schemaToSqliteFactor2.values;

            return this.sqliteDatabaseWrapper.runAsync(sql, values);
        }
    }]);

    return TableCreator;
}();

exports.default = TableCreator;
//# sourceMappingURL=TableCreator.js.map