"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ValueNode = _interopRequireDefault(require("./abstractSyntaxTree/ValueNode"));

var _CompositeNode = _interopRequireDefault(require("./abstractSyntaxTree/CompositeNode"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class NodeFactory {
  constructor() {}

  createAndNode() {
    return new _CompositeNode.default("and");
  }

  createOrNode() {
    return new _CompositeNode.default("or");
  }

  createOperatorNode(itemType, propertyName, operation, value) {
    const node = new _CompositeNode.default(operation);
    const valueNode = this.createValueNode(value);
    const propertyNode = this.createPropertyNode(itemType, propertyName);
    node.children.push(propertyNode, valueNode);
    return node;
  }

  createPropertyNode(itemType, name) {
    const propertyNode = new _CompositeNode.default("property");
    const typeNode = new _ValueNode.default("type", itemType);
    const nameNode = new _ValueNode.default("propertyName", name);
    propertyNode.children.push(typeNode, nameNode);
    return propertyNode;
  }

  createValueNode(value) {
    return _ValueNode.default.fromValue(value);
  }

}

exports.default = NodeFactory;
//# sourceMappingURL=NodeFactory.js.map