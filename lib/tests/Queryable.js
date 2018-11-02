"use strict";

var _assert = require("assert");

var assert = _interopRequireWildcard(_assert);

var _sqlite = require("sqlite3");

var _sqlite2 = _interopRequireDefault(_sqlite);

var _Repository = require("../sqlite/Repository");

var _Repository2 = _interopRequireDefault(_Repository);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var createDatabaseAsync = function createDatabaseAsync(database) {
    return new Promise(function (resolve, reject) {
        database.run("CREATE TABLE IF NOT EXISTS test (\n                id integer PRIMARY KEY,\n                url text NOT NULL UNIQUE\n            )", function (error) {
            if (error != null) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
};

var fillDatabaseAsync = function fillDatabaseAsync(table) {
    var tests = [];

    for (var x = 0; x < 300; x++) {
        var testsPromise = table.addAsync({
            url: "/api/" + x + ".xhtml"
        });
        tests.push(testsPromise);
    }

    return Promise.all(tests);
};

exports["Queryable: toArrayAsync."] = function () {
    var database = new _sqlite2.default.Database(":memory:");
    var createDatabasePromise = createDatabaseAsync(database);
    var table = new _Repository2.default({
        database: database,
        name: "test"
    });

    return createDatabasePromise.then(function () {
        return fillDatabaseAsync(table);
    }).then(function () {
        return table.where().column("url").endsWith("/1.xhtml").or().column("url").startsWith("//api/2.x").or().column("url").contains("/3.xhtm").orderByDesc("id").toArrayAsync();
    }).then(function (results) {
        assert.equal(results.length, 3);

        return table.where().column("url").contains(".xhtml").removeAsync();
    }).then(function () {
        return table.where().toArrayAsync();
    }).then(function (results) {
        assert.equal(results.length, 0);
        database.close();
    }).catch(function () {
        database.close();
    });
};

exports["Queryable: IsIn with Queryable."] = function () {
    var database = new _sqlite2.default.Database(":memory:");
    var createDatabasePromise = createDatabaseAsync(database);
    var table = new _Repository2.default({
        database: database,
        name: "test"
    });

    return createDatabasePromise.then(function () {
        return fillDatabaseAsync(table);
    }).then(function () {
        return table.where().column("url").isIn(table.where().select({ "url": "url" }).take(1)).toArrayAsync();
    }).then(function (results) {
        assert.equal(results.length, 1);
        database.close();
    }).catch(function (error) {
        database.close();
        throw error;
    });
};

exports["Queryable: IsIn with Array."] = function () {
    var database = new _sqlite2.default.Database(":memory:");
    var createDatabasePromise = createDatabaseAsync(database);
    var table = new _Repository2.default({
        database: database,
        name: "test"
    });

    return createDatabasePromise.then(function () {
        return fillDatabaseAsync(table);
    }).then(function () {
        return table.where().column("url").isIn(["/api/1.xhtml"]).toArrayAsync();
    }).then(function (results) {
        assert.equal(results.length, 1);
        database.close();
    }).catch(function (error) {
        database.close();
        throw error;
    });
};

exports["Queryable: getFirstAsync"] = function () {
    var database = new _sqlite2.default.Database(":memory:");
    var createDatabasePromise = createDatabaseAsync(database);
    var table = new _Repository2.default({
        database: database,
        name: "test"
    });

    return createDatabasePromise.then(function () {
        return fillDatabaseAsync(table);
    }).then(function () {
        return table.where().column("url").endsWith("/1.xhtml").getFirstAsync();
    }).then(function (result) {
        assert.equal(result != null, true);
        database.close();
    }).catch(function () {
        database.close();
    });
};

exports["Queryable: removeAsync"] = function () {
    var database = new _sqlite2.default.Database(":memory:");
    var createDatabasePromise = createDatabaseAsync(database);
    var table = new _Repository2.default({
        database: database,
        name: "test"
    });

    return createDatabasePromise.then(function () {
        return fillDatabaseAsync(table);
    }).then(function () {
        return table.where().column("url").contains(".xhtml").removeAsync();
    }).then(function () {
        return table.where().toArrayAsync();
    }).then(function (results) {
        assert.equal(results.length, 0);
        database.close();
    }).catch(function () {
        database.close();
    });
};

exports["Queryable: updateAsync"] = function () {
    var database = new _sqlite2.default.Database(":memory:");
    var createDatabasePromise = createDatabaseAsync(database);
    var table = new _Repository2.default({
        database: database,
        name: "test"
    });

    return createDatabasePromise.then(function () {
        return fillDatabaseAsync(table);
    }).then(function () {
        return table.where().column("url").endsWith("/1.xhtml").updateAsync({
            url: "New Value"
        });
    }).then(function () {
        return table.where().column("url").endsWith("New Value").toArrayAsync();
    }).then(function (results) {
        assert.equal(results[0].url, "New Value");
        database.close();
    }).catch(function (error) {
        database.close();
        throw error;
    });
};

exports["Queryable: getCountAsync"] = function () {
    var database = new _sqlite2.default.Database(":memory:");
    var createDatabasePromise = createDatabaseAsync(database);
    var table = new _Repository2.default({
        database: database,
        name: "test"
    });

    return createDatabasePromise.then(function () {
        return fillDatabaseAsync(table);
    }).then(function () {
        return table.where().column("url").endsWith("xhtml").getCountAsync();
    }).then(function (count) {
        assert.equal(count, 300);
    }).catch(function (error) {
        database.close();
        throw error;
    });
};
//# sourceMappingURL=Queryable.js.map