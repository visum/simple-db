import * as assert from "assert";
import Database from "../sqlite/Database";
import sqlite from "sqlite3";
import personSchema from "../testSchemas/person";
import addressSchema from "../testSchemas/address";
import phoneNumberSchema from "../testSchemas/phoneNumber";

exports["Database: Add Schemas."] = () => {
    const database = new Database({ database: new sqlite.Database(":memory:") });

    database.addSchema(personSchema);
    database.addSchema(addressSchema);
    database.addSchema(phoneNumberSchema);

};

exports["Database: Add Person."] = () => {
    const database = new Database({ database:new sqlite.Database(":memory:") });

    database.addSchema(personSchema);

    return database.createTablesFromSchemasAsync().then(() => {
        return database.getTable(personSchema.name, personSchema.version).addAsync({
            firstName: "John",
            lastName: "Doe"
        });
    });

};

