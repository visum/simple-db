import Provider from "./Provider";
import Queryable from "./Queryable";
import EntityToSqlFactory from "./factory/EntityToSqlFactory";

export default class Table {
    constructor({ db, name }) {
        this.db = db;
        this.name = name;
    }

    runAsync(sql, values) {
        return new Promise((resolve, reject) => {
            this.db.run(
                sql,
                values,
                (err, result) => {

                    if (err != null) {
                        reject(err)
                    } else {
                        resolve(result);
                    }

                }
            );
        });
    }

    addAsync(entity) {

        const entityToSqlFactory = new EntityToSqlFactory({
            tableName: this.name,
            entity
        });

        const { sql, values } = entityToSqlFactory.createInsertStatement();

        return this.runAsync(sql, values);

    }

    removeAsync(entity) {
        const entityToSqlFactory = new EntityToSqlFactory({
            tableName: this.name,
            entity
        });

        const { sql, values } = entityToSqlFactory.createDeleteStatement();

        return this.runAsync(sql, values);
    }

    updateAsync(entity) {

        const entityToSqlFactory = new EntityToSqlFactory({
            tableName: this.name,
            entity
        });

        const { sql, values } = entityToSqlFactory.createUpdateStatement();

        this.runAsync(sql, values);

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