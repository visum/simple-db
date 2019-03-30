import TableCreator from "./TableCreator";
import Table from "./Table";

export default class Database {
    constructor({
        database,
        schemas
    }) {
        this.database = database;
        this.schemas = Array.isArray(schemas) ? schemas : [];
    }

    hasSchema(schema) {
        return this.getSchema(schema) != null;
    }

    removeSchema(schema) {
        const index = this.schemas.findIndex(() => {
            return schema.name == innerSchema && schema.version == innerSchema.version;
        });

        if (index > -1) {
            this.schemas.splice(index, 1);
        }
    }

    getSchema(schema) {
        return this.schemas.find((innerSchema) => {
            return schema.name == innerSchema.name && schema.version == innerSchema.version;
        });
    }

    getSchemas() {
        return this.schemas.slice(0);
    }

    addSchema(schema) {
        this.schemas.push(schema);
    }

    removeAsync(schema) {
        this.removeSchema(schema);
    }

    async createTableFromSchemaAsync(schema) {
        return await TableCreator.createTableIfNotExistsAsync({
            database: this.database,
            schema
        });
    }

    async createTablesFromSchemasAsync() {
        return await this.schemas.reduce((promise, schema) => {
            return promise.then(() => {
                return this.createTableFromSchemaAsync(schema);
            })
        }, Promise.resolve());
    }

    async dropTableFromSchemaAsync(schema) {
        return await TableCreator.dropTableIfExistsAsync({
            database: this.database,
            schema
        });
    }

    getTable({ name, version, lifeCycleDelegate }) {
        const schema = this.getSchema({ name, version });

        if (schema == null) {
            throw new Error("Unable to find table.");
        }

        const database = this.database;

        return new Table({
            database: database,
            schema,
            lifeCycleDelegate
        });

    }

}