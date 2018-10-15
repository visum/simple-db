import Node from "./Node";

export default class ValueNode extends Node {
    constructor(type, value) {
        super(type);

        this.value = value || null;
    }

    clone(){
        const node = new ValueNode(this.type, this.value);
        return node;
    }
}