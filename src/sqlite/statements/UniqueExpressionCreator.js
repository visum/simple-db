import SqliteUtils from "../utils/SqliteUtils";

export default class UniqueExpressionCreator {
    constructor(unique) {
        this.unique = unique || { columns: [], conflictOption: null };
    }

    createConflictResolution() {
        if (this.unique.conflictOption == null) {
            return "";
        }
        return this.unique.conflictOption;
    }

    createUniqueExpression() {
        const columns = this.unique.columns.map((column) => {
            return SqliteUtils.escapeName(column);
        });

        return `UNIQUE (${columns})`;
    }

    createExpression() {
        const expression = [];
        const uniqueExpression = this.createUniqueExpression();
        const conflictOptions = this.createConflictResolution();

        expression.push(uniqueExpression);

        if (conflictOptions != "") {
            expression.push(`ON CONFLICT ${conflictOptions}`);
        }

        return expression.join(" ");
    }

}