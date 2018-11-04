import Sqlite3Wrapper from "./Sqlite3Wrapper";
import SqliteTableCreator from "./TableCreator";
import Repository from "./Repository";
import SchemaUtils from "./utils/SchemaUtils";

export default class Database {
    constructor({
        database,
        schemas
    }) {
        this.database = database;
        this.sqliteDatabaseWrapper = new Sqlite3Wrapper(database);
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

    addRepositoryAsync(schema) {
        const tableCreator = new SqliteTableCreator({
            database: this.database,
            schema
        });

        return tableCreator.createRepositoryIfNotExistsAsync().then(() => {
            if (!this.hasSchema(schema)) {
                this.schemas.push(schema);
            }
        });
    }

    removeRepositoryAsync(schema) {
        return tableCreator.dropRepositoryIfExistsAsync().then(() => {
            this.removeSchema(schema)
        });
    }

    getRepository(name, version) {
        const schema = this.getSchema({ name, version });

        if (schema == null) {
            throw new Error("Unable to find repository.");
        }

        const tableName = SchemaUtils.getTableNameFromSchema(schema);
        const primaryKeys = SchemaUtils.getPrimaryKeysFromSchema(schema);
        const database = this.database;

        return new Repository({
            database: database,
            name: tableName,
            primaryKeys
        });

    }

}