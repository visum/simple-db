"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _SqlVisitor = require("../visitors/SqlVisitor");

var _SqlVisitor2 = _interopRequireDefault(_SqlVisitor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var QueryableToSqlFactory = function () {
    function QueryableToSqlFactory(_ref) {
        var _ref$queryable = _ref.queryable,
            queryable = _ref$queryable === undefined ? null : _ref$queryable;

        _classCallCheck(this, QueryableToSqlFactory);

        if (queryable == null) {
            throw new Error("Null Exception: A queryable is needed to create statement.");
        }

        this.queryable = queryable;
    }

    _createClass(QueryableToSqlFactory, [{
        key: "removeNullOrEmptyStrings",
        value: function removeNullOrEmptyStrings(expression) {
            return expression.filter(function (part) {
                return typeof part === "string" && part.length > 0;
            });
        }
    }, {
        key: "createDeleteSql",
        value: function createDeleteSql() {
            return "DELETE FROM " + this.queryable.type;
        }
    }, {
        key: "createWhereSql",
        value: function createWhereSql() {
            var visitor = new _SqlVisitor2.default();
            return visitor.createWhereStatement(this.queryable.query.expression);
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

            return "SELECT " + columns.join(", ") + " FROM " + this.queryable.type;
        }
    }, {
        key: "createOrderBySql",
        value: function createOrderBySql() {
            if (this.queryable.query.orderBy.length === 0) {
                return "";
            }

            var series = this.queryable.query.orderBy.map(function (orderBy) {
                return orderBy.column + " " + orderBy.type;
            }).join(", ");

            return "ORDER BY " + series;
        }
    }, {
        key: "createUpdateSetStatement",
        value: function createUpdateSetStatement(entity) {
            var keys = Object.keys(entity);

            var statement = keys.reduce(function (accumulator, key) {
                if (key === "id") {
                    return accumulator;
                }

                accumulator.placeHolderValues.push(key + " = ?");
                accumulator.values.push(entity[key]);
                return accumulator;
            }, { placeHolderValues: [], values: [] });

            return {
                sql: "UPDATE " + this.queryable.type + " SET " + statement.placeHolderValues.join(", "),
                values: statement.values
            };
        }
    }, {
        key: "createCountSelectSql",
        value: function createCountSelectSql() {
            return "SELECT count(*) FROM " + this.queryable.type;
        }
    }, {
        key: "createLimitAndOffsetSql",
        value: function createLimitAndOffsetSql() {
            var limit = this.queryable.query.limit;
            var offset = this.queryable.query.offset;

            if (limit === Infinity) {
                limit = -1;
            }

            return "LIMIT " + limit + " OFFSET " + offset;
        }
    }, {
        key: "createWhereStatement",
        value: function createWhereStatement() {
            var selectSql = this.createSelectSql();
            var whereSql = this.createWhereSql();
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
    }, {
        key: "createCountStatement",
        value: function createCountStatement() {
            var selectSql = this.createCountSelectSql();
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
    }, {
        key: "createDeleteStatement",
        value: function createDeleteStatement() {
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
    }, {
        key: "createUpdateStatement",
        value: function createUpdateStatement(entity) {
            var updateStatement = this.createUpdateSetStatement(entity);
            var whereStatement = this.createWhereSql();

            var sql = updateStatement.sql;

            if (whereStatement != "") {
                sql = sql + " " + whereStatement;
            }

            return {
                sql: sql,
                values: updateStatement.values
            };
        }
    }]);

    return QueryableToSqlFactory;
}();

exports.default = QueryableToSqlFactory;
//# sourceMappingURL=QueryableToSqlFactory.js.map