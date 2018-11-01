import SqlVisitor from "../visitors/SqlVisitor";

export default class QueryableToSqlFactory {
    constructor({
        queryable = null
    }) {

        if (queryable == null) {
            throw new Error("Null Exception: A queryable is needed to create statement.");
        }

        this.queryable = queryable;
    }

    removeNullOrEmptyStrings(expression) {
        return expression.filter((part) => {
            return typeof part === "string" && part.length > 0;
        });
    }

    createDeleteSql() {
        return `DELETE FROM ${this.queryable.type}`;
    }

    createWhereSql() {
        const visitor = new SqlVisitor();
        return visitor.createWhereStatement(this.queryable.query.expression);
    }

    createSelectSql() {
        const select = this.queryable.query.select;
        let columns = Object.keys(select).map((key) => {
            return `${key} AS ${select[key]}`;
        });

        if (columns.length === 0) {
            columns = ["*"];
        }

        return `SELECT ${columns.join(", ")} FROM ${this.queryable.type}`;
    }

    createOrderBySql() {
        if (this.queryable.query.orderBy.length === 0) {
            return "";
        }

        const series = this.queryable.query.orderBy.map((orderBy) => {
            return `${orderBy.column} ${orderBy.type}`;
        }).join(", ");

        return `ORDER BY ${series}`;
    }

    createUpdateSetStatement(entity) {
        const keys = Object.keys(entity);

        const statement = keys.reduce((accumulator, key) => {
            if (key === "id") {
                return accumulator;
            }

            accumulator.placeHolderValues.push(`${key} = ?`);
            accumulator.values.push(entity[key]);
            return accumulator;
        }, { placeHolderValues: [], values: [] });

        return {
            sql: `UPDATE ${this.queryable.type} SET ${statement.placeHolderValues.join(", ")}`,
            values: statement.values
        }

    }

    createCountSelectSql() {
        return `SELECT count(*) FROM ${this.queryable.type}`;
    }

    createLimitAndOffsetSql() {
        let limit = this.queryable.query.limit;
        let offset = this.queryable.query.offset;

        if (limit === Infinity) {
            limit = -1;
        }

        return `LIMIT ${limit} OFFSET ${offset}`;
    }

    createWhereStatement() {
        const selectSql = this.createSelectSql();
        const whereSql = this.createWhereSql();
        const orderBySql = this.createOrderBySql();
        const limitAndOffsetSql = this.createLimitAndOffsetSql();
        const expression = [];

        expression.push(selectSql);

        if (whereSql != "") {
            expression.push(whereSql);
        }

        if (orderBySql != "") {
            expression.push(orderBySql);
        }

        if (limitAndOffsetSql != "") {
            expression.push(limitAndOffsetSql);
        }

        const cleanedExpression = this.removeNullOrEmptyStrings(expression);

        return {
            sql: cleanedExpression.join(" "),
            values: []
        }
    }

    createCountStatement() {
        const selectSql = this.createCountSelectSql();
        const whereSql = this.createWhereSql();
        const expression = []

        expression.push(selectSql);

        if (whereSql != "") {
            expression.push(whereSql);
        }

        const cleanedExpression = this.removeNullOrEmptyStrings(expression);

        return {
            sql: cleanedExpression.join(" "),
            values: []
        }
    }

    createDeleteStatement() {
        const deleteSql = this.createDeleteSql();
        const whereSql = this.createWhereSql();

        let sql = deleteSql;

        if (whereSql != "") {
            sql = `${sql} ${whereSql}`;
        }

        return {
            sql,
            values: []
        }
    }

    createUpdateStatement(entity) {
        const updateStatement = this.createUpdateSetStatement(entity);
        const whereStatement = this.createWhereSql();

        let sql = updateStatement.sql;

        if (whereStatement != "") {
            sql = `${sql} ${whereStatement}`;
        }

        return {
            sql,
            values: updateStatement.values
        }
    }
}