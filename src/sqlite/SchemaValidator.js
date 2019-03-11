import jsonschema from "jsonschema";
import tableJsonSchema from "./tableJsonSchema";

export default class SchemaValidator {
    constructor(schema){
        this.schema = schema;
        this.validator = new jsonschema.Validator();
    }

    static validate(schema){
        const validator = new SchemaValidator(schema);
        return validator.validate();
    }

    validate(){
        const validationResults = this.validator.validate(this.schema, tableJsonSchema);

        if (validationResults.errors.length > 0) {
            const error = new Error("Schema Error");
            error.validationErrors = validationResults.errors;
            throw error;
        }
    }
}