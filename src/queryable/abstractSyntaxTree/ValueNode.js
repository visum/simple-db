import Node from "./Node";
import Queryable from "../Queryable";

export default class ValueNode extends Node {
    constructor(type, value) {
        super(type);

        this.value = value == null ? null : value;
    }

    clone() {
        const node = new ValueNode(this.type, this.value);
        return node;
    }

    static fromValue(value) {
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
        } else if (typeof value === "object" && value !== null) {
            return new ValueNode("queryable", value);
        } else {
            throw new Error("Unknown value type.");
        }
    }
}