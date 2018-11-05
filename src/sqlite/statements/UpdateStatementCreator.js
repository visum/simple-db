import SqliteUtils from "../utils/SqliteUtils";
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

        const sqliteData = keys.reduce((accumulator, key) => {
            if (this.primaryKeys.includes(key)) {
                return accumulator;
            }

            accumulator.placeHolderValues.push(`${SqliteUtils.escapeName(key)} = ?`);
            accumulator.values.push(entity[key]);
            return accumulator;
        }, { placeHolderValues: [], values: [] });

        const whereStatement = this.createWhereExpression();

        return {
            sql: `UPDATE ${SqliteUtils.escapeName(this.tableName)} SET ${sqliteData.placeHolderValues.join(", ")} ${whereStatement}`,
            values: sqliteData.values
        }
    }
}