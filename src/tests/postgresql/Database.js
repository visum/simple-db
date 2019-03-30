import * as assert from "assert";
import Database from "../../postgresql/Database";
//import PgMock from "./PgMock";
import {Pool} from "pg";
import personSchema from "./testSchemas/person";
import addressSchema from "./testSchemas/address";
import phoneNumberSchema from "./testSchemas/phoneNumber";

const pool = new Pool({
    host: "localhost",
    user: "test_user",
    password: "test_user_pass",
    database: "tests",
    port: 5432
  });

exports["PG Database: Add Schemas."] = async () => {
    const database = new Database({ database: pool });

    database.addSchema(personSchema);
    database.addSchema(addressSchema);
    database.addSchema(phoneNumberSchema);

};

exports["Database: Add Person."] = async () => {
    const database = new Database({ database: pool });

    database.addSchema(personSchema);

    await database.createTablesFromSchemasAsync();

    return await database.getTable({
        name: personSchema.name,
        version: personSchema.version
    }).addAsync({
        firstName: "John",
        lastName: "Doe"
    });

};

