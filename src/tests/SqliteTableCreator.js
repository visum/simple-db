import * as assert from "assert";
import SqliteDatabaseCreator from "../sqlite/TableCreator"
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
            "label": "Identifier"
        },
        {
            "type": "TEXT",
            "name": "text",
            "label": "Text",
            "description": "Some Description.",
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
            "isNullable": false
        },
        {
            "type": "INTEGER",
            "name": "oneToOne",
            "label": "One to One Identifier",
            "isNullable": false
        }
    ],
    primaryKeys: ["id"],
    unique: [
        ["oneToOne"]
    ],
    foreignKeys: {
        "manyToOne": {
            "label": "Source",
            "source": {
                "name": "other_table",
                "version": "1.0.0",
                "label": "Many",
                "column": "id"
            }
        },
        "oneToOne": {
            "label": "Source",
            "source": {
                "name": "other_table",
                "version": "1.0.0",
                "label": "One",
                "column": "id"
            }
        }
    }
};

exports["SqliteDatabaseCreator: createRepositoryIfNotExistsAsync."] = () => {
    const database = new sqlite3.Database(":memory:");
    const schemaToSqlite = new SqliteDatabaseCreator({
        schema: testSchema,
        database
    });


    return schemaToSqlite.createRepositoryIfNotExistsAsync();
}

exports["SqliteDatabaseCreator: createRepositoryIfNotExistsAsync twice."] = () => {
    const database = new sqlite3.Database(":memory:");
    const schemaToSqlite = new SqliteDatabaseCreator({
        schema: testSchema,
        database
    });


    return schemaToSqlite.createRepositoryIfNotExistsAsync().then(() => {
        return schemaToSqlite.createRepositoryIfNotExistsAsync();
    });
}

exports["SqliteDatabaseCreator: createRepositoryIfNotExistsAsync then Drop"] = () => {
    const database = new sqlite3.Database(":memory:");
    const schemaToSqlite = new SqliteDatabaseCreator({
        schema: testSchema,
        database
    });

    return schemaToSqlite.createRepositoryIfNotExistsAsync().then(() => {
        return schemaToSqlite.dropRepositoryIfExistsAsync();
    });
}