import Node from "./Node";

export default class CompositeNode extends Node {
    constructor(type) {
        super(type);
        this.isComposite = true;
        this.children = [];
    }

    clone(){
        const node = new CompositeNode(this.type);
        node.isComposite = this.isComposite;

        const children = this.children.map((child)=>{
            return child.clone();
        });

        node.children = children;

        return node;
    }
}