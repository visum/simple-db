import Provider from "./Provider";
import Queryable from "./Queryable";
import EntityToSqlFactory from "./factory/EntityToSqlFactory";
import SqliteDatabase from "./SqliteDatabase";

export default class Repository {
    constructor({ database, name, primaryKeys = ["id"] }) {
        this.name = name;
        this.database = database;
        this.sqliteDatabase = new SqliteDatabase(this.database);
        this.primaryKeys = primaryKeys;
    }

    addAsync(entity) {

        const entityToSqlFactory = new EntityToSqlFactory({
            tableName: this.name,
            entity,
            primaryKeys: this.primaryKeys
        });

        const { sql, values } = entityToSqlFactory.createInsertStatement();

        return this.sqliteDatabase.runAsync(sql, values);

    }

    removeAsync(entity) {
        const entityToSqlFactory = new EntityToSqlFactory({
            tableName: this.name,
            entity,
            primaryKeys: this.primaryKeys
        });

        const { sql, values } = entityToSqlFactory.createDeleteStatement();

        return this.sqliteDatabase.runAsync(sql, values);
    }

    updateAsync(entity) {

        const entityToSqlFactory = new EntityToSqlFactory({
            tableName: this.name,
            entity,
            primaryKeys: this.primaryKeys
        });

        const { sql, values } = entityToSqlFactory.createUpdateStatement();

        return this.sqliteDatabase.runAsync(sql, values);

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