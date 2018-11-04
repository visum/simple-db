import SqlVisitor from "../visitors/SqlVisitor";
import SqliteUtils from "../utils/SqliteUtils";

export default class UpdateWhereStatementCreator {
    constructor(queryable) {

        if (queryable == null) {
            throw new Error("Null Exception: A queryable is needed to create statement.");
        }

        this.queryable = queryable;
    }

    getTableName(){
        return SqliteUtils.escapeName(this.queryable.type);
    }

    createWhereExpression() {
        const visitor = new SqlVisitor();
        return visitor.createWhereExpression(this.queryable.query.expression);
    }

    createSetExpression(updates) {
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

    createStatement(updates) {
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