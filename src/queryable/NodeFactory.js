import ValueNode from "./abstractSyntaxTree/ValueNode";
import CompositeNode from "./abstractSyntaxTree/CompositeNode";

export default class NodeFactory {
    constructor() { }

    createAndNode() {
        return new CompositeNode("and");
    }

    createOrNode() {
        return new CompositeNode("or");
    }

    createOperatorNode(
        itemType,
        propertyName,
        operation,
        value
    ) {
        const node = new CompositeNode(operation);
        const valueNode = this.createValueNode(value);
        const propertyNode = this.createPropertyNode(itemType, propertyName);

        node.children.push(propertyNode, valueNode);

        return node;
    }

    createPropertyNode(itemType, name) {
        const propertyNode = new CompositeNode("property");

        const typeNode = new ValueNode("type", itemType);
        const nameNode = new ValueNode("propertyName", name);

        propertyNode.children.push(typeNode, nameNode);

        return propertyNode;
    }

    createValueNode(value) {
        return ValueNode.fromValue(value);
    }
}