import Visitor from "./Visitor";
import SelectStatementCreator from "../statements/SelectStatementCreator";
import SqliteUtils from "../utils/SqliteUtils";

class SqlString {
    constructor(value) {
        this.value = `${value.replace("'", "''")}`;
    }

    toString() {
        return `'${this.value}'`;
    }

    toEndsWithString() {
        return `'%${this.value}'`;
    }

    toContainsString() {
        return `'%${this.value}%'`;
    }

    toStartsWithString() {
        return `'${this.value}%'`;
    }
}

export default class SqlVisitor extends Visitor {
    and(...args) {
        if (args.length === 0) {
            return "";
        }

        return `(${args.join(" AND ")})`;
    }

    or(...args) {
        if (args.length === 0) {
            return "";
        }

        return `(${args.join(" OR ")})`;
    }

    endsWith(property, value) {
        return `${property} LIKE ${value.toEndsWithString()}`;
    }

    startsWith(property, value) {
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

    isIn(property, value) {
        return `${property} IN ${value}`;
    }

    isNotIn(property, value) {
        return `${property} NOT IN ${value}`;
    }

    queryable(value) {
        const selectStatementCreator = new SelectStatementCreator(value);
        const { sql } = selectStatementCreator.createStatement();
        return `(${sql})`;
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

    array(value) {
        const series = value.map((item) => {

            if (typeof item === "string") {
                return this.string(item).toString();
            } else if (typeof item === "number") {
                return this.number(item);
            } else if (typeof item === "boolean") {
                return this.boolean(item);
            } else {
                throw new Error("Invalid Argument: Unknown primitive type.");
            }

        }).join(", ");

        return `(${series})`;
    }

    propertyName(name) {
        return SqliteUtils.escapeName(name);
    }

    property(type, name) {
        return name;
    }

    type(value) {
        this.table = value;
        return value;
    }

    createWhereExpression(node) {
        
        const where = this.visit(node);

        if (where == null) {
            return "";
        }

        return `WHERE ${where}`;

    }
}
