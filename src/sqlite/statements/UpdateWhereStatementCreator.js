import SqlVisitor from "../visitors/SqlVisitor";
import SqliteUtils from "../utils/SqliteUtils";
import { timingSafeEqual } from "crypto";

export default class UpdateWhereStatementCreator {
    constructor(queryable, updates) {

        if (queryable == null) {
            throw new Error("Null Argument Exception: A queryable is needed to create statement.");
        }

        if (updates == null){
            throw new Error("Null Argument Exception: updates cannot be null.");
        }

        this.updates = updates;
        this.queryable = queryable;
    }

    static createStatement(queryable, updates){
        const updateWhereStatementCreator = new UpdateWhereStatementCreator(queryable, updates);
        return updateWhereStatementCreator.createStatement();
    }

    getTableName(){
        return SqliteUtils.escapeName(this.queryable.query.type);
    }

    createWhereExpression() {
        const visitor = new SqlVisitor();
        return visitor.createWhereExpression(this.queryable.query.expression);
    }

    createSetExpression() {
        const updates = this.updates;
        const keys = Object.keys(updates);

        const statement = keys.reduce((accumulator, key) => {
            if (key === "id") {
                return accumulator;
            }

            accumulator.placeHolderValues.push(`${SqliteUtils.escapeName(key)} = ?`);
            accumulator.values.push(updates[key]);
            return accumulator;
        }, { placeHolderValues: [], values: [] });

        return {
            sql: `UPDATE ${this.getTableName()} SET ${statement.placeHolderValues.join(", ")}`,
            values: statement.values
        }

    }

    createStatement() {
        const updates = this.updates;
        const updateStatement = this.createSetExpression(updates);
        const whereStatement = this.createWhereExpression();

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