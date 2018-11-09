"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ValueNode = require("./abstractSyntaxTree/ValueNode");

var _ValueNode2 = _interopRequireDefault(_ValueNode);

var _CompositeNode = require("./abstractSyntaxTree/CompositeNode");

var _CompositeNode2 = _interopRequireDefault(_CompositeNode);

var _Queryable = require("./Queryable");

var _Queryable2 = _interopRequireDefault(_Queryable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NodeFactory = function () {
    function NodeFactory() {
        _classCallCheck(this, NodeFactory);
    }

    _createClass(NodeFactory, [{
        key: "createAndNode",
        value: function createAndNode() {
            return new _CompositeNode2.default("and");
        }
    }, {
        key: "createOrNode",
        value: function createOrNode() {
            return new _CompositeNode2.default("or");
        }
    }, {
        key: "createOperatorNode",
        value: function createOperatorNode(itemType, propertyName, operation, value) {
            var node = new _CompositeNode2.default(operation);
            var valueNode = this.createValueNode(value);
            var propertyNode = this.createPropertyNode(itemType, propertyName);

            node.children.push(propertyNode, valueNode);

            return node;
        }
    }, {
        key: "createPropertyNode",
        value: function createPropertyNode(itemType, name) {
            var propertyNode = new _CompositeNode2.default("property");

            var typeNode = new _ValueNode2.default("type", itemType);
            var nameNode = new _ValueNode2.default("propertyName", name);

            propertyNode.children.push(typeNode, nameNode);

            return propertyNode;
        }
    }, {
        key: "createValueNode",
        value: function createValueNode(value) {
            if (value instanceof _Queryable2.default) {
                return new _ValueNode2.default("queryable", value);
            } else {
                return _ValueNode2.default.fromValue(value);
            }
        }
    }]);

    return NodeFactory;
}();

exports.default = NodeFactory;
//# sourceMappingURL=NodeFactory.js.map