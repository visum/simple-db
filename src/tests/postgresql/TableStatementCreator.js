import * as assert from "assert";
import SchemaToPGFactory from "../../postgresql/statements/TableStatementCreator"
import personSchema from "./testSchemas/person";
import addressSchema from "./testSchemas/address";
import phoneNumberSchema from "./testSchemas/phoneNumber";

exports["SchemaToPGFactory: Person Schema."] = () => {
    const schemaToPGFactory = new SchemaToPGFactory(personSchema);
    const createTableStatement = schemaToPGFactory.createTableStatement();
    const expectedSql = `CREATE TABLE IF NOT EXISTS "person_0.0.1" ("id" SERIAL, "firstName" TEXT, "lastName" TEXT, "dateOfBirth" INTEGER, PRIMARY KEY("id"))`;

    assert.equal(createTableStatement.sql, expectedSql);
};

exports["PG SchemaToPGFactory: Address Schema."] = () => {
    const schemaToPGFactory = new SchemaToPGFactory(addressSchema);
    const createTableStatement = schemaToPGFactory.createTableStatement();
    const expectedSql = `CREATE TABLE IF NOT EXISTS "address_0.0.1" ("id" SERIAL, "address" TEXT, "city" TEXT, "state" INTEGER, "zipCode" INTEGER, "personId" INTEGER NOT NULL, PRIMARY KEY("id"), FOREIGN KEY ("personId") REFERENCES "person_0.0.1" ("id"))`;

    assert.equal(createTableStatement.sql, expectedSql);
};

exports["PG SchemaToPGFactory: Phone Number Schema."] = () => {
    const schemaToPGFactory = new SchemaToPGFactory(phoneNumberSchema);
    const createTableStatement = schemaToPGFactory.createTableStatement();
    const expectedSql = `CREATE TABLE IF NOT EXISTS "address_0.0.1" ("id" SERIAL, "type" TEXT, "personId" INTEGER NOT NULL, PRIMARY KEY("id"), UNIQUE ("personId","type"), FOREIGN KEY ("personId") REFERENCES "person_0.0.1" ("id"))`;

    assert.equal(createTableStatement.sql, expectedSql);
};