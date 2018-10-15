export default class EntityToSqlFactory {
    constructor({
        entity,
        tableName
    }) {
        this.tableName = tableName;
        this.entity = entity;
    }

    createInsertStatement() {
        const entity = this.entity;
        const keys = Object.keys(entity);
        const values = keys.map((key) => {
            return entity[key];
        });

        const placeHolderArray = new Array(keys.length).fill("?").join(", ");

        return {
            sql: `INSERT INTO ${this.tableName} ( ${keys.join(", ")} ) VALUES ( ${placeHolderArray} )`,
            values: values
        }

    }

    createUpdateStatement() {
        const entity = this.entity;

        if (entity.id == null) {
            throw new Error("The entity needs to have an id.");
        }

        const keys = Object.keys(entity);
        const sqliteData = keys.reduce((accumulator, key) => {
            if (key === "id") {
                return accumulator;
            }

            accumulator.placeHolderValues.push(`${key} = ?`);
            accumulator.values.push(entity[key]);
            return accumulator;
        }, { placeHolderValues: [], values: [] });

        return {
            sql: `UPDATE ${this.tableName} SET ${sqliteData.placeHolderValues.join(", ")} WHERE id = ${entity.id}`,
            values: sqliteData.values
        }
    }

    createDeleteStatement() {
        const entity = this.entity;

        if (entity.id == null) {
            throw new Error("The entity needs to have an id.");
        }

        return {
            sql: `DELETE FROM ${this.tableName} WHERE id = ?`,
            values: [entity.id]
        }
    }
}