export default class Node {
    constructor(type){
        this.type = type;
        this.isComposite = false;
    }

    clone(){
        const node = new Node(this.type);
        node.isComposite = this.isComposite;
    }

}