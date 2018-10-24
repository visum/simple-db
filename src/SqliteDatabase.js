import SqliteDatabaseWrapper from "./sqliteDatabaseWrapper";
import SchemaToSqlite from "./SchemaToSqlite";
import Repository from "./Repository";
import SchemaUtils from "./SchemaUtils";

export default class SqliteDatabase {
    constructor({
        database
    }) {
        this.database = database;
        this.sqliteDatabaseWrapper = new SqliteDatabaseWrapper(database);
        this.schemas = schemas;
    }

    hasSchema(schema) {
        return this.findSchema(schema) != null;
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
            return schema.name == innerSchema && schema.version == innerSchema.version;
        });
    }

    addRepositoryIfDoesNotExistsAsync(schema) {
        const schemaToSqlite = new SchemaToSqlite({
            database: this.database,
            schema
        });

        return schemaToSqlite.createRepositoryIfNotExistsAsync().then(() => {
            if (!this.hasSchema(schema)) {
                this.schemas.push(schema);
            }
        });
    }

    removeRepositoryIfExistsAsync(schema) {
        return schemaToSqlite.dropRepositoryIfExistsAsync().then(() => {
            this.removeSchema(schema)
        });
    }

    getRepository(name, version) {
        const schema = this.getSchema({ name, version });

        if (schema == null) {
            throw new Error("Unable to find repository.");
        }

        const schemaUtils = new SchemaUtils(schema);
        const tableName = schemaUtils.getTableName();
        const primaryKeys = schemaUtils.getPrimaryKeys();
        const database = this.database;

        return new Repository({
            database: database,
            name: tableName,
            primaryKeys
        });

    }

}