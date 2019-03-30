import PgSQLUtils from "../utils/PostgreSQLUtils";
import AbstractStatementCreator from "./AbstractStatementCreator";

export default class UpdateStatementCreator extends AbstractStatementCreator {

    static createStatement(options){
        const updateStatementCreator = new UpdateStatementCreator(options);
        return updateStatementCreator.createStatement(); 
    }

    createStatement() {
        const entity = this.entity;
        const keys = Object.keys(entity);

        if (!this.validateEntityPrimaryKeys()) {
            throw new Error("Cannot update entity: Invalid primary key(s).");
        }

        const tokens = keys.reduce((accumulator, key, index) => {
            if (this.primaryKeys.includes(key)) {
                return accumulator;
            }

            accumulator.placeHolderValues.push(`${PgSQLUtils.escapeName(key)} = $${index}`);
            accumulator.values.push(entity[key]);
            return accumulator;
        }, { placeHolderValues: [], values: [] });

        const whereStatement = this.createWhereExpression();

        return {
            sql: `UPDATE ${PgSQLUtils.escapeName(this.tableName)} SET ${tokens.placeHolderValues.join(", ")} ${whereStatement}`,
            values: tokens.values
        }
    }
}