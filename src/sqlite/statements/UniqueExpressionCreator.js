import SqliteUtils from "../utils/SqliteUtils";

export default class UniqueExpressionCreator {
    constructor(unique){
        this.unique = unique;
    }

    createConflictResolution() {
        if (this.unique.conflictOption == null) {
            return "";
        }
    }

    createUniqueExpression(){
        this.unique.columns.map((column) => {
            return SqliteUtils.escapeName(column);
        });

       return `UNIQUE (${columns})`;
    }

    createExpression() {
        const unique = this.unique;
        const expression = [];
        const uniqueExpression = this.createUniqueExpression(unique);
        const conflictOptions = this.createUniqueConflictResolution(unique.conflictOptions);
        
        expression.push(uniqueExpression);

        if (conflictOptions != "") {
            expression.push(`ON CONFLICT ${conflictOptions}`);
        }

        return expression.join(" ");
    }

}