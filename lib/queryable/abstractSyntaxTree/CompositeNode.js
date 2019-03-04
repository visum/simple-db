"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Node = _interopRequireDefault(require("./Node"));

var _ValueNode = _interopRequireDefault(require("./ValueNode"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class CompositeNode extends _Node.default {
  constructor(type) {
    super(type);
    this.isComposite = true;
    this.children = [];
  }

  static fromObject(object) {
    let node;

    if (object == null) {
      return null;
    }

    if (typeof object.isComposite === "boolean" && object.isComposite && Array.isArray(object.children)) {
      node = new CompositeNode(object.type);
      object.children.forEach(child => {
        return node.children.push(CompositeNode.fromObject(child));
      });
    } else {
      node = new _ValueNode.default(object.type, object.value);
    }

    return node;
  }

  static fromJson(json) {
    const object = JSON.parse(json);
    return this.fromObject(object);
  }

  clone() {
    const node = new CompositeNode(this.type);
    node.isComposite = this.isComposite;
    const children = this.children.map(child => {
      return child.clone();
    });
    node.children = children;
    return node;
  }

}

exports.default = CompositeNode;
//# sourceMappingURL=CompositeNode.js.map