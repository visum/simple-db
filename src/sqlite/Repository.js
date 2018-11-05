import Provider from "./Provider";
import Queryable from "../queryable/Queryable";
import Sqlite3Wrapper from "./Sqlite3Wrapper";
import InsertStatementCreator from "./statements/InsertStatementCreator";
import UpdateStatementCreator from "./statements/UpdateStatementCreator";
import DeleteStatementCreator from "./statements/DeleteStatementCreator";

export default class Repository {
    constructor({ database, name, primaryKeys = ["id"] }) {
        this.name = name;
        this.database = database;
        this.sqliteDatabaseWrapper = new Sqlite3Wrapper(this.database);
        this.primaryKeys = primaryKeys;
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
        
        const {sql, values} = UpdateStatementCreator.createStatement({
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
            type: this.name,
            provider: provider
        });
    }

}