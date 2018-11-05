import jsonschema from "jsonschema";
import repositoryJsonSchema from "../repositoryJsonSchema";
import SchemaUtils from "../utils/SchemaUtils";
import SqliteUtils from "../utils/SqliteUtils";
import UniqueExpressionCreator from "./UniqueExpressionCreator";

export default class TableStatementCreator {
    constructor(schema) {
        this.schema = schema;
        this.validator = new jsonschema.Validator();
    }

    static createTableStatement(schema) {
        const tableStatementCreator = new TableStatementCreator(schema);
        return tableStatementCreator.createTableStatement();
    }

    static createDropTableStatement() {
        const tableStatementCreator = new TableStatementCreator(schema);
        return tableStatementCreator.createDropTableStatement();
    }

    getTableName() {
        return SqliteUtils.escapeName(SchemaUtils.getTableNameFromSchema(this.schema));
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

    createPrimaryKeysExpression() {
        const keys = this.schema.primaryKeys.map((column) => {
            return SqliteUtils.escapeName(column);
        }).join(", ");

        return `PRIMARY KEY(${keys})`;
    }

    createUniqueExpressions() {
        if (Array.isArray(this.schema.unique)) {
            return this.schema.unique.map((unique) => {

                const uniqueExpression = new UniqueExpressionCreator(unique);
                return uniqueExpression.createExpression();

            }).join(", ");
        }
        return "";
    }

    createForeignKeysExpression() {
        const foreignKeys = this.schema.foreignKeys || {};

        return Object.keys(foreignKeys).map((name) => {
            const column = foreignKeys[name];
            const columnName = SqliteUtils.escapeName(name);
            const source = SqliteUtils.escapeName(SchemaUtils.getTableNameFromSchema(column.source));
            const sourceColumn = SqliteUtils.escapeName(column.source.column);

            return `FOREIGN KEY (${columnName}) REFERENCES ${source} (${sourceColumn})`;
        }).join(", ");
    }

    createTableStatement() {
        this.validateSchema();
        const expression = [];

        expression.push(this.createColumnsExpression());
        expression.push(this.createPrimaryKeysExpression());
        expression.push(this.createUniqueExpressions());
        expression.push(this.createForeignKeysExpression());

        const cleanedExpression = this.removeNullOrEmptyStrings(expression);

        const sql = `CREATE TABLE IF NOT EXISTS ${this.getTableName()} (${cleanedExpression.join(", ")})`;

        return {
            sql,
            values: []
        }
    }

    createDropTableStatment() {
        const sql = `DROP TABLE IF EXISTS ${this.getTableName()}`;

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
        expression.push(`${SqliteUtils.escapeName(name)}`);

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