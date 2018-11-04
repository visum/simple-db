import SqlVisitor from "../visitors/SqlVisitor";
import SqliteUtils from "../utils/SqliteUtils";

export default class DeleteWhereStatementCreator {
    constructor(queryable) {

        if (queryable == null) {
            throw new Error("Null Exception: A queryable is needed to create statement.");
        }

        this.queryable = queryable;
    }

    getTableName(){
        return SqliteUtils.escapeName(this.queryable.type);
    }

    createDeleteSql() {
        return `DELETE FROM ${this.getTableName()}`;
    }

    createWhereSql() {
        const visitor = new SqlVisitor();
        return visitor.createWhereExpression(this.queryable.query.expression);
    }

    createStatement() {
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

}