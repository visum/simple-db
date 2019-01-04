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

var SelectStatementCreator = function () {
    function SelectStatementCreator(queryable) {
        _classCallCheck(this, SelectStatementCreator);

        if (queryable == null) {
            throw new Error("Null Exception: A queryable is needed to create statement.");
        }

        this.queryable = queryable;
    }

    _createClass(SelectStatementCreator, [{
        key: "getTableName",
        value: function getTableName() {
            return _SqliteUtils2.default.escapeName(this.queryable.query.type);
        }
    }, {
        key: "removeNullOrEmptyStrings",
        value: function removeNullOrEmptyStrings(expression) {
            return expression.filter(function (part) {
                return typeof part === "string" && part.length > 0;
            });
        }
    }, {
        key: "createWhereExpression",
        value: function createWhereExpression() {
            var visitor = new _SqlVisitor2.default();
            return visitor.createWhereExpression(this.queryable.query.expression);
        }
    }, {
        key: "createSelectSql",
        value: function createSelectSql() {
            var select = this.queryable.query.select;
            var columns = Object.keys(select).map(function (key) {
                return key + " AS " + select[key];
            });

            if (columns.length === 0) {
                columns = ["*"];
            }

            return "SELECT " + columns.join(", ") + " FROM " + this.getTableName();
        }
    }, {
        key: "createOrderBySql",
        value: function createOrderBySql() {
            if (this.queryable.query.orderBy.length === 0) {
                return "";
            }

            var series = this.queryable.query.orderBy.map(function (orderBy) {
                return _SqliteUtils2.default.escapeName(orderBy.column) + " " + orderBy.type;
            }).join(", ");

            return "ORDER BY " + series;
        }
    }, {
        key: "createLimitAndOffsetSql",
        value: function createLimitAndOffsetSql() {
            var limit = this.queryable.query.limit;
            var offset = this.queryable.query.offset;

            return "LIMIT " + limit + " OFFSET " + offset;
        }
    }, {
        key: "createStatement",
        value: function createStatement() {
            var selectSql = this.createSelectSql();
            var whereSql = this.createWhereExpression();
            var orderBySql = this.createOrderBySql();
            var limitAndOffsetSql = this.createLimitAndOffsetSql();
            var expression = [];

            expression.push(selectSql);

            if (whereSql != "") {
                expression.push(whereSql);
            }

            if (orderBySql != "") {
                expression.push(orderBySql);
            }

            if (limitAndOffsetSql != "") {
                expression.push(limitAndOffsetSql);
            }

            var cleanedExpression = this.removeNullOrEmptyStrings(expression);

            return {
                sql: cleanedExpression.join(" "),
                values: []
            };
        }
    }], [{
        key: "createStatement",
        value: function createStatement(queryable) {
            var selectStatementCreator = new SelectStatementCreator(queryable);
            return selectStatementCreator.createStatement();
        }
    }]);

    return SelectStatementCreator;
}();

exports.default = SelectStatementCreator;
//# sourceMappingURL=SelectStatementCreator.js.map