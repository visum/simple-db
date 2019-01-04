"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Node2 = require("./Node");

var _Node3 = _interopRequireDefault(_Node2);

var _ValueNode = require("./ValueNode");

var _ValueNode2 = _interopRequireDefault(_ValueNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CompositeNode = function (_Node) {
    _inherits(CompositeNode, _Node);

    function CompositeNode(type) {
        _classCallCheck(this, CompositeNode);

        var _this = _possibleConstructorReturn(this, (CompositeNode.__proto__ || Object.getPrototypeOf(CompositeNode)).call(this, type));

        _this.isComposite = true;
        _this.children = [];
        return _this;
    }

    _createClass(CompositeNode, [{
        key: "clone",
        value: function clone() {
            var node = new CompositeNode(this.type);
            node.isComposite = this.isComposite;

            var children = this.children.map(function (child) {
                return child.clone();
            });

            node.children = children;

            return node;
        }
    }], [{
        key: "fromObject",
        value: function fromObject(object) {
            var node = void 0;

            if (object == null) {
                return null;
            }

            if (typeof object.isComposite === "boolean" && object.isComposite && Array.isArray(object.children)) {
                node = new CompositeNode(object.type);
                object.children.forEach(function (child) {
                    return node.children.push(CompositeNode.fromObject(child));
                });
            } else {
                node = new _ValueNode2.default(object.type, object.value);
            }

            return node;
        }
    }, {
        key: "fromJson",
        value: function fromJson(json) {
            var object = JSON.parse(json);
            return this.fromObject(object);
        }
    }]);

    return CompositeNode;
}(_Node3.default);

exports.default = CompositeNode;
//# sourceMappingURL=CompositeNode.js.map