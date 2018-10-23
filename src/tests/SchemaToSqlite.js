import * as assert from "assert";
import SchemaToSqlite from "../SchemaToSqlite"
import sqlite3 from "sqlite3";

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

exports["SchemaToSqlite: createRepositoryIfNotExistsAsync."] = () => {
    const database = new sqlite3.Database(":memory:");
    const schemaToSqlite = new SchemaToSqlite({
        schema: testSchema,
        database
    });


    return schemaToSqlite.createRepositoryIfNotExistsAsync();
}

exports["SchemaToSqlite: createRepositoryIfNotExistsAsync twice."] = () => {
    const database = new sqlite3.Database(":memory:");
    const schemaToSqlite = new SchemaToSqlite({
        schema: testSchema,
        database
    });


    return schemaToSqlite.createRepositoryIfNotExistsAsync().then(()=>{
        return schemaToSqlite.createRepositoryIfNotExistsAsync();
    });
}

exports["SchemaToSqlite: createRepositoryIfNotExistsAsync then Drop"] = () => {
    const database = new sqlite3.Database(":memory:");
    const schemaToSqlite = new SchemaToSqlite({
        schema: testSchema,
        database
    });

    return schemaToSqlite.createRepositoryIfNotExistsAsync().then(()=>{
        return schemaToSqlite.dropRepositoryIfExistsAsync();
    });
}