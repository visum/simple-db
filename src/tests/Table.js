import * as assert from "assert";
import sqlite from "sqlite3";
import Table from "../Table";

const createDatabaseAsync = (db) => {
    return new Promise((resolve, reject) => {
        db.run(
            `CREATE TABLE IF NOT EXISTS test (
                id integer PRIMARY KEY,
                data text NOT NULL UNIQUE
            )`,
            (error) => {
                if (error != null) {
                    reject(error);
                } else {
                    resolve();
                }
            }
        );
    });
}

exports["Table: addAsync"] = function () {
    const db = new sqlite.Database(":memory:");
    const table = new Table({
        db,
        name: "test"
    });

    return createDatabaseAsync(db).then(()=>{
        return table.addAsync({data: "blah"});
    }).then(()=>{
        db.close();
    }).catch((error)=>{
        db.close();
        throw error;
    }) 
};

exports["Table: updateAsync"] = function () {
    const db = new sqlite.Database(":memory:");
    const table = new Table({
        db,
        name: "test"
    });

    return createDatabaseAsync(db).then(()=>{
        return table.addAsync({data: "blah"});
    }).then((id)=>{
        return table.updateAsync({
            id: id,
            data: "blah2"
        });
    }).then(()=>{
        return table.where().column("data").isEqualTo("blah2").toArrayAsync();
    }).then((results)=>{
        assert.equal(results.length, 1);
        db.close();
    }).catch((error)=>{
        db.close();
        throw error;
    }) 
};

exports["Table: removeAsync"] = function () {
    const db = new sqlite.Database(":memory:");
    const table = new Table({
        db,
        name: "test"
    });

    return createDatabaseAsync(db).then(()=>{
        return table.addAsync({data: "blah"});
    }).then((id)=>{
        return table.removeAsync({
            id: id
        });
    }).then(()=>{
        return table.where().column("data").isEqualTo("blah").toArrayAsync();
    }).then((results)=>{
        assert.equal(results.length, 0);
        db.close();
    }).catch((error)=>{
        db.close();
        throw error;
    }) 
};
