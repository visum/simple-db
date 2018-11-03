import * as assert from "assert";
import SqliteDatabase from "../sqlite/SqliteDatabase";
import sqlite from "sqlite3";
import personSchema from "../testSchemas/person";
import addressSchema from "../testSchemas/address";
import phoneNumberSchema from "../testSchemas/phoneNumber";

exports["SqliteDatabase: Add Repositories."] = () => { 

    const database = new sqlite.Database(":memory:");
    const sqliteDatabase = new SqliteDatabase({database});

    return sqliteDatabase.addRepositoryAsync(personSchema).then(()=>{
        return  sqliteDatabase.addRepositoryAsync(addressSchema);
    }).then(()=>{
        return sqliteDatabase.addRepositoryAsync(phoneNumberSchema);
    });

};

exports["SqliteDatabase: Add Person."] = () => { 
    
    const database = new sqlite.Database(":memory:");
    const sqliteDatabase = new SqliteDatabase({database});

    return sqliteDatabase.addRepositoryAsync(personSchema).then(()=>{
        return  sqliteDatabase.getRepository(personSchema.name, personSchema.version).addAsync({
            firstName: "John",
            lastName: "Doe"
        });
    }).then((response)=>{

    }).catch((error)=>{

    });

};

