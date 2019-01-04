"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Node2 = require("./Node");

var _Node3 = _interopRequireDefault(_Node2);

var _Queryable = require("../Queryable");

var _Queryable2 = _interopRequireDefault(_Queryable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ValueNode = function (_Node) {
    _inherits(ValueNode, _Node);

    function ValueNode(type, value) {
        _classCallCheck(this, ValueNode);

        var _this = _possibleConstructorReturn(this, (ValueNode.__proto__ || Object.getPrototypeOf(ValueNode)).call(this, type));

        _this.value = value == null ? null : value;
        return _this;
    }

    _createClass(ValueNode, [{
        key: "clone",
        value: function clone() {
            var node = new ValueNode(this.type, this.value);
            return node;
        }
    }], [{
        key: "fromValue",
        value: function fromValue(value) {
            if (typeof value === "string") {
                return new ValueNode("string", value);
            } else if (typeof value === "boolean") {
                return new ValueNode("boolean", value);
            } else if (typeof value === "number") {
                return new ValueNode("number", value);
            } else if (Array.isArray(value)) {
                return new ValueNode("array", value);
            } else if (value instanceof Date) {
                return new ValueNode("date", value);
            } else if ((typeof value === "undefined" ? "undefined" : _typeof(value)) === "object" && value !== null) {
                return new ValueNode("queryable", value);
            } else {
                throw new Error("Unknown value type.");
            }
        }
    }]);

    return ValueNode;
}(_Node3.default);

exports.default = ValueNode;
//# sourceMappingURL=ValueNode.js.map