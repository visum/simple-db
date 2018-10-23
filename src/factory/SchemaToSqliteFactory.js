import jsonschema from "jsonschema";
import repositorySchema from "../repositorySchema";

export default class SchemaToSqliteFactory {
    constructor(schema) {
        this.schema = schema;
        this.validator = new jsonschema.Validator();
    }

    getTableName(schema) {
        return `${schema.name}_${schema.version}`;
    }

    validateSchema() {
        this.assertHasPrimaryKey();
        const validationResults = this.validator.validate(this.schema, repositorySchema);
        
        if (validationResults.errors.length > 0){
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

    hasPrimaryKey() {
        return this.schema.columns.filter((column) => {
            return column.isPrimaryKey;
        }).length > 0;
    }

    assertHasPrimaryKey() {
        if (!this.hasPrimaryKey()) {
            throw new Error("Invalid Schema: Schema needs to have at least one primary key.");
        }
    }

    createPrimaryKeysExpression() {
        const keys = this.schema.columns.filter((column) => {
            return column.isPrimaryKey;
        }).map((column) => {
            return this.sqlizeName(column.name);
        }).join(", ");

        return `PRIMARY KEY(${keys})`;
    }

    createForeignKeysExpression() {
        return this.schema.columns.filter((column) => {
            return column.foreignKey != null;
        }).map((column) => {
            const columnName = this.sqlizeName(column.name);
            const source = this.sqlizeName(this.getTableName(column.foreignKey.source));
            const sourceColumn = this.sqlizeName(column.foreignKey.source.column);

            return `FOREIGN KEY (${columnName}) REFERENCES ${source} (${sourceColumn})`;
        }).join(", \n");
    }

    createTableStatement() {
        this.validateSchema();
        const expression = [];
        const tableName = this.sqlizeName(this.schema.name);

        expression.push(this.createColumnsExpression());
        expression.push(this.createPrimaryKeysExpression());
        expression.push(this.createForeignKeysExpression());

        const sql = `CREATE TABLE IF NOT EXISTS ${this.sqlizeName(this.getTableName(this.schema))} ( ${expression.join(", \n")} )`;

        return {
            sql,
            values: []
        }
    }

    createDropTableStatment() {
        return `DROP TABLE IF EXISTS ${this.sqlizeName(this.getTableName(this.schema))}`;
    }

    createColumnExpression({
        name,
        type,
        isUnique,
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

        if (isUnique) {
            expression.push("UNIQUE");
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
        }).join(", \n");
    }
}