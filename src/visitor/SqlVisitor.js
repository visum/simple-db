import Visitor from "./Visitor";

class SqlString {
    constructor(value){
        this.value = `${value.replace("'", "''")}`;
    }

    toString(){
        return this.value;
    }

    toEndsWithString(){
        return `'%${this.value}'`;
    }

    toContainsString(){
        return `'%${this.value}%'`;
    }

    toStartsWithString(){
        return `'${this.value}%'`;
    }
}

export default class SqlVisitor extends Visitor {
    and(...args) {
        if (args.length === 0){
            return "";
        }

        return `(${args.join(" AND ")})`;
    }

    or(...args) {
        if (args.length === 0){
            return "";
        }

        return `(${args.join(" OR ")})`;
    }

    endsWith(property, value){
        return `${property} LIKE ${value.toEndsWithString()}`; 
    }

    startsWith(property, value){
        return `${property} LIKE ${value.toStartsWithString()}`; 
    }

    contains(property, value) {
        return `${property} LIKE ${value.toContainsString()}`;
    }

    isEqualTo(property, value) {
        return `${property} = ${value.toString()}`;
    }

    isNotEqualTo(property, value) {
        return `${property} != ${value.toString()}`;
    }

    isGreaterThan(property, value) {
        return `${property} > ${value.toString()}`;
    }

    isGreaterThanOrEqualTo(property, value) {
        return `${property} >= ${value.toString()}`;
    }

    isLessThan(property, value) {
        return `${property} < ${value.toString()}`;
    }

    isLessThanOrEqualTo(property, value) {
        return `${property} <= ${value.toString()}`;
    }

    string(value) {
        return new SqlString(value);
    }

    boolean(value) {
        return value.toString();
    }

    number(value) {
        return value;
    }

    array() {
        throw new Error("Not yet Implemented");
    }

    object() {
        throw new Error("Not yet Implemented");
    }

    propertyName(name) {
        return name;
    }

    property(type, name) {
        return `${name}`;
    }

    type(value) {
        this.table = value;
        return value;
    }

    createWhereStatement(node) {

        const where = this.visit(node);

        if (where == null){
            return "";
        }
        
        return `WHERE ${where}`;

    }
}
