import Provider from "./Provider";
import Queryable from "./Queryable";
import EntityToSqlFactory from "./factory/EntityToSqlFactory";

export default class Table {
    constructor({ db, name, primaryKeys = ["id"] }) {
        this.db = db;
        this.name = name;
        this.primaryKeys = primaryKeys;
    }

    runAsync(sql, values) {
        return new Promise((resolve, reject) => {
            return this.db.run(sql, values, function (error) {
                if (error != null) {
                    reject(error);
                } else {
                    const lastID = this.lastID || null;

                    resolve(lastID);
                }
            });
        });
    }

    addAsync(entity) {

        const entityToSqlFactory = new EntityToSqlFactory({
            tableName: this.name,
            entity,
            primaryKeys: this.primaryKeys
        });

        const { sql, values } = entityToSqlFactory.createInsertStatement();

        return this.runAsync(sql, values);

    }

    removeAsync(entity) {
        const entityToSqlFactory = new EntityToSqlFactory({
            tableName: this.name,
            entity,
            primaryKeys: this.primaryKeys
        });

        const { sql, values } = entityToSqlFactory.createDeleteStatement();

        return this.runAsync(sql, values);
    }

    updateAsync(entity) {

        const entityToSqlFactory = new EntityToSqlFactory({
            tableName: this.name,
            entity,
            primaryKeys: this.primaryKeys
        });

        const { sql, values } = entityToSqlFactory.createUpdateStatement();

        return this.runAsync(sql, values);

    }

    getQueryProvider() {
        return new Provider({
            db: this.db
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