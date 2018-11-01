export default class SchemaUtils {
    constructor(schema) {
        this.schema = schema;
    }

    getTableName() {
        const schema = this.schema;
        return `${schema.name}_${schema.version}`;
    }

    getPrimaryKeys() {
        const schema = this.schema;

        return schema.columns.filter((column) => {
            return column.isPrimaryKey;
        }).map((column) => {
            return column.name;
        });
    }
}