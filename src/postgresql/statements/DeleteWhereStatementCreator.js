import SqlVisitor from "../visitors/SqlVisitor";
import PgSQLUtils from "../utils/PostgreSQLUtils";

export default class DeleteWhereStatementCreator {
    constructor(queryable) {

        if (queryable == null) {
            throw new Error("Null Exception: A queryable is needed to create statement.");
        }

        this.queryable = queryable;
    }

    static createStatement(queryable){
        const deleteWhereStatementCreator = new DeleteWhereStatementCreator(queryable);
        return deleteWhereStatementCreator.createStatement();
    }

    getTableName(){
        return PgSQLUtils.escapeName(this.queryable.query.type);
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