export default class Visitor {
    visit(node){

        if (node == null){
            return null;
        }

        if (node.isComposite){
            
            const results = node.children.map((node)=>{
                return this.visit(node);
            });

            if (typeof this[node.type] === "function"){
                return this[node.type].apply(this, results);
            } else {
                throw new Error(`"${node.type}" is an unsupported node type.`);
            }

        } else {

            if (typeof this[node.type] === "function"){
                return this[node.type](node.value);
            } else {
                throw new Error(`"${node.type}" is an unsupported node type.`);
            }

        }
    }

}