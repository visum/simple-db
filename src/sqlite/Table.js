import Provider from "./Provider";
import Queryable from "../queryable/Queryable";
import Sqlite3Wrapper from "./Sqlite3Wrapper";
import InsertStatementCreator from "./statements/InsertStatementCreator";
import UpdateStatementCreator from "./statements/UpdateStatementCreator";
import DeleteStatementCreator from "./statements/DeleteStatementCreator";
import SchemaUtils from "./utils/SchemaUtils";

export default class Table {
    constructor({ database, schema }) {
        this.name = SchemaUtils.getTableNameFromSchema(schema);
        this.database = database;
        this.sqliteDatabaseWrapper = new Sqlite3Wrapper(this.database);
        this.primaryKeys = schema.primaryKeys;
    }

    addAsync(entity) {
        const { sql, values } = InsertStatementCreator.createStatement({
            tableName: this.name,
            entity,
            primaryKeys: this.primaryKeys
        });

        return this.sqliteDatabaseWrapper.runAsync(sql, values);
    }

    removeAsync(entity) {
        const { sql, values } = DeleteStatementCreator.createStatement({
            tableName: this.name,
            entity,
            primaryKeys: this.primaryKeys
        });

        return this.sqliteDatabaseWrapper.runAsync(sql, values);
    }

    updateAsync(entity) {

        const { sql, values } = UpdateStatementCreator.createStatement({
            tableName: this.name,
            entity,
            primaryKeys: this.primaryKeys
        });

        return this.sqliteDatabaseWrapper.runAsync(sql, values);

    }

    getQueryProvider() {
        return new Provider({
            database: this.database
        });
    }

    where() {
        const provider = this.getQueryProvider();

        return new Queryable({
            query: {
                type: this.name,
                expression: null,
                select: {},
                limit: -1,
                offset: 0,
                orderBy: []
            },
            provider: provider
        });
    }

}