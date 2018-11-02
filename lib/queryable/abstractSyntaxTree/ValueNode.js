"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Node2 = require("./Node");

var _Node3 = _interopRequireDefault(_Node2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ValueNode = function (_Node) {
    _inherits(ValueNode, _Node);

    function ValueNode(type, value) {
        _classCallCheck(this, ValueNode);

        var _this = _possibleConstructorReturn(this, (ValueNode.__proto__ || Object.getPrototypeOf(ValueNode)).call(this, type));

        _this.value = value || null;
        return _this;
    }

    _createClass(ValueNode, [{
        key: "clone",
        value: function clone() {
            var node = new ValueNode(this.type, this.value);
            return node;
        }
    }]);

    return ValueNode;
}(_Node3.default);

exports.default = ValueNode;
//# sourceMappingURL=ValueNode.js.map