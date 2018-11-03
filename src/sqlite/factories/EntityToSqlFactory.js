import SqliteUtils from "../utils/SqliteUtils";

export default class EntityToSqlFactory {
    constructor({
        entity,
        tableName,
        primaryKeys
    }) {
        if (!Array.isArray(primaryKeys) || primaryKeys.length === 0) {
            throw new Error("Invalid Argument Exception:'primaryKeys' needs to be an array of length greater than 0. ");
        }

        this.tableName = tableName;
        this.entity = entity;
        this.primaryKeys = primaryKeys;
    }

    validateEntityPrimaryKeys(entity) {
        if (this.primaryKeys.length === 1) {
            return entity[this.primaryKeys[0]] != null;
        } else if (this.primaryKeys.length > 1) {
            return this.primaryKeys.every((key) => {
                return typeof entity[key] !== "undefined";
            })
        } else {
            return false;
        }
    }

    createWhereStatement(entity) {
        const columns = this.primaryKeys.map((key) => {
            return `${SqliteUtils.escapeName(key)} = ${SqliteUtils.escapeStringValue(entity[key])}`;
        }).join(", ");

        return `WHERE ${columns}`;
    }

    createInsertStatement() {
        const entity = this.entity;
        const keys = Object.keys(entity);
        const values = keys.map((key) => {
            return entity[key];
        });
        const escapedKeys = keys.map((key) => {
            return SqliteUtils.escapeName(key);
        });

        const placeHolderArray = new Array(keys.length).fill("?").join(", ");

        return {
            sql: `INSERT INTO ${SqliteUtils.escapeName(this.tableName)} ( ${escapedKeys.join(", ")} ) VALUES ( ${placeHolderArray} )`,
            values: values
        }

    }

    createUpdateStatement() {
        const entity = this.entity;
        const keys = Object.keys(entity);

        if (!this.validateEntityPrimaryKeys(entity)) {
            throw new Error("Cannot update entity: Invalid primary key(s).");
        }

        const sqliteData = keys.reduce((accumulator, key) => {
            if (this.primaryKeys.includes(key)) {
                return accumulator;
            }

            accumulator.placeHolderValues.push(`${SqliteUtils.escapeName(key)} = ?`);
            accumulator.values.push(entity[key]);
            return accumulator;
        }, { placeHolderValues: [], values: [] });

        const whereStatement = this.createWhereStatement(entity);

        return {
            sql: `UPDATE ${SqliteUtils.escapeName(this.tableName)} SET ${sqliteData.placeHolderValues.join(", ")} ${whereStatement}`,
            values: sqliteData.values
        }
    }

    createDeleteStatement() {
        const entity = this.entity;

        if (!this.validateEntityPrimaryKeys(entity)) {
            throw new Error("Cannot delete entity: Invalid primary key(s).");
        }

        const whereStatement = this.createWhereStatement(entity);

        return {
            sql: `DELETE FROM ${SqliteUtils.escapeName(this.tableName)} ${whereStatement}`,
            values: []
        }
    }
}