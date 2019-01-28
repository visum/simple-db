### Introduction
Here are the features for this node module.
* Create
* Read
* Update
* Delete
* Create Tables
* Drop Tables

## Schema
Everything with sqlite repository relies on a schema declaration. Here is the specification.

### Simple Schema
```javascript
const personTable = {
    name: "person",
    version: "1.0.0",
    label: "People",
    description: "A place to store people.",
    columns: [
        {
            type: "INTEGER",
            name: "id",
            label: "Identity"
        },
        {
            type: "TEXT",
            name: "firstName",
            label: "First Name"
        },
        {
            type: "TEXT",
            name: "lastName",
            label: "Last Name"
        }
    ],
    primaryKeys: ["id"]
};
```

### Foreign Keys
```javascript
const = {
    name: "address",
    label: "Address",
    description: "Address Table",
    version: "1.0.0",
    columns: [
        {
            type: "INTEGER",
            name: "id",
            label:"Identifier"
        },
        {
            type: "TEXT",
            name: "address",
            label: "Address"
        },
        {
            type: "TEXT",
            name: "city",
            label: "City"
        },
        {
            type: "INTEGER",
            name: "state",
            label: "State"
        },
        {
            type: "INTEGER",
            name: "zipCode",
            label: "Zip Code"
        },
        {
            type: "INTEGER",
            name: "personId",
            label: "Person Id",
            isRequired: true
        }
    ],
    primaryKeys:["id"],
    foreignKeys: {
            personId: {
                label: "Person",
                source: {
                    name: "person",
                    version: "1.0.0",
                    label: "Addresses",
                    column: "id"
                }
            }
    }
};
```

### Create
```javascript
    import { Database } from "sqlite-repository";
    
    
```

