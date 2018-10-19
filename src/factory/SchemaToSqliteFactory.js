import jsonschema from "jsonschema";
import repositorySchema from "../repositorySchema";

const typeMapping = {
    string: "TEXT",
    number: "REAL",
    boolean: "INTEGER"
};

export default class SchemaToSqliteFactory {
    constructor(schema) {
        this.schema = schema;
        this.validator = new jsonschema.Validator();
    }

    validateSchema() {
        const schema = this.schema;

        if (!Array.isArray(schema.primaryKeys) || schema.primaryKeys.length === 0) {
            throw new Error("Invalid Schema: no primary key set.");
        }

        this.validator.validate(this.schema, repositorySchema);
    }

    sqlizeValue(value) {
        if (typeof value === "string") {
            return `'${value.replace(/\'/, "''")}'`;
        } if (typeof value === "boolean") {
            return value ? 1 : 0;
        } else {
            return value.toString();
        }
    }

    sqlizeName(value) {
        return `"${value.replace(/\"/, "\"")}"`;
    }

    isColumnRequired(column) {
        return Array.isArray(this.schema.required) && this.schema.required.includes(column);
    }

    isColumnUnique(column) {
        return Array.isArray(this.schema.unique) && this.schema.unique.includes(column);
    }

    isColumnIndexed(column) {
        return Array.isArray(this.schema.indexed) && this.schema.indexed.includes(column);
    }

    createPrimaryKeysExpression() {
        const keys = this.schema.primaryKeys.map((key) => {
            return this.sqlizeName(key);
        }).join(", ");

        return `PRIMARY KEY(${keys})`;
    }

    createTableStatement() {
        this.validateSchema();
        const expression = [];

        const tableName = this.sqlizeName(this.schema.title);

        expression.push(this.createColumnsExpression());
        expression.push(this.createPrimaryKeysExpression());

        const sql = `CREATE TABLE ${tableName} ( ${expression.join(", \n")} )`;

        return {
            sql,
            values: []
        }
    }

    createDropTableStatment() {

    }

    createColumnExpression(name, config) {
        const expression = [];
        expression.push(`${this.sqlizeName(name)}`);

        expression.push(typeMapping[config.type]);

        if (this.isColumnRequired(name)) {
            expression.push("NOT NULL");
        }

        if (this.isColumnUnique(name)) {
            expression.push("UNIQUE");
        }

        if (this.isColumnIndexed(name)) {
            expression.push("INDEXED");
        }

        if (config.default != null) {
            expression.push(this.sqlizeValue(config.default));
        }

        return expression.join(" ");
    }

    createColumnsExpression() {
        const properties = this.schema.properties;

        return Object.keys(properties).map((name) => {
            return this.createColumnExpression(name, properties[name]);
        }).join(", \n");
    }
}