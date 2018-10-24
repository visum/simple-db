import ValueNode from "../composite/ValueNode";
import CompositeNode from "../composite/CompositeNode";
import Queryable from "../Queryable";

export default class QueryFactory {
    constructor() { }

    createAndNode() {
        return new CompositeNode("and");
    }

    createOrNode() {
        return new CompositeNode("or");
    }

    createContainsNode() {
        return new CompositeNode("contains");
    }

    createEndsWithNode() {
        return new CompositeNode("endsWith");
    }

    createStartsWithNode() {
        return new CompositeNode("startsWith");
    }

    createIsEqualToNode() {
        return new CompositeNode("isEqualTo");
    }

    createIsNotEqualToNode() {
        return new CompositeNode("isNotEqualTo");
    }

    createIsGreaterThanNode() {
        return new CompositeNode("isGreaterThan");
    }

    createIsLessThanNode() {
        return new CompositeNode("isLessThan");
    }

    createIsInNode() {
        return new CompositeNode("isIn");
    }

    createIsNotInNode() {
        return new CompositeNode("isNotIn");
    }

    createIsGreaterThanOrEqualToNode() {
        return new CompositeNode("isGreaterThanOrEqualTo");
    }

    createIsLessThanOrEqualToNode() {
        return new CompositeNode("isLessThanOrEqualTo");
    }

    createPropertyNode(type, name) {
        const propertyNode = new CompositeNode("property");

        const typeNode = new ValueNode("type", type);
        const nameNode = new ValueNode("propertyName", name);

        propertyNode.children.push(typeNode, nameNode);

        return propertyNode;
    }

    createQueryableValueNode(value) {
        if (!(value instanceof Queryable)) {
            throw new Error("Invalid Argument: expected a queryable.");
        }

        return new ValueNode("queryable", value);
    }

    createValueNode(value) {

        if (typeof value === "string") {

            return new ValueNode("string", value);

        } else if (typeof value === "boolean") {

            return new ValueNode("boolean", value);

        } else if (typeof value === "number") {

            return new ValueNode("number", value);

        } else if (Array.isArray(value)) {

            return new ValueNode("array", value);

        } else if (typeof value === "obejct" && value !== null) {

            return new ValueNode("object", value);

        } else {

            throw new Error("Unknown value type.");

        }

    }
}