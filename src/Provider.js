import QueryableToSqlFactory from "./factory/QueryableToSqlFactory";
import SqliteDatabase from "./SqliteDatabase";

export default class Provider {
    constructor({
        database
    }) {
        if (database == null) {
            throw new Error("Null Exception: database cannot be null.");
        }

        this.database = database;
        this.sqliteDatabase = new SqliteDatabase(this.database);
    }

    toArrayAsync(queryable) {
        const queryableToSqlFactory = new QueryableToSqlFactory({ queryable });
        const { sql } = queryableToSqlFactory.createWhereStatement();

        return this.sqliteDatabase.allAsync(sql);
    }

    getFirstAsync(queryable){
        return this.toArrayAsync(queryable).then((results)=>{
            return results[0] || null
        });
    }

    getCountAsync(queryable) {
        const queryableToSqlFactory = new QueryableToSqlFactory({ queryable });
        const { sql } = queryableToSqlFactory.createCountStatement();

        return this.sqliteDatabase.allAsync(sql).then((results) => {
            return results[0]["count(*)"];
        });

    }

    removeAsync(queryable) {
        const queryableToSqlFactory = new QueryableToSqlFactory({ queryable });
        const { sql } = queryableToSqlFactory.createDeleteStatement();

        return this.sqliteDatabase.allAsync(sql);
    }

    updateAsync(queryable, entity) {
        const queryableToSqlFactory = new QueryableToSqlFactory({ queryable });
        const statement = queryableToSqlFactory.createUpdateStatement(entity);

        return this.sqliteDatabase.runAsync(statement.sql, statement.values);

    }


}