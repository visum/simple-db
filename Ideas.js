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

    prepareRepositoryToBeAddedAsync(schema) { }
    prepareRepositoryToBeUpdatedAsync(oldSchema, newSchema) { }
    prepareRepositoryToBeRemovedAsync(schema) { }

    approveRepositoryToBeAddedAsync(schema) { }
    approveRepositoryToBeUpdatedAsync(oldSchema, newSchema) { }
    approveRepositoryToBeRemovedAsync(schema) { }

    refineQueryableAsync(queryable) { }
}

jsonSchemaValidationFactory = {
    type: "json-schema-validation",
    create: (context) => {
        return new JsonSchemaValidation(context);
    }
}

database.addDataControlFactoryAsync(JsonSchemaValidation);
database.addRepositoryIfNotExistsAsync(jsonSchema);
database.updateRepositoryIfExistsAsync(jsonSchema);
database.removeRespositoryIfExistsAsync(jsonSchema);
database.getRepositoryAsync(name, context);


