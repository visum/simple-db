"use strict";

var _assert = require("assert");

var assert = _interopRequireWildcard(_assert);

var _TableCreator = require("../sqlite/TableCreator");

var _TableCreator2 = _interopRequireDefault(_TableCreator);

var _sqlite = require("sqlite3");

var _sqlite2 = _interopRequireDefault(_sqlite);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var testSchema = {
    "name": "repository",
    "label": "Repository",
    "description": "Some great description.",
    "version": "1.0.1",
    "columns": [{
        "type": "INTEGER",
        "name": "id",
        "label": "Identifier"
    }, {
        "type": "TEXT",
        "name": "text",
        "label": "Text",
        "description": "Some Description."
    }, {
        "type": "REAL",
        "name": "real",
        "label": "Float",
        "isNullable": false
    }, {
        "type": "INTEGER",
        "name": "manyToOne",
        "label": "Many To One Identifier",
        "isNullable": false
    }, {
        "type": "INTEGER",
        "name": "oneToOne",
        "label": "One to One Identifier",
        "isNullable": false
    }],
    primaryKeys: ["id"],
    unique: [["oneToOne"]],
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

exports["SqliteDatabaseCreator: createRepositoryIfNotExistsAsync."] = function () {
    var database = new _sqlite2.default.Database(":memory:");
    var schemaToSqlite = new _TableCreator2.default({
        schema: testSchema,
        database: database
    });

    return schemaToSqlite.createRepositoryIfNotExistsAsync();
};

exports["SqliteDatabaseCreator: createRepositoryIfNotExistsAsync twice."] = function () {
    var database = new _sqlite2.default.Database(":memory:");
    var schemaToSqlite = new _TableCreator2.default({
        schema: testSchema,
        database: database
    });

    return schemaToSqlite.createRepositoryIfNotExistsAsync().then(function () {
        return schemaToSqlite.createRepositoryIfNotExistsAsync();
    });
};

exports["SqliteDatabaseCreator: createRepositoryIfNotExistsAsync then Drop"] = function () {
    var database = new _sqlite2.default.Database(":memory:");
    var schemaToSqlite = new _TableCreator2.default({
        schema: testSchema,
        database: database
    });

    return schemaToSqlite.createRepositoryIfNotExistsAsync().then(function () {
        return schemaToSqlite.dropRepositoryIfExistsAsync();
    });
};
//# sourceMappingURL=SqliteTableCreator.js.map