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
        key: "createContainsNode",
        value: function createContainsNode() {
            return new _CompositeNode2.default("contains");
        }
    }, {
        key: "createEndsWithNode",
        value: function createEndsWithNode() {
            return new _CompositeNode2.default("endsWith");
        }
    }, {
        key: "createStartsWithNode",
        value: function createStartsWithNode() {
            return new _CompositeNode2.default("startsWith");
        }
    }, {
        key: "createIsEqualToNode",
        value: function createIsEqualToNode() {
            return new _CompositeNode2.default("isEqualTo");
        }
    }, {
        key: "createIsNotEqualToNode",
        value: function createIsNotEqualToNode() {
            return new _CompositeNode2.default("isNotEqualTo");
        }
    }, {
        key: "createIsGreaterThanNode",
        value: function createIsGreaterThanNode() {
            return new _CompositeNode2.default("isGreaterThan");
        }
    }, {
        key: "createIsLessThanNode",
        value: function createIsLessThanNode() {
            return new _CompositeNode2.default("isLessThan");
        }
    }, {
        key: "createIsInNode",
        value: function createIsInNode() {
            return new _CompositeNode2.default("isIn");
        }
    }, {
        key: "createIsNotInNode",
        value: function createIsNotInNode() {
            return new _CompositeNode2.default("isNotIn");
        }
    }, {
        key: "createIsGreaterThanOrEqualToNode",
        value: function createIsGreaterThanOrEqualToNode() {
            return new _CompositeNode2.default("isGreaterThanOrEqualTo");
        }
    }, {
        key: "createIsLessThanOrEqualToNode",
        value: function createIsLessThanOrEqualToNode() {
            return new _CompositeNode2.default("isLessThanOrEqualTo");
        }
    }, {
        key: "createPropertyNode",
        value: function createPropertyNode(type, name) {
            var propertyNode = new _CompositeNode2.default("property");

            var typeNode = new _ValueNode2.default("type", type);
            var nameNode = new _ValueNode2.default("propertyName", name);

            propertyNode.children.push(typeNode, nameNode);

            return propertyNode;
        }
    }, {
        key: "createQueryableValueNode",
        value: function createQueryableValueNode(value) {
            if (!(value instanceof _Queryable2.default)) {
                throw new Error("Invalid Argument: expected a queryable.");
            }

            return new _ValueNode2.default("queryable", value);
        }
    }, {
        key: "createValueNode",
        value: function createValueNode(value) {

            if (typeof value === "string") {

                return new _ValueNode2.default("string", value);
            } else if (typeof value === "boolean") {

                return new _ValueNode2.default("boolean", value);
            } else if (typeof value === "number") {

                return new _ValueNode2.default("number", value);
            } else if (Array.isArray(value)) {

                return new _ValueNode2.default("array", value);
            } else if (typeof value === "obejct" && value !== null) {

                return new _ValueNode2.default("object", value);
            } else {

                throw new Error("Unknown value type.");
            }
        }
    }]);

    return NodeFactory;
}();

exports.default = NodeFactory;
//# sourceMappingURL=NodeFactory.js.map