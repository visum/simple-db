import * as assert from "assert";
import sqlite from "sqlite3";
import Repository from "../Repository";

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

exports["Repository: addAsync"] = function () {
    const db = new sqlite.Database(":memory:");
    const repository = new Repository({
        db,
        name: "test"
    });

    return createDatabaseAsync(db).then(()=>{
        return repository.addAsync({data: "blah"});
    }).then(()=>{
        db.close();
    }).catch((error)=>{
        db.close();
        throw error;
    }) 
};

exports["Repository: updateAsync"] = function () {
    const db = new sqlite.Database(":memory:");
    const repository = new Repository({
        db,
        name: "test"
    });

    return createDatabaseAsync(db).then(()=>{
        return repository.addAsync({data: "blah"});
    }).then((id)=>{
        return repository.updateAsync({
            id: id,
            data: "blah2"
        });
    }).then(()=>{
        return repository.where().column("data").isEqualTo("blah2").toArrayAsync();
    }).then((results)=>{
        assert.equal(results.length, 1);
        db.close();
    }).catch((error)=>{
        db.close();
        throw error;
    }) 
};

exports["Repository: removeAsync"] = function () {
    const db = new sqlite.Database(":memory:");
    const repository = new Repository({
        db,
        name: "test"
    });

    return createDatabaseAsync(db).then(()=>{
        return repository.addAsync({data: "blah"});
    }).then((id)=>{
        return repository.removeAsync({
            id: id
        });
    }).then(()=>{
        return repository.where().column("data").isEqualTo("blah").toArrayAsync();
    }).then((results)=>{
        assert.equal(results.length, 0);
        db.close();
    }).catch((error)=>{
        db.close();
        throw error;
    }) 
};
