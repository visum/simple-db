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

var UpdateWhereStatementCreator = function () {
    function UpdateWhereStatementCreator(queryable) {
        _classCallCheck(this, UpdateWhereStatementCreator);

        if (queryable == null) {
            throw new Error("Null Exception: A queryable is needed to create statement.");
        }

        this.queryable = queryable;
    }

    _createClass(UpdateWhereStatementCreator, [{
        key: "getTableName",
        value: function getTableName() {
            return _SqliteUtils2.default.escapeName(this.queryable.type);
        }
    }, {
        key: "createWhereExpression",
        value: function createWhereExpression() {
            var visitor = new _SqlVisitor2.default();
            return visitor.createWhereExpression(this.queryable.query.expression);
        }
    }, {
        key: "createSetExpression",
        value: function createSetExpression(updates) {
            var keys = Object.keys(updates);

            var statement = keys.reduce(function (accumulator, key) {
                if (key === "id") {
                    return accumulator;
                }

                accumulator.placeHolderValues.push(_SqliteUtils2.default.escapeName(key) + " = ?");
                accumulator.values.push(updates[key]);
                return accumulator;
            }, { placeHolderValues: [], values: [] });

            return {
                sql: "UPDATE " + this.getTableName() + " SET " + statement.placeHolderValues.join(", "),
                values: statement.values
            };
        }
    }, {
        key: "createStatement",
        value: function createStatement(updates) {
            var updateStatement = this.createSetExpression(updates);
            var whereStatement = this.createWhereExpression();

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

    return UpdateWhereStatementCreator;
}();

exports.default = UpdateWhereStatementCreator;
//# sourceMappingURL=UpdateWhereStatementCreator.js.map