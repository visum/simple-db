import jsonschema from "jsonschema";
import repositoryJsonSchema from "../repositoryJsonSchema";
import SchemaUtils from "../utils/SchemaUtils";

export default class SchemaToSqliteFactory {
    constructor(schema) {
        this.schema = schema;
        this.validator = new jsonschema.Validator();
    }

    removeNullOrEmptyStrings(expression) {
        return expression.filter((part) => {
            return typeof part === "string" && part.length > 0;
        });
    }

    validateSchema() {
        const validationResults = this.validator.validate(this.schema, repositoryJsonSchema);

        if (validationResults.errors.length > 0) {
            const error = new Error("Schema Error");
            error.validationErrors = validationResults.errors;
            throw error;
        }
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

    createPrimaryKeysExpression() {
        const keys = this.schema.primaryKeys.map((column) => {
            return this.sqlizeName(column);
        }).join(", ");

        return `PRIMARY KEY(${keys})`;
    }

    createUniqueColumns() {
        if (!Array.isArray(this.schema.unique) || this.schema.unique.length === 0) {
            return "";
        }

        const columns = this.schema.unique.map((columns) => {
            return columns.map((column) => {
                return this.sqlizeName(column);
            });
        }).join(", ");

        return `UNIQUE (${columns})`;
    }

    createForeignKeysExpression() {
        const foreignKeys = this.schema.foreignKeys || {};

        return Object.keys(foreignKeys).map((name) => {
            const column = foreignKeys[name];
            const schemaUtils = new SchemaUtils(column.source);
            const columnName = this.sqlizeName(name);
            const source = this.sqlizeName(schemaUtils.getTableName());
            const sourceColumn = this.sqlizeName(column.source.column);

            return `FOREIGN KEY (${columnName}) REFERENCES ${source} (${sourceColumn})`;
        }).join(", ");
    }

    createTableStatement() {
        this.validateSchema();
        const expression = [];
        const schemaUtils = new SchemaUtils(this.schema);
        const tableName = schemaUtils.getTableName();

        expression.push(this.createColumnsExpression());
        expression.push(this.createPrimaryKeysExpression());
        expression.push(this.createUniqueColumns());
        expression.push(this.createForeignKeysExpression());

        const cleanedExpression = this.removeNullOrEmptyStrings(expression);

        const sql = `CREATE TABLE IF NOT EXISTS ${this.sqlizeName(tableName)} (${cleanedExpression.join(", ")})`;

        return {
            sql,
            values: []
        }
    }

    createDropTableStatment() {
        const schemaUtils = new SchemaUtils(this.schema);
        const sql = `DROP TABLE IF EXISTS ${this.sqlizeName(schemaUtils.getTableName())}`;

        return {
            sql,
            values: []
        }
    }

    createColumnExpression({
        name,
        type,
        isRequired,
        isIndexed,
        defaultValue
    }) {

        const expression = [];
        expression.push(`${this.sqlizeName(name)}`);

        expression.push(type);

        if (isRequired) {
            expression.push("NOT NULL");
        }

        if (isIndexed) {
            expression.push("INDEXED");
        }

        if (defaultValue != null) {
            expression.push(this.sqlizeValue(defaultValue));
        }

        return expression.join(" ");
    }

    createColumnsExpression() {
        return this.schema.columns.map((column) => {
            return this.createColumnExpression(column);
        }).join(", ");
    }
}