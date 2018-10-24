import QueryFactory from "../factory/QueryFactory";
import Queryable from "../Queryable";

export default class OperationBuilder {

    constructor(queryable, propertyName) {
        this.factory = new QueryFactory();
        this.propertyName = propertyName;
        this.queryable = queryable;
    }

    getQuery() {
        return this.queryable;
    }

    isIn(value){
        if (!Array.isArray(value) && !(value instanceof Queryable) ){
            throw new Error("Invalid Argument: value needs to be an array or a queryable.");
        }

        const node = this.factory.createIsInNode();
        const valueNode = this.factory.createQueryableValueNode(value);
        const propertyNode = this.factory.createPropertyNode(this.queryable.type, this.propertyName);
        
        node.children.push(propertyNode, valueNode);

        if (this.queryable.query.expression && Array.isArray(this.queryable.query.expression.children)) {
            this.queryable.query.expression.children.push(node);
        } else {
            this.queryable.query.expression = node;
        }

        return this.queryable;
    }

    isNotIn(value){
        if (!Array.isArray(value) && !(value instanceof Queryable) ){
            throw new Error("Invalid Argument: value needs to be an array or a queryable.");
        }

        const node = this.factory.createIsNotInNode();
        const valueNode = this.factory.createQueryableValueNode(value);
        const propertyNode = this.factory.createPropertyNode(this.queryable.type, this.propertyName);
        
        node.children.push(propertyNode, valueNode);

        if (this.queryable.query.expression && Array.isArray(this.queryable.query.expression.children)) {
            this.queryable.query.expression.children.push(node);
        } else {
            this.queryable.query.expression = node;
        }

        return this.queryable;
    }

    endsWith(value) {
        const node = this.factory.createEndsWithNode();
        const valueNode = this.factory.createValueNode(value);
        const propertyNode = this.factory.createPropertyNode(this.queryable.type, this.propertyName);

        node.children.push(propertyNode, valueNode);

        if (this.queryable.query.expression && Array.isArray(this.queryable.query.expression.children)) {
            this.queryable.query.expression.children.push(node);
        } else {
            this.queryable.query.expression = node;
        }

        return this.queryable;
    }

    startsWith(value) {
        const node = this.factory.createStartsWithNode();
        const valueNode = this.factory.createValueNode(value);
        const propertyNode = this.factory.createPropertyNode(this.queryable.type, this.propertyName);

        node.children.push(propertyNode, valueNode);

        if (this.queryable.query.expression && Array.isArray(this.queryable.query.expression.children)) {
            this.queryable.query.expression.children.push(node);
        } else {
            this.queryable.query.expression = node;
        }

        return this.queryable;
    }

    contains(value) {
        const node = this.factory.createContainsNode();
        const valueNode = this.factory.createValueNode(value);
        const propertyNode = this.factory.createPropertyNode(this.queryable.type, this.propertyName);

        node.children.push(propertyNode, valueNode);

        if (this.queryable.query.expression && Array.isArray(this.queryable.query.expression.children)) {
            this.queryable.query.expression.children.push(node);
        } else {
            this.queryable.query.expression = node;
        }

        return this.queryable;
    }

    isEqualTo(value) {
        const node = this.factory.createIsEqualToNode();
        const valueNode = this.factory.createValueNode(value);
        const propertyNode = this.factory.createPropertyNode(this.queryable.type, this.propertyName);

        node.children.push(propertyNode, valueNode);

        if (this.queryable.query.expression && Array.isArray(this.queryable.query.expression.children)) {
            this.queryable.query.expression.children.push(node);
        } else {
            this.queryable.query.expression = node;
        }

        return this.queryable;
    }

    isNotEqualTo(value) {
        const node = this.factory.createIsNotEqualToNode();
        const valueNode = this.factory.createValueNode(value);
        const propertyNode = this.factory.createPropertyNode(this.queryable.type, this.propertyName);

        node.children.push(propertyNode, valueNode);

        if (this.queryable.query.expression && Array.isArray(this.queryable.query.expression.children)) {
            this.queryable.query.expression.children.push(node);
        } else {
            this.queryable.query.expression = node;
        }

        return this.queryable;
    }

    isGreaterThan(value) {
        const node = this.factory.createIsGreaterThanNode();
        const valueNode = this.factory.createValueNode(value);
        const propertyNode = this.factory.createPropertyNode(this.queryable.type, this.propertyName);

        node.children.push(propertyNode, valueNode);

        if (this.queryable.query.expression && Array.isArray(this.queryable.query.expression.children)) {
            this.queryable.query.expression.children.push(node);
        } else {
            this.queryable.query.expression = node;
        }

        return this.queryable;
    }

    isGreaterThanOrEqualTo(value) {
        const node = this.factory.createIsGreaterThanOrEqualToNode();
        const valueNode = this.factory.createValueNode(value);
        const propertyNode = this.factory.createPropertyNode(this.queryable.type, this.propertyName);

        node.children.push(propertyNode, valueNode);

        if (this.queryable.query.expression && Array.isArray(this.queryable.query.expression.children)) {
            this.queryable.query.expression.children.push(node);
        } else {
            this.queryable.query.expression = node;
        }

        return this.queryable;
    }

    isLessThan(value) {
        const node = this.factory.createIsLessThanNode();
        const valueNode = this.factory.createValueNode(value);
        const propertyNode = this.factory.createPropertyNode(this.queryable.type, this.propertyName);

        node.children.push(propertyNode, valueNode);

        if (this.queryable.query.expression && Array.isArray(this.queryable.query.expression.children)) {
            this.queryable.query.expression.children.push(node);
        } else {
            this.queryable.query.expression = node;
        }

        return this.queryable;
    }

    isLessThanOrEqualTo(value) {
        const node = this.factory.createIsLessThanOrEqualToNode();
        const valueNode = this.factory.createValueNode(value);
        const propertyNode = this.factory.createPropertyNode(this.queryable.type, this.propertyName);

        node.children.push(propertyNode, valueNode);

        if (this.queryable.query.expression && Array.isArray(this.queryable.query.expression.children)) {
            this.queryable.query.expression.children.push(node);
        } else {
            this.queryable.query.expression = node;
        }

        return this.queryable;
    }

}