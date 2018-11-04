import SelectStatementCreator from "./statements/SelectStatementCreator";
import Sqlite3Wrapper from "./Sqlite3Wrapper";
import CountStatementCreator from "./statements/CountStatementCreator";
import DeleteWhereStatementCreator from "./statements/DeleteWhereStatementCreator";
import UpdateWhereStatementCreator from "./statements/UpdateWhereStatementCreator";

export default class Provider {
    constructor({
        database
    }) {
        if (database == null) {
            throw new Error("Null Exception: database cannot be null.");
        }

        this.database = database;
        this.sqliteDatabaseWrapper = new Sqlite3Wrapper(this.database);
    }

    toArrayAsync(queryable) {
        const selectStatementCreator = new SelectStatementCreator(queryable);
        const { sql } = selectStatementCreator.createStatement();

        return this.sqliteDatabaseWrapper.allAsync(sql);
    }

    getFirstAsync(queryable){
        return this.toArrayAsync(queryable).then((results)=>{
            return results[0] || null
        });
    }

    getCountAsync(queryable) {
        const countStatementCreator = new CountStatementCreator(queryable);
        const { sql } = countStatementCreator.createStatement();

        return this.sqliteDatabaseWrapper.allAsync(sql).then((results) => {
            return results[0]["count(*)"];
        });

    }

    removeAsync(queryable) {
        const deleteWhereStatementCreator = new DeleteWhereStatementCreator({ queryable });
        const { sql } = deleteWhereStatementCreator.createStatement();

        return this.sqliteDatabaseWrapper.allAsync(sql);
    }

    updateAsync(queryable, entity) {
        const updateWhereStatementCreator = new UpdateWhereStatementCreator({ queryable });
        const statement = updateWhereStatementCreator.createStatement(entity);

        return this.sqliteDatabaseWrapper.runAsync(statement.sql, statement.values);

    }


}