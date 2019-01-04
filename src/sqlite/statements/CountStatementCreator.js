import SqlVisitor from "../visitors/SqlVisitor";
import SqliteUtils from "../utils/SqliteUtils";

export default class CountStatementCreator {
    constructor(queryable) {

        if (queryable == null) {
            throw new Error("Null Exception: A queryable is needed to create statement.");
        }

        this.queryable = queryable;
    }

    static createStatement(queryable){
        const countStatementCreator = new CountStatementCreator(queryable);
        return countStatementCreator.createStatement();
    }

    getTableName(){
        return SqliteUtils.escapeName(this.queryable.query.type);
    }

    removeNullOrEmptyStrings(expression) {
        return expression.filter((part) => {
            return typeof part === "string" && part.length > 0;
        });
    }

    createWhereSql() {
        const visitor = new SqlVisitor();
        return visitor.createWhereExpression(this.queryable.query.expression);
    }

    createSelectSql() {
        return `SELECT count(*) FROM ${this.getTableName()}`;
    }

    createStatement() {
        const selectSql = this.createSelectSql();
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

}