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

var CountStatementCreator = function () {
    function CountStatementCreator(queryable) {
        _classCallCheck(this, CountStatementCreator);

        if (queryable == null) {
            throw new Error("Null Exception: A queryable is needed to create statement.");
        }

        this.queryable = queryable;
    }

    _createClass(CountStatementCreator, [{
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
        key: "createWhereSql",
        value: function createWhereSql() {
            var visitor = new _SqlVisitor2.default();
            return visitor.createWhereExpression(this.queryable.query.expression);
        }
    }, {
        key: "createSelectSql",
        value: function createSelectSql() {
            return "SELECT count(*) FROM " + this.getTableName();
        }
    }, {
        key: "createStatement",
        value: function createStatement() {
            var selectSql = this.createSelectSql();
            var whereSql = this.createWhereSql();
            var expression = [];

            expression.push(selectSql);

            if (whereSql != "") {
                expression.push(whereSql);
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
            var countStatementCreator = new CountStatementCreator(queryable);
            return countStatementCreator.createStatement();
        }
    }]);

    return CountStatementCreator;
}();

exports.default = CountStatementCreator;
//# sourceMappingURL=CountStatementCreator.js.map