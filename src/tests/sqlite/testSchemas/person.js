export default {
    "name": "person",
    "label": "Person",
    "description": "Person Table",
    "version": "0.0.1",
    "columns": [
        {
            "type": "INTEGER",
            "name": "id",
            "label": "Identifier"
        },
        {
            "type": "TEXT",
            "name": "firstName",
            "label": "First Name",
            "description": "The first given name."
        },
        {
            "type": "TEXT",
            "name": "lastName",
            "label": "Last Name",
            "description": "Surname"
        },
        {
            "type": "INTEGER",
            "name": "dateOfBirth",
            "label": "Date of Birth",
            "description": "Date of Birth"
        }
    ],
    "primaryKeys": ["id"]
};