import * as assert from "assert";
import SchemaToSqliteFactory from "../factory/SchemaToSqliteFactory"
import sqlite3 from "sqlite3";

exports["SchemaToSqliteFactory: "] = () => {
    const schema = {
        "$id": "/test",
        "title": "test",
        "description": "The Test.",
        "properties": {
            "id": {
                "type": "number"
            },
            "string": {
                "type": "string"
            },
            "boolean": {
                "type": "boolean"
            }
        },
        "primaryKeys": [
            "id"
        ]
    };

    const schemaToSqliteFactory = new SchemaToSqliteFactory(schema);
    const createTableStatement = schemaToSqliteFactory.createTableStatement();

    const database = new sqlite3.Database(":memory:");

    return new Promise((resolve, reject) => {
        database.run(createTableStatement.sql, createTableStatement.values, (error, results) => {
            if (error != null){
                reject(error);
            } else {
                resolve(results);
            }
        });
    });

}