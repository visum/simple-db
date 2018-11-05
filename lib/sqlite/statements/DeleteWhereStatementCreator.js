"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _SqlVisitor = require("../visitors/SqlVisitor");

var _SqlVisitor2 = _interopRequireDefault(_SqlVisitor);

var _SqliteUtils = require("../utils/SqliteUtils");

var _SqliteUtils2 = _interopRequireDefault(_SqliteUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DeleteWhereStatementCreator = function () {
    function DeleteWhereStatementCreator(queryable) {
        _classCallCheck(this, DeleteWhereStatementCreator);

        if (queryable == null) {
            throw new Error("Null Exception: A queryable is needed to create statement.");
        }

        this.queryable = queryable;
    }

    _createClass(DeleteWhereStatementCreator, [{
        key: "getTableName",
        value: function getTableName() {
            return _SqliteUtils2.default.escapeName(this.queryable.type);
        }
    }, {
        key: "createDeleteSql",
        value: function createDeleteSql() {
            return "DELETE FROM " + this.getTableName();
        }
    }, {
        key: "createWhereSql",
        value: function createWhereSql() {
            var visitor = new _SqlVisitor2.default();
            return visitor.createWhereExpression(this.queryable.query.expression);
        }
    }, {
        key: "createStatement",
        value: function createStatement() {
            var deleteSql = this.createDeleteSql();
            var whereSql = this.createWhereSql();

            var sql = deleteSql;

            if (whereSql != "") {
                sql = sql + " " + whereSql;
            }

            return {
                sql: sql,
                values: []
            };
        }
    }], [{
        key: "createStatement",
        value: function createStatement(queryable) {
            var deleteWhereStatementCreator = new DeleteWhereStatementCreator(queryable);
            return deleteWhereStatementCreator.createStatement();
        }
    }]);

    return DeleteWhereStatementCreator;
}();

exports.default = DeleteWhereStatementCreator;
//# sourceMappingURL=DeleteWhereStatementCreator.js.map