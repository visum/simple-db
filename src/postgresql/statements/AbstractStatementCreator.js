import PgSQLUtils from "../utils/PostgreSQLUtils";

export default class AbstractStatementCreator {
    constructor({
        entity,
        tableName,
        primaryKeys
    }) {
        this.entity = entity;
        this.tableName = tableName;
        this.primaryKeys = primaryKeys;
    }

    createWhereExpression() {
        const entity = this.entity;
        const columns = this.primaryKeys.map((key) => {
            return `${PgSQLUtils.escapeName(key)} = ${PgSQLUtils.escapeValue(entity[key])}`;
        }).join(" AND ");

        return `WHERE ${columns}`;
    }

    validateEntityPrimaryKeys() {
        const entity = this.entity;
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

}