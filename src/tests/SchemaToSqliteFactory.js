import * as assert from "assert";
import SchemaToSqliteFactory from "../factory/SchemaToSqliteFactory"
import sqlite3 from "sqlite3";

const badSchema = {
    "name": "repository",
    "label": "Repository",
    "description": "Some great description.",
    "version": "1.0.1",
    "columns": [
        {
            "type": "INTEGER",
            "name": "manyToOne",
            "label": "Many To One Identifier",
            "isNullable": false,
            "foreignKey": {
                "label": "Source",
                "source": {
                    "name": "other_table",
                    "column": "id"
                }
            }
        }
    ]
};

const testSchema = {
    "name": "repository",
    "label": "Repository",
    "description": "Some great description.",
    "version": "1.0.1",
    "columns": [
        {
            "type": "INTEGER",
            "name": "id",
            "label":"Identifier",
            "isPrimaryKey": true
        },
        {
            "type": "TEXT",
            "name": "text",
            "label": "Text",
            "description":"Some Description.",
            "isUnique": true
        },
        {
            "type": "REAL",
            "name": "real",
            "label": "Float",
            "isNullable": false
        },
        {
            "type": "INTEGER",
            "name": "manyToOne",
            "label": "Many To One Identifier",
            "isNullable": false,
            "foreignKey": {
                "label": "Source",
                "source": {
                    "name": "other_table",
                    "version": "1.0.0",
                    "label": "Many",
                    "column": "id"
                }
            }
        },
        {
            "type": "INTEGER",
            "name": "oneToOne",
            "label":"One to One Identifier",
            "isUnique":true,
            "isNullable": false,
            "foreignKey": {
                "label": "Source",
                "source": {
                    "name": "other_table",
                    "version": "1.0.0",
                    "label": "One",
                    "column": "id"
                }
            }
        }
    ]
};

exports["SchemaToSqliteFactory: "] = () => {
    const schemaToSqliteFactory = new SchemaToSqliteFactory(testSchema);
    const createTableStatement = schemaToSqliteFactory.createTableStatement();

    const database = new sqlite3.Database(":memory:");

    return new Promise((resolve, reject) => {
        database.run(createTableStatement.sql, createTableStatement.values, (error, results) => {
            if (error != null) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });

}

exports["SchemaToSqliteFactory: bad repository."] = () => {
    assert.throws(()=>{
        const schemaToSqliteFactory = new SchemaToSqliteFactory(badSchema);
        const createTableStatement = schemaToSqliteFactory.createTableStatement();
    
    });

}