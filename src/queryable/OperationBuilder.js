import QueryFactory from "./NodeFactory";
import Queryable from "./Queryable";

export default class OperationBuilder {

    constructor(queryable, propertyName) {
        this.factory = new QueryFactory();
        this.propertyName = propertyName;
        this.queryable = queryable;
    }

    getQuery() {
        return this.queryable;
    }

    isIn(value) {
        if (!(value instanceof Queryable) && !Array.isArray(value)){
            throw new Error("Invalid Argument: value needs to be an array or a queryable.");
        }

        const node = this.factory.createOperatorNode(
            this.queryable.type,
            this.propertyName,
            "isIn",
            value
        );

        if (this.queryable.query.expression && Array.isArray(this.queryable.query.expression.children)) {
            this.queryable.query.expression.children.push(node);
        } else {
            this.queryable.query.expression = node;
        }

        return this.queryable;
    }

    isNotIn(value) {
        if (!(value instanceof Queryable) && !Array.isArray(value)){
            throw new Error("Invalid Argument: value needs to be an array or a queryable.");
        }

        const node = this.factory.createOperatorNode(
            this.queryable.type,
            this.propertyName,
            "isNotIn",
            value
        );

        if (this.queryable.query.expression && Array.isArray(this.queryable.query.expression.children)) {
            this.queryable.query.expression.children.push(node);
        } else {
            this.queryable.query.expression = node;
        }

        return this.queryable;
    }

    endsWith(value) {
        const node = this.factory.createOperatorNode(
            this.queryable.type,
            this.propertyName,
            "endsWith",
            value
        );

        if (this.queryable.query.expression && Array.isArray(this.queryable.query.expression.children)) {
            this.queryable.query.expression.children.push(node);
        } else {
            this.queryable.query.expression = node;
        }

        return this.queryable;
    }

    startsWith(value) {
        const node = this.factory.createOperatorNode(
            this.queryable.type,
            this.propertyName,
            "startsWith",
            value
        );

        if (this.queryable.query.expression && Array.isArray(this.queryable.query.expression.children)) {
            this.queryable.query.expression.children.push(node);
        } else {
            this.queryable.query.expression = node;
        }

        return this.queryable;
    }

    contains(value) {
        const node = this.factory.createOperatorNode(
            this.queryable.type,
            this.propertyName,
            "contains",
            value
        );

        if (this.queryable.query.expression && Array.isArray(this.queryable.query.expression.children)) {
            this.queryable.query.expression.children.push(node);
        } else {
            this.queryable.query.expression = node;
        }

        return this.queryable;
    }

    isEqualTo(value) {
        const node = this.factory.createOperatorNode(
            this.queryable.type,
            this.propertyName,
            "isEqualTo",
            value
        );

        if (this.queryable.query.expression && Array.isArray(this.queryable.query.expression.children)) {
            this.queryable.query.expression.children.push(node);
        } else {
            this.queryable.query.expression = node;
        }

        return this.queryable;
    }

    isNotEqualTo(value) {
        const node = this.factory.createOperatorNode(
            this.queryable.type,
            this.propertyName,
            "isNotEqualTo",
            value
        );

        if (this.queryable.query.expression && Array.isArray(this.queryable.query.expression.children)) {
            this.queryable.query.expression.children.push(node);
        } else {
            this.queryable.query.expression = node;
        }

        return this.queryable;
    }

    isGreaterThan(value) {
        const node = this.factory.createOperatorNode(
            this.queryable.type,
            this.propertyName,
            "isGreaterThan",
            value
        );

        if (this.queryable.query.expression && Array.isArray(this.queryable.query.expression.children)) {
            this.queryable.query.expression.children.push(node);
        } else {
            this.queryable.query.expression = node;
        }

        return this.queryable;
    }

    isGreaterThanOrEqualTo(value) {
        const node = this.factory.createOperatorNode(
            this.queryable.type,
            this.propertyName,
            "isGreaterThanOrEqualTo",
            value
        );

        if (this.queryable.query.expression && Array.isArray(this.queryable.query.expression.children)) {
            this.queryable.query.expression.children.push(node);
        } else {
            this.queryable.query.expression = node;
        }

        return this.queryable;
    }

    isLessThan(value) {
        const node = this.factory.createOperatorNode(
            this.queryable.type,
            this.propertyName,
            "isLessThan",
            value
        );

        if (this.queryable.query.expression && Array.isArray(this.queryable.query.expression.children)) {
            this.queryable.query.expression.children.push(node);
        } else {
            this.queryable.query.expression = node;
        }

        return this.queryable;
    }

    isLessThanOrEqualTo(value) {
        const node = this.factory.createOperatorNode(
            this.queryable.type,
            this.propertyName,
            "isLessThanOrEqualTo",
            value
        );
        if (this.queryable.query.expression && Array.isArray(this.queryable.query.expression.children)) {
            this.queryable.query.expression.children.push(node);
        } else {
            this.queryable.query.expression = node;
        }

        return this.queryable;
    }

}