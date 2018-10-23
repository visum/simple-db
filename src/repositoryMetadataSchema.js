export default {
    name: "repository_metadata",
    version: "1.0.0",
    label: "Repositories Metadata",
    columns: [
        {
            type: "INTEGER",
            name: "id",
            isPrimary: true
        },
        {
            type: "TEXT",
            name: "name",
            isUnique: true
        },
        {
            type: "TEXT",
            name: "json"
        }
    ]
};