import SqliteUtils from "../utils/SqliteUtils";
import AbstractStatementCreator from "./AbstractStatementCreator";

export default class DeleteStatementCreator extends AbstractStatementCreator {

    static createStatement(options){
        const deleteStatementCreator = new DeleteStatementCreator(options);
        return deleteStatementCreator.createStatement(); 
    }

    createStatement() {
        const entity = this.entity;

        if (!this.validateEntityPrimaryKeys(entity)) {
            throw new Error("Cannot delete entity: Invalid primary key(s).");
        }

        const whereStatement = this.createWhereExpression(entity);

        return {
            sql: `DELETE FROM ${SqliteUtils.escapeName(this.tableName)} ${whereStatement}`,
            values: []
        }
    }
}