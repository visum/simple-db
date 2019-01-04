import Visitor from "./Visitor";
import SelectStatementCreator from "../statements/SelectStatementCreator";
import SqliteUtils from "../utils/SqliteUtils";
import Queryable from "../../queryable/Queryable";
import SqlString from "./SqlString";

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
        const queryable = Queryable.fromObject(value);

        const selectStatementCreator = new SelectStatementCreator(queryable);
        const { sql } = selectStatementCreator.createStatement();
        return `(${sql})`;
    }

    string(value) {
        if (typeof value !== "string") {
            throw new Error("Invalid string value.");
        }

        return new SqlString(value);
    }

    boolean(value) {
        if (typeof value !== "boolean") {
            throw new Error("Invalid boolean value.");
        }

        return value.toString();
    }

    number(value) {
        if (typeof value !== "number") {
            throw new Error("Invalid number value.");
        }

        return value;
    }

    date(value) {
        if (!(value instanceof value)) {
            throw new Error("Invalid date value.");
        }

        return value.getTime();
    }

    array(value) {
        if (!Array.isArray(value)) {
            throw new Error("Invalid array value.");
        }

        const series = value.map((item) => {

            if (typeof item === "string") {
                return this.string(item).toString();
            } else if (typeof item === "number") {
                return this.number(item);
            } else if (typeof item === "boolean") {
                return this.boolean(item);
            } else if (item instanceof Date) {
                return this.date(item);
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
