import PgWrapper from "./PgWrapper";
import TableStatementCreator from "./statements/TableStatementCreator";

export default class TableCreator {
    constructor({
        database,
        schema
    }) {
        this.database = database;
        this.schema = schema;
        this.pgDatabaseWrapper = new PgWrapper(database);
        this.schemaToPGFactory = new TableStatementCreator(schema);
    }

    static async createTableIfNotExistsAsync({ database, schema }) {
        const tableCreator = new TableCreator({
            database: database,
            schema
        });

        return await tableCreator.createTableIfNotExistsAsync();
    }

    static async createTablesIfNotExistsAsync({ database, schemas }) {
        const promises = schemas.map((schema) => {
            const tableCreator = new TableCreator({
                database: database,
                schema
            });

            return tableCreator.createTableIfNotExistsAsync();
        });

        return await Promise.all(promises);
    }

    static async dropTableIfExistsAsync({ database, schema }) {
        const tableCreator = new TableCreator({
            database: database,
            schema
        });

        return await tableCreator.dropTableIfExistsAsync();
    }

    static async dropTablesIfExistsAsync({ database, schemas }) {

        const promises = schemas.map((schema) => {
            const tableCreator = new TableCreator({
                database: database,
                schema
            });

            return tableCreator.dropTableIfExistsAsync();
        });

        return await Promise.all(promises);
    }

    async createTableIfNotExistsAsync() {
        const {
            sql,
            values
        } = this.schemaToPGFactory.createTableStatement();

        return await this.pgDatabaseWrapper.runAsync(sql, values);
    }

    async dropTableIfExistsAsync() {
        const {
            sql,
            values
        } = this.schemaToPGFactory.createDropTableStatment();

        return await this.pgDatabaseWrapper.runAsync(sql, values);
    }
}