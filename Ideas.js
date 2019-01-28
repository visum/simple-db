const database = new Database();

class JsonSchemaValidation {
    constructor(context) {
        this.context = context;
        // Things that would go here would be maybe user, schema, and or db. 
        // This is really up to the developer to decide what a context means,
        // and what the data controls expect.
    }

    prepareEntityToBeAddedAsync(entity) { }
    prepareEntityToBeUpdatedAsync(entity) { }
    prepareEntityToBeRemovedAsync(entity) { }

    approveQueryingAsync(queryable) { }

    approveEntityToBeAddedAsync(entity) { }
    approveEntityToBeUpdatedAsync(entity) { }
    approveEntityToBeRemovedAsync(entity) { }

    prepareTableToBeAddedAsync(schema) { }
    prepareTableToBeUpdatedAsync(oldSchema, newSchema) { }
    prepareTableToBeRemovedAsync(schema) { }

    approveTableToBeAddedAsync(schema) { }
    approveTableToBeUpdatedAsync(oldSchema, newSchema) { }
    approveTableToBeRemovedAsync(schema) { }

    refineQueryableAsync(queryable) { }
}

jsonSchemaValidationFactory = {
    type: "json-schema-validation",
    create: (context) => {
        return new JsonSchemaValidation(context);
    }
}

database.addDataControlFactoryAsync(JsonSchemaValidation);
database.addTableIfNotExistsAsync(jsonSchema);
database.updateTableIfExistsAsync(jsonSchema);
database.removeRespositoryIfExistsAsync(jsonSchema);
database.getTableAsync(name, context);


