"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _SqliteUtils = require("../utils/SqliteUtils");

var _SqliteUtils2 = _interopRequireDefault(_SqliteUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AbstractStatementCreator = function () {
    function AbstractStatementCreator(_ref) {
        var entity = _ref.entity,
            tableName = _ref.tableName,
            primaryKeys = _ref.primaryKeys;

        _classCallCheck(this, AbstractStatementCreator);

        this.entity = entity;
        this.tableName = tableName;
        this.primaryKeys = primaryKeys;
    }

    _createClass(AbstractStatementCreator, [{
        key: "createWhereExpression",
        value: function createWhereExpression() {
            var entity = this.entity;
            var columns = this.primaryKeys.map(function (key) {
                return _SqliteUtils2.default.escapeName(key) + " = " + _SqliteUtils2.default.escapeValue(entity[key]);
            }).join(" AND ");

            return "WHERE " + columns;
        }
    }, {
        key: "validateEntityPrimaryKeys",
        value: function validateEntityPrimaryKeys() {
            var entity = this.entity;
            if (this.primaryKeys.length === 1) {
                return entity[this.primaryKeys[0]] != null;
            } else if (this.primaryKeys.length > 1) {
                return this.primaryKeys.every(function (key) {
                    return typeof entity[key] !== "undefined";
                });
            } else {
                return false;
            }
        }
    }]);

    return AbstractStatementCreator;
}();

exports.default = AbstractStatementCreator;
//# sourceMappingURL=AbstractStatementCreator.js.map