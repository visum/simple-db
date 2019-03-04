"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class Node {
  constructor(type) {
    this.type = type;
    this.isComposite = false;
  }

  clone() {
    const node = new Node(this.type);
    node.isComposite = this.isComposite;
  }

}

exports.default = Node;
//# sourceMappingURL=Node.js.map