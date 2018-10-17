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

    sqlizeValue(value) {
        if (typeof value === "string") {
            return `'${value.replace(/\'/, "''")}'`;
        } else {
            return value.toString();
        }
    }

    createWhereStatement(entity) {
        const columns = this.primaryKeys.map((key) => {
            return `"${key}" = ${this.sqlizeValue(entity[key])}`;
        }).join(", ");

        return `WHERE ${columns}`;
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
        const keys = Object.keys(entity);

        if (!this.validateEntityPrimaryKeys(entity)) {
            throw new Error("Cannot update entity: Invalid primary key(s).");
        }

        const sqliteData = keys.reduce((accumulator, key) => {
            if (this.primaryKeys.includes(key)) {
                return accumulator;
            }

            accumulator.placeHolderValues.push(`${key} = ?`);
            accumulator.values.push(entity[key]);
            return accumulator;
        }, { placeHolderValues: [], values: [] });

        const whereStatement = this.createWhereStatement(entity);

        return {
            sql: `UPDATE ${this.tableName} SET ${sqliteData.placeHolderValues.join(", ")} ${whereStatement}`,
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
            sql: `DELETE FROM ${this.tableName} ${whereStatement}`,
            values: []
        }
    }
}