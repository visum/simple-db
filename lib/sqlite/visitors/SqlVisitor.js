"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Visitor2 = require("./Visitor");

var _Visitor3 = _interopRequireDefault(_Visitor2);

var _SelectStatementCreator = require("../statements/SelectStatementCreator");

var _SelectStatementCreator2 = _interopRequireDefault(_SelectStatementCreator);

var _SqliteUtils = require("../utils/SqliteUtils");

var _SqliteUtils2 = _interopRequireDefault(_SqliteUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SqlString = function () {
    function SqlString(value) {
        _classCallCheck(this, SqlString);

        this.value = "" + value.replace("'", "''");
    }

    _createClass(SqlString, [{
        key: "toString",
        value: function toString() {
            return "'" + this.value + "'";
        }
    }, {
        key: "toEndsWithString",
        value: function toEndsWithString() {
            return "'%" + this.value + "'";
        }
    }, {
        key: "toContainsString",
        value: function toContainsString() {
            return "'%" + this.value + "%'";
        }
    }, {
        key: "toStartsWithString",
        value: function toStartsWithString() {
            return "'" + this.value + "%'";
        }
    }]);

    return SqlString;
}();

var SqlVisitor = function (_Visitor) {
    _inherits(SqlVisitor, _Visitor);

    function SqlVisitor() {
        _classCallCheck(this, SqlVisitor);

        return _possibleConstructorReturn(this, (SqlVisitor.__proto__ || Object.getPrototypeOf(SqlVisitor)).apply(this, arguments));
    }

    _createClass(SqlVisitor, [{
        key: "and",
        value: function and() {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            if (args.length === 0) {
                return "";
            }

            return "(" + args.join(" AND ") + ")";
        }
    }, {
        key: "or",
        value: function or() {
            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
            }

            if (args.length === 0) {
                return "";
            }

            return "(" + args.join(" OR ") + ")";
        }
    }, {
        key: "endsWith",
        value: function endsWith(property, value) {
            return property + " LIKE " + value.toEndsWithString();
        }
    }, {
        key: "startsWith",
        value: function startsWith(property, value) {
            return property + " LIKE " + value.toStartsWithString();
        }
    }, {
        key: "contains",
        value: function contains(property, value) {
            return property + " LIKE " + value.toContainsString();
        }
    }, {
        key: "isEqualTo",
        value: function isEqualTo(property, value) {
            return property + " = " + value.toString();
        }
    }, {
        key: "isNotEqualTo",
        value: function isNotEqualTo(property, value) {
            return property + " != " + value.toString();
        }
    }, {
        key: "isGreaterThan",
        value: function isGreaterThan(property, value) {
            return property + " > " + value.toString();
        }
    }, {
        key: "isGreaterThanOrEqualTo",
        value: function isGreaterThanOrEqualTo(property, value) {
            return property + " >= " + value.toString();
        }
    }, {
        key: "isLessThan",
        value: function isLessThan(property, value) {
            return property + " < " + value.toString();
        }
    }, {
        key: "isLessThanOrEqualTo",
        value: function isLessThanOrEqualTo(property, value) {
            return property + " <= " + value.toString();
        }
    }, {
        key: "isIn",
        value: function isIn(property, value) {
            return property + " IN " + value;
        }
    }, {
        key: "isNotIn",
        value: function isNotIn(property, value) {
            return property + " NOT IN " + value;
        }
    }, {
        key: "queryable",
        value: function queryable(value) {
            var selectStatementCreator = new _SelectStatementCreator2.default(value);

            var _selectStatementCreat = selectStatementCreator.createStatement(),
                sql = _selectStatementCreat.sql;

            return "(" + sql + ")";
        }
    }, {
        key: "string",
        value: function string(value) {
            return new SqlString(value);
        }
    }, {
        key: "boolean",
        value: function boolean(value) {
            return value.toString();
        }
    }, {
        key: "number",
        value: function number(value) {
            return value;
        }
    }, {
        key: "array",
        value: function array(value) {
            var _this2 = this;

            var series = value.map(function (item) {

                if (typeof item === "string") {
                    return _this2.string(item).toString();
                } else if (typeof item === "number") {
                    return _this2.number(item);
                } else if (typeof item === "boolean") {
                    return _this2.boolean(item);
                } else {
                    throw new Error("Invalid Argument: Unknown primitive type.");
                }
            }).join(", ");

            return "(" + series + ")";
        }
    }, {
        key: "propertyName",
        value: function propertyName(name) {
            return _SqliteUtils2.default.escapeName(name);
        }
    }, {
        key: "property",
        value: function property(type, name) {
            return name;
        }
    }, {
        key: "type",
        value: function type(value) {
            this.table = value;
            return value;
        }
    }, {
        key: "createWhereExpression",
        value: function createWhereExpression(node) {
            var where = this.visit(node);

            if (where == null) {
                return "";
            }

            return "WHERE " + where;
        }
    }]);

    return SqlVisitor;
}(_Visitor3.default);

exports.default = SqlVisitor;
//# sourceMappingURL=SqlVisitor.js.map